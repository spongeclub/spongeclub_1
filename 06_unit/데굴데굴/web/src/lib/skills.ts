// 배포판(_site)의 skills 페이지 로직을 Next App Router로 이식.
// vault의 02_mission/**/*submit.md 를 스캔해 외부 링크를 추출·분류한다.

import fs from "node:fs";
import path from "node:path";

export type LinkCategory = "skill" | "tool" | "content" | "showcase";

export type SharedLink = {
  url: string;
  title: string;
  category: LinkCategory;
  sharedBy: string[];
  weeks: number[];
};

const VAULT_PATH = process.env.VAULT_PATH
  ? path.resolve(process.env.VAULT_PATH)
  : path.resolve(process.cwd(), "../../..");

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg)(\?[^)\s]*)?$/i;
const LOCALHOST = /^https?:\/\/localhost/i;
const MD_LINK = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const BARE_URL = /(?<!\()(https?:\/\/[^\s\)\]"'<>]+)/g;
const UTM_PARAMS = /[?&](utm_[^&=]+=([^&]*))(&|$)/g;

function extractUrls(text: string): Array<{ url: string; title: string }> {
  const results: Array<{ url: string; title: string }> = [];
  const seen = new Set<string>();

  for (const m of text.matchAll(MD_LINK)) {
    const rawUrl = m[2].replace(/[)\s]+$/, "");
    const title = m[1].trim();
    if (!seen.has(rawUrl)) {
      seen.add(rawUrl);
      results.push({ url: rawUrl, title });
    }
  }

  for (const m of text.matchAll(BARE_URL)) {
    const rawUrl = m[1].replace(/[)\].,;:!?]+$/, "");
    if (!seen.has(rawUrl)) {
      seen.add(rawUrl);
      results.push({ url: rawUrl, title: "" });
    }
  }

  return results.filter(({ url }) => !LOCALHOST.test(url) && !IMAGE_EXT.test(url));
}

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    for (const key of [...u.searchParams.keys()]) {
      if (key.startsWith("utm_") || key === "igsh" || key === "xmt") {
        u.searchParams.delete(key);
      }
    }
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch {
    return raw.replace(/\/$/, "").replace(UTM_PARAMS, "");
  }
}

function classify(url: string): LinkCategory {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const pathStr = u.pathname.toLowerCase();

    if (
      host.endsWith(".vercel.app") ||
      host.endsWith(".netlify.app") ||
      host.endsWith(".github.io")
    ) {
      return "showcase";
    }

    if (host === "github.com") {
      const p = pathStr;
      if (
        p.includes("/skill") ||
        p.includes("/plugin") ||
        p.includes("anthropic") ||
        p.includes("claude") ||
        p.includes("oh-my-claude") ||
        p.includes("selfishclub") ||
        p.includes("spongeclub") ||
        p.includes("/skills/") ||
        p.includes("/claude-code")
      ) {
        return "skill";
      }
      return "content";
    }

    if (
      host === "habitica.com" ||
      host.includes("notion.so") ||
      host.includes("notion.site") ||
      host === "vercel.com" ||
      host === "netlify.com" ||
      host === "cursor.sh" ||
      host === "cursor.com" ||
      host.includes("claude.ai") ||
      host.includes("anthropic.com") ||
      host === "openai.com" ||
      host === "figma.com" ||
      host === "linear.app" ||
      host === "airtable.com" ||
      host === "zapier.com" ||
      host === "make.com" ||
      host === "replit.com" ||
      host === "bolt.new" ||
      host === "v0.dev" ||
      host === "lovable.dev" ||
      host === "perplexity.ai" ||
      host === "framer.com" ||
      host === "webflow.com" ||
      host === "supabase.com"
    ) {
      return "tool";
    }

    if (
      host.includes("youtube.com") ||
      host === "youtu.be" ||
      host.includes("substack.com") ||
      host === "brunch.co.kr" ||
      host === "maily.so" ||
      host.includes("medium.com") ||
      host.includes("linkedin.com") ||
      host.includes("threads.com") ||
      host.includes("twitter.com") ||
      host.includes("x.com") ||
      host.includes("instagram.com") ||
      host === "toss.im" ||
      host.includes("velog.io") ||
      host.includes("naver.com") ||
      host.includes("tistory.com") ||
      host.includes("kakao.com") ||
      host === "disquiet.io"
    ) {
      return "content";
    }

    return "content";
  } catch {
    return "content";
  }
}

function parseFilename(fname: string): { team: string; nickname: string; week: number } | null {
  const m = fname.match(/^(\d조)_(.+?)_(\d+)주차_submit\.md$/);
  if (!m) return null;
  return {
    team: m[1],
    nickname: m[2].replace(/\s*\([^)]*\)\s*/, "").trim(),
    week: Number(m[3]),
  };
}

function makeTitle(rawTitle: string, url: string): string {
  if (rawTitle && rawTitle.length > 1 && !rawTitle.startsWith("http")) {
    return rawTitle.slice(0, 80);
  }
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const seg = u.pathname.split("/").filter(Boolean);
    if (seg.length === 0) return host;
    const last = decodeURIComponent(seg[seg.length - 1])
      .replace(/[-_]/g, " ")
      .replace(/\.\w+$/, "")
      .trim();
    if (last.length > 2 && last.length < 80) return `${host} — ${last}`;
    return host;
  } catch {
    return url.slice(0, 60);
  }
}

export function extractSharedLinks(): SharedLink[] {
  const missionDir = path.join(VAULT_PATH, "02_mission");
  if (!fs.existsSync(missionDir)) return [];

  const map = new Map<
    string,
    { url: string; title: string; category: LinkCategory; sharedBy: Set<string>; weeks: Set<number> }
  >();

  const walkDir = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith("_")) continue;
      const full = path.join(dir, entry);
      let stat: fs.Stats;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        walkDir(full);
      } else if (entry.endsWith(".md") && !entry.startsWith("_")) {
        const meta = parseFilename(entry);
        if (!meta) continue;

        let text: string;
        try {
          text = fs.readFileSync(full, "utf-8");
        } catch {
          continue;
        }

        for (const { url: rawUrl, title: rawTitle } of extractUrls(text)) {
          const norm = normalizeUrl(rawUrl);
          const existing = map.get(norm);
          if (existing) {
            existing.sharedBy.add(meta.nickname);
            existing.weeks.add(meta.week);
            if (!existing.title && rawTitle) existing.title = rawTitle;
          } else {
            map.set(norm, {
              url: norm,
              title: makeTitle(rawTitle, norm),
              category: classify(norm),
              sharedBy: new Set([meta.nickname]),
              weeks: new Set([meta.week]),
            });
          }
        }
      }
    }
  };

  walkDir(missionDir);

  return [...map.values()]
    .map((item) => ({
      ...item,
      sharedBy: [...item.sharedBy].sort((a, b) => a.localeCompare(b, "ko")),
      weeks: [...item.weeks].sort((a, b) => a - b),
    }))
    .sort((a, b) => {
      const catOrder: Record<LinkCategory, number> = { skill: 0, tool: 1, content: 2, showcase: 3 };
      const c = catOrder[a.category] - catOrder[b.category];
      if (c !== 0) return c;
      return b.sharedBy.length - a.sharedBy.length || a.title.localeCompare(b.title, "ko");
    });
}
