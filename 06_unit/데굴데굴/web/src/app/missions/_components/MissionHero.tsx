"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getMission, weekPreview, dDayUntil } from "../_data/mission";
import { learningMaterials } from "../_data/materials";
import { useWeek } from "../_lib/week-context";
import type { Mission } from "../_lib/types";

const MATERIAL_PREVIEW_COUNT = 3;
const sessionButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-bold shadow-sm transition";

function StatusBadge({
  status,
}: {
  status: "done" | "current" | "upcoming";
}) {
  if (status === "current") {
    return (
      <span className="flex items-center gap-2 text-sponge-700 text-xs font-semibold tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-sponge-500 animate-pulse" />
        진행중
      </span>
    );
  }

  if (status === "done") {
    return (
      <span className="text-emerald-700 text-xs font-semibold tracking-wider uppercase">
        완료
      </span>
    );
  }

  return (
    <span className="text-ink-500 text-xs font-semibold tracking-wider uppercase">
      예정
    </span>
  );
}

function MaterialsPreview({ selectedWeek }: { selectedWeek: number }) {
  const allWeekItems = learningMaterials.filter(
    (material) => material.weekOrder === selectedWeek,
  );
  const samples = allWeekItems
    .filter((material) => material.contentType === "url")
    .slice(0, MATERIAL_PREVIEW_COUNT);

  return (
    <div className="rounded-xl bg-ink-900 text-white p-4 flex flex-col">
      <header className="flex items-center justify-between mb-3">
        <div className="text-xs text-sponge-300 flex items-center gap-1.5">
          <span>📚</span>
          <span className="font-semibold tracking-wide">참고자료</span>
        </div>
        <span className="text-[11px] text-ink-100/60">
          총 {allWeekItems.length}개
        </span>
      </header>

      {samples.length > 0 ? (
        <ul className="space-y-1.5 flex-1">
          {samples.map((item) => (
            <li key={item.id}>
              <a
                href={item.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline text-ink-100 line-clamp-1 block"
                title={item.title}
              >
                · {item.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 grid place-items-center text-[11px] text-ink-100/60 text-center py-3">
          참고자료는 주차 시작 후 공개됩니다.
        </div>
      )}

      <a
        href={`/materials?week=${selectedWeek}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 pt-3 border-t border-ink-700 inline-flex items-center justify-between text-xs text-sponge-300 hover:text-sponge-100 transition"
      >
        <span className="font-semibold">전체 참고자료 보기</span>
        <span>↗</span>
      </a>
    </div>
  );
}

function SessionButton({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <button
        type="button"
        disabled
        className={`${sessionButtonClass} cursor-not-allowed border-ink-100 bg-white/70 text-ink-300`}
        title="아직 바로가기 링크가 없습니다."
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${sessionButtonClass} border-ink-100 bg-white text-sponge-700 hover:bg-sponge-50 hover:border-sponge-300`}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function SessionReplayActions({
  mission,
  selectedWeek,
}: {
  mission: Mission | null;
  selectedWeek: number;
}) {
  const hasSessionBundle = Boolean(mission?.replayUrl && mission?.transcriptUrl);
  const replayUrl = hasSessionBundle ? mission?.replayUrl : undefined;
  const transcriptUrl = hasSessionBundle ? mission?.transcriptUrl : undefined;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5">
      <SessionButton href={replayUrl}>
        {selectedWeek}주차 세션 다시보기
      </SessionButton>
      <SessionButton href={transcriptUrl}>
        {selectedWeek}주차 속기본 다시보기
      </SessionButton>
    </div>
  );
}

function useDDay(deadlineISO: string): number | null {
  const [dDay, setDDay] = useState<number | null>(() =>
    deadlineISO ? dDayUntil(deadlineISO) : null,
  );

  useEffect(() => {
    if (!deadlineISO) return;

    const refresh = () => setDDay(dDayUntil(deadlineISO));
    const first = setTimeout(refresh, 0);
    const interval = setInterval(refresh, 60 * 60 * 1000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [deadlineISO]);

  return dDay;
}

function dDayLabel(dDay: number | null) {
  if (dDay === null) return "D-?";
  if (dDay > 0) return `D-${dDay}`;
  if (dDay === 0) return "D-Day";
  return `D+${Math.abs(dDay)}`;
}

export function MissionHero() {
  const { selectedWeek } = useWeek();
  const mission = getMission(selectedWeek);
  const preview = weekPreview[selectedWeek];
  const dDay = useDDay(mission?.deadline ?? "");

  if (!mission) {
    return (
      <section className="rounded-2xl bg-gradient-to-br from-ink-50 to-white border border-ink-100 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-ink-500">
              {selectedWeek}주차
            </div>
            <h1 className="mt-1 text-2xl font-bold leading-tight">
              {preview?.title ?? "준비 중"}
            </h1>
            <p className="mt-2 text-ink-500 text-sm">
              {preview?.tagline ?? "이 주차의 상세 내용은 곧 공개됩니다."}
            </p>
          </div>
          {preview && <StatusBadge status={preview.status} />}
        </div>
        <div className="mt-5 p-4 rounded-xl bg-white border border-dashed border-ink-100 text-sm text-ink-500 text-center">
          학습 목표는 주차 시작 시점에 공개됩니다.
        </div>
        <SessionReplayActions mission={mission} selectedWeek={selectedWeek} />
      </section>
    );
  }

  const status = preview?.status ?? "current";

  return (
    <section className="rounded-2xl bg-gradient-to-br from-sponge-100 via-sponge-50 to-white border border-sponge-100 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <span className="text-ink-500">{mission.weekNumber}주차</span>
            <span className="text-ink-300">·</span>
            <StatusBadge status={status} />
          </div>
          <h1 className="mt-1 text-3xl font-bold leading-tight whitespace-pre-line">
            {mission.title}
          </h1>
          <p className="mt-2 text-ink-500 text-sm leading-relaxed">
            {mission.subtitle}
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-white border border-ink-100 min-w-[120px] text-center">
          <div className="text-[10px] text-ink-500 tracking-wider">
            {status === "done" ? "마감 완료" : "과제 마감까지"}
          </div>
          <div
            className={`text-3xl font-bold leading-none mt-1 ${
              status === "done" ? "text-emerald-700" : "text-sponge-600"
            }`}
            suppressHydrationWarning
          >
            {status === "done" ? "✓" : dDayLabel(dDay)}
          </div>
          <div className="text-[10px] text-ink-500 mt-1">
            {mission.deadlineDate} {mission.deadlineTime}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="bg-white rounded-xl border border-ink-100 p-4">
          <div className="text-xs text-ink-500 mb-2">🎯 학습 목표</div>
          <ul className="space-y-1.5 text-ink-700 leading-relaxed">
            {mission.goals.map((goal, index) => (
              <li key={index} className="flex gap-2">
                <span aria-hidden="true" className="shrink-0">
                  ·
                </span>
                <span className="flex-1">{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <MaterialsPreview selectedWeek={selectedWeek} />
      </div>
      <SessionReplayActions mission={mission} selectedWeek={selectedWeek} />
    </section>
  );
}
