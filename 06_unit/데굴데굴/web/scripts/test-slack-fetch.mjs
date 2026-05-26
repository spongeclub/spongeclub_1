#!/usr/bin/env node
/**
 * Slack 채널 데이터 fetch 테스트 스크립트.
 *
 * 사용법:
 *   node scripts/test-slack-fetch.mjs                                         # 채널 목록
 *   node scripts/test-slack-fetch.mjs <channel>                               # 채널 메시지
 *   node scripts/test-slack-fetch.mjs <channel> --threads                     # 메시지 + 모든 쓰레드 내용
 *   node scripts/test-slack-fetch.mjs <channel> --thread <ts>                 # 특정 쓰레드만
 *   node scripts/test-slack-fetch.mjs <channel> --threads --output <file>     # 파일로 저장
 *
 * 환경변수:
 *   SLACK_TOKEN     필수 — Bot 또는 User OAuth Token (xoxb- / xoxp-)
 *   LIMIT           선택 — 가져올 메시지/답글 수 (기본 1000)
 */
import fs from "node:fs";

const token = process.env.SLACK_TOKEN;
const args = process.argv.slice(2);
const channelArg = args[0];
const showAllThreads = args.includes("--threads");
const singleThreadIdx = args.indexOf("--thread");
const singleThreadTs = singleThreadIdx >= 0 ? args[singleThreadIdx + 1] : null;
const outputIdx = args.indexOf("--output");
const outputPath = outputIdx >= 0 ? args[outputIdx + 1] : null;
const limit = Number(process.env.LIMIT ?? "1000");

if (!token) {
  console.error("ERROR: SLACK_TOKEN 환경변수가 필요합니다.");
  console.error("예: SLACK_TOKEN=xoxb-... node scripts/test-slack-fetch.mjs");
  process.exit(1);
}

// --output 지정 시 버퍼에 모아 파일에 쓰고, 없으면 stdout 출력
let outputBuffer = "";
function print(line = "") {
  if (outputPath) {
    outputBuffer += line + "\n";
  } else {
    console.log(line);
  }
}
function flushOutput() {
  if (outputPath) {
    fs.writeFileSync(outputPath, outputBuffer, "utf-8");
    console.error(`저장 완료: ${outputPath}`);
  }
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
  print("=== 봇이 접근 가능한 채널 목록 ===");
  const data = await slack("conversations.list", {
    types: "public_channel",
    limit: 200,
  });
  data.channels.forEach((c) => {
    const tag = c.is_member ? "✓" : "·";
    print(`  ${tag} ${c.name.padEnd(30)} ${c.id}`);
  });
  print("");
  print("ℹ️  ✓ = 봇이 멤버로 참여 중인 채널 (history 조회 가능)");
  print("ℹ️  특정 채널 데이터를 보려면:");
  print("    SLACK_TOKEN=... node scripts/test-slack-fetch.mjs 0-공지사항");
  print("");
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
  const text = msg.text || "";
  const reactions =
    msg.reactions?.map((r) => `${r.name}×${r.count}`).join(" ") ?? "";
  const replies = msg.reply_count ? `💬${msg.reply_count}` : "";
  print(`${indent}[${ts}] ${msg.user ?? msg.username ?? "?"} (ts=${msg.ts})`);
  print(`${indent}  ${text}`);
  if (reactions || replies)
    print(`${indent}  ${replies} ${reactions}`.trim());
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
    print("    (답글 없음)");
    return;
  }
  for (const r of replies) {
    formatMessage(r, "    ↳ ");
    print();
  }
}

async function fetchHistory(channelId) {
  const ch = await slack("conversations.info", { channel: channelId });
  print(`=== #${ch.channel.name} (${channelId}) 전체 메시지 ===`);
  print("");

  let allMessages = [];
  let cursor = undefined;

  do {
    const params = { channel: channelId, limit };
    if (cursor) params.cursor = cursor;
    const data = await slack("conversations.history", params);
    allMessages = allMessages.concat(data.messages ?? []);
    cursor = data.response_metadata?.next_cursor || undefined;
    if (outputPath) process.stderr.write(".");
  } while (cursor);

  if (outputPath) process.stderr.write("\n");

  if (!allMessages.length) {
    print("(메시지 없음)");
    return;
  }

  // conversations.history는 최신순 반환 — 오래된 것부터 출력
  const ordered = [...allMessages].reverse();

  for (const msg of ordered) {
    formatMessage(msg);
    if (showAllThreads && msg.reply_count) {
      print("    --- 쓰레드 ---");
      await fetchThreadReplies(channelId, msg.thread_ts ?? msg.ts);
    } else {
      print();
    }
  }

  print(`\n총 ${allMessages.length}개 메시지`);
}

(async () => {
  try {
    if (!channelArg) {
      await listChannels();
    } else if (singleThreadTs) {
      const id = await resolveChannelId(channelArg);
      print(`=== 쓰레드 ${singleThreadTs} ===`);
      print("");
      await fetchThreadReplies(id, singleThreadTs);
    } else {
      const id = await resolveChannelId(channelArg);
      await fetchHistory(id);
    }
    flushOutput();
  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
})();
