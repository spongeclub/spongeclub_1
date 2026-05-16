#!/usr/bin/env node
import { readdirSync, writeFileSync, existsSync, statSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../..");
const MISSION_DIR = join(REPO_ROOT, "02_mission");
const OUTPUT = resolve(__dirname, "../src/data/submissions.generated.json");

const WEEK_FOLDER_RE = /^([0-6])주차/;
const TEAM_FOLDER_RE = /^([1-6])조$/;
const SUBMIT_FILE_RE =
  /^([1-6])조_(.+?)_(00_OT|0주차_OT|0주차|[1-6]주차)_submit\.md$/;

function weekFromPart(part) {
  if (part === "00_OT" || part === "0주차_OT" || part === "0주차") return 0;
  const m = /^([1-6])주차$/.exec(part);
  return m ? Number(m[1]) : null;
}

/**
 * Extract identifier aliases from a raw name field.
 * "Nina(이예지)" → ["Nina", "이예지"]
 * "린디"        → ["린디"]
 */
function extractAliases(raw) {
  const m = /^(.+?)\((.+?)\)$/.exec(raw.trim());
  if (m) {
    const left = m[1].trim();
    const right = m[2].trim();
    const out = [];
    if (left) out.push(left);
    if (right && right !== left) out.push(right);
    return out;
  }
  const t = raw.trim();
  return t ? [t] : [];
}

/** Parse YAML frontmatter and check `submitted: true` */
function isSubmitted(filePath) {
  let text;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    return false;
  }
  if (!text.startsWith("---")) return false;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return false;
  const fm = text.slice(3, end);
  return /^\s*submitted:\s*true\s*$/m.test(fm);
}

/** { [teamNum]: { [nickname]: [weeks...] } } */
const submissions = {};

function addSubmission(teamNum, nickname, week) {
  const t = String(teamNum);
  submissions[t] ??= {};
  submissions[t][nickname] ??= [];
  if (!submissions[t][nickname].includes(week)) {
    submissions[t][nickname].push(week);
    submissions[t][nickname].sort((a, b) => a - b);
  }
}

if (!existsSync(MISSION_DIR)) {
  console.warn(`[scan-submissions] 02_mission not found at ${MISSION_DIR} — writing empty data`);
  writeFileSync(OUTPUT, "{}\n");
  process.exit(0);
}

let scanned = 0;
for (const weekEntry of readdirSync(MISSION_DIR)) {
  const weekMatch = WEEK_FOLDER_RE.exec(weekEntry);
  if (!weekMatch) continue;
  const weekFolderPath = join(MISSION_DIR, weekEntry);
  if (!statSync(weekFolderPath).isDirectory()) continue;

  for (const teamEntry of readdirSync(weekFolderPath)) {
    const teamMatch = TEAM_FOLDER_RE.exec(teamEntry);
    if (!teamMatch) continue;
    const teamNum = Number(teamMatch[1]);
    const teamFolderPath = join(weekFolderPath, teamEntry);
    if (!statSync(teamFolderPath).isDirectory()) continue;

    for (const file of readdirSync(teamFolderPath)) {
      const fileMatch = SUBMIT_FILE_RE.exec(file);
      if (!fileMatch) continue;
      const [, fileTeam, rawNickname, weekPart] = fileMatch;
      if (Number(fileTeam) !== teamNum) continue;
      const week = weekFromPart(weekPart);
      if (week === null) continue;
      const aliases = extractAliases(rawNickname);
      if (aliases.length === 0) continue;
      const filePath = join(teamFolderPath, file);
      if (!isSubmitted(filePath)) continue;
      for (const alias of aliases) addSubmission(teamNum, alias, week);
      scanned += 1;
    }
  }
}

writeFileSync(OUTPUT, JSON.stringify(submissions, null, 2) + "\n");
console.log(
  `[scan-submissions] scanned ${scanned} files → ${Object.keys(submissions).length} teams`,
);
