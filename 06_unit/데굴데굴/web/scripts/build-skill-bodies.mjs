#!/usr/bin/env node
// build-skill-bodies.mjs
// skills_md/*.md → 두 개의 JSON 생성
//   1) skill-bodies.generated.json : { slug: 본문 마크다운 }       (기존, 3단계까지 유지)
//   2) skills.generated.json       : { slug: 카드 메타+인용+본문 } (신규, 화면 자동 import용)

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '../../스킬인사이트/skills_md');
const OUT_FILE = join(__dirname, '../src/data/skill-bodies.generated.json');
const SKILLS_OUT = join(__dirname, '../src/data/skills.generated.json');

// 화면(skills-client.tsx) SKILLS 배열에 실제 노출 중인 카드 슬러그 (16개)
// 3단계에서 화면을 이 JSON으로 전환하면 이 목록이 노출 기준이 된다.
// 써본 후기 24개 (0606 큐레이션) — 기존 12 + 신규 12. /공유·/써보고싶은 카드는 데이터 유지·화면 숨김.
const VISIBLE_SLUGS = new Set([
  'skillers-finder', 'claude-mem', 'obsidian-cardnews-skill', 'social-media-skills',
  'claude-mermaid', 'claude-content-writer', 'project-instruction-optimizer', 'superpowers',
  'visualize', 'travel-daily-brief', 'cowork-plugins', 'create-closing',
  'project-starter-kit', 'ai-marketing-campaign-analytics', 'anydesign', 'automation-level-advisor',
  'designing-surveys', 'diagram-design', 'form-cro', 'os-interview',
  'telegram-plugin', 'pr-marketing-skill', 'remotion', 'web-debug-verify',
  'soultrace-multilingual', 'service-blueprint', 'claude-video', 'AI-SLOP-Detector',
  'blog-seo-checker', 'andrej-karpathy-skills',
]);

// frontmatter category 표기 보정 (화면 area 값과 맞춤)
const AREA_NORMALIZE = { '콘텐츠마케팅': '콘텐츠·마케팅' };

// Vercel 빌드 등 부모 디렉토리가 업로드되지 않는 환경: 기존 JSON 있으면 유지, 없으면 빈 객체 생성
if (!existsSync(SRC_DIR)) {
  for (const out of [OUT_FILE, SKILLS_OUT]) {
    if (!existsSync(out)) {
      writeFileSync(out, '{}\n');
      console.log(`[build-skill-bodies] skills_md not found — wrote empty JSON to ${out}`);
    } else {
      console.log(`[build-skill-bodies] skills_md not found — keeping existing ${out}`);
    }
  }
  process.exit(0);
}

// ─── 파서 ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const lines = m[1].split('\n');
  const fm = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([a-z_]+):[ \t]*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    if (key === 'links') {
      // 다음 들여쓰기 `- url` 줄들을 모음
      const urls = [];
      for (let j = i + 1; j < lines.length; j++) {
        const lm = lines[j].match(/^\s*-\s*(.+)$/);
        if (!lm) break;
        urls.push(lm[1].trim());
      }
      fm.links = urls;
      continue;
    }
    fm[key] = kv[2].trim();
  }
  return fm;
}

// "[a, b, c]" → ['a','b','c'] / 빈 값 → []
function parseList(raw) {
  const inner = (raw ?? '').replace(/^\[|\]$/g, '').trim();
  return inner ? inner.split(',').map(s => s.trim()).filter(Boolean) : [];
}

function stripQuotes(s) {
  return (s ?? '').replace(/^["']|["']$/g, '').trim();
}

// `## 주요 내용` 본문 추출 + 슬랙 bullet 정규화
function extractBody(content) {
  const m = content.match(/## 주요 내용\n([\s\S]*?)(?=\n## |$)/);
  if (!m) return '';
  return m[1]
    .split('\n')
    .map(line => line
      .replace(/^(\s*)•\s+/, '$1- ')
      .replace(/^(\s*)◦\s+/, '$1  - '))
    .join('\n')
    .trim();
}

// `## 결과·인사이트`의 `> "본문" — 작성자` 줄들을 인용 배열로
function extractQuotes(content) {
  const m = content.match(/## 결과·인사이트\n([\s\S]*?)(?=\n## |$)/);
  if (!m) return [];
  const quotes = [];
  for (const line of m[1].split('\n')) {
    const qm = line.trim().match(/^>\s*["\u201C\u201D](.+)["\u201C\u201D]\s*[—–-]\s*(.+)$/);
    if (qm) quotes.push({ text: qm[1].trim(), author: qm[2].trim() });
  }
  return quotes;
}

// ─── 메인 ──────────────────────────────────────────────────────────────────

const files = readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));
const bodies = {};
const skills = {};

for (const file of files) {
  const slug = file.replace(/^skill_\d+_/, '').replace(/\.md$/, '');
  const content = readFileSync(join(SRC_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const fm = parseFrontmatter(content);

  const body = extractBody(content);
  if (body) bodies[slug] = body;

  skills[slug] = {
    name: fm.skill_name ?? slug,
    title: stripQuotes(fm.title),
    summary: stripQuotes(fm.summary),
    area: AREA_NORMALIZE[fm.category] ?? fm.category ?? '',
    difficulty: fm.difficulty ?? '',
    kind: fm.post_type ?? '',
    href: fm.href ?? '',
    slackUrl: (fm.links ?? [])[0] ?? '',
    usedBy: parseList(fm.author).length,
    quotes: extractQuotes(content),
    body,
    published: fm.published === 'true',
    visible: VISIBLE_SLUGS.has(slug),
  };
}

writeFileSync(OUT_FILE, JSON.stringify(bodies, null, 2) + '\n');
console.log(`[build-skill-bodies] ${Object.keys(bodies).length}/${files.length} bodies → ${OUT_FILE}`);

const visibleCount = Object.values(skills).filter(s => s.visible).length;
writeFileSync(SKILLS_OUT, JSON.stringify(skills, null, 2) + '\n');
console.log(`[build-skill-bodies] ${Object.keys(skills).length} skills (${visibleCount} visible) → ${SKILLS_OUT}`);
