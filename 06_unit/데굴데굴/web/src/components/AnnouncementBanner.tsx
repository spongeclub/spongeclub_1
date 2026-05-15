"use client";

import { useEffect, useState } from "react";
import { announcements, recentAnnouncements } from "@/data/announcements";
import { AnnouncementRow } from "@/components/AnnouncementRow";

const PREVIEW_COUNT = 3;
/** 자동 회전 주기 (ms) */
const ROTATE_INTERVAL = 6000;

export function AnnouncementBanner() {
  const preview = recentAnnouncements(PREVIEW_COUNT);
  const total = announcements.length;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || preview.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % preview.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, preview.length]);

  const current = preview[idx] ?? preview[0];

  return (
    <section
      className="rounded-2xl bg-white border border-sponge-300 px-5 py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <header className="flex items-center justify-between mb-2 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-base">📢</span>
          <h3 className="font-bold text-sm">공지사항</h3>
          <span className="text-[11px] text-ink-300">
            {idx + 1} / {preview.length} · 총 {total}건
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* 도트 인디케이터 */}
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="공지사항 페이지"
          >
            {preview.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`${i + 1}번 공지로 이동`}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition cursor-pointer ${
                  i === idx
                    ? "bg-sponge-500 w-4"
                    : "bg-ink-200 hover:bg-ink-300"
                }`}
              />
            ))}
          </div>
          <a
            href="/announcements"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
          >
            전체 공지 <span className="text-[10px]">↗</span>
          </a>
        </div>
      </header>

      {/* 캐러셀 — 1개씩 표시. min-h 로 높이 고정 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="min-h-[44px]"
        key={current?.id}
      >
        {current && (
          <ul className="divide-y divide-ink-100">
            <AnnouncementRow a={current} />
          </ul>
        )}
      </div>
    </section>
  );
}
