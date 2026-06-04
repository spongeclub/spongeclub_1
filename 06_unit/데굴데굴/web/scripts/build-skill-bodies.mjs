#!/usr/bin/env node
// build-skill-bodies.mjs
// skills_md/*.md → src/data/skill-bodies.generated.json
// 각 파일의 `## 주요 내용` 섹션 본문만 추출 → { slug: bodyMarkdown }

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '../../스킬인사이트/skills_md');
const OUT_FILE = join(__dirname, '../src/data/skill-bodies.generated.json');

const result = {};

// Vercel 빌드 등 부모 디렉토리가 업로드되지 않는 환경: 기존 JSON 있으면 유지, 없으면 빈 객체 생성
if (!existsSync(SRC_DIR)) {
  if (!existsSync(OUT_FILE)) {
    writeFileSync(OUT_FILE, '{}\n');
    console.log(`[build-skill-bodies] skills_md not found — wrote empty JSON to ${OUT_FILE}`);
  } else {
    console.log(`[build-skill-bodies] skills_md not found — keeping existing JSON`);
  }
  process.exit(0);
}

const files = readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const slug = file.replace(/^skill_\d+_/, '').replace(/\.md$/, '');
  const content = readFileSync(join(SRC_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const m = content.match(/## 주요 내용\n([\s\S]*?)(?=\n## |$)/);
  if (!m) continue;
  // 슬랙 bullet `•`, `◦`를 마크다운 표준 `-`로 정규화 (중첩 들여쓰기 유지)
  const body = m[1]
    .split('\n')
    .map(line => line
      .replace(/^(\s*)•\s+/, '$1- ')
      .replace(/^(\s*)◦\s+/, '$1  - '))
    .join('\n')
    .trim();
  if (body) result[slug] = body;
}

writeFileSync(OUT_FILE, JSON.stringify(result, null, 2) + '\n');
console.log(`[build-skill-bodies] ${Object.keys(result).length}/${files.length} bodies → ${OUT_FILE}`);
