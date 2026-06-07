#!/usr/bin/env node
// fetch-skill-reviews.mjs
// 슬랙 채널 메시지를 raw_data.md 형식으로 통째 덤프한다.
// build-skills.mjs가 읽는 raw_data.md를 슬랙에서 자동 갱신하는 용도.
// 원본 마커(:pushpin: 등)를 그대로 떨구며, 해석·변환은 하지 않는다.
//
// Usage:
//   node fetch-skill-reviews.mjs --dry-run   (미리보기: 건수만, 파일 안 씀)
//   node fetch-skill-reviews.mjs             (raw_data.md 덮어쓰기)

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANNEL_ID = process.env.SLACK_SKILL_CHANNEL || 'C0B25TW69MW';
const CHANNEL_NAME = process.env.SLACK_SKILL_CHANNEL_NAME || 'a유닛-이기적인스킬러들-에밀리';
const OUTPUT = join(__dirname, '../../스킬인사이트/raw_data.md');
const PAGE_LIMIT = 200;

const isDryRun = process.argv.includes('--dry-run');

// web/.env.local 에서 SLACK_BOT_TOKEN 읽기 (기존 sync 스크립트와 동일 방식)
async function loadLocalEnv() {
  try {
    const raw = await readFile(resolve(__dirname, '..', '.env.local'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim();
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  } catch {
    // .env.local 없으면 환경변수에서 직접 읽음 (선택)
  }
}

async function slack(method, params = {}) {
  const token = process.env.SLACK_BOT_TOKEN?.trim() || process.env.SLACK_TOKEN?.trim();
  if (!token) throw new Error('SLACK_BOT_TOKEN이 필요합니다 (web/.env.local 확인)');

  const url = new URL(`https://slack.com/api/${method}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Slack ${method} HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack ${method} 실패: ${data.error ?? 'unknown'}`);
  return data;
}

// cursor 페이지네이션으로 전체 수집
async function fetchAll(method, params, key = 'messages') {
  const out = [];
  let cursor;
  do {
    const data = await slack(method, { ...params, limit: PAGE_LIMIT, ...(cursor ? { cursor } : {}) });
    out.push(...(data[key] ?? []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);
  return out;
}

// unix ts → "2026. 5. 3. PM 5:28:38" (KST, 기존 raw_data.md 헤더 형식)
function fmtDate(ts) {
  const d = new Date(Number(ts) * 1000 + 9 * 3600 * 1000); // KST 보정
  const y = d.getUTCFullYear();
  const mo = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  let h = d.getUTCHours();
  const ampm = h < 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  const mi = String(d.getUTCMinutes()).padStart(2, '0');
  const se = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}. ${mo}. ${day}. ${ampm} ${h}:${mi}:${se}`;
}

// channel_join / channel_leave 같은 시스템 메시지는 제외
function isSystemMessage(m) {
  return m.subtype === 'channel_join' || m.subtype === 'channel_leave';
}

function speaker(m) {
  return m.user ?? m.bot_id ?? '?';
}

// 한 메시지 + 스레드 답글을 raw_data.md 형식 문자열로 직렬화
function serializeMessage(m, replies) {
  const out = [];
  out.push(`[${fmtDate(m.ts)}] ${speaker(m)} (ts=${m.ts})`);
  out.push('  ' + (m.text ?? '')); // 첫 줄 2칸 들여쓰기 (기존 형식)

  if (replies.length > 0) {
    out.push('    --- 쓰레드 ---');
    for (const r of replies) {
      out.push(`    ↳ [${fmtDate(r.ts)}] ${speaker(r)} (ts=${r.ts})`);
      out.push('    ↳   ' + (r.text ?? '').replace(/\n/g, ' '));
      out.push('');
    }
  }
  return out.join('\n');
}

async function main() {
  await loadLocalEnv();

  const messages = (await fetchAll('conversations.history', { channel: CHANNEL_ID }))
    .filter((m) => !isSystemMessage(m));

  // 스레드가 달린 메시지는 답글까지 수집
  const withReplies = [];
  for (const m of messages) {
    let replies = [];
    if (m.reply_count) {
      replies = (await fetchAll('conversations.replies', { channel: CHANNEL_ID, ts: m.thread_ts ?? m.ts }))
        .filter((r) => r.ts !== m.ts && !isSystemMessage(r));
    }
    withReplies.push({ m, replies });
  }

  // 슬랙은 최신순으로 주므로 오래된 순(기존 raw_data.md 순서)으로 정렬
  withReplies.sort((a, b) => Number(a.m.ts) - Number(b.m.ts));

  const header = `=== #${CHANNEL_NAME} (${CHANNEL_ID}) 전체 메시지 ===\n`;
  const body = withReplies.map(({ m, replies }) => serializeMessage(m, replies)).join('\n\n');
  const content = `${header}\n${body}\n`;

  // 참고용 카운트: /써본스킬 로 시작하는 후기 건수
  const reviewCount = withReplies.filter(({ m }) => /^\s*\/써본스킬/.test(m.text ?? '')).length;

  if (isDryRun) {
    console.log(`채널: #${CHANNEL_NAME} (${CHANNEL_ID})`);
    console.log(`전체 메시지: ${withReplies.length}건`);
    console.log(`/써본스킬 후기: ${reviewCount}건`);
    console.log('dry-run: 파일 안 씀');
    return;
  }

  await writeFile(OUTPUT, content, 'utf8');
  console.log(`raw_data.md 갱신 완료: 전체 ${withReplies.length}건 (/써본스킬 ${reviewCount}건)`);
  console.log(`→ ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
