import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanSlackText,
  classifyMessage,
  toDiscussion,
} from "../slack-discussions-lib.mjs";

test("cleanSlackText unwraps Slack links and normalizes whitespace", () => {
  assert.equal(
    cleanSlackText("<https://example.com|예시 링크>\n확인 &amp; 공유"),
    "예시 링크 확인 & 공유",
  );
});

test("cleanSlackText removes Slack mentions and markdown", () => {
  assert.equal(
    cleanSlackText("<!channel> *`신청 페이지`* 확인 <@U123> :fire:\n<https://example.com|신청 링크>"),
    "신청 페이지 확인 🔥 신청 링크",
  );
});

test("cleanSlackText renders known Slack emoji codes and removes unknown custom emoji", () => {
  assert.equal(
    cleanSlackText("역시 비비안:thumbsupall: 한번 해보겠습니다! :unknown_custom_emoji:"),
    "역시 비비안👍 한번 해보겠습니다!",
  );
});


test("classifyMessage maps questions to unresolved question discussions", () => {
  const result = classifyMessage({ text: "Claude Code 훅 오류 왜 나는 걸까요? 질문드립니다", channelName: "0-무지성질문아무나답변" });

  assert.equal(result.type, "question");
  assert.equal(result.status, "unresolved");
  assert.ok(result.relevance >= 70);
  assert.deepEqual(result.topicTags, ["에이전트"]);
});

test("toDiscussion converts Slack message to site Discussion shape", () => {
  const discussion = toDiscussion(
    {
      ts: "1770000000.123456",
      text: "n8n 자동화 비교표 공유합니다 <https://example.com|문서>",
      user_profile: { display_name: "율율" },
      reactions: [{ name: "+1", count: 2 }, { name: "fire", count: 1 }],
      reply_count: 3,
      replies: [
        {
          ts: "1779199200.000000",
          text: "좋은 자료네요 :white_check_mark:",
          user_profile: { display_name: "답변자" },
        },
      ],
    },
    { id: "C123", name: "0-아무말대잔치", team: 2 },
    new Date("2026-05-20T00:00:00+09:00"),
  );

  assert.equal(discussion.id, "slack-C123-1770000000.123456");
  assert.equal(discussion.author, "율율");
  assert.equal(discussion.team, 2);
  assert.equal(discussion.type, "tip");
  assert.equal(discussion.text, "n8n 자동화 비교표 공유합니다 문서");
  assert.deepEqual(discussion.replies, [
    { author: "답변자", text: "좋은 자료네요 ✅", timeAgo: "1시간 전" },
  ]);
  assert.deepEqual(discussion.reactions, [
    { emoji: "💬", count: 3 },
    { emoji: "👍", count: 2 },
    { emoji: "🔥", count: 1 },
  ]);
});


test("toDiscussion summarizes long Slack text into a compact title while preserving full text", () => {
  const longText = "어제 AX 공유회 잘 들었습니다. 금주 과제물에 어제 공유회에서 배운것을 적용해보다가 질문이 생겨서요. claude, agent md파일과 work log 운용하는 구조 관련 질문입니다.";
  const discussion = toDiscussion(
    { ts: "1770000000.123456", text: longText, user_profile: { display_name: "율율" } },
    { id: "C123", name: "0-과제관련질문-누구나답변", team: 0 },
    new Date("2026-05-20T00:00:00+09:00"),
  );

  assert.equal(discussion.text, longText);
  assert.ok(discussion.title.length <= 70);
  assert.equal(discussion.title, "어제 AX 공유회 잘 들었습니다. 금주 과제물에 어제 공유회에서 배운것을 적용해보다가 질문…");
});
