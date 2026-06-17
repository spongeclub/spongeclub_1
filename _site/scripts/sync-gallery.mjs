#!/usr/bin/env node
// 갤러리 반자동 동기화 스크립트
// 02_mission/gallery input/ 의 제출 노트를 읽어, gallery.json에 아직 없는 산출물을
// 자동으로 추가하고 첨부 이미지를 720px JPEG로 최적화한다.
//
// 사용법 (repo 루트 _site 기준):
//   node scripts/sync-gallery.mjs              # 새 노트만 추가 + 이미지 최적화 + gallery.json 갱신
//   node scripts/sync-gallery.mjs --dry        # 쓰지 않고 파싱 결과만 출력(검증용)
//   node scripts/sync-gallery.mjs --check      # 빠진 노트 목록만 출력
//   node scripts/sync-gallery.mjs --resync <대상>  # 등록된 노트를 다시 파싱해 빈 칸만 채움(수정 반영)
//   node scripts/sync-gallery.mjs --resync-all     # 등록된 모든 노트 재파싱(--dry로 미리보기 권장)
//   node scripts/sync-gallery.mjs --resync <대상> --force  # 노트 원문으로 전체 덮어쓰기
//
// 기본 동작은 새 노트만 추가하고 기존 항목은 건드리지 않는다(notePath 기준 중복 제외).
// 멤버가 노트를 수정한 뒤 갤러리에 반영하려면 --resync 로 해당 노트를 다시 파싱한다.
//   · 기본(추가형): 비어 있는 칸만 노트에서 채우고 사람이 다듬은 설명/인사이트는 보존.
//   · --force: 노트를 진실로 보고 전체 덮어쓰기(빈 값 다운그레이드만 방지, featuresSimple 보존).
// <대상>은 notePath·제목·닉네임 부분일치. 항상 --dry 로 변경 내용을 먼저 확인하길 권장.

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

const argv = process.argv.slice(2);
const args = new Set(argv);
const DRY = args.has('--dry');
const CHECK = args.has('--check');
const RESYNC_ALL = args.has('--resync-all');
const FORCE = args.has('--force');
// --resync <대상> 또는 --resync=<대상> : 등록된 노트(notePath·제목·닉네임 부분일치)를 다시 파싱
let resyncTarget = null;
const ri = argv.indexOf('--resync');
if (ri >= 0 && argv[ri + 1] && !argv[ri + 1].startsWith('--')) resyncTarget = argv[ri + 1];
const reEq = argv.find((a) => a.startsWith('--resync='));
if (reEq) resyncTarget = reEq.slice('--resync='.length);
const RESYNC = RESYNC_ALL || resyncTarget != null;

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
// 템플릿 안내문(>로 시작하는 힌트) 보일러플레이트. 멤버가 블록인용(>) 안에 답을
// 적어 넣는 경우가 많아, 인용 줄을 통째로 버리면 진짜 내용까지 사라진다(예: 한 줄 소개).
// 그래서 인용 표시는 떼되, 아래 안내 문구가 포함된 줄만 골라서 버린다.
const HINT_FRAGMENTS = [
  '카드에 보일', '누구의 어떤 문제', '스크린샷을 여기에', '여기에 붙여넣기', '사용한 도구',
  '막혔던 지점', '깨달은 점', '이 도구가 없을 때', '이 도구로 달라진', '한 줄로', '쉼표로',
  '1~2문장', '왜 만들었', '이 노트 1개', '추가 산출물', '다 채우면', '위 속성에서',
  '해당하는 것 하나만', '없으면 비워',
];
function isHintLine(l) {
  const t = l.replace(/^>+\s?/, '').trim();
  if (!t) return true;
  if (/^예시?\s*[:：]/.test(t)) return true;            // "예: ...", "예시: ..." 예시 문구
  if (/^<.*>$/.test(t)) return true;                    // <URL — 없으면 비워두기> 같은 플레이스홀더
  return HINT_FRAGMENTS.some((h) => t.includes(h));
}
// 인용(>) 줄도 내용일 수 있으므로 안내문구만 걸러 살린다. 이미지/빈 줄 제외.
function cleanText(s) {
  return s.split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('!['))
    .filter((l) => !isHintLine(l))
    .map((l) => l.replace(/^>+\s?/, '').trim())
    .filter(Boolean)
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

// 재싱크 병합 정책.
// 기본(추가형, fill-only): 기존 항목을 그대로 두고 빈 칸만 노트에서 채운다. 사람이 다듬은
//   설명·인사이트를 노트 원문으로 되돌려 망가뜨리지 않는다(가장 흔한 "수정/보강했는데
//   안 떠요"가 대부분 빈 칸 채우기라 이걸로 해결). category·mvp는 노트가 진실이라 갱신.
// --force(덮어쓰기): 노트를 진실로 보고 전체 갱신하되, 빈 값으로의 다운그레이드는 막고
//   featuresSimple(노트 출처 없음)은 보존.
function mergeResync(old, fresh) {
  if (FORCE) {
    const out = { ...fresh };
    for (const k of ['descriptionShort', 'description', 'before', 'after', 'url', 'highlight']) {
      if ((out[k] == null || out[k] === '') && old[k]) out[k] = old[k];
    }
    for (const k of ['features', 'techStack', 'insights', 'images']) {
      if ((!out[k] || !out[k].length) && old[k] && old[k].length) out[k] = old[k];
    }
    if (old.featuresSimple) out.featuresSimple = old.featuresSimple;
    return out;
  }
  const out = { ...old };
  for (const k of ['descriptionShort', 'description', 'before', 'after', 'url', 'highlight']) {
    if ((out[k] == null || out[k] === '') && fresh[k]) out[k] = fresh[k];
  }
  for (const k of ['techStack', 'insights', 'images']) {
    if ((!out[k] || !out[k].length) && fresh[k] && fresh[k].length) out[k] = fresh[k];
  }
  // features는 featuresSimple(큐레이션)이 있으면 채우지 않는다(중복/노이즈 방지).
  const hasCuratedFeats = out.featuresSimple && out.featuresSimple.length;
  if (!hasCuratedFeats && (!out.features || !out.features.length) && fresh.features && fresh.features.length) {
    out.features = fresh.features;
  }
  out.category = fresh.category;
  out.mvp = fresh.mvp;
  return out;
}

// 변경 요약(검수용): 주요 필드의 before→after, 배열은 개수 변화만.
function summarizeDiff(old, fresh) {
  const d = [];
  for (const k of ['descriptionShort', 'url', 'category', 'mvp']) {
    if (JSON.stringify(old[k] ?? '') !== JSON.stringify(fresh[k] ?? '')) {
      d.push(`${k}: ${JSON.stringify(old[k] ?? '')} → ${JSON.stringify(fresh[k] ?? '')}`);
    }
  }
  for (const k of ['features', 'techStack', 'insights', 'images']) {
    const a = (old[k] || []).length, b = (fresh[k] || []).length;
    if (a !== b) d.push(`${k}: ${a}→${b}개`);
  }
  return d;
}

// ── 메인 ──────────────────────────────────────────────
const data = JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf-8'));
const existing = new Set(data.items.map((i) => i.notePath));
const usedSlugs = new Set(
  data.items.flatMap((i) => (i.images || []).map((u) => path.basename(u).replace(/-\d+\.jpg$/, '')))
);

const noteFiles = walk(NOTES_DIR);
const missing = noteFiles.filter((f) => !existing.has(relFromRoot(f)));

// ── 재싱크: 이미 등록된 노트를 다시 파싱해 갱신 ──────────
if (RESYNC) {
  const targets = data.items.filter((it) =>
    RESYNC_ALL
      ? true
      : (it.notePath || '').includes(resyncTarget) ||
        (it.title || '').includes(resyncTarget) ||
        nick(it.member).includes(resyncTarget)
  );
  if (!targets.length) {
    console.error(`재싱크 대상을 찾지 못했습니다: "${resyncTarget}"`);
    process.exit(1);
  }
  console.log(`🔄 재싱크 ${targets.length}개${DRY ? ' (dry-run)' : ''}`);
  let changed = 0;
  for (const old of targets) {
    const file = path.join(ROOT, ...old.notePath.split('/'));
    if (!fs.existsSync(file)) { console.warn(`  ⚠ 노트 없음, 스킵: ${old.notePath}`); continue; }
    const parsed = parseNote(file);
    // 이미지: 기존 이미지가 있고 --force가 아니면 재생성하지 않는다(기존 파일·순서 보존,
    // 불필요한 재인코딩과 슬러그 꼬임 방지). 비어 있을 때만(또는 --force) 새로 최적화한다.
    let images = old.images || [];
    if (FORCE || images.length === 0) {
      let slug;
      if (old.images && old.images[0]) {
        // 기존 파일명 슬러그 재사용: 확장자와 -N 꼬리 모두 제거(첫 이미지는 slug.jpg 형태)
        slug = path.basename(old.images[0]).replace(/\.[a-z0-9]+$/i, '').replace(/-\d+$/, '');
      } else {
        slug = slugify(parsed.title, parsed.url);
        while (usedSlugs.has(slug)) slug += '-2';
        usedSlugs.add(slug);
      }
      images = optimizeImages(parsed, slug);
    }
    const fresh = mergeResync(old, toItem(parsed, images));
    const diff = summarizeDiff(old, fresh);
    console.log(`\n── ${fresh.title} (${fresh.team} ${fresh.member})`);
    if (diff.length) { diff.forEach((d) => console.log('   •', d)); changed++; }
    else console.log('   (변경 없음)');
    data.items[data.items.indexOf(old)] = fresh;
  }
  if (DRY) { console.log('\n(dry-run: gallery.json 미변경)'); process.exit(0); }
  fs.writeFileSync(GALLERY_JSON, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`\n✅ 재싱크 완료 — ${changed}개 변경 (총 ${data.items.length}개)`);
  console.log('   ⓘ featuresSimple 등 수작업 큐레이션은 보존됩니다. 새로 채워진 필드는 검수하세요.');
  process.exit(0);
}

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
