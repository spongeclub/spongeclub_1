export interface ParsedSections {
  oneLineSummary: string;
  mainContent: string;
  usagePoints: string;
  linksRaw: string;
}

type SectionKey = "oneLine" | "main" | "usage" | "links";

export function parseInsightTemplate(text: string): ParsedSections | null {
  if (!text || !text.trim()) return null;
  const cleaned = text
    .replace(/\r\n?/g, "\n")
    .replace(/^[ \t]*\/스킬공유[ \t]*/u, "");
  const lines = cleaned.split("\n");

  const sections: Record<SectionKey, string[]> = {
    oneLine: [],
    main: [],
    usage: [],
    links: [],
  };
  let current: SectionKey | null = null;
  let foundAny = false;

  for (const line of lines) {
    const marker = detectMarker(line);
    if (marker) {
      current = marker;
      foundAny = true;
      const stripped = stripMarkerHeader(line, marker);
      if (stripped.length > 0) sections[current].push(stripped);
      continue;
    }
    if (current) {
      sections[current].push(line);
    }
  }

  if (!foundAny) return null;

  const result: ParsedSections = {
    oneLineSummary: cleanContent(sections.oneLine.join("\n")),
    mainContent: cleanContent(sections.main.join("\n")),
    usagePoints: cleanContent(sections.usage.join("\n")),
    linksRaw: cleanContent(sections.links.join("\n")),
  };

  if (!result.oneLineSummary) return null;
  return result;
}

function detectMarker(line: string): SectionKey | null {
  if (/📌|:pushpin:/.test(line)) return "oneLine";
  if (/🔍|:mag(_right)?:|:magnifying_glass:/.test(line)) return "main";
  if (/💼|:briefcase:/.test(line)) return "usage";
  if (/🔗|:link:/.test(line)) return "links";
  return null;
}

function stripMarkerHeader(line: string, marker: SectionKey): string {
  let result = line;
  switch (marker) {
    case "oneLine":
      result = result.replace(/(📌|:pushpin:)\s*한줄\s*요약[:：]?/g, " ");
      break;
    case "main":
      result = result.replace(/(🔍|:mag(_right)?:|:magnifying_glass:)\s*주요\s*내용[:：]?/g, " ");
      break;
    case "usage":
      result = result.replace(/(💼|:briefcase:)\s*활용\s*포인트[:：]?/g, " ");
      break;
    case "links":
      result = result.replace(
        /(🔗|:link:)\s*링크(\s*[\/／]\s*스크린?샷?)?[:：]?/g,
        " ",
      );
      break;
  }
  result = result.replace(
    /(📌|🔍|💼|🔗|:pushpin:|:mag(_right)?:|:magnifying_glass:|:briefcase:|:link:)/g,
    "",
  );
  return result.trim();
}

function cleanContent(s: string): string {
  return s
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "")
    .trim();
}
