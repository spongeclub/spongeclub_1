import {
  discussions,
  discussionCountByType,
  RELEVANCE_THRESHOLD,
} from "@/data/discussions";
import { siteConfig } from "@/data/config";
import type { Discussion } from "@/lib/types";

const STATUS_BADGE: Record<Discussion["status"], { text: string; cls: string }> = {
  unresolved: { text: "미해결", cls: "bg-rose-50 text-rose-600" },
  resolved: { text: "해결", cls: "bg-emerald-50 text-emerald-700" },
  shared: { text: "공유", cls: "bg-sponge-500 text-white" },
};

function TypeTag({ type, topics }: { type: Discussion["type"]; topics: string[] }) {
  const typeHash = type === "question" ? "#질문" : type === "tip" ? "#노하우" : "#사이트";
  const topicHashes = topics.map((t) => `#${t}`).join(" ");
  return (
    <span>
      {typeHash} {topicHashes}
    </span>
  );
}

function RelevanceScore({ score }: { score: number }) {
  const cls = score >= 85 ? "text-emerald-700" : "text-sponge-700";
  return <span className={`${cls} font-medium`}>🎯 {score}%</span>;
}

function ReactionList({ reactions }: { reactions: Discussion["reactions"] }) {
  return (
    <>
      {reactions.map((r, i) => (
        <span key={i}>
          {i > 0 && <span className="ddot" />}
          {r.emoji} {r.count}
        </span>
      ))}
    </>
  );
}

function DiscussionItem({ d }: { d: Discussion }) {
  const status = STATUS_BADGE[d.status];
  return (
    <li className="px-5 py-4 hover:bg-ink-50 cursor-pointer">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${status.cls}`}
        >
          {status.text}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium leading-snug">{d.title}</div>
          <div className="mt-1 text-xs text-ink-500 flex items-center flex-wrap">
            <span>
              {d.author} · {d.team}조
            </span>
            <span className="ddot" />
            <TypeTag type={d.type} topics={d.topicTags} />
            <span className="ddot" />
            <RelevanceScore score={d.relevance} />
            <span className="ddot" />
            <span>{d.timeAgo}</span>
            {d.reactions.length > 0 && <span className="ddot" />}
            <ReactionList reactions={d.reactions} />
          </div>
        </div>
        {d.hot && (
          <span className="text-sponge-600 text-xs font-semibold shrink-0">
            🔥 답 필요
          </span>
        )}
        {d.linkToSkill && (
          <a
            href="/skills"
            className="text-[11px] text-sponge-600 hover:underline shrink-0 mt-1"
          >
            스킬로 보기 →
          </a>
        )}
      </div>
    </li>
  );
}

export function MissionDiscussion() {
  const total = discussions.length;
  const questions = discussionCountByType("question");
  const tips = discussionCountByType("tip");
  const sites = discussionCountByType("site");

  return (
    <section className="rounded-2xl bg-white border border-ink-100">
      <header className="p-5 pb-3 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-lg">💬 미션 관련 질문 &amp; 공유</h3>
          <p className="text-xs text-ink-500 mt-0.5">
            Slack 자동 수집 · Graphify 매칭 일 2회 ·{" "}
            <b className="text-ink-700">
              🎯 미션 관련도 ≥ {RELEVANCE_THRESHOLD}% 자동 게이팅
            </b>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="h-7 px-3 rounded-full text-xs bg-ink-900 text-white">
            전체 {total}
          </button>
          <button className="h-7 px-3 rounded-full text-xs bg-ink-50 text-ink-700 hover:bg-ink-100">
            #질문 {questions}
          </button>
          <button className="h-7 px-3 rounded-full text-xs bg-ink-50 text-ink-700 hover:bg-ink-100">
            #노하우 {tips}
          </button>
          <button className="h-7 px-3 rounded-full text-xs bg-ink-50 text-ink-700 hover:bg-ink-100">
            #사이트 {sites}
          </button>
        </div>
      </header>

      <ul className="divide-y divide-ink-100">
        {discussions.map((d) => (
          <DiscussionItem key={d.id} d={d} />
        ))}
      </ul>

      <footer className="p-3 border-t border-ink-100 flex items-center justify-between text-xs">
        <a
          href={siteConfig.slackWorkspaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
        >
          ✏️ Slack에 바로 쓰기 <span className="text-[10px]">↗</span>
        </a>
        <button className="text-ink-500 hover:text-ink-900">더 보기</button>
      </footer>
    </section>
  );
}
