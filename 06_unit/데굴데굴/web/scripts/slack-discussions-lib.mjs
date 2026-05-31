export const RELEVANCE_THRESHOLD = 70;

const EMOJI_MAP = {
  "+1": "👍",
  thumbsup: "👍",
  thumbs_up: "👍",
  thumbsupall: "👍",
  fire: "🔥",
  heart: "❤️",
  heart_eyes: "😍",
  clap: "👏",
  raised_hands: "🙌",
  facewithpeekingeye: "🫣",
  slightlysmilingface: "🙂",
  slightly_smiling_face: "🙂",
  white_check_mark: "✅",
  "woman-cartwheeling": "🤸‍♀️",
  woman_cartwheeling: "🤸‍♀️",
};

function slackEmoji(name) {
  return EMOJI_MAP[name] ?? "";
}

export function cleanSlackText(text = "") {
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
    .replace(/:([a-z0-9_+-]+):/gi, (_match, name) => slackEmoji(name))
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

function firstMatchingTag(text) {
  const rules = [
    [/claude|codex|에이전트|agent|훅|hook|프롬프트|prompt/i, "에이전트"],
    [/자동화|n8n|make|zapier|slack|notion|노션/i, "자동화"],
    [/사이트|vercel|next|react|배포|홈페이지|웹/i, "사이트"],
    [/콘텐츠|카피|글쓰기|마케팅/i, "카피"],
    [/os|운영체계|워크플로우|workflow/i, "AI-OS"],
  ];
  return rules.find(([regex]) => regex.test(text))?.[1] ?? "AI-OS";
}

export function classifyMessage({ text = "", channelName = "" }) {
  const haystack = `${channelName} ${text}`;
  const isQuestion = /\?|질문|어떻게|왜 |뭘까요|되나요|막혔|도와/i.test(haystack);
  const isSite = /사이트|홈페이지|vercel|next|react|배포|웹/i.test(haystack);
  const isTip = /공유|팁|노하우|정리|비교|추천|가이드|자료|자동화/i.test(haystack);

  const type = isQuestion ? "question" : isSite && !isTip ? "site" : "tip";
  const status = type === "question" ? "unresolved" : "shared";
  const topicTags = [firstMatchingTag(haystack)];
  const relevance = Math.max(
    RELEVANCE_THRESHOLD,
    Math.min(96, 72 + (isQuestion ? 8 : 0) + (isTip ? 6 : 0) + (isSite ? 4 : 0)),
  );

  return { type, status, topicTags, relevance };
}

function summarizeTitle(text) {
  const maxLength = 50;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function timeAgoFromTs(ts, now = new Date()) {
  const diffMs = now.getTime() - Number(ts) * 1000;
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  return new Date(Number(ts) * 1000).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

function reactionEmoji(name) {
  return slackEmoji(name) || `:${name}:`;
}

function normalizeReactions(message) {
  const reactions = [];
  if (message.reply_count) reactions.push({ emoji: "💬", count: message.reply_count });
  for (const reaction of message.reactions ?? []) {
    reactions.push({ emoji: reactionEmoji(reaction.name), count: reaction.count });
  }
  return reactions;
}

function normalizeReplies(message, now) {
  return (message.replies ?? [])
    .map((reply) => ({
      author: authorName(reply),
      text: cleanSlackText(reply.text ?? ""),
      timeAgo: timeAgoFromTs(reply.ts, now),
    }))
    .filter((reply) => reply.text.length > 0);
}

function authorName(message) {
  return (
    message.user_profile?.display_name ||
    message.user_profile?.real_name ||
    message.username ||
    message.user ||
    "Slack"
  );
}

function slackPermalink(channel, ts) {
  if (!channel.workspaceUrl) return undefined;
  const baseUrl = channel.workspaceUrl.replace(/\/$/, "");
  return `${baseUrl}/archives/${channel.id}/p${ts.replace(".", "")}`;
}

export function toDiscussion(message, channel, now = new Date()) {
  const text = cleanSlackText(message.text ?? "");
  const classification = classifyMessage({ text, channelName: channel.name });
  const replies = normalizeReplies(message, now);

  return {
    id: `slack-${channel.id}-${message.ts}`,
    status: classification.status,
    type: classification.type,
    title: summarizeTitle(text),
    text,
    author: authorName(message),
    team: channel.team ?? 0,
    topicTags: classification.topicTags,
    relevance: classification.relevance,
    timeAgo: timeAgoFromTs(message.ts, now),
    href: slackPermalink(channel, message.ts),
    reactions: normalizeReactions(message),
    replies,
    hot: classification.type === "question" && replies.length === 0,
    linkToSkill: classification.type === "tip",
    source: {
      channelId: channel.id,
      channelName: channel.name,
      ts: message.ts,
    },
  };
}

export function toDiscussions(messagesByChannel, now = new Date()) {
  return messagesByChannel
    .flatMap(({ channel, messages }) =>
      messages
        .filter((message) => message.type === "message" || !message.type)
        .filter((message) => !message.subtype || message.subtype === "thread_broadcast")
        .filter((message) => cleanSlackText(message.text ?? "").length > 0)
        .map((message) => toDiscussion(message, channel, now)),
    )
    .filter((discussion) => discussion.relevance >= RELEVANCE_THRESHOLD)
    .sort((a, b) => b.source.ts.localeCompare(a.source.ts));
}
