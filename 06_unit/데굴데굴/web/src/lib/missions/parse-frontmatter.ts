export type FrontmatterValue = string | number | boolean | null;
export type Frontmatter = Record<string, FrontmatterValue>;

export function parseFrontmatter(markdown: string): Frontmatter {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const result: Frontmatter = {};

  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let raw = line.slice(idx + 1).trim();
    if (!key) continue;

    if (raw === "" || raw === "~" || raw === "null") {
      result[key] = null;
      continue;
    }

    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      raw = raw.slice(1, -1);
    }

    if (raw === "true") result[key] = true;
    else if (raw === "false") result[key] = false;
    else if (/^-?\d+$/.test(raw)) result[key] = parseInt(raw, 10);
    else if (/^-?\d+\.\d+$/.test(raw)) result[key] = parseFloat(raw);
    else result[key] = raw;
  }

  return result;
}

export function extractDisplayName(member: string): string {
  const idx = member.indexOf("(");
  return (idx === -1 ? member : member.slice(0, idx)).trim();
}
