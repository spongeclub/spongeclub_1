import type { SiteConfig } from "../_lib/types";

const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL ?? "https://spongeclub-community.vercel.app/";

export const siteConfig: SiteConfig = {
  weekNumberSubtitle: "스폰지클럽 1기 · 7주 커리큘럼",
  slackWorkspaceUrl: "https://w1777265456-oc0196728.slack.com/",
  communityUrl,
  homepageUrl: "https://spongeclub-homepage.vercel.app/",
};
