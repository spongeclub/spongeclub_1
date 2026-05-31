import type { Metadata } from "next";
import Link from "next/link";
import { getSiteAnnouncements } from "@/lib/supabase-content";
import { Header } from "@/components/Header";
import { AnnouncementRow } from "@/components/AnnouncementRow";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 — 공지사항 전체보기",
  description: "Slack #0-공지사항 자동 수집 + 상시 노출 가이드/툴",
};

export const revalidate = 300;

export default async function AnnouncementsBoardPage() {
  const announcements = await getSiteAnnouncements();

  return (
    <>
      <Header breadcrumb="공지사항" />
      <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full space-y-6">
        <header>
          <Link
            href="/"
            className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
          >
            ← 홈으로
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            📢 공지사항 전체보기
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            임시 Supabase에 저장된 공지 + 상시 노출 가이드·툴. 총 {announcements.length}건 · 업데이트 일자 내림차순.
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
          데이터 출처: 임시 Supabase 공지 DB + 운영진 핀 fallback
        </footer>
      </main>
    </>
  );
}
