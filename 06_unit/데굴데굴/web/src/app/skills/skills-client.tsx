"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Header } from "../missions/_components/Header";
import skillBodies from "@/data/skill-bodies.generated.json";

type SkillKind = "써본후기" | "공유";
type SkillArea = "클로드코드" | "콘텐츠·마케팅" | "개발도구" | "생산성";
type SkillDifficulty = "설치만하면됨" | "설정좀필요" | "코드만져야함";

type SkillItem = {
  title: string;
  name: string;
  href: string;
  slackUrl?: string;
  area: SkillArea;
  difficulty: SkillDifficulty;
  kind: SkillKind;
  usedBy?: number;
  quotes?: { text: string; author: string }[];
  flow?: string;
  // skill-bodies.generated.json 키와 다른 경우만 명시
  bodySlug?: string;
};

const BODIES = skillBodies as Record<string, string>;

const SKILLS: SkillItem[] = [
  {
    title: "내 상황에 맞는 스킬 자동 추천 + 설치",
    name: "skillers-finder",
    href: "https://github.com/emily-mkt/skillers-finder",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595027541129",
    area: "클로드코드",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 8,
    quotes: [
      { text: "뭘 깔아야 할지 몰랐는데 검색부터 설치까지 5분 컷", author: "달빛그린" },
      { text: "기획만 잘하면 스킬을 알아서 찾아주는구나", author: "하늘" },
      { text: "평소 디자인 쪽으로만 생각하다가 시야가 넓어지는 효과", author: "키노" },
    ],
    flow: "에밀리 공유회 → 8명이 써봄",
  },
  {
    title: "세션 간 영속 메모리 플러그인",
    name: "claude-mem",
    href: "https://github.com/thedotmack/claude-mem",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779010543580379",
    area: "클로드코드",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 2,
    quotes: [
      { text: "메모리 불러와서 일목요연하게 정리해줌. 심지어 이어서 어떤 걸 하길 원하는지 연결해줌", author: "그린" },
      { text: "프로젝트 작업할 때 바로 다 못 끝내니까 시작 전 사용하기 좋네요", author: "리보" },
    ],
    flow: "먼지민이 발견 → 그린이 써봄",
  },
  {
    title: "md → 인스타 카드뉴스 자동 변환",
    name: "obsidian-cardnews-skill",
    href: "https://github.com/owenleekr/obsidian-cardnews-skill",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779002187847939",
    area: "콘텐츠·마케팅",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [
      { text: "과제 내용을 보고 알아서 카피를 만들어 카드뉴스까지 만들어주는 게 신기했는데, 내가 SNS에 말하고 싶은 부분만 써주지는 않아서 몇 번 수정 요청함", author: "연수" },
      { text: "다음과제는 냅다 저 오웬스킬 사용해서 후기남겨야겠어요", author: "리보" },
    ],
    flow: "오웬 스킬 → 연수가 써봄",
  },
  {
    title: "훅 카피 → 캐릭터 애니메이션 MP4 파이프라인",
    name: "social-media-skills + remotion-ads",
    bodySlug: "social-media-skills",
    href: "https://github.com/charlie947/social-media-skills",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778605229551699",
    area: "콘텐츠·마케팅",
    difficulty: "코드만져야함",
    kind: "써본후기",
    usedBy: 1,
    quotes: [
      { text: "'스킬이 움직이게 하고, 에이전트가 그 스킬을 불러온다'는 말이 정확히 무슨 뜻인지 이번에 처음으로 체감했습니다", author: "슬로우퀵" },
    ],
    flow: "에밀리 공유회 → 슬로우퀵이 파이프라인 구축",
  },
  {
    title: "Claude Code를 디자인 전문가로 바꿔주는 스킬",
    name: "claude-design-skill",
    href: "https://github.com/jiji262/claude-design-skill",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778596990512049",
    area: "콘텐츠·마케팅",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [
      { text: "혼자 만든 결과물이 왠지 촌스럽고 뭔가 비어있는 느낌을 지울 수 없었다. [...] 전체적인 디자인이 확실히 정돈되는 느낌을 받았다", author: "슬로우퀵" },
    ],
    flow: "skillers-finder 추천 → 슬로우퀵이 적용",
  },
  {
    title: "CLAUDE.md 6개 기준 자동 감사 (공식)",
    name: "claude-md-management",
    href: "https://github.com/anthropics/claude-plugins-official",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778491790933989",
    area: "클로드코드",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "숫자보다 '어디서 깎이는지 패턴'을 보는 도구로 쓰는 게 맞음", author: "먼지민" }],
  },
  {
    title: "AI 답변 전 공식 문서 자동 참조",
    name: "context7",
    href: "https://github.com/upstash/context7",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778586767072939",
    area: "개발도구",
    difficulty: "설정좀필요",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "AI가 모르면서 자신만만하게 답하는 일이 줄어요", author: "먼지민" }],
  },
  {
    title: "질문-대답으로 OS 규칙 설계 브레인스토밍",
    name: "superpowers",
    href: "https://github.com/obra/superpowers",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778493796854089",
    area: "클로드코드",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "'뭘 골라야 하지'가 아니라 '어떤 게 나한테 맞지'에 집중 가능", author: "Galia" }],
  },
  {
    title: "Chat → HTML 캐러셀 자동 생성 + PNG 내보내기",
    name: "open-carrusel",
    href: "https://github.com/Hainrixz/open-carrusel",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778596329241979",
    area: "콘텐츠·마케팅",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "스킬을 '있는 그대로 쓰는 것'과 '공유받은 노하우로 응용하는 것'의 차이가 진짜 크다는 걸 체감함. 역시 냅다 하기!!", author: "민트" }],
    flow: "skillers-finder 추천 → 민트가 써봄",
  },
  {
    title: "블로그 풀사이클 — 초안부터 SEO까지",
    name: "claude-blog",
    href: "https://github.com/AgriciDaniel/claude-blog",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595654200289",
    area: "콘텐츠·마케팅",
    difficulty: "설정좀필요",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "SEO는 잘 모르는데 알아서 진단해주는게 매우 편함!", author: "연수" }],
  },
  {
    title: "현재 컨텍스트·브랜치·모델 항상 표시",
    name: "claude-hud",
    href: "https://github.com/nullx/claude-hud",
    slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778467459173629",
    area: "클로드코드",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "시각화된 컨텍스트 바·git 브랜치·모델명이 항상 보이는 게 의외로 큰 안정감", author: "먼지민" }],
  },
  { title: "브라우저 UI 실시간 검사 · 코드 변환", name: "UI-Inspector MCP", bodySlug: "UI-Inspector-MCP", href: "https://github.com/beyondworks/UI-Inspector", area: "개발도구", difficulty: "설정좀필요", kind: "공유" },
  { title: "한 줄이면 맥킨지 스타일 PPT 완성", name: "mckinsey-pptx", href: "https://github.com/seulee26/mckinsey-pptx", area: "생산성", difficulty: "설치만하면됨", kind: "공유" },
  { title: "SEO 및 광고 채널 통합 자동화", name: "toprank", href: "https://github.com/nowork-studio/toprank", slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778126542472039", area: "콘텐츠·마케팅", difficulty: "설정좀필요", kind: "공유" },
  { title: "코딩 몰라도 Claude Code 입문 한국어 가이드", name: "CC101", href: "https://cc101.axwith.com/ko", area: "클로드코드", difficulty: "설치만하면됨", kind: "공유" },
  { title: "Supabase AI 에이전트용 공식 스킬 모음", name: "Supabase agent-skills", bodySlug: "supabase-agent-skills", href: "https://github.com/supabase/agent-skills", slackUrl: "https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778393191102419", area: "개발도구", difficulty: "설정좀필요", kind: "공유" },
];

const AREAS: SkillArea[] = ["클로드코드", "콘텐츠·마케팅", "개발도구", "생산성"];

type Tier = "hot" | "mid" | "base";
type TagKind = "field" | "diff" | "post";

const TAG_CLASS: Record<TagKind, string> = {
  field: "border-[#C9DCF7] bg-[#EAF2FF] text-[#1F5BB8]",
  diff: "border-[#BFE0C8] bg-[#E8F5EC] text-[#1F7A3A]",
  post: "border-[#F1C9C9] bg-[#FBEBEB] text-[#B0322A]",
};

function tierOf(used: number): Tier {
  if (used >= 5) return "hot";
  if (used >= 2) return "mid";
  return "base";
}

function chipClass(active: boolean) {
  return [
    "text-[12.5px] px-3 py-1.5 rounded-full border tracking-[-0.01em] transition-all font-normal",
    active
      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
      : "bg-transparent border-[#ECE7DC] text-[#4D4D4D] hover:border-[#DDD6C5] hover:text-[#1A1A1A]",
  ].join(" ");
}

function matchesQuery(item: SkillItem, query: string) {
  if (!query.trim()) return true;
  const haystack = [
    item.title,
    item.name,
    item.area,
    item.difficulty,
    item.kind,
    item.flow ?? "",
    ...(item.quotes ?? []).flatMap((quote) => [quote.text, quote.author]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function Tag({ kind, children }: { kind: TagKind; children: string }) {
  return (
    <span
      className={`text-[11.5px] px-[9px] py-[3px] rounded-md whitespace-nowrap tracking-[-0.005em] border ${TAG_CLASS[kind]}`}
    >
      {children}
    </span>
  );
}

function Pop({ users, tier }: { users: number; tier: Tier }) {
  const tone =
    tier === "hot"
      ? "bg-[#F5A623] border-[#F5A623] text-white shadow-[0_4px_14px_-8px_rgba(245,166,35,0.6)]"
      : tier === "mid"
        ? "bg-[#FFFBEF] border-[#ECDFC0] text-[#4D4D4D]"
        : "bg-white border-[#ECE7DC] text-[#4D4D4D]";
  const flameTone =
    tier === "hot" ? "" : tier === "mid" ? "opacity-90" : "opacity-55 saturate-[0.4]";
  return (
    <div
      className={`shrink-0 flex flex-col items-center gap-0.5 rounded-[10px] px-2.5 py-1.5 min-w-[62px] text-center border ${tone}`}
      aria-label={`${users}명 사용`}
    >
      <span className={`text-[14px] leading-none ${flameTone}`}>🔥</span>
      <span className="text-[13px] font-semibold tabular-nums">{users}</span>
      <span className={`text-[10px] tracking-[-0.01em] ${tier === "hot" ? "text-[#FFF4D6]" : "text-[#888888]"}`}>명이 써봄</span>
    </div>
  );
}

function PopFeatured({ users }: { users: number }) {
  return (
    <div
      className="shrink-0 flex flex-col items-center gap-0.5 rounded-xl px-3.5 py-3 min-w-[92px] text-center bg-[#F5A623] border border-[#F5A623] text-white shadow-[0_4px_14px_-8px_rgba(245,166,35,0.6)]"
      aria-label={`${users}명 사용`}
    >
      <span className="text-[22px] leading-none">🔥</span>
      <span className="text-[18px] font-semibold tabular-nums">{users}</span>
      <span className="text-[11px] tracking-[-0.01em] text-[#FFF4D6]">명이 써봄</span>
    </div>
  );
}

function Tags({ item }: { item: SkillItem }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      <Tag kind="field">{item.area}</Tag>
      <Tag kind="diff">{item.difficulty}</Tag>
      <Tag kind="post">{item.kind}</Tag>
    </div>
  );
}

function Chev({ open }: { open: boolean }) {
  return (
    <div
      className={`self-center w-[30px] h-[30px] flex items-center justify-center rounded-full shrink-0 transition-transform ${open ? "rotate-180 text-[#1A1A1A]" : "text-[#888888]"}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}

function Expanded({ item, tier }: { item: SkillItem; tier: Tier }) {
  const body = BODIES[item.bodySlug ?? item.name];
  return (
    <div className="mt-[18px]">
      <hr className={`border-0 border-t border-dashed mb-4 ${tier === "hot" ? "border-[#F0C870]" : "border-[#DDD6C5]"}`} />
      {body ? (
        <div className="mb-[18px]">
          <div className="text-[11px] text-[#8B7E66] uppercase tracking-[0.08em] font-semibold mb-2">주요 내용</div>
          <div className="text-[14px] leading-[1.65] tracking-[-0.01em] text-[#2A2A2A] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_p]:my-1 [&_strong]:font-semibold [&_strong]:text-[#1A1A1A] [&_code]:bg-[#FFF4D6] [&_code]:px-1 [&_code]:rounded [&_code]:text-[13px] [&_a]:text-[#D98E0E] [&_a]:underline">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>
      ) : null}
      {item.quotes?.length ? (
        <div className="flex flex-col gap-3.5 mb-[18px]">
          {item.quotes.slice(0, 3).map((quote, qi) => (
            <div className="flex gap-3" key={`${item.name}-${qi}`}>
              <div className={`text-[32px] leading-[0.7] mt-2 shrink-0 select-none text-[#F5A623] ${tier === "hot" ? "opacity-100" : "opacity-70"}`}>“</div>
              <div className="flex-1 min-w-0">
                <div className={`leading-[1.55] tracking-[-0.012em] text-[#1A1A1A] ${tier === "hot" ? "text-[16px]" : "text-[14.5px]"}`}>{quote.text}</div>
                <div className="text-[12px] text-[#888888] mt-1">— <b className="text-[#4D4D4D] font-semibold">{quote.author}</b></div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {item.flow ? (
        <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-[10px] mb-3.5 text-[13px] flex-wrap ${tier === "hot" ? "bg-white border border-[#F0C870]" : "bg-[#FFF9EE] border border-[#ECE7DC]"}`}>
          <span className="text-[10.5px] text-[#888888] tracking-[0.08em] mr-1">흐름</span>
          <span className="text-[#4D4D4D] font-medium">{item.flow}</span>
        </div>
      ) : null}
      <div className="flex gap-2 items-center pt-1 flex-wrap">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-2 rounded-[9px] bg-[#1A1A1A] text-white border border-[#1A1A1A] hover:bg-black no-underline transition-all"
        >
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8h12M9 3l5 5-5 5" />
          </svg>
          GitHub에서 보기
        </a>
        {item.slackUrl ? (
          <a
            href={item.slackUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-2 rounded-[9px] bg-transparent text-[#1A1A1A] border border-[#DDD6C5] hover:border-[#1A1A1A] hover:bg-[#FFFBEF] no-underline transition-all"
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h10M3 8h10M3 4h10" />
            </svg>
            슬랙 원본 보기
          </a>
        ) : null}
      </div>
    </div>
  );
}

function CardFeatured({ item, open, onToggle }: { item: SkillItem; open: boolean; onToggle: () => void }) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a,button")) return;
        onToggle();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className={`relative rounded-[22px] px-7 py-7 cursor-pointer transition-all bg-gradient-to-b from-[#FFF3D0] to-[#FFF8E1] border-[1.5px] hover:-translate-y-px hover:shadow-[0_4px_22px_-14px_rgba(80,60,20,0.18)] ${open ? "border-[#F5A623] shadow-[0_8px_32px_-18px_rgba(40,30,10,0.28)]" : "border-[#F0C870]"}`}
    >
      <div className="absolute top-0 left-[22px] -translate-y-1/2 bg-[#F5A623] text-white text-[11.5px] font-semibold px-3 py-[5px] rounded-full tracking-[-0.005em] shadow-[0_4px_12px_-4px_rgba(245,166,35,0.55)]">
        이번 주 가장 많이 써본 스킬
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-1"><span className="font-mono text-[11.5px] text-[#D98E0E]">{item.name}</span></div>
          <h2 className="text-[26px] font-bold leading-[1.35] tracking-[-0.022em] text-[#1A1A1A] m-0 mt-1 mb-4">{item.title}</h2>
          <Tags item={item} />
        </div>
        <PopFeatured users={item.usedBy ?? 0} />
        <Chev open={open} />
      </div>
      {open ? <Expanded item={item} tier="hot" /> : null}
    </article>
  );
}

function CardCompact({ item, open, onToggle }: { item: SkillItem; open: boolean; onToggle: () => void }) {
  const tier = tierOf(item.usedBy ?? 0);
  const bg =
    tier === "hot" ? "bg-gradient-to-b from-[#FFF3D0] to-[#FFF8E1]"
    : tier === "mid" ? "bg-[#FFFBEF]"
    : "bg-white";
  const border =
    tier === "hot"
      ? `border-[1.5px] ${open ? "border-[#F5A623]" : "border-[#F0C870]"}`
      : `border ${open ? "border-[#1A1A1A]" : tier === "mid" ? "border-[#ECDFC0]" : "border-[#ECE7DC]"}`;
  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a,button")) return;
        onToggle();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className={`relative rounded-[14px] px-[18px] py-4 cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_22px_-14px_rgba(80,60,20,0.18)] ${bg} ${border} ${open ? "shadow-[0_8px_32px_-18px_rgba(40,30,10,0.28)] md:col-span-2" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1"><span className={`font-mono text-[11.5px] ${tier === "hot" ? "text-[#D98E0E]" : "text-[#888888]"}`}>{item.name}</span></div>
          <h3 className="text-[17px] font-bold leading-[1.35] tracking-[-0.022em] text-[#1A1A1A] m-0 mb-3">{item.title}</h3>
          <Tags item={item} />
        </div>
        <Pop users={item.usedBy ?? 0} tier={tier} />
      </div>
      {open ? <Expanded item={item} tier={tier} /> : null}
    </article>
  );
}

function SectionHeader({ eyebrow, title, count }: { eyebrow?: string; title: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between mx-1 mb-3.5 pb-2.5 border-b border-[#ECE7DC]">
      <div className="flex flex-col gap-0.5">
        {eyebrow ? <div className="text-[11px] text-[#D98E0E] uppercase tracking-[0.08em] font-semibold">{eyebrow}</div> : null}
        <h2 className="text-[18px] tracking-[-0.018em] font-bold m-0 text-[#1A1A1A]">{title}</h2>
      </div>
      <div className="text-[12.5px] text-[#888888] tabular-nums">{count}</div>
    </div>
  );
}

function Grid({ items, openIds, onToggle }: { items: SkillItem[]; openIds: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
      {items.map((item) => (
        <CardCompact key={item.href} item={item} open={openIds.has(item.href)} onToggle={() => onToggle(item.href)} />
      ))}
    </div>
  );
}

export function SkillsClient() {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState<"전체" | SkillArea>("전체");

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(
    () =>
      SKILLS.filter((item) => {
        if (activeField !== "전체" && item.area !== activeField) return false;
        return matchesQuery(item, query);
      }),
    [activeField, query],
  );

  const featured = useMemo(
    () => [...filtered].sort((a, b) => (b.usedBy ?? 0) - (a.usedBy ?? 0)).find((s) => (s.usedBy ?? 0) >= 5) ?? null,
    [filtered],
  );

  const rest = useMemo(
    () => (featured ? filtered.filter((s) => s.href !== featured.href) : filtered),
    [filtered, featured],
  );

  const groups = useMemo(() => {
    const tiers = [
      { key: "hot", title: "많이 써본 스킬", eyebrow: "5명 이상", filter: (s: SkillItem) => (s.usedBy ?? 0) >= 5 },
      { key: "mid", title: "떠오르는 스킬", eyebrow: "2~4명 사용", filter: (s: SkillItem) => (s.usedBy ?? 0) >= 2 && (s.usedBy ?? 0) < 5 },
      { key: "base", title: "새로 들어온 스킬", eyebrow: "1명 사용", filter: (s: SkillItem) => (s.usedBy ?? 0) < 2 },
    ];
    return tiers.map((t) => ({ ...t, items: rest.filter(t.filter) })).filter((g) => g.items.length > 0);
  }, [rest]);

  const fieldCounts = useMemo(() => {
    const c: Record<string, number> = { 전체: SKILLS.length };
    AREAS.forEach((f) => {
      c[f] = SKILLS.filter((s) => s.area === f).length;
    });
    return c;
  }, []);

  const totalUsers = useMemo(() => {
    const ppl = new Set<string>();
    SKILLS.forEach((s) => s.quotes?.forEach((q) => ppl.add(q.author)));
    return ppl.size;
  }, []);

  return (
    <>
      <Header active="skills" breadcrumb="스킬 & 인사이트" />
      <div className="flex-1 bg-[#FFFDF7]">
        <div className="max-w-[1200px] mx-auto px-8 pt-10 pb-32">
          <section className="mb-7 max-w-[760px]">
            <h1 className="text-[clamp(32px,4vw,44px)] leading-[1.15] tracking-[-0.025em] font-bold m-0 mb-3.5 text-[#1A1A1A]">
              멤버들이 직접 써본{" "}
              <em className="not-italic px-1 bg-[linear-gradient(180deg,transparent_62%,#FFF3D0_62%)]">스킬</em>만 모았어요
            </h1>
            <p className="text-[17px] text-[#4D4D4D] max-w-[56ch] m-0 mb-5 tracking-[-0.01em]">
              실제 일에 적용해보고 후기까지 남긴 스킬을 큐레이션합니다. 궁금한 카드를 펼쳐서 누가 어떻게 썼는지 살펴보세요.
            </p>
            <div className="flex items-center gap-3.5 flex-wrap text-[13px] text-[#888888]">
              <span><b className="text-[#1A1A1A] font-semibold">{SKILLS.length}</b>개의 스킬</span>
              <span className="w-[3px] h-[3px] rounded-full bg-[#DDD6C5] inline-block" />
              <span><b className="text-[#1A1A1A] font-semibold">{totalUsers}</b>명의 멤버가 후기 작성</span>
              <span className="w-[3px] h-[3px] rounded-full bg-[#DDD6C5] inline-block" />
              <span>표시 중 <b className="text-[#1A1A1A] font-semibold">{filtered.length}</b>개</span>
            </div>
          </section>

          <div className="sticky top-14 z-40 -mx-8 mb-7 px-8 py-3.5 bg-[rgba(255,253,247,0.85)] backdrop-blur-[14px] backdrop-saturate-[160%] border-b border-[#ECE7DC] flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#ECE7DC] rounded-[10px] min-w-[260px] focus-within:border-[#1A1A1A] text-[#888888] focus-within:text-[#1A1A1A]">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="5" />
                <path d="M14 14l-3-3" />
              </svg>
              <input
                type="text"
                placeholder="스킬 이름이나 키워드로 검색"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="flex-1 border-0 outline-none bg-transparent text-[14px] text-[#1A1A1A] placeholder:text-[#888888] min-w-0"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="지우기"
                  className="appearance-none border-0 bg-transparent cursor-pointer text-[#888888] text-[12px] p-1 hover:text-[#1A1A1A]"
                >
                  ✕
                </button>
              ) : null}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button type="button" onClick={() => setActiveField("전체")} className={chipClass(activeField === "전체")}>
                전체 {fieldCounts["전체"]}
              </button>
              {AREAS.map((f) => (
                <button key={f} type="button" onClick={() => setActiveField(f)} className={chipClass(activeField === f)}>
                  {f} {fieldCounts[f]}
                </button>
              ))}
            </div>
          </div>

          {featured ? (
            <section className="mb-9 pt-2">
              <CardFeatured item={featured} open={openIds.has(featured.href)} onToggle={() => toggleOpen(featured.href)} />
            </section>
          ) : null}

          <main className="flex flex-col gap-10">
            {groups.map((g) => (
              <section key={g.key}>
                <SectionHeader eyebrow={g.eyebrow} title={g.title} count={g.items.length} />
                <Grid items={g.items} openIds={openIds} onToggle={toggleOpen} />
              </section>
            ))}
            {filtered.length === 0 ? (
              <div className="text-center py-14 px-5 text-[#888888] text-sm border border-dashed border-[#ECE7DC] rounded-[14px]">
                검색 결과가 없어요. 다른 키워드를 시도해 보세요.
              </div>
            ) : null}
          </main>

          <div className="mt-14 flex gap-[18px] flex-wrap text-xs text-[#888888] pt-5 border-t border-[#ECE7DC]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-[4px] border border-[#F5A623] bg-[#F5A623]" />
              5명 이상 — 커뮤니티 추천
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-[4px] border border-[#ECDFC0] bg-[#FFFBEF]" />
              2~4명 사용
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-[4px] border border-[#ECE7DC] bg-white" />
              1명 사용
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
