import type { Metadata } from "next";
import { SkillsClient } from "./skills-client";

export const metadata: Metadata = {
  title: "스킬 & 인사이트 — 스폰지클럽 1기",
  description: "스폰지들이 직접 써본 스킬과 가이드 모음",
};

export default function SkillsPage() {
  return <SkillsClient />;
}
