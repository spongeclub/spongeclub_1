import { WebClient } from "@slack/web-api";
import type { Config } from "./config.ts";
import type { ParsedInsight, SlackMessageRaw, UserDirEntry } from "./types.ts";
import { parseInsightTemplate } from "./parse_template.ts";

export interface FetchResult {
  messages: SlackMessageRaw[];
  userDir: Map<string, UserDirEntry>;
}

export async function fetchInsightMessages(
  config: Config,
  windowStartUtc: Date,
  windowEndUtc: Date,
): Promise<FetchResult> {
  const client = new WebClient(config.slack.botToken);
  const oldestSec = (windowStartUtc.getTime() / 1000).toFixed(6);
  const latestSec = (windowEndUtc.getTime() / 1000).toFixed(6);

  const messages: SlackMessageRaw[] = [];
  let cursor: string | undefined;
  do {
    const result = await client.conversations.history({
      channel: config.slack.channelId,
      oldest: oldestSec,
      latest: latestSec,
      inclusive: false,
      limit: 200,
      cursor,
    });
    if (!result.ok) {
      throw new Error(`Slack history error: ${(result as unknown as { error: string }).error}`);
    }
    for (const m of (result.messages ?? []) as SlackMessageRaw[]) {
      if (!m.text || m.text.length === 0) continue;
      if (m.thread_ts && m.thread_ts !== m.ts) continue;
      messages.push(m);
    }
    cursor = (result as unknown as { response_metadata?: { next_cursor?: string } }).response_metadata?.next_cursor;
  } while (cursor && cursor.length > 0);

  const userIds = new Set<string>();
  for (const m of messages) if (m.user) userIds.add(m.user);

  const userDir = new Map<string, UserDirEntry>();
  for (const id of userIds) {
    try {
      const info = await client.users.info({ user: id });
      const profile = (info as unknown as {
        user?: {
          profile?: { display_name?: string; real_name?: string };
          name?: string;
        };
      }).user;
      const display =
        profile?.profile?.display_name ||
        profile?.profile?.real_name ||
        profile?.name ||
        id;
      userDir.set(id, { id, display });
    } catch {
      userDir.set(id, { id, display: id });
    }
  }

  for (const m of messages) {
    if (m.permalink) continue;
    try {
      const link = await client.chat.getPermalink({
        channel: config.slack.channelId,
        message_ts: m.ts,
      });
      m.permalink = (link as unknown as { permalink?: string }).permalink ?? "";
    } catch {
      m.permalink = "";
    }
  }

  return { messages, userDir };
}

export interface ToInsightsResult {
  parsed: ParsedInsight[];
  skipped: { ts: string; reason: string }[];
}

export function toParsedInsights(
  messages: SlackMessageRaw[],
  userDir: Map<string, UserDirEntry>,
): ToInsightsResult {
  const parsed: ParsedInsight[] = [];
  const skipped: { ts: string; reason: string }[] = [];
  for (const m of messages) {
    const text = m.text ?? "";
    const sections = parseInsightTemplate(text);
    if (!sections) {
      skipped.push({ ts: m.ts, reason: "template-not-matched" });
      continue;
    }
    const tsSec = Number.parseFloat(m.ts);
    parsed.push({
      ts: m.ts,
      permalink: m.permalink ?? "",
      authorId: m.user,
      authorDisplay: m.user
        ? userDir.get(m.user)?.display ?? m.user
        : m.username ?? "(bot/unknown)",
      postedAtUtc: new Date(tsSec * 1000),
      oneLineSummary: sections.oneLineSummary,
      mainContent: sections.mainContent,
      usagePoints: sections.usagePoints,
      linksRaw: sections.linksRaw,
      rawText: text,
      reactionsTotal: (m.reactions ?? []).reduce((acc, r) => acc + (r.count ?? 0), 0),
    });
  }
  return { parsed, skipped };
}
