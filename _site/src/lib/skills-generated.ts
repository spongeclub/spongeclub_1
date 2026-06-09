// web(Next.js) 빌드 산출물 skills.generated.json + skill-bodies.generated.json 을 읽어
// _site 스킬 하위 페이지에 노출한다. visible=true 인 카드(써본 후기 큐레이션)만 사용.
// 데이터 출처는 web 파이프라인 단일화 — 변경 시 web 빌드로 generated.json 을 갱신해야 반영됨.

import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { VAULT_PATH } from './data';

export type SkillArea = '클로드코드' | '콘텐츠·마케팅' | '개발도구' | '생산성';
export type SkillDifficulty = '설치만하면됨' | '설정좀필요' | '코드만져야함';
export type SkillKind = '써본후기' | '공유';

export type SkillQuote = { text: string; author: string };

export type GeneratedSkill = {
  slug: string;
  name: string;        // 모노폰트 작은 식별자
  title: string;       // 카드 큰 제목 (= JSON summary)
  area: SkillArea;
  difficulty: SkillDifficulty;
  kind: SkillKind;
  href: string;
  slackUrl?: string;
  usedBy: number;
  quotes: SkillQuote[];
  bodyHtml: string;    // 펼침 영역 "주요 내용" 마크다운 → HTML
  flow?: string;       // 화면 표시용 흐름(슬러그별 수동 유지)
};

type RawSkill = {
  name: string;
  title: string;
  summary: string;
  area: string;
  difficulty: string;
  kind: string;
  href: string;
  slackUrl: string;
  usedBy: number;
  quotes: SkillQuote[];
  body: string;
  published: boolean;
  visible: boolean;
};

// 화면 표시용 흐름(flow)은 JSON에 없어 슬러그별로 수동 유지 (web skills-client.tsx 와 동일)
const FLOW: Record<string, string> = {
  'skillers-finder': '에밀리 공유회 → 8명이 써봄',
  'claude-mem': '먼지민이 발견 → 그린이 써봄',
  'obsidian-cardnews-skill': '오웬 스킬 → 연수가 써봄',
  'social-media-skills': '에밀리 공유회 → 슬로우퀵이 파이프라인 구축',
  'claude-design-skill': 'skillers-finder 추천 → 슬로우퀵이 적용',
  'open-carrusel': 'skillers-finder 추천 → 민트가 써봄',
};

const DATA_DIR = path.join(VAULT_PATH, '06_unit/데굴데굴/web/src/data');

function readJson<T>(file: string): T | null {
  const full = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
  } catch {
    return null;
  }
}

export function loadGeneratedSkills(): GeneratedSkill[] {
  const skills = readJson<Record<string, RawSkill>>('skills.generated.json');
  const bodies = readJson<Record<string, string>>('skill-bodies.generated.json') ?? {};
  if (!skills) return [];

  return Object.entries(skills)
    .filter(([, v]) => v.visible)
    .map(([slug, v]) => {
      const md = bodies[slug] || '';
      const bodyHtml = md ? (marked.parse(md, { async: false }) as string) : '';
      return {
        slug,
        name: v.name,
        title: v.summary,
        area: v.area as SkillArea,
        difficulty: v.difficulty as SkillDifficulty,
        kind: v.kind as SkillKind,
        href: v.href,
        slackUrl: v.slackUrl || undefined,
        usedBy: v.usedBy ?? 0,
        quotes: v.quotes ?? [],
        bodyHtml,
        flow: FLOW[slug],
      };
    });
}

export function loadInsights(): string[] {
  const data = readJson<{ items: string[] }>('insights.generated.json');
  return data?.items ?? [];
}

export const SKILL_AREAS: SkillArea[] = ['클로드코드', '콘텐츠·마케팅', '개발도구', '생산성'];
