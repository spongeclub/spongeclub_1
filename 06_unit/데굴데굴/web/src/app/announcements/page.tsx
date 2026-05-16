import type { Metadata } from "next";
import { announcements } from "@/data/announcements";
import { Header } from "@/components/Header";
import { AnnouncementRow } from "@/components/AnnouncementRow";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 — 공지사항 전체보기",
  description: "Slack #0-공지사항 자동 수집 + 상시 노출 가이드/툴",
};

export default function AnnouncementsBoardPage() {
  return (
    <>
      <Header breadcrumb="공지사항" />
      <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full space-y-6">
        <header>
          <a
            href="/"
            className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
          >
            ← 홈으로
          </a>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            📢 공지사항 전체보기
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Slack <code className="text-[11px] px-1 rounded bg-ink-50">#0-공지사항</code>{" "}
            자동 수집 + 상시 노출 가이드·툴. 총 {announcements.length}건 · 업데이트 일자 내림차순.
          </p>
        </header>

        <section className="rounded-2xl bg-white border border-ink-100 p-5">
          <ul className="divide-y divide-ink-100">
            {announcements.map((a) => (
              <AnnouncementRow key={a.id} a={a} />
            ))}
          </ul>
        </section>

        <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
          데이터 출처: Slack #0-공지사항 + 운영진 핀
        </footer>
      </main>
    </>
  );
}
