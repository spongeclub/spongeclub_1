#!/usr/bin/env node

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const TOKEN = process.env.SLACK_TOKEN;
const BASE = "https://slack.com/api";

if (!TOKEN) {
  console.error("SLACK_TOKEN 환경변수가 필요합니다.");
  process.exit(1);
}

async function slackGet(method, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${BASE}/${method}?${qs}` : `${BASE}/${method}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API error [${method}]: ${data.error}`);
  return data;
}

async function fetchAllUsers() {
  const users = [];
  let cursor = undefined;

  do {
    const params = { limit: 200 };
    if (cursor) params.cursor = cursor;
    const data = await slackGet("users.list", params);
    users.push(...(data.members ?? []));
    cursor = data.response_metadata?.next_cursor;
  } while (cursor);

  return users;
}

function resolveNickname(member) {
  const displayName =
    member.profile?.display_name ||
    member.profile?.display_name_normalized ||
    "";
  if (displayName) return { nickname: displayName, source: "display_name" };
  if (member.real_name) return { nickname: member.real_name, source: "real_name" };
  return { nickname: member.id, source: "id" };
}

async function main() {
  console.log("슬랙 사용자 목록 fetch 중...");
  const allMembers = await fetchAllUsers();

  const activeHumans = allMembers.filter(
    (m) => !m.is_bot && !m.deleted && m.id !== "USLACKBOT"
  );

  let fallbackToRealName = 0;
  let fallbackToId = 0;
  const idOnlyList = [];

  const usersMap = {};
  const usersFull = [];

  for (const member of activeHumans) {
    const { nickname, source } = resolveNickname(member);
    usersMap[member.id] = nickname;
    usersFull.push({
      id: member.id,
      real_name: member.real_name ?? "",
      display_name: member.profile?.display_name ?? "",
      display_name_normalized: member.profile?.display_name_normalized ?? "",
      nickname,
    });
    if (source === "real_name") fallbackToRealName++;
    if (source === "id") {
      fallbackToId++;
      idOnlyList.push(member.id);
    }
  }

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dataDir = join(__dirname, "data");
  await mkdir(dataDir, { recursive: true });

  await writeFile(
    join(dataDir, "users_map.json"),
    JSON.stringify(usersMap, null, 2),
    "utf-8"
  );
  await writeFile(
    join(dataDir, "users_full.json"),
    JSON.stringify(usersFull, null, 2),
    "utf-8"
  );

  console.log(`\n총 ${activeHumans.length}명 (봇/삭제 제외)`);
  console.log(
    `  display_name 사용: ${activeHumans.length - fallbackToRealName - fallbackToId}명`
  );
  console.log(`  real_name fallback: ${fallbackToRealName}명`);
  console.log(`  ID 그대로 (닉네임 없음): ${fallbackToId}명`);
  if (idOnlyList.length > 0) console.log(`  → ${idOnlyList.join(", ")}`);
  console.log(`\n저장 완료:`);
  console.log(`  ${join(dataDir, "users_map.json")}`);
  console.log(`  ${join(dataDir, "users_full.json")}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
