import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WeekTimeline } from "@/components/WeekTimeline";
import { SkillsBoard } from "@/components/SkillsBoard";
import { WeekProvider } from "@/lib/week-context";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 — 스킬 & 인사이트",
  description: "스폰지들이 직접 써본 스킬과 가이드 모음",
};

export default function SkillsPage() {
  return (
    <>
      <Header active="skills" breadcrumb="스킬 & 인사이트" />
      <WeekProvider>
        <main className="max-w-6xl mx-auto px-5 py-6 space-y-6 flex-1 w-full">
          <WeekTimeline />
          <SkillsBoard />

          <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
            스폰지클럽 1기 · 스킬 &amp; 인사이트 · v1 · 2026-05-19
          </footer>
        </main>
      </WeekProvider>
    </>
  );
}
