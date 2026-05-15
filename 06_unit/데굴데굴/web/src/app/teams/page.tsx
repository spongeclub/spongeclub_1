import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WeekTimeline } from "@/components/WeekTimeline";
import { TeamProgress } from "@/components/TeamProgress";
import { WeekProvider } from "@/lib/week-context";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 — 조별 현황판",
  description: "6개 조 · 주차별 멤버 제출 현황",
};

export default function TeamsBoardPage() {
  return (
    <>
      <Header active="teams" breadcrumb="조별 현황판" />
      <WeekProvider>
        <main className="max-w-6xl mx-auto px-5 py-6 space-y-6 flex-1 w-full">
          {/* 홈과 동일한 WeekTimeline */}
          <WeekTimeline />

          <TeamProgress />

          <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
            데이터 출처:{" "}
            <a
              href="https://spongeclub-homepage.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink-500"
            >
              스폰지클럽 홈 ↗
            </a>{" "}
            · 닉네임만 표기 · Phase 2에서 자동 동기화
          </footer>
        </main>
      </WeekProvider>
    </>
  );
}
