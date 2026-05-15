import type { Member, MemberStatus, Team } from "@/lib/types";

/**
 * 스폰지클럽 1기 · 6개 조 · 총 77명 (조장 6 + 셀피쉬크루 4 + 부조장 6 + 크루 61)
 *
 * 출처: Google Sheets · gid=632296607 (2026-05 기준)
 * 닉네임만 표기 (시트의 "X(Y)" 포맷은 닉네임 쪽을 채택).
 *
 * 제출 상태는 mock — Phase 2에서 spongeclub-homepage 실데이터로 교체.
 * - submittedWeeks: 제출 완료한 주차 (보통 0주차는 셋업이므로 모두 포함)
 * - writingWeek: 현재 작성 중인 주차 (있으면 1)
 *
 * 0주차(셋업): 모든 멤버 제출 완료 가정.
 * 1주차(현재 진행중): 제출/작성중/미작성 mix.
 */
export const teams: Team[] = [
  {
    number: 1,
    color: "#FF8A4C",
    shortName: "AX PM",
    subject: "AX PM · 프로덕트 구조 설계",
    members: [
      { nickname: "비비안", role: "leader", submittedWeeks: [0, 1] },
      { nickname: "샤인", role: "vice", submittedWeeks: [0, 1] },
      { nickname: "이든", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "배짱", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "잭", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "체스터", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "Amy", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "유스", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "민트", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "아가타", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "모닥", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "솔", role: "crew", submittedWeeks: [0] },
      { nickname: "나무", role: "crew", submittedWeeks: [0] },
    ],
  },
  {
    number: 2,
    color: "#FFB800",
    shortName: "콘텐츠 마케팅",
    subject: "콘텐츠 마케팅 사이트 + Vercel 자동배포",
    members: [
      { nickname: "띵크", role: "leader", submittedWeeks: [0, 1] },
      { nickname: "에밀리", role: "selfish_crew", submittedWeeks: [0, 1] },
      { nickname: "제제", role: "vice", submittedWeeks: [0, 1] },
      { nickname: "마라", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "오국봉", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "히카리", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "포노미터", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "박라엘", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "죠죠", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "피노", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "봄", role: "crew", submittedWeeks: [0] },
      { nickname: "슬로우퀵", role: "crew", submittedWeeks: [0] },
      { nickname: "박경선", role: "crew", submittedWeeks: [0] },
    ],
  },
  {
    number: 3,
    color: "#7CC4FF",
    shortName: "OS 설계 철학",
    subject: "OS 설계 철학 · Sullivan 프로젝트",
    members: [
      { nickname: "흐민", role: "leader", submittedWeeks: [0, 1] },
      { nickname: "솔라", role: "selfish_crew", submittedWeeks: [0, 1] },
      { nickname: "개미", role: "vice", submittedWeeks: [0, 1] },
      { nickname: "율리아", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "코니", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "설록", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "치코", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "신연수", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "지니", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "린디", role: "crew", submittedWeeks: [0] },
      { nickname: "Nina", role: "crew", submittedWeeks: [0] },
      { nickname: "그린", role: "crew", submittedWeeks: [0] },
      { nickname: "이세희", role: "crew", submittedWeeks: [0] },
    ],
  },
  {
    number: 4,
    color: "#A78BFA",
    shortName: "OPS 시스템화",
    subject: "레포 · 자동화 · 아카이브 · OPS 시스템화",
    members: [
      { nickname: "다다", role: "leader", submittedWeeks: [0, 1] },
      { nickname: "위시", role: "selfish_crew", submittedWeeks: [0, 1] },
      { nickname: "먼지민", role: "vice", submittedWeeks: [0, 1] },
      { nickname: "에이스", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "찌니", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "yongs", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "달빛그린", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "Rin", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "거위의꿈", role: "crew", submittedWeeks: [0] },
      { nickname: "설민주", role: "crew", submittedWeeks: [0] },
      { nickname: "릴팍", role: "crew", submittedWeeks: [0] },
      { nickname: "리보", role: "crew", submittedWeeks: [0] },
      { nickname: "정민", role: "crew", submittedWeeks: [0] },
    ],
  },
  {
    number: 5,
    color: "#34D399",
    shortName: "유저 프로덕트",
    subject: "월 1개 유저 프로덕트 런칭",
    /** 시트상 12명 + 1자리 미배정 = 총 13명 슬롯 */
    members: [
      { nickname: "오웬", role: "leader", submittedWeeks: [0, 1] },
      { nickname: "키노", role: "vice", submittedWeeks: [0, 1] },
      { nickname: "Sunny", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "이안", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "비키", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "덕수", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "로이캉", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "artree", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "성윤재", role: "crew", submittedWeeks: [0] },
      { nickname: "박상임", role: "crew", submittedWeeks: [0] },
      { nickname: "거북이의꿈", role: "crew", submittedWeeks: [0] },
      { nickname: "보미", role: "crew", submittedWeeks: [0] },
    ],
  },
  {
    number: 6,
    color: "#F472B6",
    shortName: "운영 총괄",
    subject: "운영 총괄 · 콘텐츠 운영 시스템",
    members: [
      { nickname: "다니", role: "leader", submittedWeeks: [0, 1] },
      { nickname: "키니", role: "selfish_crew", submittedWeeks: [0, 1] },
      { nickname: "라라", role: "vice", submittedWeeks: [0, 1] },
      { nickname: "석영", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "레이", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "히얌", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "이창환", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "정하늘", role: "crew", submittedWeeks: [0, 1] },
      { nickname: "Galia", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "허니바른", role: "crew", submittedWeeks: [0], writingWeek: 1 },
      { nickname: "이루다썬", role: "crew", submittedWeeks: [0] },
      { nickname: "J", role: "crew", submittedWeeks: [0] },
      { nickname: "초보자", role: "crew", submittedWeeks: [0] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────

/** 특정 주차에 대한 한 멤버의 상태를 도출 */
export function memberStatus(member: Member, week: number): MemberStatus {
  if (member.submittedWeeks?.includes(week)) return "submitted";
  if (member.writingWeek === week) return "writing";
  return "todo";
}

/** 한 조의 특정 주차 진척률 */
export function teamProgress(team: Team, week: number) {
  const submitted = team.members.filter(
    (m) => memberStatus(m, week) === "submitted",
  ).length;
  const total = team.members.length;
  return {
    submitted,
    total,
    percent: Math.round((submitted / total) * 100),
  };
}

/** 전체 6개 조 평균 */
export function overallProgress(week: number) {
  const all = teams.flatMap((t) => t.members);
  const submitted = all.filter((m) => memberStatus(m, week) === "submitted")
    .length;
  return {
    submitted,
    total: all.length,
    percent: Math.round((submitted / all.length) * 100),
  };
}

export const ROLE_LABEL: Record<NonNullable<Member["role"]>, string> = {
  leader: "조장",
  vice: "부조장",
  selfish_crew: "셀피쉬크루",
  crew: "크루",
};
