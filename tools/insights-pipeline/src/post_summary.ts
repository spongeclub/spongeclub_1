import { WebClient } from "@slack/web-api";
import type { Config } from "./config.ts";
import type { BestPick, ClassifiedInsight } from "./types.ts";
import { isoDateKst } from "./window.ts";

export interface SummaryArgs {
  classified: ClassifiedInsight[];
  best: BestPick[];
  weeklyOverview: string;
  windowStartUtc: Date;
  windowEndUtc: Date;
  newCategoryProposalNames: string[];
}

export function buildWeeklySummaryText(args: SummaryArgs): string {
  const {
    classified,
    best,
    weeklyOverview,
    windowStartUtc,
    windowEndUtc,
    newCategoryProposalNames,
  } = args;
  const startKst = isoDateKst(windowStartUtc);
  const endKst = isoDateKst(windowEndUtc);

  if (classified.length === 0) {
    return [
      `📚 *이번 주 인사이트 요약 (${startKst} ~ ${endKst} KST)*`,
      "",
      "이번 주는 새 인사이트가 올라오지 않았어요. 다음 주에 만나요 👋",
    ].join("\n");
  }

  const byCategory = new Map<string, number>();
  for (const it of classified) {
    byCategory.set(it.category, (byCategory.get(it.category) ?? 0) + 1);
  }
  const distribution = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => `• *${c}*: ${n}건`)
    .join("\n");

  const tsToInsight = new Map(classified.map((c) => [c.ts, c]));
  const bestLines = best
    .map((b, i) => {
      const it = tsToInsight.get(b.ts);
      if (!it) return null;
      return `${i + 1}. *${it.oneLineSummary}* — ${it.authorDisplay}\n   _${b.reason}_`;
    })
    .filter((l): l is string => l !== null)
    .join("\n\n");

  const newCatLine =
    newCategoryProposalNames.length > 0
      ? `\n\n🌱 새 카테고리 제안: ${newCategoryProposalNames
          .map((n) => `\`${n}\``)
          .join(", ")} _(taxonomy 파일에 추가됨)_`
      : "";

  const overviewLine = weeklyOverview ? `\n_${weeklyOverview}_\n` : "";

  return [
    `📚 *이번 주 인사이트 요약 (${startKst} ~ ${endKst} KST)*`,
    overviewLine,
    `*총 ${classified.length}건이 떨어졌어요.* 카테고리별 분포:`,
    distribution,
    "",
    "🌟 *이번 주 베스트*",
    "",
    bestLines || "_(베스트 선정 없음)_",
    newCatLine,
    "",
    "📂 옵시디언에서 다시 보기: `03_insights/` 폴더",
  ].join("\n");
}

export async function postSummary(
  config: Config,
  text: string,
  destination: { kind: "channel" } | { kind: "dm"; userId: string },
): Promise<{ ok: boolean; ts: string | undefined; channel: string }> {
  const client = new WebClient(config.slack.botToken);
  let channelId: string;
  if (destination.kind === "channel") {
    channelId = config.slack.channelId;
  } else {
    const open = await client.conversations.open({ users: destination.userId });
    const ch = (open as unknown as { channel?: { id?: string } }).channel;
    if (!open.ok || !ch?.id) {
      throw new Error(
        `Failed to open DM with ${destination.userId}: ${(open as unknown as { error?: string }).error ?? "unknown"}`,
      );
    }
    channelId = ch.id;
  }
  const res = await client.chat.postMessage({
    channel: channelId,
    text,
    mrkdwn: true,
  });
  return { ok: !!res.ok, ts: res.ts, channel: channelId };
}
