import { fallbackAnnouncements } from "@/data/announcements";
import announcementOverrides from "@/data/announcement-overrides.json";
import type { Announcement, AnnouncementLabel } from "@/lib/types";

interface SlackMessage {
  type?: string;
  subtype?: string;
  ts: string;
  text?: string;
  user?: string;
  bot_id?: string;
}

interface SlackHistoryResponse {
  ok: boolean;
  error?: string;
  messages?: SlackMessage[];
}

interface SlackListResponse {
  ok: boolean;
  error?: string;
  channels?: { id: string; name: string; is_member?: boolean }[];
}

const DEFAULT_NOTICE_CHANNEL_NAME = "0-공지사항";
const DEFAULT_LIMIT = 10;
const MERGE_CONSECUTIVE_MESSAGE_GAP_MS = 60 * 1000;
const TITLE_MAX_LENGTH = 42;

type AnnouncementOverride = Partial<Pick<Announcement, "title" | "text" | "href" | "pinned">> & {
  hidden?: boolean;
};

const manualOverrides = (announcementOverrides as {
  overrides?: Record<string, AnnouncementOverride>;
}).overrides ?? {};

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

async function slackApi<T>(method: string, params: Record<string, string | number>) {
  const token = env("SLACK_BOT_TOKEN") ?? env("SLACK_TOKEN");
  if (!token) throw new Error("SLACK_BOT_TOKEN is not configured");

  const url = new URL(`https://slack.com/api/${method}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Slack ${method} HTTP ${response.status}`);
  }

  const data = (await response.json()) as T & { ok: boolean; error?: string };
  if (!data.ok) {
    throw new Error(`Slack ${method} failed: ${data.error ?? "unknown_error"}`);
  }
  return data;
}

async function resolveNoticeChannelId(): Promise<string> {
  const configuredId = env("SLACK_NOTICE_CHANNEL_ID");
  if (configuredId) return configuredId;

  const channelName = env("SLACK_NOTICE_CHANNEL_NAME") ?? DEFAULT_NOTICE_CHANNEL_NAME;
  const data = await slackApi<SlackListResponse>("conversations.list", {
    types: "public_channel",
    limit: 1000,
  });

  const channel = data.channels?.find((c) => c.name === channelName);
  if (!channel) throw new Error(`Slack channel not found: ${channelName}`);
  return channel.id;
}

function slackPermalink(channelId: string, ts: string): string | undefined {
  const workspaceUrl = env("SLACK_WORKSPACE_URL") ?? "https://w1777265456-oc0196728.slack.com";
  const baseUrl = workspaceUrl.replace(/\/$/, "");
  return `${baseUrl}/archives/${channelId}/p${ts.replace(".", "")}`;
}

function cleanSlackText(text: string): string {
  return text
    .replace(/<!channel>|<!here>|<!everyone>/g, "")
    .replace(/(^|\s)!(channel|here|everyone)\b/gi, " ")
    .replace(/<@[^>]+>/g, "")
    .replace(/<#([^|>]+)\|([^>]+)>/g, "#$2")
    .replace(/<mailto:([^|>]+)\|([^>]+)>/g, "$2")
    .replace(/<([^|>]+)\|([^>]+)>/g, "$2")
    .replace(/<((?:https?|mailto):[^>]+)>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/:fire:/g, "🔥")
    .replace(/:heart:/g, "❤️")
    .replace(/:white_check_mark:/g, "✅")
    .replace(/```([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~([^~]+)~/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeAnnouncementTitle(text: string): string {
  const withoutUrls = text.replace(/https?:\/\/\S+/g, "").trim();
  const source = withoutUrls || text;
  const firstSentence = source.split(/[.!?。？！]/)[0]?.trim() || source;
  const candidate = firstSentence.length >= 10 ? firstSentence : source;
  const normalized = candidate.replace(/[\s:：·•-]+$/g, "").trim();
  if (normalized.length <= TITLE_MAX_LENGTH) return normalized;
  return `${normalized.slice(0, TITLE_MAX_LENGTH - 1).trim()}…`;
}

function withTitle(announcement: Announcement): Announcement {
  return {
    ...announcement,
    title: announcement.title?.trim() || makeAnnouncementTitle(announcement.text),
  };
}

function applyManualOverrides(announcements: Announcement[]): Announcement[] {
  return announcements
    .map((announcement) => {
      const override = manualOverrides[announcement.id];
      if (!override) return withTitle(announcement);
      return withTitle({ ...announcement, ...override });
    })
    .filter((announcement) => !manualOverrides[announcement.id]?.hidden);
}

function inferLabel(text: string): AnnouncementLabel {
  if (/(긴급|변경|중요|필독|마감|오늘|당일)/.test(text)) return "urgent";
  if (/(일정|zoom|줌|모임|발표|진행|시간|요일)/i.test(text)) return "schedule";
  if (/(자료|첨부|노션|링크|업로드|가이드)/.test(text)) return "material";
  return "guide";
}

function timeAgoFromSlackTs(ts: string): string {
  const diffMs = Date.now() - Number(ts) * 1000;
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  return new Date(Number(ts) * 1000).toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
}


function senderKey(message: SlackMessage): string {
  return message.user ?? message.bot_id ?? "unknown";
}

function combineConsecutiveMessages(messages: SlackMessage[]): SlackMessage[] {
  const combined: SlackMessage[] = [];

  for (const message of messages) {
    if (!message.ts || message.subtype === "message_deleted") continue;
    const previous = combined[combined.length - 1];
    const sameSender = previous && senderKey(previous) === senderKey(message);
    const closeEnough =
      previous &&
      Math.abs(Number(previous.ts) - Number(message.ts)) * 1000 <=
        MERGE_CONSECUTIVE_MESSAGE_GAP_MS;

    if (sameSender && closeEnough) {
      previous.text = [message.text, previous.text]
        .map((text) => text?.trim())
        .filter(Boolean)
        .join("\n");
      continue;
    }

    combined.push({ ...message });
  }

  return combined;
}

function toAnnouncement(message: SlackMessage, channelId: string): Announcement | null {
  if (!message.ts || message.subtype === "message_deleted") return null;
  const text = cleanSlackText(message.text ?? "");
  if (!text) return null;

  return {
    id: `slack-${channelId}-${message.ts}`,
    label: inferLabel(text),
    title: makeAnnouncementTitle(text),
    text,
    timeAgo: timeAgoFromSlackTs(message.ts),
    updatedAt: new Date(Number(message.ts) * 1000).toISOString(),
    href: slackPermalink(channelId, message.ts),
  };
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const channelId = await resolveNoticeChannelId();
    const limit = Number(env("SLACK_NOTICE_LIMIT") ?? DEFAULT_LIMIT);
    const data = await slackApi<SlackHistoryResponse>("conversations.history", {
      channel: channelId,
      limit: Number.isFinite(limit) ? limit : DEFAULT_LIMIT,
    });

    const slackAnnouncements = combineConsecutiveMessages(data.messages ?? [])
      .map((message) => toAnnouncement(message, channelId))
      .filter((item): item is Announcement => item !== null);

    return applyManualOverrides([...slackAnnouncements, ...fallbackAnnouncements])
      .filter((item, index, all) => all.findIndex((x) => x.id === item.id) === index)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (error) {
    if (env("SLACK_BOT_TOKEN") || env("SLACK_TOKEN")) {
      console.warn("Slack announcements fallback:", error);
    }
    return applyManualOverrides([...fallbackAnnouncements]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export async function getRecentAnnouncements(n = 3): Promise<Announcement[]> {
  return (await getAnnouncements()).slice(0, n);
}
