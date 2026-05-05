import type { BatchWindow } from "./types.ts";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * "한 주의 마감"은 토요일 00:00 KST.
 * 일요일 11:00 KST에 cron이 돌면 직전 토요일 00:00 KST가 윈도우의 endUtc.
 */
export function previousSaturdayMidnightKstAsUtc(now: Date): Date {
  const shifted = new Date(now.getTime() + KST_OFFSET_MS);
  const target = new Date(shifted.getTime());
  target.setUTCHours(0, 0, 0, 0);
  const dow = target.getUTCDay();
  const delta = (dow + 1) % 7;
  target.setUTCDate(target.getUTCDate() - delta);
  if (target.getTime() > shifted.getTime()) {
    target.setUTCDate(target.getUTCDate() - 7);
  }
  return new Date(target.getTime() - KST_OFFSET_MS);
}

export function computeBatchWindow(
  now: Date,
  lastBatchEndIso: string | null,
  overrideEndIso?: string,
): BatchWindow {
  const endUtc = overrideEndIso
    ? new Date(overrideEndIso)
    : previousSaturdayMidnightKstAsUtc(now);
  const startUtc = lastBatchEndIso
    ? new Date(lastBatchEndIso)
    : new Date(endUtc.getTime() - ONE_WEEK_MS);
  if (startUtc.getTime() >= endUtc.getTime()) {
    throw new Error(
      `Invalid window: start=${startUtc.toISOString()} >= end=${endUtc.toISOString()}`,
    );
  }
  return { startUtc, endUtc };
}

export function formatKst(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function isoDateKst(date: Date): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(date);
}

export function weekTagKst(date: Date): string {
  const ymd = isoDateKst(date);
  const d = new Date(ymd + "T00:00:00+09:00");
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const dayMs = 24 * 60 * 60 * 1000;
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / dayMs) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
