export type RunMode = "draft" | "auto";

export interface SlackMessageRaw {
  ts: string;
  text?: string;
  user?: string;
  bot_id?: string;
  username?: string;
  permalink?: string;
  thread_ts?: string;
  reply_count?: number;
  reactions?: { name: string; count: number }[];
  blocks?: unknown[];
}

export interface UserDirEntry {
  id: string;
  display: string;
}

export interface ParsedInsight {
  ts: string;
  permalink: string;
  authorId: string | undefined;
  authorDisplay: string;
  postedAtUtc: Date;
  oneLineSummary: string;
  mainContent: string;
  usagePoints: string;
  linksRaw: string;
  rawText: string;
  reactionsTotal: number;
}

export interface ClassifiedInsight extends ParsedInsight {
  category: string;
  subTags: string[];
}

export interface BestPick {
  ts: string;
  reason: string;
}

export interface ClassificationResult {
  classified: ClassifiedInsight[];
  newCategoryProposals: NewCategoryProposal[];
  best: BestPick[];
  weeklyOverview: string;
}

export interface NewCategoryProposal {
  name: string;
  description: string;
  exampleTs: string;
}

export interface CursorState {
  lastBatchEndIso: string | null;
  lastRunIso: string | null;
  lastRunMode: "draft" | "auto" | null;
  lastRunMessages: number | null;
}

export interface BatchWindow {
  startUtc: Date;
  endUtc: Date;
}

export interface TaxonomyEntry {
  name: string;
  description: string;
  addedIso: string;
}
