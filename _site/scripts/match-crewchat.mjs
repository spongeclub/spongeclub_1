// crewchat-raw.json ↔ vault 멤버목록.md 매칭 리포트 (DRY, 아무것도 안 씀)
// 실행: node scripts/match-crewchat.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT = path.resolve(__dirname, '..', '..'); // _site/.. = vault 루트
const crew = JSON.parse(fs.readFileSync(path.join(__dirname, 'crewchat-raw.json'), 'utf-8'));

// --- vault 멤버 파싱 (parseMemberList 복제) ---
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
    const nickname = pm ? cleaned.replace(NICK_PAREN, '').trim() : cleaned;
    const fullName = pm ? pm[1].trim() : cleaned;
    members.push({ team, nickname, fullName });
  }
  return members;
}

const vault = parseVault();
const norm = (s) => (s || '').replace(/\s+/g, '').toLowerCase();
// crewchat name → {nick, paren}
function split(name) {
  const n = name.replace(/^\d조\s*/, '').trim(); // "4조 지니(신진영)" → "지니(신진영)"
  const pm = n.match(NICK_PAREN);
  return { nick: pm ? n.replace(NICK_PAREN, '').trim() : n, paren: pm ? pm[1].trim() : '' };
}

const usedVault = new Set();
const rows = [];
for (const c of crew) {
  const { nick, paren } = split(c.name);
  const cand = [nick, paren, c.name].map(norm).filter(Boolean);
  let match = null, strat = '';
  // 우선순위: 닉네임 정확 → 본명 정확 → paren=닉 → 통명=본명/닉
  for (const v of vault) {
    if (usedVault.has(v.nickname + v.team)) continue;
    const vn = norm(v.nickname), vf = norm(v.fullName);
    if (cand.includes(vn)) { match = v; strat = 'nick'; break; }
  }
  if (!match) for (const v of vault) {
    if (usedVault.has(v.nickname + v.team)) continue;
    const vf = norm(v.fullName);
    if (vf && cand.includes(vf)) { match = v; strat = 'fullname'; break; }
  }
  if (match) usedVault.add(match.nickname + match.team);
  // 사진 종류
  const img = c.profile_image;
  const photo = !img ? 'NONE' : (img.includes('gravatar.com') ? 'DEFAULT' : 'REAL');
  rows.push({ crew: c.name, g: c.group_number, match, strat, photo });
}

// --- 출력 ---
const ok = rows.filter(r => r.match);
const fuzzy = ok.filter(r => r.strat === 'fullname');
const no = rows.filter(r => !r.match);
const matchedVaultKeys = new Set(ok.map(r => r.match.nickname + r.match.team));
const vaultMissing = vault.filter(v => !matchedVaultKeys.has(v.nickname + v.team));

console.log(`\n=== 매칭 결과: crewchat ${crew.length}명 / vault ${vault.length}명 ===`);
console.log(`✅ 매칭됨: ${ok.length}  (닉네임직매칭 ${ok.length - fuzzy.length} / 본명매칭 ${fuzzy.length})`);
console.log(`❌ crewchat인데 vault매칭 실패: ${no.length}`);
console.log(`⚠️ vault에 있는데 crewchat매칭 안됨: ${vaultMissing.length}`);

console.log(`\n--- ⚠️ 본명으로 매칭된 건 (확인 필요) ---`);
for (const r of fuzzy) console.log(`  crew "${r.crew}"(${r.g}조) → vault ${r.match.nickname}(${r.match.fullName}, ${r.match.team})`);

console.log(`\n--- ❌ crewchat → vault 매칭 실패 ---`);
for (const r of no) console.log(`  crew "${r.crew}"(${r.g}조)  [사진:${r.photo}]`);

console.log(`\n--- ⚠️ vault에 있는데 crewchat에 없음 ---`);
for (const v of vaultMissing) console.log(`  vault ${v.nickname}(${v.fullName}, ${v.team})`);

const photoStats = rows.reduce((a, r) => (a[r.photo] = (a[r.photo]||0)+1, a), {});
console.log(`\n--- 사진 종류 (전체 crewchat) ---`);
console.log(`  REAL(슬랙업로드) ${photoStats.REAL||0} / DEFAULT(기본아바타) ${photoStats.DEFAULT||0} / NONE(없음) ${photoStats.NONE||0}`);
