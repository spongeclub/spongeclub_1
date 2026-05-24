import type { Metadata } from "next";
import Link from "next/link";
import { learningMaterials } from "@/data/materials";
import { CURRENT_WEEK } from "@/data/mission";
import { Header } from "@/components/Header";
import { MaterialItem } from "@/components/MaterialItem";

export const metadata: Metadata = {
  title: "스폰지클럽 1기 — 학습 자료 전체보기",
  description: "주차별 강의·실습·꿀팁·도구 모음",
};

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1RrOy0elNKaGHNPn81RGoeTXqbOukHIZol1qdfXZsufM/edit?gid=1107259301";

const WEEK_ORDERS = [0, 1, 2, 3, 4, 5, 6];

interface PageProps {
  searchParams: Promise<{ week?: string }>;
}

function parseWeek(value: string | undefined): number {
  if (!value) return CURRENT_WEEK;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || !WEEK_ORDERS.includes(n)) return CURRENT_WEEK;
  return n;
}

export default async function MaterialsBoardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedWeek = parseWeek(params.week);

  return (
    <>
      <Header breadcrumb="학습 자료" />
      <main className="max-w-3xl mx-auto px-5 py-8 flex-1 w-full space-y-4">
        <header>
          <Link
            href="/"
            className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
          >
            ← 홈으로
          </Link>
          <div className="mt-2 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                📚 학습 자료 전체보기
              </h1>
              <p className="mt-2 text-sm text-ink-500">
                총 {learningMaterials.length}건 · 주차 헤더를 클릭해 접고 펼 수
                있어요. 선택된{" "}
                <b className="text-sponge-700">{selectedWeek}주차</b>가
                노란색으로 펼쳐져 있습니다.
              </p>
            </div>
            <a
              href={SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1 mt-3"
            >
              원본 시트 <span className="text-[10px]">↗</span>
            </a>
          </div>
        </header>

        {WEEK_ORDERS.map((weekOrder) => {
          const items = learningMaterials.filter(
            (m) => m.weekOrder === weekOrder,
          );
          const label = `${weekOrder}주차`;
          const isSelected = weekOrder === selectedWeek;
          const containerCls = isSelected
            ? "bg-sponge-50/40 border-2 border-sponge-300"
            : "bg-white border border-ink-100";

          return (
            <details
              key={weekOrder}
              open={isSelected}
              className={`group rounded-2xl overflow-hidden transition ${containerCls}`}
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-3 hover:bg-ink-50/30 transition [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2">
                  <h2
                    className={`font-bold ${
                      isSelected ? "text-sponge-700" : "text-ink-700"
                    }`}
                  >
                    {label}
                  </h2>
                  <span className="text-[11px] text-ink-500 font-normal">
                    {items.length}개
                  </span>
                  {isSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sponge-500 text-white font-bold">
                      선택됨
                    </span>
                  )}
                </div>
                <span className="text-ink-400 text-base leading-none transition group-open:rotate-90">
                  ▸
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1">
                {items.length > 0 ? (
                  <ul className="space-y-0.5">
                    {items.map((item) => (
                      <li key={item.id}>
                        <MaterialItem item={item} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 rounded-lg bg-ink-50/50 border border-dashed border-ink-100 text-center text-xs text-ink-500">
                    📚 {label} 자료는 주차 시작 시 공개됩니다
                  </div>
                )}
              </div>
            </details>
          );
        })}

        <footer className="text-center text-xs text-ink-300 pt-6 pb-12">
          데이터 출처: Google Sheets · Phase 2에서 자동 동기화
        </footer>
      </main>
    </>
  );
}
