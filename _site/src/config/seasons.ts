// ────────────────────────────────────────────────────────────────
// 시즌 레지스트리 — 단일 소스(single source).
// 시즌의 메타(번호·라벨·상태·경로·규모)를 여기 한 곳에서 정의한다.
// 메인 `/` 은 항상 status:'active' 시즌, 과거 시즌은 status:'archived' + 정적 경로.
// 시즌 전환 런북: _site/README.md "다음 시즌 올리기" 참고.
// ────────────────────────────────────────────────────────────────

export type Season = {
  n: number;
  label: string;            // 표시 라벨 (예: '2기')
  status: 'active' | 'archived';
  path: string;             // 그 시즌 랜딩 경로 ('/' = 현재 시즌)
  startDate?: string;       // YYYY-MM-DD (active 시즌 D-day 계산용)
  members?: number;
  teams?: number;
  weeks?: number;
  outputs?: number;         // 산출물 수 (아카이브 요약용)
};

export const SEASONS: Season[] = [
  { n: 2, label: '2기', status: 'active',   path: '/',        startDate: '2026-06-16', members: 84, teams: 6, weeks: 6 },
  { n: 1, label: '1기', status: 'archived', path: '/season1', members: 77, teams: 6, weeks: 6, outputs: 73 },
];

export const activeSeason = SEASONS.find((s) => s.status === 'active')!;
export const archivedSeasons = SEASONS.filter((s) => s.status === 'archived');
export const seasonByN = (n: number) => SEASONS.find((s) => s.n === n);
