import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeBatchWindow,
  isoDateKst,
  previousSaturdayMidnightKstAsUtc,
} from "../src/window.ts";

test("Saturday 00:00 KST = Friday 15:00 UTC for the prior week boundary", () => {
  // Sunday 2026-05-10 11:00 KST = Sunday 2026-05-10 02:00 UTC
  const now = new Date("2026-05-10T02:00:00Z");
  const prev = previousSaturdayMidnightKstAsUtc(now);
  // Expected: Saturday 2026-05-09 00:00 KST = Friday 2026-05-08 15:00 UTC
  assert.equal(prev.toISOString(), "2026-05-08T15:00:00.000Z");
});

test("running Saturday morning still returns the previous week's Saturday boundary", () => {
  // Saturday 2026-05-09 03:00 KST = Friday 2026-05-08 18:00 UTC (3am Sat KST is past Sat 00:00 KST)
  const now = new Date("2026-05-08T18:00:00Z");
  const prev = previousSaturdayMidnightKstAsUtc(now);
  // Saturday 00:00 KST has already happened earlier today (Sat 00:00 KST)
  assert.equal(prev.toISOString(), "2026-05-08T15:00:00.000Z");
});

test("running on Friday before Saturday boundary returns last week's", () => {
  // Friday 2026-05-08 12:00 KST = Friday 2026-05-08 03:00 UTC (12 hours before Sat 00:00 KST)
  const now = new Date("2026-05-08T03:00:00Z");
  const prev = previousSaturdayMidnightKstAsUtc(now);
  // Most recent Saturday 00:00 KST is one week ago: Saturday 2026-05-02 00:00 KST = Friday 2026-05-01 15:00 UTC
  assert.equal(prev.toISOString(), "2026-05-01T15:00:00.000Z");
});

test("computeBatchWindow with no cursor uses 7-day default backwards", () => {
  const now = new Date("2026-05-10T02:00:00Z");
  const w = computeBatchWindow(now, null);
  assert.equal(w.endUtc.toISOString(), "2026-05-08T15:00:00.000Z");
  assert.equal(w.startUtc.toISOString(), "2026-05-01T15:00:00.000Z");
});

test("computeBatchWindow uses cursor as start when cursor < end", () => {
  const now = new Date("2026-05-10T02:00:00Z");
  const w = computeBatchWindow(now, "2026-05-01T15:00:00.000Z");
  assert.equal(w.startUtc.toISOString(), "2026-05-01T15:00:00.000Z");
  assert.equal(w.endUtc.toISOString(), "2026-05-08T15:00:00.000Z");
});

test("computeBatchWindow throws if cursor equals or exceeds current end", () => {
  const now = new Date("2026-05-10T02:00:00Z");
  assert.throws(() =>
    computeBatchWindow(now, "2026-05-08T15:00:00.000Z"),
  );
});

test("computeBatchWindow override end works", () => {
  const now = new Date("2026-05-10T02:00:00Z");
  const w = computeBatchWindow(now, null, "2026-05-15T03:00:00Z");
  assert.equal(w.endUtc.toISOString(), "2026-05-15T03:00:00.000Z");
});

test("isoDateKst formats Saturday 00:00 KST = Friday 15:00 UTC as Saturday date", () => {
  const utc = new Date("2026-05-08T15:00:00.000Z");
  assert.equal(isoDateKst(utc), "2026-05-09");
});
