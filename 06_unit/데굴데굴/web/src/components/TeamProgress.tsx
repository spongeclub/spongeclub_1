"use client";

import { useState } from "react";
import type { TeamProgress as TeamProgressData } from "@/lib/missions/types";
import type { WeekInfo } from "@/lib/missions/schedule-parser";

const TEAM_META: Record<number, { color: string; subject: string }> = {
  1: { color: "#FF8A4C", subject: "AX PM · 프로젝트 구조 설계" },
  2: { color: "#FFB800", subject: "콘텐츠 매니저 · 사이트 자동배포" },
  3: { color: "#7CC4FF", subject: "OS 설계 철학 · Sullivan 프로젝트" },
  4: { color: "#A78BFA", subject: "OPS 시스템화 · 자동화 아카이브" },
  5: { color: "#34D399", subject: "유저 프로젝트" },
  6: { color: "#F472B6", subject: "운영 총괄 · 콘텐츠 운영 시스템" },
};

function teamNumber(team: string): number {
  return Number.parseInt(team.match(/\d+/)?.[0] ?? "0", 10);
}

function weekStatusClass(status: WeekInfo["status"], selected: boolean) {
  if (selected) {
    return "bg-sponge-500 text-white border-2 border-sponge-500 shadow-sm";
  }

  if (status === "past") {
    return "bg-ink-100 text-ink-500 border border-ink-100";
  }

  return "bg-white text-ink-700 border border-dashed border-ink-100";
}

function weekButtonLabel(week: WeekInfo) {
  return week.label === "OT" ? "OT" : week.label;
}

function formatWeekStartDate(date: string) {
  const [, month, day] = date.match(/^\d{4}-(\d{2})-(\d{2})$/) ?? [];
  if (!month || !day) return date;
  return `${Number(month)}/${Number(day)}`;
}

function MemberChip({
  member,
}: {
  member: TeamProgressData["members"][number];
}) {
  const isLeader = member.role === "조장";

  return (
    <span
      className={`m-chip ${member.submitted ? "m-done" : "m-todo"} ${
        isLeader ? "ring-1 ring-inset ring-ink-300/60" : ""
      }`}
      title={`${isLeader ? "조장 · " : ""}${member.submitted ? "제출" : "미제출"}`}
    >
      {isLeader && <span className="font-bold">👑</span>}
      <span>{member.submitted ? "✓" : "·"}</span>
      <span>{member.displayName}</span>
    </span>
  );
}

function TeamCard({ team }: { team: TeamProgressData }) {
  const number = teamNumber(team.team);
  const meta = TEAM_META[number] ?? { color: "#A7ADBA", subject: "" };
  const percent =
    team.totalCount > 0
      ? Math.round((team.submittedCount / team.totalCount) * 100)
      : 0;

  return (
    <div className="rounded-2xl bg-white border border-[#E7E9EE] p-4 hover:border-[#A7ADBA] transition">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg grid place-items-center text-white font-bold"
            style={{ background: meta.color }}
          >
            {number || team.team}
          </div>
          <div>
            <div className="font-bold text-sm">
              {team.team}
              {meta.subject && (
                <span className="text-[#5B6271] font-medium">
                  {" · "}
                  {meta.subject}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#5B6271]">
              {team.totalCount > 0 ? `${team.totalCount}명` : "노트 없음"}
            </div>
          </div>
        </div>
        <div className="text-xs">
          <span className="font-bold text-[#E89E00]">{percent}%</span>
          <span className="text-[#5B6271] ml-1">
            ({team.submittedCount}/{team.totalCount})
          </span>
        </div>
      </div>

      <div
        className={`progress-bar team-${number} mt-3 h-1.5 rounded-full`}
        style={{ "--p": `${percent}%` } as React.CSSProperties}
      />

      {team.members.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {team.members.map((member) => (
            <MemberChip key={member.filePath} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TeamProgress({
  progressByWeek,
  weeks,
  currentWeekNumber,
}: {
  progressByWeek: Record<number, TeamProgressData[]>;
  weeks: WeekInfo[];
  currentWeekNumber: number;
}) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeekNumber);
  const weekInfo = weeks.find((week) => week.week === selectedWeek);
  const weekLabel = weekInfo?.label ?? `${selectedWeek}주차`;
  const teams = progressByWeek[selectedWeek] ?? [];
  const totalSubmitted = teams.reduce((sum, team) => sum + team.submittedCount, 0);
  const totalAll = teams.reduce((sum, team) => sum + team.totalCount, 0);
  const overallPercent =
    totalAll > 0 ? Math.round((totalSubmitted / totalAll) * 100) : 0;

  return (
    <section className="rounded-2xl bg-[#FAFBFD] border border-[#E7E9EE] p-4 sm:p-5">
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold">과제 현황판</span>
          <span className="text-[11px] text-[#5B6271]">
            기준 <span className="font-bold text-sponge-600">{weekLabel}</span>
          </span>
        </div>
        <div
          className="flex flex-1 min-w-0 items-center gap-1.5 overflow-x-auto"
          role="radiogroup"
          aria-label="주차 선택"
        >
        {weeks.map((week) => {
          const active = week.week === selectedWeek;

          return (
            <button
              key={week.week}
              type="button"
              role="radio"
              onClick={() => setSelectedWeek(week.week)}
              aria-checked={active}
              className={`shrink-0 px-3 h-9 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition cursor-pointer hover:ring-2 hover:ring-sponge-300 ${weekStatusClass(
                week.status,
                active,
              )}`}
            >
              <span>{weekButtonLabel(week)}</span>
              <span className="text-[10px] opacity-70">
                {formatWeekStartDate(week.startDate)}
              </span>
            </button>
          );
        })}
        </div>
      </div>

      <header className="flex items-end justify-between mb-3 gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-lg">📊 6개 조 과제 현황 · {weekLabel}</h3>
          <p className="text-xs text-[#5B6271] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              상태:
              <span className="m-chip m-done ml-1">✓ 제출</span>{" "}
              <span className="m-chip m-todo">· 미제출</span>
            </span>
            <span className="text-[#A7ADBA]">·</span>
            <span>
              역할: <span className="font-semibold">👑 조장</span>
            </span>
          </p>
        </div>
        <div className="text-xs text-[#5B6271]">
          전체 평균{" "}
          <span className="font-bold text-[#E89E00]">{overallPercent}%</span> ·{" "}
          {totalSubmitted}/{totalAll} 제출
        </div>
      </header>

      {totalAll === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E7E9EE] px-4 py-10 text-center text-sm text-[#5B6271] leading-relaxed">
          vault에서 미션 노트를 가져오지 못했습니다.
          <br />
          <span className="text-xs text-[#A7ADBA]">
            GitHub API rate limit 또는 일시 오류일 수 있습니다.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => (
            <TeamCard key={team.team} team={team} />
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] text-[#A7ADBA] text-center leading-relaxed">
        배포 버전 과제 현황판과 같은 vault frontmatter `submitted: true`
        기준입니다.
      </p>
    </section>
  );
}
