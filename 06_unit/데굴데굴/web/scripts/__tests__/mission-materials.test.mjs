import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const appMission = () => read("src/app/missions/_data/mission.ts");
const appWeeks = () => read("src/app/missions/_data/weeks.ts");
const appMaterials = () => read("src/app/missions/_data/materials.ts");
const rootMission = () => read("src/data/mission.ts");
const rootMaterials = () => read("src/data/materials.ts");

test("current week stays on 3주차 while using the corrected 5/24 deadline", () => {
  assert.match(appMission(), /export const CURRENT_WEEK = 3;/);
  assert.match(appWeeks(), /current: 3,/);
  assert.match(appWeeks(), /\{ number: 2, startDate: "5\/17", status: "done"/);
  assert.match(appWeeks(), /\{ number: 3, startDate: "5\/24", status: "active"/);
  assert.match(appMission(), /deadline: "2026-05-24T19:00:00\+09:00"/);
});

test("0 week has setup goal and separates replay/transcript from extra prep videos", () => {
  assert.match(appMission(), /Claude Code와 GitHub 세팅하기/);
  assert.match(appMission(), /replayUrl: "https:\/\/www\.youtube\.com\/watch\?v=SYChUnLC7yA"/);
  assert.match(appMission(), /transcriptUrl: "https:\/\/tiro\.ooo\/s\/MimSSp5sLs752"/);

  const materials = appMaterials();
  assert.match(materials, /클로드코드 워크샵 녹화본/);
  assert.match(materials, /클로드코드, 깃허브 워크샵 녹화본/);
  assert.doesNotMatch(materials, /title: "다시보기 VOD"/);
  assert.doesNotMatch(materials, /title: "티로 속기본/);
});

test("session replay/transcript links are shown as complete bundles only", () => {
  const mission = appMission();
  assert.match(mission, /1:[\s\S]*replayUrl: "https:\/\/youtu\.be\/Thh1HuvRXu4"/);
  assert.match(mission, /1:[\s\S]*transcriptUrl: "https:\/\/tiro\.ooo\/s\/xKsD1iW7tic8M"/);
  assert.match(mission, /2:[\s\S]*replayUrl: "https:\/\/youtu\.be\/Thh1HuvRXu4"/);
  assert.match(mission, /2:[\s\S]*transcriptUrl: "https:\/\/tiro\.ooo\/s\/xKsD1iW7tic8M"/);
  assert.doesNotMatch(mission, /3:[\s\S]*replayUrl: "https:\/\/youtu\.be\/XEvVXHmJrZo"/);
  assert.doesNotMatch(mission, /3:[\s\S]*transcriptUrl: "https:\/\/tiro\.ooo\/s\/kNk5ewHpAeGiG"/);
});

test("root data used by the materials page is kept in sync with app mission data", () => {
  assert.match(rootMission(), /export const CURRENT_WEEK = 3;/);
  assert.match(rootMission(), /1:[\s\S]*replayUrl: "https:\/\/youtu\.be\/Thh1HuvRXu4"/);
  assert.match(rootMission(), /1:[\s\S]*transcriptUrl: "https:\/\/tiro\.ooo\/s\/xKsD1iW7tic8M"/);
  assert.match(rootMission(), /2:[\s\S]*replayUrl: "https:\/\/youtu\.be\/Thh1HuvRXu4"/);
  assert.match(rootMission(), /2:[\s\S]*transcriptUrl: "https:\/\/tiro\.ooo\/s\/xKsD1iW7tic8M"/);
  assert.doesNotMatch(rootMission(), /3:[\s\S]*replayUrl: "https:\/\/youtu\.be\/XEvVXHmJrZo"/);
  assert.doesNotMatch(rootMission(), /3:[\s\S]*transcriptUrl: "https:\/\/tiro\.ooo\/s\/kNk5ewHpAeGiG"/);

  const materials = rootMaterials();
  assert.match(materials, /weekLabel: "2주차",\s*weekOrder: 2,[\s\S]*클로드 코드 채널 기능을 위한 가이드/);
  assert.match(materials, /weekLabel: "3주차",\s*weekOrder: 3,[\s\S]*상세페이지 뚝딱 만드는 후커블 가입 링크/);
});
