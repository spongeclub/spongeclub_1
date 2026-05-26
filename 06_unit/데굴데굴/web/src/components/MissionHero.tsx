"use client";

import { useEffect, useState } from "react";
import { getMission, weekPreview, dDayUntil } from "@/data/mission";
import { learningMaterials } from "@/data/materials";
import { useWeek } from "@/lib/week-context";

const MATERIAL_PREVIEW_COUNT = 3;

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
        ✓ 완료
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
    (m) => m.weekOrder === selectedWeek,
  );
  const linkable = allWeekItems.filter((m) => m.contentType === "url");
  const samples = linkable.slice(0, MATERIAL_PREVIEW_COUNT);
  const total = allWeekItems.length;

  return (
    <div className="rounded-xl bg-ink-900 text-white p-4 flex flex-col">
      <header className="flex items-center justify-between mb-3">
        <div className="text-xs text-sponge-300 flex items-center gap-1.5">
          <span>📚</span>
          <span className="font-semibold tracking-wide">학습 자료</span>
        </div>
        <span className="text-[11px] text-ink-100/60">총 {total}개</span>
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
          자료는 주차 시작 시 공개됩니다
        </div>
      )}

      <a
        href={`/materials?week=${selectedWeek}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 pt-3 border-t border-ink-700 inline-flex items-center justify-between text-xs text-sponge-300 hover:text-sponge-100 transition"
      >
        <span className="font-semibold">전체 자료 보기</span>
        <span>↗</span>
      </a>
    </div>
  );
}

/** 클라이언트에서 오늘 기준 D-day 계산 (서버 렌더 stale 회피) */
function useDDay(deadlineISO: string): number | null {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // 자정 넘어가도 갱신되도록 1시간마다 재계산
    const t = setInterval(() => setNow(new Date()), 60 * 60 * 1000);
    return () => clearInterval(t);
  }, []);
  return deadlineISO ? dDayUntil(deadlineISO, now) : null;
}

export function MissionHero() {
  const { selectedWeek } = useWeek();
  const mission = getMission(selectedWeek);
  const preview = weekPreview[selectedWeek];
  const dDay = useDDay(mission?.deadline ?? "");

  // 풀 데이터 없는 주차 (2~6주차) — placeholder.
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
          📅 학습 목표·결과물·자료는 주차 시작 시점에 공개됩니다.
        </div>
      </section>
    );
  }

  const m = mission;
  const status = preview?.status ?? "current";

  return (
    <section className="rounded-2xl bg-gradient-to-br from-sponge-100 via-sponge-50 to-white border border-sponge-100 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <span className="text-ink-500">{m.weekNumber}주차</span>
            <span className="text-ink-300">·</span>
            <StatusBadge status={status} />
          </div>
          <h1 className="mt-1 text-3xl font-bold leading-tight whitespace-pre-line">
            {m.title}
          </h1>
          <p className="mt-2 text-ink-500 text-sm leading-relaxed">
            {m.subtitle}
          </p>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white border border-ink-100 min-w-[120px] text-center">
          {status === "current" && (
            <>
              <div className="text-[10px] text-ink-500 tracking-wider">
                과제 마감까지
              </div>
              <div
                className="text-3xl font-bold text-sponge-600 leading-none mt-1"
                suppressHydrationWarning
              >
                {dDay === null ? "D-…" : dDay > 0 ? `D-${dDay}` : dDay === 0 ? "D-Day" : `D+${-dDay}`}
              </div>
              <div className="text-[10px] text-ink-500 mt-1">
                {m.deadlineDate} {m.deadlineTime}
              </div>
            </>
          )}
          {status === "done" && (
            <>
              <div className="text-[10px] text-ink-500 tracking-wider">
                마감 완료
              </div>
              <div className="text-3xl font-bold text-emerald-700 leading-none mt-1">
                ✓
              </div>
              <div className="text-[10px] text-ink-500 mt-1">
                {m.deadlineDate} {m.deadlineTime}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3-col: 학습목표 · 결과물 · 학습 자료 (검은 카드) */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="bg-white rounded-xl border border-ink-100 p-4">
          <div className="text-xs text-ink-500 mb-2">🎯 학습 목표</div>
          <ul className="space-y-1.5 text-ink-700 leading-relaxed">
            {m.goals.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="shrink-0">·</span>
                <span className="flex-1">{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-ink-100 p-4">
          <div className="text-xs text-ink-500 mb-2">📦 결과물 (제출물)</div>
          <ul className="space-y-1.5 text-ink-700 leading-relaxed">
            {m.deliverables.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="shrink-0">·</span>
                <span className="flex-1">{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <MaterialsPreview selectedWeek={selectedWeek} />
      </div>
    </section>
  );
}
