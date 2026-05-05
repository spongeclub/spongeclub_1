import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Config } from "./config.ts";
import type { ClassifiedInsight, TaxonomyEntry } from "./types.ts";
import { formatKst, isoDateKst } from "./window.ts";
import { slugify, slugifyCategory } from "./slugify.ts";

export interface WriteResult {
  files: string[];
}

export async function writeInsightNotes(
  config: Config,
  classified: ClassifiedInsight[],
  dryRun: boolean,
): Promise<WriteResult> {
  const files: string[] = [];
  for (const it of classified) {
    const dateKst = isoDateKst(it.postedAtUtc);
    const authorSlug = slugify(it.authorDisplay, 24);
    const titleSlug = slugify(it.oneLineSummary, 60);
    const categoryDir = slugifyCategory(it.category);
    const filename = `${dateKst}_${authorSlug}_${titleSlug}.md`;
    const dir = resolve(config.vaultRoot, config.insightsDir, categoryDir);
    const filepath = resolve(dir, filename);
    const body = renderNote(it);
    if (!dryRun) {
      await mkdir(dir, { recursive: true });
      await writeFile(filepath, body, "utf-8");
    }
    files.push(filepath);
  }
  return { files };
}

function renderNote(it: ClassifiedInsight): string {
  const dateKst = isoDateKst(it.postedAtUtc);
  const postedKst = formatKst(it.postedAtUtc);
  const fmLines = [
    "---",
    `category: ${yamlScalar(it.category)}`,
    `author: ${yamlScalar(it.authorDisplay)}`,
    `author_slack_id: ${it.authorId ?? ""}`,
    `posted_at_kst: ${yamlScalar(postedKst)}`,
    `posted_date_kst: ${dateKst}`,
    `slack_ts: "${it.ts}"`,
    `slack_permalink: ${it.permalink || `""`}`,
    `summary: ${yamlScalar(it.oneLineSummary)}`,
    "tags:",
    "  - insight",
    `  - ${slugifyCategory(it.category)}`,
    ...it.subTags.map((t) => `  - ${slugifyCategory(t)}`),
    "---",
    "",
  ];
  const permalinkSegment = it.permalink
    ? `[원본 슬랙 메시지](${it.permalink})`
    : "(원본 링크 없음)";
  const bodyLines = [
    `# ${it.oneLineSummary}`,
    "",
    `> ${it.authorDisplay} · ${postedKst} KST · ${permalinkSegment}`,
    "",
    "## 📌 한줄 요약",
    "",
    it.oneLineSummary,
    "",
    "## 🔍 주요 내용",
    "",
    it.mainContent || "_(내용 없음)_",
    "",
    "## 💼 활용 포인트",
    "",
    it.usagePoints || "_(내용 없음)_",
    "",
    "## 🔗 링크 / 스크린샷",
    "",
    it.linksRaw || "_(링크 없음)_",
    "",
  ];
  return [...fmLines, ...bodyLines].join("\n");
}

function yamlScalar(value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
  return `"${escaped}"`;
}

export async function readTaxonomy(config: Config): Promise<TaxonomyEntry[]> {
  const path = resolve(config.vaultRoot, config.taxonomyPath);
  if (!existsSync(path)) return [];
  const content = await readFile(path, "utf-8");
  const entries: TaxonomyEntry[] = [];
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("|") || !line.endsWith("|")) continue;
    const cols = line.slice(1, -1).split("|").map((c) => c.trim());
    if (cols.length !== 3) continue;
    const [name, description, addedIso] = cols;
    if (!name || !description) continue;
    if (name === "카테고리") continue;
    if (name.startsWith("---") || name.startsWith(":-")) continue;
    entries.push({
      name,
      description,
      addedIso: addedIso || new Date().toISOString(),
    });
  }
  return entries;
}

export async function updateTaxonomy(
  config: Config,
  taxonomy: TaxonomyEntry[],
  newProposals: { name: string; description: string }[],
  dryRun: boolean,
): Promise<TaxonomyEntry[]> {
  const existing = new Set(taxonomy.map((t) => t.name.toLowerCase()));
  const additions: TaxonomyEntry[] = [];
  const nowIso = new Date().toISOString();
  for (const p of newProposals) {
    if (!p.name) continue;
    if (existing.has(p.name.toLowerCase())) continue;
    additions.push({
      name: p.name,
      description: p.description || "(자동 제안 — 정의 보강 필요)",
      addedIso: nowIso,
    });
    existing.add(p.name.toLowerCase());
  }
  if (additions.length === 0) return taxonomy;
  const merged = [...taxonomy, ...additions];
  if (!dryRun) {
    await writeTaxonomyFile(config, merged);
  }
  return merged;
}

async function writeTaxonomyFile(config: Config, taxonomy: TaxonomyEntry[]): Promise<void> {
  const path = resolve(config.vaultRoot, config.taxonomyPath);
  const lines = [
    "# 인사이트 카테고리 (Insights Taxonomy)",
    "",
    "> 자동 적재 파이프라인이 사용하는 카테고리 목록. AI가 새 글 분류 시 이 목록에서 1개를 선택하고, 적합한 게 없을 때만 새 카테고리를 제안한다 → PR에 변경 포함.",
    "",
    "| 카테고리 | 정의 | 추가일 (UTC) |",
    "|---------|------|-------------|",
    ...taxonomy.map(
      (t) =>
        `| ${t.name} | ${t.description.replace(/\|/g, "\\|")} | ${t.addedIso} |`,
    ),
    "",
  ];
  await writeFile(path, lines.join("\n"), "utf-8");
}
