import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { RunMode } from "./types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type { RunMode };

export interface Config {
  slack: {
    botToken: string;
    channelId: string;
    operatorUserId: string | undefined;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
  runMode: RunMode;
  vaultRoot: string;
  insightsDir: string;
  taxonomyPath: string;
  cursorPath: string;
  timezone: string;
  weeklyChannelMessage: boolean;
}

const env = (key: string): string | undefined => {
  const v = process.env[key];
  return v && v.length > 0 ? v : undefined;
};

const requireEnv = (key: string): string => {
  const v = env(key);
  if (!v) throw new Error(`Missing required environment variable: ${key}`);
  return v;
};

export function loadConfig(opts: { skipSecrets?: boolean } = {}): Config {
  const get = opts.skipSecrets ? (k: string) => env(k) ?? "" : requireEnv;
  const vaultRoot = env("VAULT_ROOT") ?? resolve(__dirname, "..", "..", "..");
  const runMode = (env("RUN_MODE") ?? "draft") as RunMode;
  return {
    slack: {
      botToken: get("SLACK_BOT_TOKEN"),
      channelId: get("SLACK_INSIGHTS_CHANNEL_ID"),
      operatorUserId: env("SLACK_OPERATOR_USER_ID"),
    },
    anthropic: {
      apiKey: get("ANTHROPIC_API_KEY"),
      model: env("ANTHROPIC_MODEL") ?? "claude-sonnet-4-6",
    },
    runMode: runMode === "auto" ? "auto" : "draft",
    vaultRoot,
    insightsDir: "03_insights",
    taxonomyPath: "99_meta/insights-taxonomy.md",
    cursorPath: "99_meta/insights-cursor.json",
    timezone: "Asia/Seoul",
    weeklyChannelMessage: env("DISABLE_CHANNEL_POST") !== "1",
  };
}
