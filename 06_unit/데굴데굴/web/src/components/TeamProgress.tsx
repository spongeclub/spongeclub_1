"use client";

import {
  teams,
  teamProgress,
  overallProgress,
  memberStatus,
  ROLE_LABEL,
} from "@/data/teams";
import { siteConfig } from "@/data/config";
import { useWeek } from "@/lib/week-context";
import type { Member, MemberRole, MemberStatus, Team } from "@/lib/types";

const STATUS_CHIP: Record<
  MemberStatus,
  { cls: string; symbol: string; label: string }
> = {
  submitted: { cls: "m-done", symbol: "✓", label: "제출" },
  writing: { cls: "m-progress", symbol: "✏️", label: "작성 중" },
  todo: { cls: "m-todo", symbol: "○", label: "미작성" },
};

const ROLE_ORDER: Record<MemberRole, number> = {
  leader: 0,
  vice: 1,
  selfish_crew: 2,
  crew: 3,
};

function MemberChip({ member, week }: { member: Member; week: number }) {
  const status = memberStatus(member, week);
  const s = STATUS_CHIP[status];
  const isLeader = member.role !== "crew";
  return (
    <span
      className={`m-chip ${s.cls} ${
        isLeader ? "ring-1 ring-inset ring-ink-300/60" : ""
      }`}
      title={`${ROLE_LABEL[member.role]} · ${s.label}`}
    >
      {member.role === "leader" && <span className="font-bold">👑</span>}
      {member.role === "vice" && <span>◆</span>}
      {member.role === "selfish_crew" && <span>★</span>}
      {s.symbol} {member.nickname}
    </span>
  );
}

function TeamCard({ team, week }: { team: Team; week: number }) {
  const progress = teamProgress(team, week);
  const sortedMembers = [...team.members].sort(
    (a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role],
  );

  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-4 hover:border-ink-300 transition">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg grid place-items-center text-white font-bold"
            style={{ background: team.color }}
          >
            {team.number}
          </div>
          <div>
            <div className="font-bold text-sm">
              {team.number}조 · {team.subject}
            </div>
            <div className="text-[11px] text-ink-500">
              {team.members.length}명
            </div>
          </div>
        </div>
        <div className="text-xs">
          <span className="font-bold text-sponge-600">{progress.percent}%</span>
          <span className="text-ink-500 ml-1">
            ({progress.submitted}/{progress.total})
          </span>
        </div>
      </div>
      <div
        className={`mt-3 h-1.5 rounded-full progress-bar team-${team.number}`}
        style={{ "--p": `${progress.percent}%` } as React.CSSProperties}
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {sortedMembers.map((m) => (
          <MemberChip key={m.nickname} member={m} week={week} />
        ))}
      </div>
    </div>
  );
}

export function TeamProgress() {
  const { selectedWeek } = useWeek();
  const overall = overallProgress(selectedWeek);

  return (
    <section>
      <header className="flex items-end justify-between mb-3 gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-lg">
            📊 6개 조 진척 · {selectedWeek}주차
          </h3>
          <p className="text-xs text-ink-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              상태:
              <span className="m-chip m-done ml-1">✓ 제출</span>{" "}
              <span className="m-chip m-progress">✏️ 작성 중</span>{" "}
              <span className="m-chip m-todo">○ 미작성</span>
            </span>
            <span className="text-ink-300">·</span>
            <span>
              역할: <span className="font-semibold">👑 조장</span> ·{" "}
              <span className="font-semibold">★ 셀피쉬크루</span> ·{" "}
              <span className="font-semibold">◆ 부조장</span>
            </span>
          </p>
        </div>
        <div className="text-xs text-ink-500">
          전체 평균{" "}
          <span className="font-bold text-sponge-600">{overall.percent}%</span>{" "}
          · {overall.submitted}/{overall.total} 제출
        </div>
      </header>

      <div className="space-y-3">
        {teams.map((team) => (
          <TeamCard key={team.number} team={team} week={selectedWeek} />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-ink-300 text-center">
        제출 상태는 일 2회(09:00 / 21:00) 갱신 · 닉네임만 표기 · 데이터 출처{" "}
        <a
          href={siteConfig.homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink-500"
        >
          스폰지클럽 홈 ↗
        </a>
      </p>
    </section>
  );
}
