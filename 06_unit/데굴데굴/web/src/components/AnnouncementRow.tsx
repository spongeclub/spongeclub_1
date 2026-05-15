import type { Announcement, AnnouncementLabel } from "@/lib/types";

export const LABEL_STYLE: Record<
  AnnouncementLabel,
  { text: string; cls: string }
> = {
  urgent: { text: "긴급", cls: "text-rose-700 bg-rose-50" },
  schedule: { text: "일정", cls: "text-sponge-700 bg-sponge-50" },
  material: { text: "자료", cls: "text-ink-500 bg-ink-50" },
  guide: { text: "가이드", cls: "text-sky-700 bg-sky-50" },
  tool: { text: "툴", cls: "text-amber-700 bg-amber-50" },
};

export function AnnouncementRow({ a }: { a: Announcement }) {
  const label = LABEL_STYLE[a.label];
  const inner = (
    <>
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${label.cls}`}
      >
        {label.text}
      </span>
      <span className="flex-1 text-sm leading-snug">
        {a.pinned && <span className="text-ink-300 mr-1">📌</span>}
        <span className={a.href ? "hover:underline" : ""}>{a.text}</span>
      </span>
      <span
        className={`text-[11px] shrink-0 whitespace-nowrap mt-0.5 ${
          a.pinned ? "text-ink-300" : "text-ink-500"
        }`}
      >
        {a.pinned ? "고정" : a.timeAgo}
      </span>
    </>
  );

  if (a.href) {
    return (
      <li className="py-2">
        <a
          href={a.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 -mx-2 px-2 rounded hover:bg-ink-50/50 transition"
        >
          {inner}
        </a>
      </li>
    );
  }
  return <li className="py-2 flex items-start gap-2">{inner}</li>;
}
