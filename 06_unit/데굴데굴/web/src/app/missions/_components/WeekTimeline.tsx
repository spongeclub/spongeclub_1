"use client";

import { weekTimeline, weekProgress } from "../_data/weeks";
import { useWeek } from "../_lib/week-context";
import type { WeekTimelineItem } from "../_lib/types";

function pillClass(status: WeekTimelineItem["status"], selected: boolean) {
  if (selected) {
    return "bg-sponge-500 text-white border-2 border-sponge-500 shadow-sm";
  }
  switch (status) {
    case "done":
      return "bg-ink-100 text-ink-500 border border-ink-100";
    case "active":
    case "locked":
      return "bg-white text-ink-700 border border-dashed border-ink-100";
  }
}

function weekButtonLabel(week: WeekTimelineItem) {
  return week.label === "OT" ? "OT" : `${week.number}주차`;
}

/** 주차 선택 pills만 (외곽 카드 없음). 재사용 가능. */
export function WeekPills() {
  const { selectedWeek, setSelectedWeek, isCurrent } = useWeek();

  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto"
      role="radiogroup"
      aria-label="주차 선택"
    >
      {weekTimeline.map((week) => {
        const selected = selectedWeek === week.number;
        return (
          <button
            key={week.number}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setSelectedWeek(week.number)}
            title={`${weekButtonLabel(week)} 보기${
              isCurrent(week.number) ? " · 현재 주차" : ""
            }`}
            className={`shrink-0 px-3 h-9 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition cursor-pointer hover:ring-2 hover:ring-sponge-300 ${pillClass(
              week.status,
              selected,
            )}`}
          >
            <span>{weekButtonLabel(week)}</span>
            <span className="text-[10px] opacity-70">{week.startDate}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Hero 위 컴팩트 타임라인: 한 줄에 제목 + 진행 + pills */
export function WeekTimeline() {
  return (
    <section className="bg-white rounded-2xl border border-ink-100 px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold">7주 커리큘럼</span>
          <span className="text-[11px] text-ink-500">
            진행{" "}
            <span className="font-bold text-sponge-600">
              {weekProgress.current}/{weekProgress.total}
            </span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <WeekPills />
        </div>
      </div>
    </section>
  );
}
