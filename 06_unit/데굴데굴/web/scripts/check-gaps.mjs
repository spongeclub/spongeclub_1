#!/usr/bin/env node
// check-gaps.mjs
// "지금 무엇이 빠져 있는가"를 한눈에 보여주는 현황판.
// 자동 수집(fetch)은 raw_data.md까지만 채운다. 그 뒤 messages_extracted·quote_picks
// 갱신은 수동이라, 빠져도 아무 신호가 없다(조용한 누락). 이 스크립트가 그 신호다.
//
// 점검 3종:
//   ① 미반영 후기  — raw_data에는 본문이 있는데 messages_extracted에 없는 후기
//   ② 카드 미생성  — messages_extracted '써본스킬' slug인데 quote_picks에 인용이 없는 slug
//   ③ 빈 카드       — skills.generated.json에서 visible=true 인데 body가 비어 있는 카드
//
// 하나라도 걸리면 종료코드 1 (CI·자동화 게이트로도 쓸 수 있게).
//
// Usage: node scripts/check-gaps.mjs

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '../../스킬인사이트');
const DATA_DIR = join(__dirname, '../src/data');

// 슬랙 URL `.../p1778595605045249` → ts `1778595605.045249`
function urlToTs(url) {
  const m = url.match(/\/p(\d{10})(\d{6})/);
  return m ? `${m[1]}.${m[2]}` : null;
}

// ─── raw_data.md: 후기 본문이 있는 메시지 ts 수집 ─────────────────────────────
// build-skills.mjs의 parseRawData와 같은 기준: pushpin(한줄요약) 또는 mag(주요내용)
// 섹션이 있어야 "후기"로 본다. link만 있는 봇 응답·위임 메시지는 제외한다.
const MARKER_RE = /^\s*:(pushpin|mag|briefcase|link):\s*(.*)$/;
const MSG_HEADER_RE = /^\[\d{4}\. \d+\. \d+\. .+?\] (\S+) \(ts=([\d.]+)\)$/;

function collectRawReviews(content) {
  content = content.replace(/\r\n/g, '\n');
  const lines = content.split('\n');
  const headerIdx = [];
  for (let i = 0; i < lines.length; i++) {
    if (MSG_HEADER_RE.test(lines[i])) headerIdx.push(i);
  }
  const reviews = new Map(); // ts → 한줄요약 미리보기
  for (let h = 0; h < headerIdx.length; h++) {
    const start = headerIdx[h];
    const end = headerIdx[h + 1] ?? lines.length;
    const ts = lines[start].match(MSG_HEADER_RE)[2];

    // 본인 본문만: 쓰레드(↳) 답글·구분선 전까지
    const bodyLines = [];
    for (const line of lines.slice(start + 1, end)) {
      if (line.startsWith('    ↳') || line.startsWith('↳')) break;
      if (line.includes('--- 쓰레드 ---')) break;
      bodyLines.push(line);
    }

    // 마커별 섹션 분리
    const sections = { pushpin: [], mag: [], briefcase: [], link: [] };
    let current = null;
    for (const line of bodyLines) {
      const m = line.match(MARKER_RE);
      if (m) {
        current = m[1];
        const inline = m[2].replace(/^\**(한줄 요약|주요 내용|내가 써본 상황[^*]*|활용 포인트|링크[^*]*)\**\s*/, '').trim();
        if (inline) sections[current].push(inline);
        continue;
      }
      if (current && line.trim() && !/^한줄 요약$|^주요 내용$|^내가 써본 상황|^활용 포인트$|^링크/.test(line.trim())) {
        sections[current].push(line.trim());
      }
    }

    // pushpin/mag 둘 다 없으면 후기 본문 아님(위임·봇응답)
    if (sections.pushpin.length === 0 && sections.mag.length === 0) continue;
    const preview = (sections.pushpin[0] || sections.mag[0] || '').replace(/[*_`]/g, '').slice(0, 50);
    reviews.set(ts, preview);
  }
  return reviews;
}

// ─── messages_extracted.md: 등록된 ts·slug 수집 ──────────────────────────────
function collectMessages(content) {
  content = content.replace(/\r\n/g, '\n');
  const tsSet = new Set();
  const usedSlugs = new Set(); // 써본스킬 타입 slug
  for (const line of content.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 8) continue;
    const msgNum = cells[0];
    if (!msgNum.match(/^[GSW][-\d]/)) continue;
    const slackUrl = cells[7];
    const ts = slackUrl?.startsWith('http') ? urlToTs(slackUrl) : null;
    if (ts) tsSet.add(ts);
    if (msgNum.startsWith('S')) {
      for (const slug of cells[3].split(',').map(s => s.trim())) {
        if (slug && slug !== '-' && slug !== '(미상)') usedSlugs.add(slug);
      }
    }
  }
  return { tsSet, usedSlugs };
}

// ─── quote_picks.md: 인용이 1개 이상 있는 slug 수집 ──────────────────────────
function collectQuoteSlugs(content) {
  content = content.replace(/\r\n/g, '\n');
  const slugs = new Set();
  for (const section of content.split(/^## /m).slice(1)) {
    const slug = section.slice(0, section.indexOf('\n')).trim();
    if (/^### 인용 \d+/m.test(section)) slugs.add(slug);
  }
  return slugs;
}

// ─── 실행 ────────────────────────────────────────────────────────────────────
const rawReviews = collectRawReviews(readFileSync(join(BASE, 'raw_data.md'), 'utf8'));
const { tsSet, usedSlugs } = collectMessages(readFileSync(join(BASE, 'messages_extracted.md'), 'utf8'));
const quoteSlugs = collectQuoteSlugs(readFileSync(join(BASE, 'quote_picks.md'), 'utf8'));
const skills = JSON.parse(readFileSync(join(DATA_DIR, 'skills.generated.json'), 'utf8'));

// ① 미반영 후기: messages_extracted에 매핑된 '최신 ts' 이후로 raw_data에 들어왔는데
//   아직 messages_extracted에 없는 후기.
//   왜 역대 전체가 아니라 '최신 ts 이후'만 보나:
//   raw_data엔 후기/공유 구분 플래그가 없다(구분은 사람이 messages_extracted에서 한다).
//   그래서 역대 미매핑에는 02-rules ①대로 '의도적으로 카드화하지 않은' 공유·공지·잡담이
//   섞여, 전부 띄우면 매번 수십 건이 떠 게이트로 못 쓴다. 매핑된 최신 ts를 기준선으로
//   삼으면 '이번에 새로 긁혀 들어왔는데 아직 안 챙긴 것'만 정확히 잡혀, 세션 1회 게이트가
//   된다. (기준선 이전의 미매핑은 백로그로, 이 점검의 대상이 아니다.)
const baseline = [...tsSet].reduce((max, t) => Math.max(max, parseFloat(t)), 0);
const unmapped = [...rawReviews.entries()]
  .filter(([ts]) => !tsSet.has(ts) && parseFloat(ts) > baseline);
// ② 카드 미생성: 써본스킬 slug인데 quote_picks에 인용 없음
const noCard = [...usedSlugs].filter(slug => !quoteSlugs.has(slug));
// ③ 빈 카드: visible 인데 body 비어있음
const emptyCards = Object.entries(skills)
  .filter(([, v]) => v.visible && !(v.body && v.body.trim()))
  .map(([slug]) => slug);

console.log('=== 스킬인사이트 누락 점검 ===\n');

console.log(`① 미반영 후기 (매핑 최신 ts=${baseline} 이후 유입 중 미매핑): ${unmapped.length}건`);
for (const [ts, preview] of unmapped) console.log(`   - ts=${ts}  "${preview}"`);

console.log(`\n② 카드 미생성 (써본스킬인데 quote_picks에 인용 없음): ${noCard.length}건`);
for (const slug of noCard) console.log(`   - ${slug}`);

console.log(`\n③ 빈 카드 (visible인데 본문 없음): ${emptyCards.length}건`);
for (const slug of emptyCards) console.log(`   - ${slug}`);

const total = unmapped.length + noCard.length + emptyCards.length;
console.log(`\n합계 ${total}건${total === 0 ? ' — 깨끗합니다 ✅' : ' — 위 항목을 채운 뒤 build 하세요.'}`);
process.exit(total === 0 ? 0 : 1);
