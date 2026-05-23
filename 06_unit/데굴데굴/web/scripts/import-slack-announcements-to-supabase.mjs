#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_NOTICE_CHANNEL_NAME = "0-공지사항";
const DEFAULT_LIMIT = 10;
const HISTORY_PAGE_LIMIT = 200;
const TITLE_MAX_LENGTH = 42;
const MERGE_CONSECUTIVE_MESSAGE_GAP_MS = 60 * 1000;

function loadDotenv(file = ".env.local") {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  const text = fs.readFileSync(fullPath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function argFlag(name) {
  return process.argv.includes(name);
}

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  return fallback;
}

function env(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

async function slackApi(method, params) {
  const token = env("SLACK_BOT_TOKEN") ?? env("SLACK_TOKEN");
  if (!token) throw new Error("SLACK_BOT_TOKEN is not configured");

  const url = new URL(`https://slack.com/api/${method}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));

  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Slack ${method} HTTP ${response.status}`);

  const data = await response.json();
  if (!data.ok) throw new Error(`Slack ${method} failed: ${data.error ?? "unknown_error"}`);
  return data;
}

async function resolveNoticeChannelId() {
  const configuredId = env("SLACK_NOTICE_CHANNEL_ID");
  if (configuredId) return configuredId;

  const channelName = env("SLACK_NOTICE_CHANNEL_NAME") ?? DEFAULT_NOTICE_CHANNEL_NAME;
  const data = await slackApi("conversations.list", { types: "public_channel", limit: 1000 });
  const channel = data.channels?.find((item) => item.name === channelName);
  if (!channel) throw new Error(`Slack channel not found: ${channelName}`);
  return channel.id;
}

async function fetchNoticeHistory(channelId, { all, limit }) {
  if (!all) {
    const data = await slackApi("conversations.history", { channel: channelId, limit });
    return data.messages ?? [];
  }

  const messages = [];
  let cursor;
  do {
    const params = { channel: channelId, limit: HISTORY_PAGE_LIMIT };
    if (cursor) params.cursor = cursor;
    const data = await slackApi("conversations.history", params);
    messages.push(...(data.messages ?? []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return messages;
}

function slackPermalink(channelId, ts) {
  const workspaceUrl = env("SLACK_WORKSPACE_URL");
  if (!workspaceUrl) return undefined;
  return `${workspaceUrl.replace(/\/$/, "")}/archives/${channelId}/p${ts.replace(".", "")}`;
}

function cleanSlackText(text) {
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
    .replace(/:loudspeaker:/g, "📢")
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

function makeAnnouncementTitle(text) {
  const withoutUrls = text.replace(/https?:\/\/\S+/g, "").trim();
  const source = withoutUrls || text;
  const firstSentence = source.split(/[.!?。？！]/)[0]?.trim() || source;
  const candidate = firstSentence.length >= 10 ? firstSentence : source;
  const normalized = candidate.replace(/[\s:：·•-]+$/g, "").trim();
  if (normalized.length <= TITLE_MAX_LENGTH) return normalized;
  return `${normalized.slice(0, TITLE_MAX_LENGTH - 1).trim()}…`;
}

function inferLabel(text) {
  if (/(긴급|변경|중요|필독|마감|오늘|당일)/.test(text)) return "urgent";
  if (/(일정|zoom|줌|모임|발표|진행|시간|요일)/i.test(text)) return "schedule";
  if (/(자료|첨부|노션|링크|업로드|가이드)/.test(text)) return "material";
  return "guide";
}

function senderKey(message) {
  return message.user ?? message.bot_id ?? "unknown";
}

function combineConsecutiveMessages(messages) {
  const combined = [];
  for (const message of messages) {
    if (!message.ts || message.subtype === "message_deleted") continue;
    const previous = combined[combined.length - 1];
    const sameSender = previous && senderKey(previous) === senderKey(message);
    const closeEnough =
      previous && Math.abs(Number(previous.ts) - Number(message.ts)) * 1000 <= MERGE_CONSECUTIVE_MESSAGE_GAP_MS;

    if (sameSender && closeEnough) {
      previous.text = [message.text, previous.text]
        .map((value) => value?.trim())
        .filter(Boolean)
        .join("\n");
      continue;
    }
    combined.push({ ...message });
  }
  return combined;
}

function toAnnouncementRow(message, channelId, sortOrder) {
  if (!message.ts || message.subtype === "message_deleted") return null;
  const text = cleanSlackText(message.text ?? "");
  if (!text) return null;

  return {
    label: inferLabel(text),
    title: makeAnnouncementTitle(text),
    text,
    time_ago: null,
    updated_at: new Date(Number(message.ts) * 1000).toISOString(),
    href: slackPermalink(channelId, message.ts),
    pinned: false,
    is_published: true,
    sort_order: sortOrder,
    slack_channel_id: channelId,
    slack_message_ts: message.ts,
  };
}

function createSupabaseAdminClient() {
  const url = env("CONTENT_SUPABASE_URL");
  const serviceRoleKey = env("CONTENT_SUPABASE_SERVICE_ROLE_KEY");
  if (!url) throw new Error("CONTENT_SUPABASE_URL is not configured");
  if (!serviceRoleKey) throw new Error("CONTENT_SUPABASE_SERVICE_ROLE_KEY is required for write import");
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

async function preserveExistingPublishState(supabase, rows) {
  const messageTsList = rows.map((row) => row.slack_message_ts).filter(Boolean);
  if (messageTsList.length === 0) return rows;

  const { data, error } = await supabase
    .from("yulia_site_announcements")
    .select("slack_channel_id,slack_message_ts,is_published")
    .in("slack_message_ts", messageTsList);
  if (error) throw new Error(`Supabase existing-row lookup failed: ${error.message}`);

  const publishStateByKey = new Map(
    (data ?? []).map((row) => [`${row.slack_channel_id}/${row.slack_message_ts}`, row.is_published]),
  );

  return rows.map((row) => {
    const existing = publishStateByKey.get(`${row.slack_channel_id}/${row.slack_message_ts}`);
    return existing === undefined ? row : { ...row, is_published: existing };
  });
}

async function main() {
  loadDotenv();
  const dryRun = argFlag("--dry-run");
  const all = argFlag("--all");
  const limit = Number(argValue("--limit", env("SLACK_NOTICE_LIMIT") ?? DEFAULT_LIMIT));
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;
  const channelId = await resolveNoticeChannelId();
  const messages = await fetchNoticeHistory(channelId, { all, limit: safeLimit });
  const rows = combineConsecutiveMessages(messages)
    .map((message, index) => toAnnouncementRow(message, channelId, index + 100))
    .filter(Boolean);

  console.log(`channel=${channelId}`);
  console.log(`fetch_all=${all}`);
  console.log(`fetched_messages=${messages.length}`);
  console.log(`normalized_rows=${rows.length}`);

  if (dryRun) {
    for (const row of rows.slice(0, 5)) {
      console.log(`- ${row.updated_at} [${row.label}] ${row.title}`);
    }
    console.log("dry_run=true; no Supabase write performed");
    return;
  }

  const supabase = createSupabaseAdminClient();
  const rowsForUpsert = await preserveExistingPublishState(supabase, rows);
  const preservedHiddenRows = rowsForUpsert.filter((row) => row.is_published === false).length;
  const { error } = await supabase.from("yulia_site_announcements").upsert(rowsForUpsert, {
    onConflict: "slack_channel_id,slack_message_ts",
  });
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  console.log(`upserted_rows=${rowsForUpsert.length}`);
  console.log(`preserved_hidden_rows=${preservedHiddenRows}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
