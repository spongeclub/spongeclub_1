#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { toDiscussions } from "./slack-discussions-lib.mjs";

const DEFAULT_OUTPUT = "src/data/discussions.generated.json";
const DEFAULT_LIMIT = 50;
const HISTORY_PAGE_LIMIT = 200;

async function loadLocalEnv() {
  try {
    const raw = await readFile(resolve(".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env.local is optional; CI can provide env vars directly.
  }
}

function env(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
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

function outputPath() {
  const explicit = argValue("--output", undefined) ?? env("SLACK_DISCUSSION_OUTPUT");
  if (explicit) return resolve(explicit);

  const positional = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  return resolve(positional ?? DEFAULT_OUTPUT);
}

function parseChannels() {
  const raw = env("SLACK_DISCUSSION_CHANNELS") ?? "";
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [idOrName, teamRaw] = entry.split(":");
      return { idOrName, team: teamRaw ? Number(teamRaw) : 0 };
    });
}

async function slack(method, params = {}) {
  const token = env("SLACK_BOT_TOKEN") ?? env("SLACK_TOKEN");
  if (!token) throw new Error("SLACK_BOT_TOKEN is required");

  const url = new URL(`https://slack.com/api/${method}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Slack ${method} HTTP ${res.status}`);

  const data = await res.json();
  if (!data.ok) throw new Error(`Slack ${method} failed: ${data.error ?? "unknown_error"}`);
  return data;
}

async function listChannels() {
  const data = await slack("conversations.list", { types: "public_channel", limit: 1000 });
  return data.channels ?? [];
}

async function resolveChannel(config, channels) {
  const workspaceUrl = env("SLACK_WORKSPACE_URL");
  if (/^C[A-Z0-9]+$/.test(config.idOrName)) {
    const known = channels.find((channel) => channel.id === config.idOrName);
    return { id: config.idOrName, name: known?.name ?? config.idOrName, team: config.team, workspaceUrl };
  }

  const found = channels.find((channel) => channel.name === config.idOrName);
  if (!found) throw new Error(`Slack channel not found: ${config.idOrName}`);
  return { id: found.id, name: found.name, team: config.team, workspaceUrl };
}

function isNoiseMessage(message) {
  const text = message.text ?? "";
  return (
    message.subtype === "channel_join" ||
    message.subtype === "channel_leave" ||
    /GitHub for Slack was added to this channel/i.test(text) ||
    /This content can't be displayed/i.test(text)
  );
}

async function fetchThreadReplies(channel, message) {
  if (!message.reply_count) return [];

  const replies = [];
  let cursor;
  do {
    const params = {
      channel: channel.id,
      ts: message.thread_ts ?? message.ts,
      limit: HISTORY_PAGE_LIMIT,
    };
    if (cursor) params.cursor = cursor;
    const data = await slack("conversations.replies", params);
    replies.push(...(data.messages ?? []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return replies.filter((reply) => reply.ts !== message.ts).filter((reply) => !isNoiseMessage(reply));
}

async function fetchChannelMessages(channel, { all, limit }) {
  const messages = [];
  let cursor;
  do {
    const params = {
      channel: channel.id,
      limit: all ? HISTORY_PAGE_LIMIT : limit,
    };
    if (cursor) params.cursor = cursor;
    const data = await slack("conversations.history", params);
    messages.push(...(data.messages ?? []));
    cursor = all ? data.response_metadata?.next_cursor || undefined : undefined;
  } while (cursor);

  return Promise.all(
    messages.map(async (message) => ({
      ...message,
      replies: await fetchThreadReplies(channel, message),
    })),
  );
}

async function userNameMap(messagesByChannel) {
  const userIds = [
    ...new Set(
      messagesByChannel
        .flatMap(({ messages }) => messages.flatMap((message) => [message, ...(message.replies ?? [])]))
        .map((message) => message.user)
        .filter(Boolean),
    ),
  ];

  const entries = await Promise.all(
    userIds.map(async (userId) => {
      try {
        const data = await slack("users.info", { user: userId });
        const user = data.user ?? {};
        const profile = user.profile ?? {};
        return [
          userId,
          profile.display_name || profile.real_name || user.real_name || user.name || userId,
        ];
      } catch {
        return [userId, userId];
      }
    }),
  );

  return Object.fromEntries(entries);
}

function applyUserNames(messagesByChannel, names) {
  return messagesByChannel.map(({ channel, messages }) => ({
    channel,
    messages: messages
      .filter((message) => !isNoiseMessage(message))
      .map((message) => ({
        ...message,
        user_profile: {
          ...(message.user_profile ?? {}),
          display_name: names[message.user] ?? message.user_profile?.display_name,
        },
        replies: (message.replies ?? []).map((reply) => ({
          ...reply,
          user_profile: {
            ...(reply.user_profile ?? {}),
            display_name: names[reply.user] ?? reply.user_profile?.display_name,
          },
        })),
      })),
  }));
}

function createSupabaseAdminClient() {
  const url = env("CONTENT_SUPABASE_URL");
  const serviceRoleKey = env("CONTENT_SUPABASE_SERVICE_ROLE_KEY");
  if (!url) throw new Error("CONTENT_SUPABASE_URL is not configured");
  if (!serviceRoleKey) throw new Error("CONTENT_SUPABASE_SERVICE_ROLE_KEY is required for write import");
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

function discussionToQuestionRow(discussion, sortOrder) {
  return {
    status: discussion.status,
    type: discussion.type,
    title: discussion.title,
    text: discussion.text,
    author: discussion.author,
    team: discussion.team,
    topic_tags: discussion.topicTags,
    relevance: discussion.relevance,
    time_ago: discussion.timeAgo,
    href: discussion.href,
    reactions: discussion.reactions,
    replies: discussion.replies,
    hot: discussion.hot,
    link_to_skill: discussion.linkToSkill,
    is_published: true,
    sort_order: sortOrder,
    slack_channel_id: discussion.source.channelId,
    slack_message_ts: discussion.source.ts,
    updated_at: new Date(Number(discussion.source.ts) * 1000).toISOString(),
  };
}

async function preserveExistingPublishState(supabase, rows) {
  const messageTsList = rows.map((row) => row.slack_message_ts).filter(Boolean);
  if (messageTsList.length === 0) return rows;

  const { data, error } = await supabase
    .from("site_questions")
    .select("slack_channel_id,slack_message_ts,is_published")
    .in("slack_message_ts", messageTsList);
  if (error) throw new Error(`Supabase existing question lookup failed: ${error.message}`);

  const publishStateByKey = new Map(
    (data ?? []).map((row) => [`${row.slack_channel_id}/${row.slack_message_ts}`, row.is_published]),
  );

  return rows.map((row) => {
    const existing = publishStateByKey.get(`${row.slack_channel_id}/${row.slack_message_ts}`);
    return existing === undefined ? row : { ...row, is_published: existing };
  });
}

async function importQuestionsToSupabase(discussions) {
  const supabase = createSupabaseAdminClient();
  const rows = discussions.map((discussion, index) => discussionToQuestionRow(discussion, index + 100));
  const rowsForUpsert = await preserveExistingPublishState(supabase, rows);
  const preservedHiddenRows = rowsForUpsert.filter((row) => row.is_published === false).length;

  const { error } = await supabase.from("site_questions").upsert(rowsForUpsert, {
    onConflict: "slack_channel_id,slack_message_ts",
  });
  if (error) throw new Error(`Supabase site_questions upsert failed: ${error.message}`);

  console.log(`upserted_question_rows=${rowsForUpsert.length}`);
  console.log(`preserved_hidden_question_rows=${preservedHiddenRows}`);
}

async function main() {
  await loadLocalEnv();
  const channelConfigs = parseChannels();
  if (channelConfigs.length === 0) {
    throw new Error("SLACK_DISCUSSION_CHANNELS is required. Example: 0-무지성질문아무나답변:0,0-아무말대잔치:0");
  }

  const all = argFlag("--all");
  const dryRun = argFlag("--dry-run");
  const importSupabase = argFlag("--import-supabase");
  const limit = Number(argValue("--limit", env("SLACK_DISCUSSION_LIMIT") ?? DEFAULT_LIMIT));
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;

  const channels = await listChannels();
  const resolvedChannels = await Promise.all(channelConfigs.map((config) => resolveChannel(config, channels)));
  const messagesByChannel = await Promise.all(
    resolvedChannels.map(async (channel) => ({
      channel,
      messages: await fetchChannelMessages(channel, { all, limit: safeLimit }),
    })),
  );

  const names = await userNameMap(messagesByChannel);
  const namedMessagesByChannel = applyUserNames(messagesByChannel, names);
  const discussions = toDiscussions(namedMessagesByChannel);
  const fetchedMessageCount = messagesByChannel.reduce((sum, item) => sum + item.messages.length, 0);

  console.log(`channels=${resolvedChannels.map((channel) => channel.name).join(",")}`);
  console.log(`fetch_all=${all}`);
  console.log(`fetched_messages=${fetchedMessageCount}`);
  console.log(`normalized_discussions=${discussions.length}`);

  if (dryRun) {
    for (const discussion of discussions.slice(0, 5)) {
      console.log(`- ${discussion.source.channelName}/${discussion.source.ts} [${discussion.type}] ${discussion.title}`);
    }
    console.log("dry_run=true; no file or Supabase write performed");
    return;
  }

  const output = outputPath();
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(discussions, null, 2)}\n`, "utf8");
  console.log(`[sync-slack-discussions] wrote ${discussions.length} discussions → ${output}`);

  if (importSupabase) {
    await importQuestionsToSupabase(discussions);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
