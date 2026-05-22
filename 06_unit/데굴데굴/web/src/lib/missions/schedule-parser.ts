const VAULT_REPO = "spongeclub/spongeclub_1";
const REVALIDATE_SECONDS = 600;

export type WeekStatus = "past" | "current" | "upcoming";

export type WeekInfo = {
  week: number;
  label: string;
  shortLabel: string;
  startDate: string;
  endDate: string;
  folder: string;
  status: WeekStatus;
};

const OT_WEEK_BASE: Omit<WeekInfo, "status"> = {
  week: 0,
  label: "OT",
  shortLabel: "OT",
  startDate: "2026-05-03",
  endDate: "2026-05-03",
  folder: "0주차_OT_0503",
};

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = process.env.VAULT_GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function getAllWeeks(today: Date = new Date()): Promise<WeekInfo[]> {
  const url = `https://raw.githubusercontent.com/${VAULT_REPO}/main/99_meta/%EC%A3%BC%EC%B0%A8%EC%9D%BC%EC%A0%95.md`;

  let parsed: Omit<WeekInfo, "status">[] = [];

  try {
    const res = await fetch(url, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (res.ok) {
      parsed = parseScheduleTable(await res.text());
    }
  } catch {
    parsed = [];
  }

  const todayISO = toKstISODate(today);

  return [OT_WEEK_BASE, ...parsed].map((week) => ({
    ...week,
    status:
      todayISO < week.startDate
        ? "upcoming"
        : todayISO > week.endDate
          ? "past"
          : "current",
  }));
}

export function getCurrentWeek(weeks: WeekInfo[]): WeekInfo | null {
  return (
    weeks.find((week) => week.status === "current") ??
    weeks.find((week) => week.status === "upcoming") ??
    weeks.at(-1) ??
    null
  );
}

function parseScheduleTable(md: string): Omit<WeekInfo, "status">[] {
  const weeks: Omit<WeekInfo, "status">[] = [];
  const re =
    /\|\s*(\d+)주차\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*`?02_mission\/([^`|/\s]+)\/?`?\s*\|/g;

  let match: RegExpExecArray | null;
  while ((match = re.exec(md)) !== null) {
    const week = Number.parseInt(match[1], 10);
    weeks.push({
      week,
      label: `${week}주차`,
      shortLabel: `${week}W`,
      startDate: match[2],
      endDate: match[3],
      folder: match[4],
    });
  }

  return weeks;
}

function toKstISODate(date: Date): string {
  const utcOffsetMin = date.getTimezoneOffset();
  const kstOffsetMin = -9 * 60;
  const adjustedMs =
    date.getTime() + (utcOffsetMin - kstOffsetMin) * 60 * 1000;

  return new Date(adjustedMs).toISOString().slice(0, 10);
}
