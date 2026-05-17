"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CURRENT_WEEK } from "@/data/mission";

interface WeekContextValue {
  /** 타임라인 라디오에서 선택된 주차 (0~6) */
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  isSelected: (week: number) => boolean;
  isCurrent: (week: number) => boolean;
}

const WeekContext = createContext<WeekContextValue | null>(null);

/**
 * 페이지 전역 "선택된 주차" 상태 (1개 단일 선택).
 * 기본값 = CURRENT_WEEK · Hero · 진척률 · 학습자료 미리보기 모두 동기화.
 */
export function WeekProvider({ children }: { children: ReactNode }) {
  const [selectedWeek, setSelectedWeek] = useState<number>(CURRENT_WEEK);

  const value = useMemo<WeekContextValue>(
    () => ({
      selectedWeek,
      setSelectedWeek,
      isSelected: (week: number) => week === selectedWeek,
      isCurrent: (week: number) => week === CURRENT_WEEK,
    }),
    [selectedWeek],
  );

  return <WeekContext.Provider value={value}>{children}</WeekContext.Provider>;
}

export function useWeek(): WeekContextValue {
  const ctx = useContext(WeekContext);
  if (!ctx) {
    throw new Error("useWeek must be used within <WeekProvider>");
  }
  return ctx;
}
