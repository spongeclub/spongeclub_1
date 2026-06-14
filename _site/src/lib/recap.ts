import fs from 'node:fs';
import path from 'node:path';
import { loadAnalysis } from './analysis';
import type { MemberAnalysis } from './analysis';
import { buildAllWeeks, getTeamTopic } from './data';
import galleryData from '../data/gallery.json';

// 조별 색상 (모노그램/칩 색)
const TEAM_COLOR: Record<string, string> = {
  '1조': '#6366f1', '2조': '#0891b2', '3조': '#16a34a',
  '4조': '#f59e0b', '5조': '#db2777', '6조': '#7c3aed',
};
export function teamColor(team: string): string {
  return TEAM_COLOR[team] ?? '#64748b';
}
export function monogram(nickname: string): string {
  return Array.from(nickname)[0] ?? '·';
}

// growthNarrative(긴 단락)에서 "배운 것" 한 줄 추출:
// 마지막 결론 문장(…다.)을 우선, 없거나 너무 길면 첫 문장.
export function distillLearned(narrative: string): string {
  const text = (narrative ?? '').trim();
  if (!text) return '';
  const sentences = text
    .split(/(?<=다[.])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length === 0) return text.slice(0, 90);
  const last = sentences[sentences.length - 1];
  if (last.length <= 110) return last;
  const first = sentences[0];
  return first.length <= 110 ? first : first.slice(0, 107) + '…';
}

export type SpotlightItem = {
  nickname: string;
  team: string;
  teamTopic: string;
  color: string;
  monogram: string;
  learned: string;
  made: string[];
  weeksActive: number[]; // 1..6
  href: string;
};

function memberHref(team: string, nickname: string): string {
  return `/member/${encodeURIComponent(team)}/${encodeURIComponent(nickname)}/`;
}

export function buildSpotlight(): SpotlightItem[] {
  return loadAnalysis().members.map((m: MemberAnalysis): SpotlightItem => ({
    nickname: m.nickname,
    team: m.team,
    teamTopic: getTeamTopic(m.team)?.topic ?? '',
    color: teamColor(m.team),
    monogram: monogram(m.nickname),
    learned: distillLearned(m.growthNarrative),
    made: m.weeklyHighlights.map((h) => h.title).filter(Boolean),
    weeksActive: [...new Set(m.weeklyHighlights.map((h) => h.week))].sort((a, b) => a - b),
    href: memberHref(m.team, m.nickname),
  }));
}

// 멤버·갤러리 마키 공용 카드 형태
export type MarqueeItem = {
  href: string;
  imageUrl?: string;
  monogram?: string;
  color?: string;
  title: string;
  sub: string;
};

export function buildMemberRolling(): MarqueeItem[] {
  return loadAnalysis().members.map((m): MarqueeItem => ({
    href: memberHref(m.team, m.nickname),
    monogram: monogram(m.nickname),
    color: teamColor(m.team),
    title: m.nickname,
    sub: distillLearned(m.growthNarrative),
  }));
}

type GalleryRaw = {
  items: Array<{
    title: string; member: string; team: string; url?: string;
    descriptionShort?: string; images?: string[]; mvp?: boolean;
  }>;
};
export function buildGalleryStrip(): MarqueeItem[] {
  const g = galleryData as GalleryRaw;
  return g.items.map((it): MarqueeItem => ({
    // url 직행 대신 갤러리 페이지의 해당 카드(모달)로 — 제목으로 매칭
    href: `/gallery/?item=${encodeURIComponent(it.title)}`,
    imageUrl: it.images?.[0],
    color: '#0f172a',
    title: it.title,
    sub: it.descriptionShort ?? it.member,
  }));
}

const DDAY_FROM = '2026-05-03';
function togetherDays(): number {
  const [fy, fm, fd] = DDAY_FROM.split('-').map(Number);
  const fromUTC = Date.UTC(fy, fm - 1, fd);
  const now = new Date();
  const kst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000);
  const todayUTC = Date.UTC(kst.getFullYear(), kst.getMonth(), kst.getDate());
  return Math.max(0, Math.floor((todayUTC - fromUTC) / 86400000));
}

export type RecapStats = {
  members: number; weeks: number; submissions: number;
  artifacts: number; togetherDays: number;
};
export function recapStats(): RecapStats {
  const weeks = buildAllWeeks().filter((w) => w.submittedCount > 0);
  return {
    members: loadAnalysis().memberCount,
    weeks: weeks.length,
    submissions: weeks.reduce((s, w) => s + w.submittedCount, 0),
    artifacts: (galleryData as GalleryRaw).items.length,
    togetherDays: togetherDays(),
  };
}

export type KeywordCount = { keyword: string; count: number };
export function afterKeywords(top = 8): KeywordCount[] {
  const counts = new Map<string, number>();
  for (const m of loadAnalysis().members) {
    for (const k of m.keywords ?? []) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, top);
}

// 1기 키워드 분석 — 멤버 keywords + 주차별 highlight keywords 전체 집계.
// weight(0~1)는 폰트 크기용(최다=1). 워드클라우드 시각화에 사용.
export type KeywordWeight = { keyword: string; count: number; weight: number };
export function keywordCloud(top = 40): KeywordWeight[] {
  const counts = new Map<string, number>();
  for (const m of loadAnalysis().members) {
    for (const k of m.keywords ?? []) counts.set(k, (counts.get(k) ?? 0) + 1);
    for (const wh of m.weeklyHighlights ?? []) {
      for (const k of wh.keywords ?? []) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  const sorted = [...counts.entries()]
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, top);
  if (!sorted.length) return [];
  const max = sorted[0].count;
  const min = sorted[sorted.length - 1].count;
  return sorted.map((e) => ({
    ...e,
    weight: max === min ? 0.65 : (e.count - min) / (max - min),
  }));
}

// 단체사진 롤링용: public/assets/recap/group/ 안의 이미지들을 빌드타임에 스캔.
// 사용자가 이 폴더에 사진을 넣기만 하면 자동 반영(코드 수정 불필요).
export function buildGroupPhotos(): string[] {
  const dir = path.resolve(process.cwd(), 'public', 'assets', 'recap', 'group');
  let files: string[] = [];
  try { files = fs.readdirSync(dir); } catch { return []; }
  return files
    .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
    .sort()
    .map((f) => `/assets/recap/group/${encodeURIComponent(f)}`);
}

// 빌드타임 invariant: 셀렉터가 깨지면 빌드를 멈춘다.
export function assertRecapData(): void {
  const sl = buildSpotlight();
  if (sl.length === 0) throw new Error('[recap] spotlight 비어있음');
  const empties = sl.filter((s) => !s.learned).map((s) => s.nickname);
  if (empties.length) throw new Error(`[recap] learned 빈 멤버: ${empties.join(', ')}`);
  if (recapStats().members < 1) throw new Error('[recap] stats.members 0');
}
