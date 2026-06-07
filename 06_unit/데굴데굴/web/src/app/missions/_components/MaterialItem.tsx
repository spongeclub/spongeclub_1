import type { LearningMaterial } from "../_lib/types";

export const CATEGORY_COLOR: Record<string, string> = {
  공지사항: "bg-rose-50 text-rose-700",
  미션: "bg-sponge-50 text-sponge-700 font-semibold",
  명령어: "bg-indigo-50 text-indigo-700",
  꿀팁: "bg-emerald-50 text-emerald-700",
  가이드: "bg-sky-50 text-sky-700",
  참고자료: "bg-violet-50 text-violet-700",
  툴: "bg-ink-50 text-ink-700",
  플러그인: "bg-amber-50 text-amber-700",
  "슬랙 실습": "bg-pink-50 text-pink-700",
  "텔레그램 실습": "bg-blue-50 text-blue-700",
  "캐러셀 OS": "bg-orange-50 text-orange-700",
};

export function CategoryChip({ category }: { category: string }) {
  const cls = CATEGORY_COLOR[category] || "bg-ink-50 text-ink-700";
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${cls}`}>
      {category}
    </span>
  );
}

function URLItem({ item }: { item: LearningMaterial }) {
  return (
    <a
      href={item.content}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-2 py-2 px-2 -mx-2 rounded-lg hover:bg-ink-50 transition"
    >
      <CategoryChip category={item.category} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium leading-snug">
          {item.title}
          {item.note && (
            <span className="ml-1.5 text-[11px] text-ink-500 font-normal">
              · {item.note}
            </span>
          )}
        </div>
      </div>
      <span className="text-ink-300 group-hover:text-ink-700 transition shrink-0 text-sm">
        ↗
      </span>
    </a>
  );
}

function TextItem({ item }: { item: LearningMaterial }) {
  const isMultiLine = item.content.includes("\n");
  if (isMultiLine) {
    return (
      <details className="py-2 px-2 -mx-2 rounded-lg hover:bg-ink-50 transition">
        <summary className="flex items-start gap-2 cursor-pointer list-none">
          <CategoryChip category={item.category} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-snug">
              {item.title}
              {item.note && (
                <span className="ml-1.5 text-[11px] text-ink-500 font-normal">
                  · {item.note}
                </span>
              )}
            </div>
          </div>
          <span className="text-ink-300 text-sm shrink-0">▾</span>
        </summary>
        <pre className="mt-2 ml-12 p-3 rounded-lg bg-ink-50 text-[12px] text-ink-700 whitespace-pre-wrap font-sans leading-relaxed">
          {item.content}
        </pre>
      </details>
    );
  }
  return (
    <div className="flex items-start gap-2 py-2 px-2 -mx-2">
      <CategoryChip category={item.category} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium leading-snug">
          {item.title}
          {item.note && (
            <span className="ml-1.5 text-[11px] text-ink-500 font-normal">
              · {item.note}
            </span>
          )}
        </div>
        <code className="mt-1 inline-block px-2 py-0.5 rounded text-[12px] bg-ink-50 text-ink-700 font-mono break-all">
          {item.content}
        </code>
      </div>
    </div>
  );
}

export function MaterialItem({ item }: { item: LearningMaterial }) {
  return item.contentType === "url" ? (
    <URLItem item={item} />
  ) : (
    <TextItem item={item} />
  );
}
