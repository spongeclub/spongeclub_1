#!/usr/bin/env node
// 갤러리 반자동 동기화 스크립트
// 02_mission/gallery input/ 의 제출 노트를 읽어, gallery.json에 아직 없는 산출물을
// 자동으로 추가하고 첨부 이미지를 720px JPEG로 최적화한다.
//
// 사용법 (repo 루트 _site 기준):
//   node scripts/sync-gallery.mjs           # 새 노트만 추가 + 이미지 최적화 + gallery.json 갱신
//   node scripts/sync-gallery.mjs --dry     # 쓰지 않고 파싱 결과만 출력(검증용)
//   node scripts/sync-gallery.mjs --check   # 빠진 노트 목록만 출력
//
// 주의: 기존 항목은 건드리지 않는다(notePath 기준 중복 제외). 추가된 항목은
//      반자동이므로 이후 사람이 검수/다듬기(이모지 기능·개조식 등) 가능.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, '..');          // _site
const ROOT = path.resolve(SITE, '..');               // vault 루트
const NOTES_DIR = path.join(ROOT, '02_mission', 'gallery input');
const GALLERY_JSON = path.join(SITE, 'src', 'data', 'gallery.json');
const ASSET_DIR = path.join(SITE, 'public', 'assets', 'gallery');
const ASSET_URL = '/assets/gallery';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const CHECK = args.has('--check');

// ── 유틸 ──────────────────────────────────────────────
function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'attachments') continue;
      out.push(...walk(p));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      out.push(p);
    }
  }
  return out;
}

function relFromRoot(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function nick(member) {
  return String(member || '').split(/[(（]/)[0].trim();
}

// 제목/URL에서 ascii 슬러그 생성 (이미지 파일명용)
function slugify(title, url) {
  const fromTitle = String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (fromTitle) return fromTitle;
  try {
    const u = new URL(url);
    if (u.hostname === 'github.com') {
      const seg = u.pathname.split('/').filter(Boolean).pop() || '';
      const s = seg.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (s) return s;
    }
    const host = u.hostname.split('.')[0];
    const s = host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (s) return s;
  } catch { /* noop */ }
  return 'item-' + Math.random().toString(36).slice(2, 7);
}

// 본문 섹션 분해: '## 헤딩' 기준
function splitSections(body) {
  const lines = body.split('\n');
  const sections = {};
  let cur = '__top__';
  sections[cur] = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(.*)$/);
    if (m) { cur = m[1].trim(); sections[cur] = []; }
    else sections[cur].push(line);
  }
  return sections;
}
function findSection(sections, keyword) {
  const key = Object.keys(sections).find((k) => k.includes(keyword));
  return key ? sections[key].join('\n') : '';
}
// 인용/안내(>) 줄, 빈 줄 제거하고 의미 있는 텍스트만
function cleanText(s) {
  return s.split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('>') && !l.startsWith('!['))
    .join(' ')
    .replace(/\*\*/g, '')
    .trim();
}
// 불릿/번호 리스트 추출
function listItems(s) {
  return s.split('\n')
    .map((l) => l.trim())
    .filter((l) => /^([-*]|\d+\.)\s+/.test(l))
    .map((l) => l.replace(/^([-*]|\d+\.)\s+/, '').replace(/\*\*/g, '').trim())
    .filter(Boolean);
}
function firstUrl(s) {
  const m = String(s).match(/https?:\/\/[^\s)\]>]+/);
  return m ? m[0].replace(/[).,]+$/, '') : '';
}

// ── 노트 파싱 ─────────────────────────────────────────
function parseNote(file) {
  const raw = fs.readFileSync(file, 'utf-8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const fmText = fmMatch ? fmMatch[1] : '';
  const body = fmMatch ? fmMatch[2] : raw;

  const fm = {};
  for (const line of fmText.split('\n')) {
    const m = line.match(/^([\w가-힣]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }

  const titleMatch = body.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : nick(fm.member) + ' 산출물';

  const sections = splitSections(body);

  // 카테고리: 체크박스 우선순위 OS > 배포사이트 > 기타, 없으면 배포링크 있으면 배포 사이트
  const isTrue = (v) => String(v).toLowerCase() === 'true';
  let category = '기타';
  const deployLine = body.match(/배포\s*링크.*$/m);
  const url = firstUrl(deployLine ? deployLine[0] : '') || firstUrl(findSection(sections, '배포'));
  if (isTrue(fm['OS'])) category = 'OS';
  else if (isTrue(fm['배포사이트'])) category = '배포 사이트';
  else if (isTrue(fm['기타'])) category = '기타';
  else if (url) category = '배포 사이트';

  const oneLiner = cleanText(findSection(sections, '한 줄 소개'));
  const why = cleanText(findSection(sections, 'WHY'));

  // Before / After (불릿 또는 인라인)
  const baText = findSection(sections, 'Before');
  const beforeM = baText.match(/Before\*?\*?\s*[:：]?\s*([\s\S]*?)(?:After|$)/i);
  const afterM = baText.match(/After\*?\*?\s*[:：]?\s*([\s\S]*)$/i);
  const before = beforeM ? cleanText(beforeM[1]).replace(/^[-*\s]+/, '') : '';
  const after = afterM ? cleanText(afterM[1]).replace(/^[-*\s]+/, '') : '';

  const features = listItems(findSection(sections, '주요 기능'));
  const insights = listItems(findSection(sections, '인사이트'));
  let techStack = [];
  const techRaw = cleanText(findSection(sections, '기술 스택') || findSection(sections, '만들었어요'));
  if (techRaw) techStack = techRaw.split(/[,，]/).map((t) => t.trim()).filter(Boolean);

  // 이미지: 본문에서 attachments 참조 추출(순서대로)
  const imgRefs = [...body.matchAll(/!\[[^\]]*\]\(([^)]*attachments\/[^)]+)\)/g)]
    .map((m) => decodeURIComponent(m[1].trim()));

  return {
    notePath: relFromRoot(file),
    dir: path.dirname(file),
    title, team: fm.team || '', member: nick(fm.member),
    mvp: isTrue(fm.mvp), category, url,
    descriptionShort: oneLiner, description: oneLiner || why,
    highlight: why, before, after,
    features, techStack, insights, imgRefs,
  };
}

// macOS sips 사용 가능 여부(한 번만 판정)
function sipsAvailable() {
  if (process.platform !== 'darwin') return false;
  try { execFileSync('sips', ['--version'], { stdio: 'ignore' }); return true; }
  catch { return false; }
}
const HAS_SIPS = sipsAvailable();

// ── 이미지 처리 ───────────────────────────────────────
// macOS면 sips로 720px JPEG 최적화. 아니면(타 OS 등) 원본을 그대로 복사해
// 어디서 실행해도 이미지가 표시되게 한다(미최적화).
function optimizeImages(parsed, slug) {
  const urls = [];
  parsed.imgRefs.forEach((ref, i) => {
    const src = path.resolve(parsed.dir, ref);
    if (!fs.existsSync(src)) { console.warn('  ⚠ 이미지 없음:', ref); return; }
    const base = `${slug}-${i + 1}`;

    if (DRY) { urls.push(`${ASSET_URL}/${base}.jpg`); return; }
    fs.mkdirSync(ASSET_DIR, { recursive: true });

    if (HAS_SIPS) {
      try {
        const out = path.join(ASSET_DIR, `${base}.jpg`);
        execFileSync('sips', ['-Z', '720', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', src, '--out', out], { stdio: 'ignore' });
        urls.push(`${ASSET_URL}/${base}.jpg`);
        return;
      } catch { /* 폴백으로 진행 */ }
    }
    // 폴백: 원본 그대로 복사 (최적화 없음, 모든 OS 동작)
    const ext = path.extname(src).toLowerCase() || '.png';
    const out = path.join(ASSET_DIR, `${base}${ext}`);
    fs.copyFileSync(src, out);
    urls.push(`${ASSET_URL}/${base}${ext}`);
    console.warn(`  ⚠ sips 미사용 — 원본 복사(미최적화): ${base}${ext}`);
  });
  return urls;
}

function toItem(parsed, images) {
  const it = {
    title: parsed.title, member: parsed.member, team: parsed.team,
    category: parsed.category, url: parsed.url, notePath: parsed.notePath,
    mvp: parsed.mvp,
    descriptionShort: parsed.descriptionShort, description: parsed.description,
  };
  if (parsed.highlight) it.highlight = parsed.highlight;
  if (parsed.before) it.before = parsed.before;
  if (parsed.after) it.after = parsed.after;
  if (parsed.features.length) it.features = parsed.features;
  if (parsed.techStack.length) it.techStack = parsed.techStack;
  if (parsed.insights.length) it.insights = parsed.insights;
  if (images.length) it.images = images;
  return it;
}

// ── 메인 ──────────────────────────────────────────────
const data = JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf-8'));
const existing = new Set(data.items.map((i) => i.notePath));
const usedSlugs = new Set(
  data.items.flatMap((i) => (i.images || []).map((u) => path.basename(u).replace(/-\d+\.jpg$/, '')))
);

const noteFiles = walk(NOTES_DIR);
const missing = noteFiles.filter((f) => !existing.has(relFromRoot(f)));

if (CHECK) {
  console.log(`전체 노트 ${noteFiles.length} / 갤러리 등록 ${existing.size} / 빠진 노트 ${missing.length}`);
  missing.forEach((f) => console.log('  +', relFromRoot(f)));
  process.exit(0);
}

if (missing.length === 0) {
  console.log('✅ 새로 추가할 노트가 없습니다. (전체 ' + noteFiles.length + '개 모두 등록됨)');
  process.exit(0);
}

console.log(`🆕 새 노트 ${missing.length}개 발견${DRY ? ' (dry-run)' : ''}`);
const added = [];
for (const file of missing) {
  const parsed = parseNote(file);
  let slug = slugify(parsed.title, parsed.url);
  while (usedSlugs.has(slug)) slug += '-2';
  usedSlugs.add(slug);
  const images = optimizeImages(parsed, slug);
  const item = toItem(parsed, images);
  added.push(item);
  console.log(`\n── ${item.title} (${item.team} ${item.member}) [${item.category}]${item.mvp ? ' ⭐' : ''}`);
  console.log('   url:', item.url || '(없음)');
  console.log('   한줄:', item.descriptionShort || '(없음)');
  console.log('   기능:', (item.features || []).length, '· 인사이트:', (item.insights || []).length, '· 이미지:', (item.images || []).length);
}

if (DRY) {
  console.log('\n(dry-run: gallery.json 미변경)');
  process.exit(0);
}

data.items.push(...added);
fs.writeFileSync(GALLERY_JSON, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`\n✅ gallery.json에 ${added.length}개 추가 완료 (총 ${data.items.length}개)`);
console.log('   ⓘ 자동 추가본은 검수 후 다듬어주세요 (이모지 기능/개조식 인사이트 등).');
