import {
  parseFrontmatter,
  type Frontmatter,
} from "./parse-frontmatter";
import {
  canonicalMemberName,
  displayMemberName,
  isKnownMemberName,
} from "./member-name-map";
import type { MissionSubmission, TeamProgress } from "./types";

const VAULT_REPO = "spongeclub/spongeclub_1";
const API_BASE = `https://api.github.com/repos/${VAULT_REPO}`;
const REVALIDATE_SECONDS = 300;

type GhContentItem = {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
  download_url: string | null;
};

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.VAULT_GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghFetch(path: string): Promise<GhContentItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/contents/${path}`, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return Array.isArray(data) ? (data as GhContentItem[]) : null;
  } catch {
    return null;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function getTeamProgress(
  weekFolder: string,
  team: string,
): Promise<TeamProgress> {
  const items = await ghFetch(
    `02_mission/${encodeURIComponent(weekFolder)}/${encodeURIComponent(team)}`,
  );

  if (!items) {
    return { team, submittedCount: 0, totalCount: 0, members: [] };
  }

  const submitFiles = items.filter(
    (item) =>
      item.type === "file" &&
      item.name.endsWith("_submit.md") &&
      item.download_url !== null,
  );

  const members = await Promise.all(
    submitFiles.map((file) => parseSubmissionFile(file, team)),
  );
  const mergedMembers = mergeSubmissions(members);

  mergedMembers.sort((a, b) => {
    if (a.role === "조장" && b.role !== "조장") return -1;
    if (b.role === "조장" && a.role !== "조장") return 1;
    return a.displayName.localeCompare(b.displayName, "ko");
  });

  return {
    team,
    submittedCount: mergedMembers.filter((member) => member.submitted).length,
    totalCount: mergedMembers.length,
    members: mergedMembers,
  };
}

async function parseSubmissionFile(
  file: GhContentItem,
  fallbackTeam: string,
): Promise<MissionSubmission> {
  const content = file.download_url ? await fetchText(file.download_url) : null;
  const frontmatter: Frontmatter = content ? parseFrontmatter(content) : {};
  const fileMember = extractMemberFromFilename(file.name);
  const frontmatterMember =
    typeof frontmatter.member === "string" ? frontmatter.member : "";
  const member = resolveCanonicalMember(fallbackTeam, [
    fileMember,
    frontmatterMember,
  ]);

  return {
    team: String(frontmatter.team ?? fallbackTeam),
    member,
    displayName: displayMemberName(member),
    role: frontmatter.role ? String(frontmatter.role) : undefined,
    week: typeof frontmatter.week === "number" ? frontmatter.week : 0,
    submitted: frontmatter.submitted === true,
    filePath: file.path,
  };
}

function resolveCanonicalMember(team: string, rawNames: string[]): string {
  const knownName = rawNames.find((name) => name && isKnownMemberName(team, name));
  return canonicalMemberName(team, knownName ?? rawNames.find(Boolean) ?? "");
}

function mergeSubmissions(members: MissionSubmission[]): MissionSubmission[] {
  const merged = new Map<string, MissionSubmission>();

  for (const member of members) {
    const existing = merged.get(member.member);
    if (!existing) {
      merged.set(member.member, member);
      continue;
    }

    existing.submitted ||= member.submitted;
    existing.role ??= member.role;
    if (member.submitted) existing.filePath = member.filePath;
  }

  return [...merged.values()];
}

function extractMemberFromFilename(fileName: string): string {
  const noExt = fileName.replace(/\.md$/i, "");
  const cleaned = noExt.replace(
    /_\d+(주차|주)?_submit$|_\d{2}_OT_submit$/u,
    "",
  );
  const match = cleaned.match(/^\d+조_(.+)$/u);
  return match ? match[1] : cleaned;
}

export async function getAllTeamsProgress(
  weekFolder: string,
): Promise<TeamProgress[]> {
  const teams = ["1조", "2조", "3조", "4조", "5조", "6조"];
  return Promise.all(teams.map((team) => getTeamProgress(weekFolder, team)));
}
