import { discussions } from "@/data/discussions";
import type { Discussion } from "@/lib/types";

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

function DiscussionPreviewItem({ d }: { d: Discussion }) {
  return (
    <li>
      <a
        href={`/discussions#discussion-${d.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 px-5 py-4 hover:bg-ink-50 cursor-pointer"
      >
        <span className="flex-1 min-w-0">
          <span className="block font-medium leading-snug">{d.title}</span>
          <span className="mt-1 text-xs text-ink-500 flex items-center flex-wrap">
            <span>
              {d.author}
              {d.team > 0 && <> · {d.team}조</>}
            </span>
            <span className="ddot" />
            <span>{d.timeAgo}</span>
            {d.reactions.length > 0 && <span className="ddot" />}
            <ReactionList reactions={d.reactions} />
          </span>
        </span>
        <span className="text-[11px] text-ink-400 shrink-0 mt-1">새창 ↗</span>
      </a>
    </li>
  );
}

export function MissionDiscussion() {
  const total = discussions.length;
  return (
    <section className="rounded-2xl bg-white border border-ink-100">
      <header className="p-5 pb-3 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-lg">💬 미션 관련 질문 &amp; 공유</h3>
          <p className="text-xs text-ink-500 mt-0.5">
            메인에서는 요약만 보고, 클릭하면 새창에서 답변 토글을 확인합니다.
          </p>
        </div>
        <p className="text-xs text-ink-500">총 {total}건</p>
      </header>

      <ul className="divide-y divide-ink-100">
        {discussions.map((d) => (
          <DiscussionPreviewItem key={d.id} d={d} />
        ))}
      </ul>

      <footer className="p-3 border-t border-ink-100 flex items-center justify-between text-xs">
        <a
          href="/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
        >
          전체 질문 보기 <span className="text-[10px]">↗</span>
        </a>
        <a
          href="/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-500 hover:text-ink-900"
        >
          답변 토글 보기
        </a>
      </footer>
    </section>
  );
}
