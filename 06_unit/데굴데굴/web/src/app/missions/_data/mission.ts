import type { Mission } from "../_lib/types";

export const CURRENT_WEEK = 3;

const sessionLinks: Record<number, Pick<Mission, "replayUrl" | "transcriptUrl">> = {
  0: {
    replayUrl: "https://www.youtube.com/watch?v=SYChUnLC7yA",
    transcriptUrl: "https://tiro.ooo/s/MimSSp5sLs752",
  },
  1: {
    replayUrl: "https://youtu.be/Thh1HuvRXu4",
    transcriptUrl: "https://tiro.ooo/s/xKsD1iW7tic8M",
  },
  2: {
    replayUrl: "https://youtu.be/Thh1HuvRXu4",
    transcriptUrl: "https://tiro.ooo/s/xKsD1iW7tic8M",
  },
};

const setupMission = {
  title: "Claude Code와 GitHub 세팅하기",
  subtitle:
    "Claude Code와 GitHub 기본 세팅을 끝내고 스폰지클럽 작업 환경을 준비하는 0주차입니다.",
  goals: [
    "Claude Code와 GitHub 세팅하기",
    "Obsidian과 GitHub 연동 흐름 이해하기",
    "스폰지클럽 활동에 필요한 기본 계정과 작업 환경 준비하기",
  ],
  deliverables: [
    "Claude Code 실행 환경 확인",
    "GitHub 계정·저장소 접근 확인",
    "Obsidian vault 또는 작업 폴더 준비",
  ],
};

const aiOsMission = {
  title: "나만의 AI OS 만들기",
  subtitle:
    "실제 업무를 바탕으로 개인 맞춤형 운영 체계를 구성하고, 자동화 하나를 끝까지 만들어봅니다.",
  goals: [
    "내 워크플로우를 노드와 엣지로 그려보기",
    "CLAUDE.md에서 역할, 메모리, 금지사항 분리",
    "자동화 1개를 끝까지 만들어보기",
  ],
  deliverables: [
    "개인 AI OS 첫 설계",
    "작동하는 자동화 1개와 짧은 시연",
    "막힘과 해결 방법 회고",
  ],
};

const customerWhyMission = {
  title: "나의 고객과 why 정의하기",
  subtitle: "이번 주에 만들고 나눌 과제입니다.",
  goals: [
    "내 고객은 누구고, 왜 쓰는가? 그 프로덕트 구현해봅시다",
    "각자가 정의하고 적용할 하네스 + 오케스트레이션은 무엇인가요?",
    "미션1 + SNS에 여러분들이 발견한 why와 근접성에 대해 남겨주세요",
  ],
  deliverables: [
    "구현한 프로덕트 또는 동작하는 프로토타입",
    "내가 정의한 하네스 + 오케스트레이션 설명",
    "발견한 why와 근접성에 대한 SNS 공유",
  ],
};

const missionsData: Record<number, Mission> = {
  0: {
    weekNumber: 0,
    totalWeeks: 7,
    deadline: "2026-05-03T19:00:00+09:00",
    deadlineDate: "5월 3일",
    deadlineTime: "19:00",
    ...setupMission,
    ...sessionLinks[0],
  },
  1: {
    weekNumber: 1,
    totalWeeks: 7,
    deadline: "2026-05-17T19:00:00+09:00",
    deadlineDate: "5월 17일",
    deadlineTime: "19:00",
    ...aiOsMission,
    ...sessionLinks[1],
  },
  2: {
    weekNumber: 2,
    totalWeeks: 7,
    deadline: "2026-05-17T19:00:00+09:00",
    deadlineDate: "5월 17일",
    deadlineTime: "19:00",
    ...aiOsMission,
    ...sessionLinks[2],
  },
  3: {
    weekNumber: 3,
    totalWeeks: 7,
    deadline: "2026-05-24T19:00:00+09:00",
    deadlineDate: "5월 24일",
    deadlineTime: "19:00",
    ...customerWhyMission,
  },
};

export const weekPreview: Record<
  number,
  { title: string; tagline: string; status: "done" | "current" | "upcoming" }
> = {
  0: { title: "OT", tagline: "5/3 오리엔테이션", status: "done" },
  1: { title: aiOsMission.title, tagline: "5/10 - 5/16 · 완료", status: "done" },
  2: { title: aiOsMission.title, tagline: "5/17 - 5/23 · 완료", status: "done" },
  3: { title: customerWhyMission.title, tagline: "5/24 - 5/30 · 진행중", status: "current" },
  4: { title: "프로모션 실행과 피드백 반영", tagline: "5/31 시작 예정", status: "upcoming" },
  5: { title: "오프라인 모임 · AI 쇼케이스", tagline: "6/7 오프라인", status: "upcoming" },
  6: { title: "결과물 발표 · 정식 스폰지크루 전환", tagline: "6/14 발표", status: "upcoming" },
};

export function getMission(week: number): Mission | null {
  return missionsData[week] ?? null;
}

export function dDayUntil(deadlineISO: string, now: Date = new Date()): number {
  const deadline = new Date(deadlineISO);
  const deadlineDate = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((deadlineDate.getTime() - today.getTime()) / 86_400_000);
}
