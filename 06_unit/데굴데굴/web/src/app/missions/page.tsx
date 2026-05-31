import { Header } from "./_components/Header";
import { WeekTimeline } from "./_components/WeekTimeline";
import { AnnouncementBanner } from "./_components/AnnouncementBanner";
import { MissionHero } from "./_components/MissionHero";
import { MissionDiscussion } from "./_components/MissionDiscussion";
import { CommunityCTA } from "./_components/CommunityCTA";
import { WeekProvider } from "./_lib/week-context";
import { getSiteAnnouncements, getSiteDiscussions } from "@/lib/supabase-content";
import "./missions.css";

export const revalidate = 300;

export default async function MissionsPage() {
  const [announcements, discussions] = await Promise.all([
    getSiteAnnouncements(),
    getSiteDiscussions(),
  ]);

  return (
    <>
      <Header active="missions" breadcrumb="주차별 미션" />
      <WeekProvider>
        <main className="max-w-6xl mx-auto px-5 py-6 space-y-6 flex-1 w-full">
          <WeekTimeline />
          <MissionHero />
          <AnnouncementBanner items={announcements} />
          <MissionDiscussion items={discussions} />
          <CommunityCTA />

          <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
            Spongeclub missions v1
          </footer>
        </main>
      </WeekProvider>
    </>
  );
}
