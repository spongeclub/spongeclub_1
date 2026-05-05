import Anthropic from "@anthropic-ai/sdk";
import type { Config } from "./config.ts";
import type {
  BestPick,
  ClassificationResult,
  ClassifiedInsight,
  NewCategoryProposal,
  ParsedInsight,
  TaxonomyEntry,
} from "./types.ts";

export interface ClassifyArgs {
  config: Config;
  insights: ParsedInsight[];
  taxonomy: TaxonomyEntry[];
}

export async function classifyAndPick(args: ClassifyArgs): Promise<ClassificationResult> {
  if (args.insights.length === 0) {
    return {
      classified: [],
      newCategoryProposals: [],
      best: [],
      weeklyOverview: "이번 주 새 인사이트가 없습니다.",
    };
  }
  const client = new Anthropic({ apiKey: args.config.anthropic.apiKey });
  const taxonomyBlock = args.taxonomy
    .map((t) => `- **${t.name}**: ${t.description}`)
    .join("\n");
  const insightsBlock = args.insights
    .map((it, i) => formatInsightForPrompt(it, i))
    .join("\n\n---\n\n");

  const system = [
    "너는 스폰지클럽 #이기적인스킬러스 채널의 주간 인사이트 큐레이터다.",
    "크루들이 던지는 글을 카테고리로 분류하고, 이번 주 베스트 2~3개를 뽑는다.",
    "",
    "기존 카테고리 (이 안에서 선택; 안 맞을 때만 새 카테고리 제안):",
    taxonomyBlock,
    "",
    "규칙:",
    "1. 모든 글에 가장 알맞은 카테고리 1개를 부여한다 (기존 카테고리 우선).",
    "2. 기존에 절대 안 맞는 글이 있을 때만 새 카테고리를 제안한다 (이름·정의·예시 인덱스).",
    "3. 이번 주 베스트 2~3개를 선정하고 각각 한국어 1~2줄 이유를 적는다 (왜 다른 크루에게 도움 되는지 구체적으로).",
    "4. 한 줄 주간 총평을 작성한다.",
    "",
    "응답은 반드시 JSON 객체 하나로만, 마크다운 코드블록 없이.",
  ].join("\n");

  const userMsg = [
    `이번 주 글 (총 ${args.insights.length}개):`,
    "",
    insightsBlock,
    "",
    "다음 JSON 스키마로 응답하라:",
    JSON.stringify(
      {
        classified: [
          {
            index: 0,
            category: "string (기존 카테고리 이름 또는 새 카테고리 이름)",
            subTags: ["string (선택, 0~3개)"],
          },
        ],
        newCategoryProposals: [
          { name: "string", description: "string", exampleIndex: 0 },
        ],
        best: [{ index: 0, reason: "한국어 1~2줄" }],
        weeklyOverview: "한 문장 한국어 총평",
      },
      null,
      2,
    ),
  ].join("\n");

  const response = await client.messages.create({
    model: args.config.anthropic.model,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: system,
        cache_control: { type: "ephemeral" } as { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMsg }],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");
  const json = parseJsonLoose(text);

  const classifiedRaw: Array<{
    index?: number;
    category?: unknown;
    subTags?: unknown;
  }> = Array.isArray(json.classified) ? json.classified : [];
  const classified: ClassifiedInsight[] = [];
  for (const c of classifiedRaw) {
    const idx = typeof c.index === "number" ? c.index : -1;
    const base = args.insights[idx];
    if (!base) continue;
    const category =
      typeof c.category === "string" && c.category.trim().length > 0
        ? c.category.trim()
        : "기타";
    const subTags = Array.isArray(c.subTags)
      ? c.subTags
          .filter((t): t is string => typeof t === "string" && t.length > 0)
          .slice(0, 3)
      : [];
    classified.push({ ...base, category, subTags });
  }
  for (const it of args.insights) {
    if (!classified.some((c) => c.ts === it.ts)) {
      classified.push({ ...it, category: "기타", subTags: [] });
    }
  }

  const proposalsRaw: Array<{
    name?: unknown;
    description?: unknown;
    exampleIndex?: number;
  }> = Array.isArray(json.newCategoryProposals) ? json.newCategoryProposals : [];
  const proposals: NewCategoryProposal[] = proposalsRaw
    .map((p) => ({
      name: typeof p.name === "string" ? p.name.trim() : "",
      description: typeof p.description === "string" ? p.description.trim() : "",
      exampleTs:
        typeof p.exampleIndex === "number"
          ? args.insights[p.exampleIndex]?.ts ?? ""
          : "",
    }))
    .filter((p) => p.name.length > 0);

  const bestRaw: Array<{ index?: number; reason?: unknown }> = Array.isArray(json.best)
    ? json.best
    : [];
  const best: BestPick[] = bestRaw
    .map((b) => {
      const idx = typeof b.index === "number" ? b.index : -1;
      const it = args.insights[idx];
      return {
        ts: it?.ts ?? "",
        reason: typeof b.reason === "string" ? b.reason.trim() : "",
      };
    })
    .filter((b) => b.ts.length > 0)
    .slice(0, 3);

  const overview = typeof json.weeklyOverview === "string" ? json.weeklyOverview.trim() : "";

  return {
    classified,
    newCategoryProposals: proposals,
    best,
    weeklyOverview: overview,
  };
}

function formatInsightForPrompt(it: ParsedInsight, index: number): string {
  return [
    `[${index}] 작성자: ${it.authorDisplay} | ts: ${it.ts}`,
    `📌 한줄 요약: ${it.oneLineSummary}`,
    `🔍 주요 내용: ${truncate(it.mainContent, 600)}`,
    `💼 활용 포인트: ${truncate(it.usagePoints, 300)}`,
    `🔗 링크: ${truncate(it.linksRaw, 300)}`,
  ].join("\n");
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function parseJsonLoose(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(`Anthropic returned non-JSON: ${text.slice(0, 200)}`);
    }
    return JSON.parse(match[0]) as Record<string, unknown>;
  }
}
