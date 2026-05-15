import type { WeekTimelineItem } from "@/lib/types";

export const weekTimeline: WeekTimelineItem[] = [
  { number: 0, startDate: "5/3",  status: "done",   label: "셋업" },
  { number: 1, startDate: "5/10", status: "active", label: "진행중" },
  { number: 2, startDate: "5/17", status: "locked", label: "예정" },
  { number: 3, startDate: "5/24", status: "locked" },
  { number: 4, startDate: "5/31", status: "locked" },
  { number: 5, startDate: "6/7",  status: "locked", label: "오프" },
  { number: 6, startDate: "6/14", status: "locked", label: "발표" },
];

/** 진행률 = done 카운트 / 전체 (현재 1/6 = 17%; 0주차 셋업은 카운트에서 제외) */
export const weekProgress = {
  current: 1,
  total: 6,
};
