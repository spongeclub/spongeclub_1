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

function parseMessages(content) {
  const result = new Map();
  content = content.replace(/\r\n/g, '\n');

  for (const line of content.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 8) continue;

    const msgNum = cells[0];
    if (!msgNum.match(/^[GSW]\d/)) continue;

    const author = cells[2];
    const slugCell = cells[3];
    const summary = cells[4];
    const slackUrl = cells[7];

    const type = msgNum.startsWith('G') ? '공유'
               : msgNum.startsWith('W') ? '써보고싶은스킬'
               : '써본스킬';

    const slugs = slugCell.split(',')
      .map(s => s.trim())
      .filter(s => s && s !== '-' && s !== '(미상)');

    for (const slug of slugs) {
      if (!result.has(slug)) {
        result.set(slug, { summary, authors: [], type, slackUrls: [] });
      }
      const entry = result.get(slug);
      if (!entry.authors.includes(author)) entry.authors.push(author);
      if (slackUrl?.startsWith('http')) entry.slackUrls.push(slackUrl);
      // 타입 우선순위: 써본스킬 > 써보고싶은스킬 > 공유
      const priority = { '써본스킬': 3, '써보고싶은스킬': 2, '공유': 1 };
      if ((priority[type] ?? 0) > (priority[entry.type] ?? 0)) entry.type = type;
    }
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

// ─── 파일 본문 생성 ───────────────────────────────────────────────────────────

function generateFile(slug, quotes, msgInfo) {
  const today = new Date().toISOString().slice(0, 10);
  const authors = msgInfo?.authors ?? [];
  const summary = (msgInfo?.summary ?? '').replace(/"/g, "'");
  const type = msgInfo?.type ?? '써본스킬';
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
      return `> "${text}" — ${q['작성자']}`;
    })
    .join('\n\n');

  return `---
# 식별
title: "${slug} 써본 후기"
skill_name: ${slug}
summary: "${summary}"

# 작성자
author: [${authors.join(', ')}]
team:

# 분류
type: 스킬
post_type: ${postType}
category:
audience: []
difficulty:

# 순환 연결
inspired_by:

# 참조
keywords: []
links:
${linksBlock}

# 운영
created: ${today}
updated: ${today}
published: false
featured: false
---

## 써본 상황
- 어떤 상황에서:
- 어떻게 썼는지:

## 결과·인사이트
${quotesBlock}
`;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

const quotesMap = parseQuotePicks(readFileSync(join(BASE, 'quote_picks.md'), 'utf8'));
const msgMap = parseMessages(readFileSync(join(BASE, 'messages_extracted.md'), 'utf8'));

const slugs = slugArg ? [slugArg] : [...quotesMap.keys()];
let created = 0, overwritten = 0;

for (const slug of slugs) {
  const quotes = quotesMap.get(slug);
  if (!quotes?.length) {
    console.log(`[SKIP] ${slug}: 인용 없음`);
    continue;
  }

  const existing = findExistingFile(slug);
  const filename = existing ?? `${slug}.md`;
  const filePath = join(SKILLS_MD_DIR, filename);
  const content = generateFile(slug, quotes, msgMap.get(slug));

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

console.log(`\n완료: ${overwritten}개 덮어쓰기, ${created}개 신규 생성${isDryRun ? ' (dry-run)' : ''}`);
