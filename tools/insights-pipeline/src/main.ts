import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { loadConfig } from "./config.ts";
import { computeBatchWindow, formatKst } from "./window.ts";
import { readCursor, writeCursor } from "./cursor.ts";
import { fetchInsightMessages, toParsedInsights } from "./fetch_slack.ts";
import { classifyAndPick } from "./classify.ts";
import {
  readTaxonomy,
  updateTaxonomy,
  writeInsightNotes,
} from "./write_obsidian.ts";
import { buildWeeklySummaryText, postSummary } from "./post_summary.ts";
import type { ClassifiedInsight, ParsedInsight, UserDirEntry } from "./types.ts";

interface Args {
  dryRun: boolean;
  fixturePath: string | undefined;
  windowEnd: string | undefined;
  vaultRoot: string | undefined;
  skipPost: boolean;
}

function parseCliArgs(argv: string[]): Args {
  const { values } = parseArgs({
    args: argv,
    options: {
      "dry-run": { type: "boolean", default: false },
      fixture: { type: "string" },
      "window-end": { type: "string" },
      "vault-root": { type: "string" },
      "skip-post": { type: "boolean", default: false },
    },
    strict: false,
    allowPositionals: true,
  });
  return {
    dryRun: values["dry-run"] === true,
    fixturePath: typeof values.fixture === "string" ? values.fixture : undefined,
    windowEnd:
      typeof values["window-end"] === "string" ? values["window-end"] : undefined,
    vaultRoot:
      typeof values["vault-root"] === "string" ? values["vault-root"] : undefined,
    skipPost: values["skip-post"] === true,
  };
}

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));
  const useFixture = !!args.fixturePath;

  const config = loadConfig({ skipSecrets: useFixture || args.dryRun });
  const vaultRoot = args.vaultRoot ? resolve(args.vaultRoot) : config.vaultRoot;
  const cfg = { ...config, vaultRoot };

  console.log(
    `[insights] start: dryRun=${args.dryRun}, mode=${cfg.runMode}, vault=${cfg.vaultRoot}`,
  );

  const cursor = await readCursor(cfg.vaultRoot, cfg.cursorPath);
  const window = computeBatchWindow(new Date(), cursor.lastBatchEndIso, args.windowEnd);
  console.log(
    `[insights] window KST: ${formatKst(window.startUtc)} → ${formatKst(window.endUtc)}`,
  );

  let messages: import("./types.ts").SlackMessageRaw[];
  let userDir: Map<string, UserDirEntry>;
  if (useFixture) {
    const fixture = JSON.parse(
      await readFile(resolve(args.fixturePath as string), "utf-8"),
    ) as {
      messages: import("./types.ts").SlackMessageRaw[];
      users?: Record<string, string>;
    };
    messages = fixture.messages;
    userDir = new Map(
      Object.entries(fixture.users ?? {}).map(
        ([id, display]) => [id, { id, display: String(display) }] as const,
      ),
    );
  } else {
    const fetched = await fetchInsightMessages(cfg, window.startUtc, window.endUtc);
    messages = fetched.messages;
    userDir = fetched.userDir;
  }
  console.log(`[insights] fetched ${messages.length} message(s)`);

  const { parsed, skipped } = toParsedInsights(messages, userDir);
  console.log(`[insights] parsed ${parsed.length} insight(s) (skipped ${skipped.length})`);
  for (const s of skipped) console.log(`  - skip ts=${s.ts}: ${s.reason}`);

  const taxonomy = await readTaxonomy(cfg);
  console.log(`[insights] taxonomy size: ${taxonomy.length}`);

  const classification = await runClassification(cfg, parsed, taxonomy, useFixture);
  console.log(
    `[insights] classified=${classification.classified.length}, newCats=${classification.newCategoryProposals.length}, best=${classification.best.length}`,
  );

  const writeResult = await writeInsightNotes(cfg, classification.classified, args.dryRun);
  console.log(
    `[insights] wrote ${writeResult.files.length} note file(s)${args.dryRun ? " (dry-run, not actually written)" : ""}`,
  );
  for (const f of writeResult.files) console.log(`  - ${f}`);

  await updateTaxonomy(
    cfg,
    taxonomy,
    classification.newCategoryProposals,
    args.dryRun,
  );

  const summaryText = buildWeeklySummaryText({
    classified: classification.classified,
    best: classification.best,
    weeklyOverview: classification.weeklyOverview,
    windowStartUtc: window.startUtc,
    windowEndUtc: window.endUtc,
    newCategoryProposalNames: classification.newCategoryProposals.map((p) => p.name),
  });
  console.log(
    "\n========== Weekly Summary Draft ==========\n" +
      summaryText +
      "\n==========================================\n",
  );

  await writeRunArtifact(cfg.vaultRoot, summaryText);

  if (
    !args.dryRun &&
    !useFixture &&
    !args.skipPost &&
    classification.classified.length > 0 &&
    cfg.weeklyChannelMessage
  ) {
    if (cfg.runMode === "auto") {
      const r = await postSummary(cfg, summaryText, { kind: "channel" });
      console.log(`[insights] posted to channel: ts=${r.ts}`);
    } else if (cfg.slack.operatorUserId) {
      const r = await postSummary(cfg, summaryText, {
        kind: "dm",
        userId: cfg.slack.operatorUserId,
      });
      console.log(`[insights] sent draft DM to operator: ts=${r.ts}`);
    } else {
      console.log("[insights] draft mode + no SLACK_OPERATOR_USER_ID — summary printed only");
    }
  }

  if (!args.dryRun && !useFixture) {
    await writeCursor(cfg.vaultRoot, cfg.cursorPath, {
      batchEndIso: window.endUtc.toISOString(),
      runMode: cfg.runMode,
      messageCount: classification.classified.length,
    });
    console.log(`[insights] cursor updated → ${window.endUtc.toISOString()}`);
  }

  console.log("[insights] done.");
}

async function runClassification(
  cfg: ReturnType<typeof loadConfig>,
  parsed: ParsedInsight[],
  taxonomy: Awaited<ReturnType<typeof readTaxonomy>>,
  useFixture: boolean,
): Promise<{
  classified: ClassifiedInsight[];
  newCategoryProposals: { name: string; description: string; exampleTs: string }[];
  best: { ts: string; reason: string }[];
  weeklyOverview: string;
}> {
  if (parsed.length === 0) {
    return {
      classified: [],
      newCategoryProposals: [],
      best: [],
      weeklyOverview: "",
    };
  }
  if (useFixture && process.env.SKIP_LLM === "1") {
    return {
      classified: parsed.map((p) => ({ ...p, category: "기타", subTags: [] })),
      newCategoryProposals: [],
      best: parsed
        .slice(0, Math.min(2, parsed.length))
        .map((p) => ({ ts: p.ts, reason: "(stub: SKIP_LLM=1)" })),
      weeklyOverview: "(stub overview)",
    };
  }
  return classifyAndPick({ config: cfg, insights: parsed, taxonomy });
}

async function writeRunArtifact(vaultRoot: string, summaryText: string): Promise<void> {
  const dir = resolve(vaultRoot, "tools/insights-pipeline/.run-artifacts");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = resolve(dir, `summary-${stamp}.md`);
  await writeFile(file, summaryText, "utf-8");
}

main().catch((err) => {
  console.error("[insights] error:", err);
  process.exit(1);
});
