#!/usr/bin/env node
/**
 * Slack 채널 데이터 fetch 테스트 스크립트.
 *
 * 사용법:
 *   node scripts/test-slack-fetch.mjs                              # 채널 목록
 *   node scripts/test-slack-fetch.mjs <channel>                    # 채널 메시지
 *   node scripts/test-slack-fetch.mjs <channel> --threads          # 메시지 + 모든 쓰레드 내용
 *   node scripts/test-slack-fetch.mjs <channel> --thread <ts>      # 특정 쓰레드만
 *
 * 환경변수:
 *   SLACK_TOKEN     필수 — Bot 또는 User OAuth Token (xoxb- / xoxp-)
 *   LIMIT           선택 — 가져올 메시지/답글 수 (기본 10)
 */
const token = process.env.SLACK_TOKEN;
const args = process.argv.slice(2);
const channelArg = args[0];
const showAllThreads = args.includes("--threads");
const singleThreadIdx = args.indexOf("--thread");
const singleThreadTs = singleThreadIdx >= 0 ? args[singleThreadIdx + 1] : null;
const limit = Number(process.env.LIMIT ?? "10");

if (!token) {
  console.error("ERROR: SLACK_TOKEN 환경변수가 필요합니다.");
  console.error("예: SLACK_TOKEN=xoxb-... node scripts/test-slack-fetch.mjs");
  process.exit(1);
}

async function slack(method, params = {}) {
  const url = new URL(`https://slack.com/api/${method}`);
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v)),
  );
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack ${method} failed: ${data.error}`);
  }
  return data;
}

async function listChannels() {
  console.log("=== 봇이 접근 가능한 채널 목록 ===");
  const data = await slack("conversations.list", {
    types: "public_channel",
    limit: 200,
  });
  data.channels.forEach((c) => {
    const tag = c.is_member ? "✓" : "·";
    console.log(`  ${tag} ${c.name.padEnd(30)} ${c.id}`);
  });
  console.log(
    "\nℹ️  ✓ = 봇이 멤버로 참여 중인 채널 (history 조회 가능)",
  );
  console.log("ℹ️  특정 채널 데이터를 보려면:");
  console.log(
    "    SLACK_TOKEN=... node scripts/test-slack-fetch.mjs 0-공지사항\n",
  );
}

async function resolveChannelId(idOrName) {
  if (/^C[A-Z0-9]+$/.test(idOrName)) return idOrName;
  const data = await slack("conversations.list", {
    types: "public_channel",
    limit: 1000,
  });
  const ch = data.channels.find((c) => c.name === idOrName);
  if (!ch) throw new Error(`채널 "${idOrName}"을 찾을 수 없습니다.`);
  return ch.id;
}

function formatMessage(msg, indent = "") {
  const ts = new Date(Number(msg.ts) * 1000).toLocaleString("ko-KR");
  const text = (msg.text || "").replace(/\n/g, " ").slice(0, 200);
  const reactions =
    msg.reactions?.map((r) => `${r.name}×${r.count}`).join(" ") ?? "";
  const replies = msg.reply_count ? `💬${msg.reply_count}` : "";
  console.log(`${indent}[${ts}] ${msg.user ?? msg.username ?? "?"} (ts=${msg.ts})`);
  console.log(`${indent}  ${text}`);
  if (reactions || replies)
    console.log(`${indent}  ${replies} ${reactions}`.trim());
}

async function fetchThreadReplies(channelId, threadTs) {
  const data = await slack("conversations.replies", {
    channel: channelId,
    ts: threadTs,
    limit,
  });
  // 첫 메시지는 부모 — 스킵하고 답글만
  const replies = data.messages?.slice(1) ?? [];
  if (replies.length === 0) {
    console.log("    (답글 없음)");
    return;
  }
  for (const r of replies) {
    formatMessage(r, "    ↳ ");
    console.log();
  }
}

async function fetchHistory(channelId) {
  const ch = await slack("conversations.info", { channel: channelId });
  console.log(`=== #${ch.channel.name} (${channelId}) 메시지 최근 ${limit}개 ===\n`);
  const data = await slack("conversations.history", {
    channel: channelId,
    limit,
  });
  if (!data.messages?.length) {
    console.log("(메시지 없음)");
    return;
  }
  for (const msg of data.messages) {
    formatMessage(msg);
    if (showAllThreads && msg.reply_count) {
      console.log("    --- 쓰레드 ---");
      await fetchThreadReplies(channelId, msg.thread_ts ?? msg.ts);
    } else {
      console.log();
    }
  }
}

(async () => {
  try {
    if (!channelArg) {
      await listChannels();
    } else if (singleThreadTs) {
      const id = await resolveChannelId(channelArg);
      console.log(`=== 쓰레드 ${singleThreadTs} ===\n`);
      await fetchThreadReplies(id, singleThreadTs);
    } else {
      const id = await resolveChannelId(channelArg);
      await fetchHistory(id);
    }
  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
})();
