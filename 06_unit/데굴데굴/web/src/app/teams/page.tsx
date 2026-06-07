import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { TeamProgress } from "@/components/TeamProgress";
import { getAllWeeks, getCurrentWeek } from "@/lib/missions/schedule-parser";
import { getAllTeamsProgress } from "@/lib/missions/vault-fetcher";
import type { TeamProgress as TeamProgressData } from "@/lib/missions/types";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 · 과제 현황판",
  description: "6개 조 · 주차별 멤버 과제 제출 현황",
};

export const revalidate = 300;

export default async function TeamsBoardPage() {
  const weeks = await getAllWeeks();
  const currentWeek = getCurrentWeek(weeks);
  const currentWeekNumber = currentWeek?.week ?? 0;
  const allWeeksProgress = await Promise.all(
    weeks.map((week) => getAllTeamsProgress(week.folder)),
  );

  const progressByWeek: Record<number, TeamProgressData[]> = {};
  weeks.forEach((week, index) => {
    progressByWeek[week.week] = allWeeksProgress[index];
  });

  return (
    <>
      <Header active="teams" breadcrumb="과제 현황판" />
      <main className="max-w-6xl mx-auto px-5 py-6 space-y-6 flex-1 w-full">
        <TeamProgress
          progressByWeek={progressByWeek}
          weeks={weeks}
          currentWeekNumber={currentWeekNumber}
        />

        <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
          배포 버전 과제 현황판과 같은 vault 데이터 소스를 사용합니다.
        </footer>
      </main>
    </>
  );
}
