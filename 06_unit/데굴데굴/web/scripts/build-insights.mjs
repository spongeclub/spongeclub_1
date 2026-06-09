#!/usr/bin/env node
// build-insights.mjs
// skills.generated.json(visible 카드)에서 "이번 주 인사이트" 신호(사실)만 뽑아 출력한다.
// 문장은 쓰지 않는다 — 숫자·분포·후기 후보만 정확히 깔아주면,
// /build-skills 단계에서 AI가 카드화규칙.md 파트2 톤으로 2~3문장을 써서 insights.generated.json에 기록한다.
//
// Usage: node scripts/build-insights.mjs

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_JSON = join(__dirname, '../src/data/skills.generated.json');

// 솔직/아쉬운 후기 신호어 — 하나라도 걸리면 "부정 후기 후보"로 표시(멤버명 빼기 트리거)
const HONEST_CUES = ['아쉽', '모르겠', '별로', '안 나', '안나', '실패', '글쎄', '어렵', '빡', '안 됨', '안됨', '한계', '아직', '안 통'];

const skills = JSON.parse(readFileSync(SKILLS_JSON, 'utf8'));
const visible = Object.entries(skills)
  .filter(([, v]) => v.visible)
  .map(([slug, v]) => ({ slug, ...v }));

// ① 최다 사용 — usedBy 내림차순
const topUsed = [...visible].sort((a, b) => b.usedBy - a.usedBy).slice(0, 5);

// ② 분야 분포
const areaCount = {};
for (const s of visible) areaCount[s.area || '(미분류)'] = (areaCount[s.area || '(미분류)'] ?? 0) + 1;
const areaSorted = Object.entries(areaCount).sort((a, b) => b[1] - a[1]);

// ③ 솔직/부정 후기 후보 — quotes에 신호어 포함
const honest = [];
for (const s of visible) {
  for (const q of s.quotes ?? []) {
    if (HONEST_CUES.some(c => q.text.includes(c))) {
      honest.push({ slug: s.slug, text: q.text, author: q.author });
    }
  }
}

// ─── 출력 ────────────────────────────────────────────────────────────────────
console.log('=== 이번 주 인사이트 신호 (사실만, 문장은 AI가 작성) ===\n');

console.log(`[전체] visible 카드 ${visible.length}개\n`);

console.log('[① 최다 사용 스킬] usedBy 내림차순');
for (const s of topUsed) {
  console.log(`  - ${s.slug}: ${s.usedBy}명 — ${s.summary}`);
}

console.log('\n[② 분야 분포]');
for (const [area, n] of areaSorted) {
  console.log(`  - ${area}: ${n}개`);
}

console.log('\n[③ 솔직/아쉬운 후기 후보] (인사이트에 쓸 땐 멤버명 빼기)');
if (honest.length === 0) {
  console.log('  - 없음');
} else {
  for (const h of honest) {
    console.log(`  - ${h.slug}: "${h.text}" (${h.author})`);
  }
}

console.log('\n=== 위 사실로 카드화규칙.md 파트2 톤대로 2~3문장 작성 → insights.generated.json ===');
