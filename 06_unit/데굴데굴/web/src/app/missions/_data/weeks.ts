import type { WeekTimelineItem } from "../_lib/types";

export const weekTimeline: WeekTimelineItem[] = [
  { number: 0, startDate: "5/3", status: "done", label: "OT" },
  { number: 1, startDate: "5/10", status: "done" },
  { number: 2, startDate: "5/17", status: "done" },
  { number: 3, startDate: "5/24", status: "active", label: "진행중" },
  { number: 4, startDate: "5/31", status: "locked" },
  { number: 5, startDate: "6/7", status: "locked", label: "오프" },
  { number: 6, startDate: "6/14", status: "locked", label: "발표" },
];

export const weekProgress = {
  current: 3,
  total: 7,
};
