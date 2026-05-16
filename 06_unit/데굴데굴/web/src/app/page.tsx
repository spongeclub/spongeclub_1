import { Header } from "@/components/Header";
import { WeekTimeline } from "@/components/WeekTimeline";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { MissionHero } from "@/components/MissionHero";
import { MissionDiscussion } from "@/components/MissionDiscussion";
import { CommunityCTA } from "@/components/CommunityCTA";
import { WeekProvider } from "@/lib/week-context";

export default function MissionsHome() {
  return (
    <>
      <Header active="missions" breadcrumb="주차별 미션" />
      <WeekProvider>
        <main className="max-w-6xl mx-auto px-5 py-6 space-y-6 flex-1 w-full">
          <WeekTimeline />
          <MissionHero />
          <AnnouncementBanner />
          <MissionDiscussion />
          <CommunityCTA />

          <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
            스폰지클럽 1기 · 주차별 미션 · v1 · 2026-05-13
          </footer>
        </main>
      </WeekProvider>
    </>
  );
}
