// crewchat-raw.json → members-extra.json 재생성 + 슬랙 프로필 사진 다운로드.
// 매칭: vault 멤버목록.md 닉네임 기준 (자동 + 본명 + 수동오버라이드).
// 실행: node scripts/sync-crewchat.mjs   (--no-photos 로 다운로드 생략)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, '..');
const VAULT = path.resolve(SITE, '..');
const PHOTO_DIR = path.join(SITE, 'public/assets/members/crew');
const PHOTO_URLBASE = '/assets/members/crew';
const SKIP_PHOTOS = process.argv.includes('--no-photos');

const crew = JSON.parse(fs.readFileSync(path.join(__dirname, 'crewchat-raw.json'), 'utf-8'));

// 표기 차이로 자동매칭 안 되는 멤버 → vault 닉네임 수동 지정.
// '4조 지니(신진영)'은 닉 "지니"가 3조 지니(민은진)와 충돌하므로 명시적으로 찌니에 고정.
const OVERRIDE = { '라엘': '박라엘', '이니': 'Iny', 'ppucca': '뿌까', '정민': '정정민', '4조 지니(신진영)': '찌니' };

// --- vault 파싱 ---
const NICK_PAREN = /\(([^)]+)\)/;
function parseVault() {
  const text = fs.readFileSync(path.join(VAULT, '99_meta/멤버목록.md'), 'utf-8').replace(/\r\n/g, '\n');
  const members = [];
  let team = null;
  for (const line of text.split('\n')) {
    const h = line.match(/^##\s+(\d조)\s*\(\d+명\)/);
    if (h) { team = h[1]; continue; }
    if (/^##\s/.test(line) || /^---\s*$/.test(line)) { team = null; continue; }
    if (!team) continue;
    const item = line.match(/^-\s+(.+)$/);
    if (!item) continue;
    const cleaned = item[1].replace(/\s*※셀피쉬크루\s*$/, '').trim();
    const pm = cleaned.match(NICK_PAREN);
    members.push({
      team,
      nickname: pm ? cleaned.replace(NICK_PAREN, '').trim() : cleaned,
      fullName: pm ? pm[1].trim() : cleaned,
    });
  }
  return members;
}
const vault = parseVault();
const norm = (s) => (s || '').replace(/\s+/g, '').toLowerCase();

function matchVault(name, used) {
  const free = (v) => v && !used.has(v.nickname + v.team);
  if (OVERRIDE[name]) return vault.find((v) => v.nickname === OVERRIDE[name]) ?? null;
  const n = name.replace(/^\d조\s*/, '').trim();
  const pm = n.match(NICK_PAREN);
  const nick = pm ? n.replace(NICK_PAREN, '').trim() : n;
  const paren = pm ? pm[1].trim() : '';
  const cand = [nick, paren, name].map(norm).filter(Boolean);
  return (
    vault.find((v) => free(v) && cand.includes(norm(v.nickname))) ??
    vault.find((v) => free(v) && v.fullName && cand.includes(norm(v.fullName))) ??
    null
  );
}

// --- SNS 정규화 ---
const isUrl = (v) => /^https?:\/\//i.test(v);
const handle = (v) => v.trim().split(/\s+/)[0].replace(/^@/, '');
function ig(v) { v = (v || '').trim(); if (!v) return ''; return isUrl(v) ? v : `https://instagram.com/${handle(v)}`; }
function li(v) { v = (v || '').trim(); return isUrl(v) ? v : ''; } // 비URL(잘못입력) 버림
function th(v) { v = (v || '').trim(); if (!v) return ''; if (isUrl(v)) return /threads\./i.test(v) ? v : ''; return `https://www.threads.com/@${handle(v)}`; }
function bl(v) { v = (v || '').trim(); if (!v) return ''; return isUrl(v) ? v : `https://${v}`; }
function pf(v) { v = (v || '').trim(); return isUrl(v) ? v : ''; }

// 사진: 슬랙 실업로드만 (gravatar 기본아바타·null 은 디폴트 로고로)
function photoUrl(img) { return img && !img.includes('gravatar.com') ? img : ''; }

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

const out = {};
const unmatched = [];
let realPhotos = 0, defaulted = 0;
if (!SKIP_PHOTOS) fs.mkdirSync(PHOTO_DIR, { recursive: true });

const used = new Set();
for (const c of crew) {
  const v = matchVault(c.name, used);
  if (!v) { unmatched.push(c.name); continue; }
  used.add(v.nickname + v.team);

  // threads 칸에 블로그 URL 오입력 → blog로 이동
  let threads = th(c.sns_threads), blog = bl(c.sns_blog);
  if ((c.sns_threads || '').includes('naver') && !blog) { blog = bl(c.sns_threads); threads = ''; }

  const src = photoUrl(c.profile_image);
  let image = '';
  if (src) {
    const file = src.split('?')[0].split('/').pop();
    image = `${PHOTO_URLBASE}/${file}`;
    if (!SKIP_PHOTOS) {
      try { await download(src, path.join(PHOTO_DIR, file)); realPhotos++; }
      catch (e) { console.warn(`  ⚠️ 다운로드 실패 ${c.name}: ${e.message}`); image = ''; }
    } else realPhotos++;
  } else defaulted++;

  out[v.nickname] = {
    jobTitle: (c.job_title || '').trim(),
    field: (c.field || '').trim(),
    sns: { instagram: ig(c.sns_instagram), linkedin: li(c.sns_linkedin), threads, blog, portfolio: pf(c.sns_portfolio) },
    image,
  };
}

// vault엔 있는데 crewchat에 없던 멤버 → 빈 엔트리 유지(카드는 디폴트로 뜸)
for (const v of vault) if (!out[v.nickname]) out[v.nickname] = { jobTitle: '', field: '', sns: {}, image: '' };

fs.writeFileSync(path.join(SITE, 'src/data/members-extra.json'), JSON.stringify(out, null, 2) + '\n');

console.log(`✅ members-extra.json 작성: ${Object.keys(out).length}명`);
console.log(`   사진 다운로드(실): ${realPhotos} / 디폴트로고: ${defaulted}`);
if (unmatched.length) console.log(`   ❌ 매칭실패(스킵): ${unmatched.join(', ')}`);
