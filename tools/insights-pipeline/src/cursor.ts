import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { CursorState, RunMode } from "./types.ts";

const EMPTY: CursorState = {
  lastBatchEndIso: null,
  lastRunIso: null,
  lastRunMode: null,
  lastRunMessages: null,
};

export async function readCursor(vaultRoot: string, cursorPath: string): Promise<CursorState> {
  const path = resolve(vaultRoot, cursorPath);
  if (!existsSync(path)) return { ...EMPTY };
  const raw = await readFile(path, "utf-8");
  if (!raw.trim()) return { ...EMPTY };
  try {
    const parsed = JSON.parse(raw);
    return {
      lastBatchEndIso: typeof parsed.lastBatchEndIso === "string" ? parsed.lastBatchEndIso : null,
      lastRunIso: typeof parsed.lastRunIso === "string" ? parsed.lastRunIso : null,
      lastRunMode: parsed.lastRunMode === "auto" || parsed.lastRunMode === "draft" ? parsed.lastRunMode : null,
      lastRunMessages: typeof parsed.lastRunMessages === "number" ? parsed.lastRunMessages : null,
    };
  } catch {
    throw new Error(`Cursor file at ${path} is not valid JSON.`);
  }
}

export async function writeCursor(
  vaultRoot: string,
  cursorPath: string,
  next: { batchEndIso: string; runMode: RunMode | "draft"; messageCount: number },
): Promise<void> {
  const path = resolve(vaultRoot, cursorPath);
  const state: CursorState = {
    lastBatchEndIso: next.batchEndIso,
    lastRunIso: new Date().toISOString(),
    lastRunMode: next.runMode === "auto" ? "auto" : "draft",
    lastRunMessages: next.messageCount,
  };
  await writeFile(path, JSON.stringify(state, null, 2) + "\n", "utf-8");
}
