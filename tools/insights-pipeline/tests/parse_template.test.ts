import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseInsightTemplate } from "../src/parse_template.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("parses 4-section template from sample message", async () => {
  const text = await readFile(
    resolve(__dirname, "fixtures/sample-message-1.txt"),
    "utf-8",
  );
  const result = parseInsightTemplate(text);
  assert.ok(result, "should parse the sample message");
  assert.match(result!.oneLineSummary, /웹사이트 디자인을 DESIGN.md/);
  assert.match(result!.mainContent, /자동 감지/);
  assert.match(result!.mainContent, /Google Stitch/);
  assert.match(result!.usagePoints, /레퍼런스 사이트/);
  assert.match(result!.linksRaw, /chromewebstore\.google\.com/);
});

test("returns null for empty or unrelated text", () => {
  assert.equal(parseInsightTemplate(""), null);
  assert.equal(parseInsightTemplate("hello world"), null);
  assert.equal(parseInsightTemplate("점심 뭐 드세요?"), null);
});

test("strips /스킬공유 prefix when on the same line as 📌 marker", () => {
  const text = [
    "/스킬공유 📌 한줄 요약",
    "내용 한 줄",
    "🔍 주요 내용",
    "본문",
    "💼 활용 포인트",
    "포인트",
    "🔗 링크",
    "https://example.com",
  ].join("\n");
  const r = parseInsightTemplate(text);
  assert.ok(r);
  assert.equal(r!.oneLineSummary, "내용 한 줄");
  assert.equal(r!.linksRaw, "https://example.com");
});

test("strips /스킬공유 prefix even with no inline content on first line", () => {
  const text = [
    "/스킬공유",
    "📌 한줄 요약",
    "테스트 한줄",
    "🔍 주요 내용",
    "내용 한 줄",
    "💼 활용 포인트",
    "포인트",
    "🔗 링크",
    "https://example.com",
  ].join("\n");
  const r = parseInsightTemplate(text);
  assert.ok(r);
  assert.equal(r!.oneLineSummary, "테스트 한줄");
  assert.equal(r!.mainContent, "내용 한 줄");
  assert.equal(r!.usagePoints, "포인트");
  assert.equal(r!.linksRaw, "https://example.com");
});

test("handles emoji shortcodes (Slack alternate format)", () => {
  const text = [
    ":pushpin: 한줄 요약",
    "쇼트코드 케이스",
    ":mag: 주요 내용",
    "본문",
    ":briefcase: 활용 포인트",
    "쓰임",
    ":link: 링크",
    "https://x.example",
  ].join("\n");
  const r = parseInsightTemplate(text);
  assert.ok(r);
  assert.equal(r!.oneLineSummary, "쇼트코드 케이스");
  assert.equal(r!.mainContent, "본문");
});

test("inline first-line content captured (emoji + summary on same line)", () => {
  const text = [
    "📌 한줄 요약 인라인 요약 내용",
    "🔍 주요 내용",
    "본문",
    "💼 활용 포인트",
    "쓰임",
    "🔗 링크",
    "x",
  ].join("\n");
  const r = parseInsightTemplate(text);
  assert.ok(r);
  assert.equal(r!.oneLineSummary, "인라인 요약 내용");
});
