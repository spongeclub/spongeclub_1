import type { Mission } from "@/lib/types";

/**
 * 주차별 미션 데이터.
 *
 * 커리큘럼 출처: https://new.selfishclub.xyz/spongeclub
 * - 인덱싱은 0주차부터 시작 (SelfishClub 1주차 = 우리 0주차)
 * - 0주차(셋업), 1주차(현재)에는 풀 데이터.
 * - 2~6주차는 weekPreview 만 있음 (제목·일정만).
 */

/** 현재 진행 중인 주차 */
export const CURRENT_WEEK = 1;

const missionsData: Record<number, Mission> = {
  0: {
    weekNumber: 0,
    totalWeeks: 6,
    title: "첫 만남 · 셋업 · 팀 OS의 감 잡기",
    subtitle:
      "GitHub · Obsidian · Claude Code 기본기를 깔고 팀을 구성하는 첫 한 주. AI OS가 무엇인지 감을 잡고 7주를 함께 출발할 준비를 합니다.",
    deadline: "2026-05-10T19:00:00+09:00",
    deadlineDate: "5월 10일(일)",
    deadlineTime: "19:00",
    goals: [
      "Claude Code · 옵시디언 설치 + 연동",
      "GitHub 계정 연결 + 스폰지클럽 레포 fork",
      "본인 닉네임 이모티콘 + 프로필 사진 등록",
    ],
    deliverables: [
      "개인 7주 목표 정리 (Notion · 자유 양식)",
      "옵시디언 vault GitHub sync 캡쳐",
      "스킬 활용해 나만의 OS 인터뷰 결과물",
    ],
  },
  1: {
    weekNumber: 1,
    totalWeeks: 6,
    title: "나만의 AI OS 만들기",
    subtitle:
      "실제 사례를 통해 개인 맞춤형 운영 체계를 구축하는 한 주. 0주차에 잡은 '에이전틱' 감을 내 일에 옮기고, 자동화 1개를 끝까지 돌려봅니다.",
    deadline: "2026-05-17T19:00:00+09:00",
    deadlineDate: "5월 17일(일)",
    deadlineTime: "19:00",
    goals: [
      '"내 일" 워크플로우를 노드·엣지로 그릴 수 있다',
      "CLAUDE.md에 역할·메모리·금지사항을 분리해 작성한다",
      "자동화 1개를 끝까지 돌려본다 (입력→처리→결과)",
    ],
    deliverables: [
      "완성된 개인 AI OS 청사진 (Figma·Notion·다이어그램 OK)",
      "작동하는 자동화 1개 + 30초 시연 영상",
      "회고 1단락 (막힌 지점·해결 방법)",
    ],
  },
};

/** 모든 주차의 짧은 정보 (Hero 미리보기·잠긴 주차 표시용) */
export const weekPreview: Record<
  number,
  { title: string; tagline: string; status: "done" | "current" | "upcoming" }
> = {
  0: {
    title: "첫 만남 · 셋업 · 팀 OS의 감 잡기",
    tagline: "5/3 첫 만남 · 셋업 완료",
    status: "done",
  },
  1: {
    title: "나만의 AI OS 만들기",
    tagline: "5/10 — 5/16 · 진행중",
    status: "current",
  },
  2: {
    title: "하네스와 오케스트레이션 · AI 콘텐츠 생성",
    tagline: "5/17 시작 예정",
    status: "upcoming",
  },
  3: {
    title: "실제 유저가 있는 프로덕트 만들기",
    tagline: "5/24 시작 예정",
    status: "upcoming",
  },
  4: {
    title: "프로덕트 다듬고, 프로모션 준비하기",
    tagline: "5/31 시작 예정",
    status: "upcoming",
  },
  5: {
    title: "오프라인 모임 · AI 시대의 커리어",
    tagline: "6/7 오프라인",
    status: "upcoming",
  },
  6: {
    title: "결과물 발표 · 정식 스폰지크루 전환",
    tagline: "6/14 발표",
    status: "upcoming",
  },
};

export function getMission(week: number): Mission | null {
  return missionsData[week] ?? null;
}

/**
 * 오늘(자정 기준)부터 deadline 날짜(자정 기준)까지 남은 일수.
 * 5/13 → 5/17 = 4 (D-4)
 */
export function dDayUntil(deadlineISO: string, now: Date = new Date()): number {
  const dl = new Date(deadlineISO);
  const dlDate = new Date(dl.getFullYear(), dl.getMonth(), dl.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((dlDate.getTime() - today.getTime()) / 86_400_000);
}
