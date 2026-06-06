#!/usr/bin/env node
// build-skills.mjs
// quote_picks.md → skills_md/{slug}.md 자동 생성 (전체 덮어쓰기)
//
// Usage:
//   node build-skills.mjs --dry-run --slug=skillers-finder  (단일 슬러그, 미리보기)
//   node build-skills.mjs --slug=skillers-finder             (단일 슬러그, 실행)
//   node build-skills.mjs --dry-run                          (전체, 미리보기)
//   node build-skills.mjs                                    (전체, 실행)

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '../../스킬인사이트');
const SKILLS_MD_DIR = join(BASE, 'skills_md');

const isDryRun = process.argv.includes('--dry-run');
const slugArg = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

// "닉네임(본명)" → "닉네임" — 끝의 괄호쌍이고 안이 한글일 때만 제거
function stripRealName(name) {
  return name.replace(/\s*\(([가-힣]+)\)\s*$/, '');
}

// ─── quote_picks.md 파서 ──────────────────────────────────────────────────────

function parseQuotePicks(content) {
  const result = new Map();
  content = content.replace(/\r\n/g, '\n');
  const sections = content.split(/^## /m).slice(1);

  for (const section of sections) {
    const firstNewline = section.indexOf('\n');
    const slug = section.slice(0, firstNewline).trim();
    const quoteBlocks = section.split(/^### 인용 \d+$/m).slice(1);

    const quotes = quoteBlocks.map(block => {
      const fields = {};
      for (const line of block.split('\n')) {
        const m = line.match(/^- (본문|작성자|메시지 번호|추천 이유): (.+)$/);
        if (m) fields[m[1]] = m[2].trim();
      }
      return fields;
    }).filter(q => q['본문']);

    result.set(slug, quotes);
  }
  return result;
}

// ─── messages_extracted.md 파서 ───────────────────────────────────────────────

// 슬랙 URL `.../p1778595605045249` → ts `1778595605.045249`
function urlToTs(url) {
  const m = url.match(/\/p(\d{10})(\d{6})/);
  return m ? `${m[1]}.${m[2]}` : null;
}

// :link: 텍스트 덩어리에서 URL만 뽑아 우선순위로 1개 선택
// 깃허브 > 대표 사이트(인스타·노션·슬랙 제외) > 빈 값
function extractHref(body) {
  const text = body?.link;
  if (!text) return '';
  // 맨 URL + 마크다운 링크 [라벨](url) 모두 포함, 꼬리 문장부호 제거
  const urls = (text.match(/https?:\/\/[^\s)\]]+/g) ?? [])
    .map(u => u.replace(/[.,)]+$/, ''));
  if (urls.length === 0) return '';
  const github = urls.find(u => u.includes('github.com'));
  if (github) return github;
  const EXCLUDE = ['instagram.com', 'notion.site', 'notion.so', 'slack.com'];
  const site = urls.find(u => !EXCLUDE.some(x => u.includes(x)));
  return site ?? '';
}

function parseMessages(content) {
  const result = new Map();
  content = content.replace(/\r\n/g, '\n');

  for (const line of content.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 8) continue;

    const msgNum = cells[0];
    if (!msgNum.match(/^[GSW][-\d]/)) continue;

    const author = cells[2];
    const slugCell = cells[3];
    const summary = cells[4];
    const slackUrl = cells[7];
    const ts = slackUrl?.startsWith('http') ? urlToTs(slackUrl) : null;

    const type = msgNum.startsWith('G') ? '공유'
               : msgNum.startsWith('W') ? '써보고싶은스킬'
               : '써본스킬';

    const slugs = slugCell.split(',')
      .map(s => s.trim())
      .filter(s => s && s !== '-' && s !== '(미상)');

    for (const slug of slugs) {
      if (!result.has(slug)) {
        result.set(slug, { summary, authors: [], type, slackUrls: [], tsList: [] });
      }
      const entry = result.get(slug);
      const cleanAuthor = stripRealName(author);
      if (!entry.authors.includes(cleanAuthor)) entry.authors.push(cleanAuthor);
      if (slackUrl?.startsWith('http')) entry.slackUrls.push(slackUrl);
      if (ts) entry.tsList.push(ts);
      // 타입 우선순위: 써본스킬 > 써보고싶은스킬 > 공유
      const priority = { '써본스킬': 3, '써보고싶은스킬': 2, '공유': 1 };
      if ((priority[type] ?? 0) > (priority[entry.type] ?? 0)) entry.type = type;
    }
  }
  // 첫 채택본 ts 결정 (messages_extracted 등장 순서가 곧 채택 순서)
  for (const entry of result.values()) {
    entry.firstTs = entry.tsList[0] ?? null;
  }
  return result;
}

// ─── raw_data.md 파서 ─────────────────────────────────────────────────────────

const MARKER_RE = /^\s*:(pushpin|mag|briefcase|link):\s*(.*)$/;
const MSG_HEADER_RE = /^\[\d{4}\. \d+\. \d+\. .+?\] (\S+) \(ts=([\d.]+)\)$/;
// 본문 없이 슬랙 URL만 있는 위임 메시지: `/써본스킬 <url>`
const DELEGATE_RE = /^\s*\/(써본스킬|써보고싶은스킬|공유)\s+<(https?:\/\/[^>]+)>/;

// 슬랙 이모지 코드 → 실제 이모지 (매핑된 것만 변환, 나머지는 원문 유지)
const SLACK_EMOJI = {
  red_circle: '🔴', large_yellow_circle: '🟡', large_green_circle: '🟢',
  star: '⭐', white_check_mark: '✅', one: '1️⃣', two: '2️⃣', link: '🔗',
};
function convertEmoji(s) {
  return s.replace(/:([a-z0-9_+-]+):/g, (m, n) => SLACK_EMOJI[n] ?? m);
}

// Slack 본문 → 마크다운 정제
function cleanSlackText(s) {
  return convertEmoji(s)
    .replace(/<(https?:\/\/[^|>]+)\|([^>]+)>/g, '[$2]($1)')  // <url|label>
    .replace(/<(https?:\/\/[^>]+)>/g, '$1')                   // <url>
    .replace(/<@(\w+)>/g, '@$1')                              // 멘션
    .replace(/\*([^*\n]+)\*/g, '**$1**')                      // bold
    .replace(/`([^`\n]+)`/g, '`$1`')                          // inline code (그대로)
    .trim();
}

function parseRawData(content) {
  const result = new Map();
  const delegates = new Map(); // ts → 위임된 다른 ts
  content = content.replace(/\r\n/g, '\n');
  const lines = content.split('\n');

  // 메시지 블록 분리: 헤더 라인 인덱스 모은 뒤 슬라이스
  const headerIdx = [];
  for (let i = 0; i < lines.length; i++) {
    if (MSG_HEADER_RE.test(lines[i])) headerIdx.push(i);
  }

  for (let h = 0; h < headerIdx.length; h++) {
    const start = headerIdx[h];
    const end = headerIdx[h + 1] ?? lines.length;
    const header = lines[start].match(MSG_HEADER_RE);
    if (!header) continue;
    const ts = header[2];
    const block = lines.slice(start + 1, end);

    // 쓰레드(↳ 시작) 라인 제거 — 본인 메시지 본문만
    const bodyLines = [];
    for (const line of block) {
      if (line.startsWith('    ↳') || line.startsWith('↳')) continue;
      if (line.trim() === '--- 쓰레드 ---' || line.includes('--- 쓰레드 ---')) break;
      bodyLines.push(line);
    }

    // 마커별 섹션 추출
    const sections = { pushpin: [], mag: [], briefcase: [], link: [] };
    let current = null;
    for (const line of bodyLines) {
      const m = line.match(MARKER_RE);
      if (m) {
        current = m[1];
        // 마커 같은 줄에 본문 있을 수 있음 (예: `:pushpin: *한줄 요약* 본문`)
        const inline = m[2].replace(/^\**한줄 요약\**\s*/, '')
                            .replace(/^\**주요 내용\**\s*/, '')
                            .replace(/^\**(내가 써본 상황[^*]*|활용 포인트)\**\s*/, '')
                            .replace(/^\**링크[^*]*\**\s*/, '')
                            .trim();
        if (inline) sections[current].push(inline);
        continue;
      }
      if (current && line.trim()) {
        // 라벨 라인(예: `:pushpin: 한줄 요약`) 다음 줄이 라벨일 수 있음 — 거르고
        if (/^한줄 요약$|^주요 내용$|^내가 써본 상황 \+ 결과$|^활용 포인트$|^링크/.test(line.trim())) continue;
        sections[current].push(line);
      }
    }

    if (sections.pushpin.length === 0 && sections.mag.length === 0) {
      // 위임 메시지(`/써본스킬 <url>`)면 ts 매핑만 저장
      for (const line of bodyLines) {
        const d = line.match(DELEGATE_RE);
        if (d) {
          const targetTs = urlToTs(d[2]);
          if (targetTs) delegates.set(ts, targetTs);
          break;
        }
      }
      continue;
    }

    result.set(ts, {
      headline: cleanSlackText(sections.pushpin.join('\n').trim()),
      summary: cleanSlackText(sections.mag.join('\n').trim()),
      usage: cleanSlackText(sections.briefcase.join('\n').trim()),
      link: cleanSlackText(sections.link.join('\n').trim()),
    });
  }
  // 위임 해소: delegates[ts] → 실제 본문이 있는 ts의 데이터를 ts로도 접근 가능하게
  for (const [from, to] of delegates) {
    const body = result.get(to);
    if (body && !result.has(from)) result.set(from, body);
  }
  return result;
}

// ─── 기존 파일 탐색 (skill_NN_{slug}.md 또는 {slug}.md) ──────────────────────

function findExistingFile(slug) {
  return readdirSync(SKILLS_MD_DIR).find(f => {
    const base = f.replace(/^skill_\d+_/, '').replace(/\.md$/, '');
    return base === slug;
  });
}

// ─── 기존 frontmatter에서 사람이 채우는 칸 읽기 (보존용) ──────────────────────
// 칸이 아예 없으면 undefined, 있고 빈칸이면 '' 를 반환해서 둘을 구분한다.
// (undefined → generateFile에서 기본값 사용, '' → 빈칸 그대로 유지)
const PRESERVED_KEYS = [
  'title', 'summary', 'category', 'audience', 'difficulty',
  'inspired_by', 'keywords', 'published', 'featured', 'created', 'team', 'href',
];

function parseExistingFrontmatter(content) {
  content = content.replace(/\r\n/g, '\n');
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = m[1];
  const result = {};
  for (const key of PRESERVED_KEYS) {
    // 콜론 뒤 전체를 캡처 (따옴표·대괄호·내부 콜론 포함)
    const fieldMatch = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
    if (fieldMatch) result[key] = fieldMatch[1].trim();
  }
  return result;
}

// ─── 파일 본문 생성 ───────────────────────────────────────────────────────────

function generateFile(slug, quotes, msgInfo, body, preserved = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const authors = msgInfo?.authors ?? [];
  const summary = (msgInfo?.summary ?? '').replace(/"/g, "'");
  const type = msgInfo?.type ?? '써본스킬';

  // 사람이 채우는 칸: 기존 값이 있으면(빈칸 포함) 그대로 유지, 없으면 기본값
  const keep = (key, fallback) => preserved[key] !== undefined ? preserved[key] : fallback;
  // 빈값이면 콜론 뒤 공백도 빼서 기존 빈칸 형식(`category:`)을 유지
  const sp = v => v === '' ? '' : ` ${v}`;
  const titleValue      = keep('title', `"${slug} 써본 후기"`);
  const summaryValue    = keep('summary', `"${summary}"`);
  const categoryValue   = keep('category', '');
  const audienceValue   = keep('audience', '[]');
  const difficultyValue = keep('difficulty', '');
  const inspiredByValue = keep('inspired_by', '');
  const keywordsValue   = keep('keywords', '[]');
  const publishedValue  = keep('published', 'false');
  const featuredValue   = keep('featured', 'false');
  const createdValue    = keep('created', today);
  const teamValue       = keep('team', '');
  const hrefValue       = keep('href', extractHref(body));
  const postType = type === '써본스킬' ? '써본후기'
                 : type === '공유'      ? '공유'
                 : '써보고싶은스킬';
  const slackUrls = msgInfo?.slackUrls ?? [];

  const linksBlock = slackUrls.length > 0
    ? slackUrls.map(u => `  - ${u}`).join('\n')
    : '';

  const quotesBlock = quotes
    .map(q => {
      const text = q['본문'].replace(/^[""]|[""]$/g, '');
      return `> "${text}" — ${stripRealName(q['작성자'])}`;
    })
    .join('\n\n');

  // 본문 섹션 — raw_data에서 첫 채택본 가져왔을 때만 출력
  const bodySections = [];
  if (body?.headline) bodySections.push(`## 한 줄 요약\n${body.headline}`);
  if (body?.summary)  bodySections.push(`## 주요 내용\n${body.summary}`);
  if (body?.usage)    bodySections.push(`## 써본 상황 + 결과\n${body.usage}`);
  const bodyBlock = bodySections.length > 0 ? bodySections.join('\n\n') + '\n\n' : '';

  return `---
# 식별
title:${sp(titleValue)}
skill_name: ${slug}
summary:${sp(summaryValue)}

# 작성자
author: [${authors.join(', ')}]
team:${sp(teamValue)}

# 분류
type: 스킬
post_type: ${postType}
category:${sp(categoryValue)}
audience:${sp(audienceValue)}
difficulty:${sp(difficultyValue)}

# 순환 연결
inspired_by:${sp(inspiredByValue)}

# 참조
href:${sp(hrefValue)}
keywords:${sp(keywordsValue)}
links:
${linksBlock}

# 운영
created:${sp(createdValue)}
updated: ${today}
published:${sp(publishedValue)}
featured:${sp(featuredValue)}
---

${bodyBlock}## 결과·인사이트
${quotesBlock}
`;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

const quotesMap = parseQuotePicks(readFileSync(join(BASE, 'quote_picks.md'), 'utf8'));
const msgMap = parseMessages(readFileSync(join(BASE, 'messages_extracted.md'), 'utf8'));
const rawMap = parseRawData(readFileSync(join(BASE, 'raw_data.md'), 'utf8'));

const slugs = slugArg ? [slugArg] : [...quotesMap.keys()];
let created = 0, overwritten = 0, bodyHit = 0, bodyMiss = 0;

for (const slug of slugs) {
  const quotes = quotesMap.get(slug);
  if (!quotes?.length) {
    console.log(`[SKIP] ${slug}: 인용 없음`);
    continue;
  }

  const msgInfo = msgMap.get(slug);
  const body = msgInfo?.firstTs ? rawMap.get(msgInfo.firstTs) : null;
  if (body) bodyHit++; else bodyMiss++;

  const existing = findExistingFile(slug);
  const filename = existing ?? `${slug}.md`;
  const filePath = join(SKILLS_MD_DIR, filename);
  // 기존 파일이 있으면 사람이 채운 칸을 읽어서 보존
  const preserved = existing
    ? parseExistingFrontmatter(readFileSync(filePath, 'utf8'))
    : {};
  const content = generateFile(slug, quotes, msgInfo, body, preserved);

  if (isDryRun) {
    const action = existing ? 'OVERWRITE' : 'CREATE';
    console.log(`\n[DRY-RUN ${action}] ${filename}`);
    console.log('─'.repeat(60));
    console.log(content);
    console.log('─'.repeat(60));
  } else {
    writeFileSync(filePath, content);
    console.log(`[${existing ? 'OVERWRITE' : 'CREATE  '}] ${filename}`);
  }

  if (existing) overwritten++;
  else created++;
}

console.log(`\n완료: ${overwritten}개 덮어쓰기, ${created}개 신규 생성, 본문 ${bodyHit}건 매칭 / ${bodyMiss}건 누락${isDryRun ? ' (dry-run)' : ''}`);
