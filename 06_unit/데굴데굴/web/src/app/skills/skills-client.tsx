"use client";

import { useMemo, useState } from "react";
import { Header } from "../missions/_components/Header";

type SkillKind = "써본후기" | "공유";
type SkillArea = "클로드코드" | "콘텐츠·마케팅" | "개발도구" | "생산성";
type SkillDifficulty = "설치만하면됨" | "설정좀필요" | "코드만져야함";

type SkillItem = {
  title: string;
  name: string;
  href: string;
  area: SkillArea;
  difficulty: SkillDifficulty;
  kind: SkillKind;
  usedBy?: number;
  quotes?: { text: string; author: string }[];
  flow?: string;
};

const SKILLS: SkillItem[] = [
  {
    title: "내 상황에 맞는 스킬 자동 추천 + 설치",
    name: "skillers-finder",
    href: "https://github.com/emily-mkt/skillers-finder",
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
    href: "https://github.com/charlie947/social-media-skills",
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
    area: "클로드코드",
    difficulty: "설치만하면됨",
    kind: "써본후기",
    usedBy: 1,
    quotes: [{ text: "시각화된 컨텍스트 바·git 브랜치·모델명이 항상 보이는 게 의외로 큰 안정감", author: "먼지민" }],
  },
  { title: "브라우저 UI 실시간 검사 · 코드 변환", name: "UI-Inspector MCP", href: "https://github.com/beyondworks/UI-Inspector", area: "개발도구", difficulty: "설정좀필요", kind: "공유" },
  { title: "한 줄이면 맥킨지 스타일 PPT 완성", name: "mckinsey-pptx", href: "https://github.com/seulee26/mckinsey-pptx", area: "생산성", difficulty: "설치만하면됨", kind: "공유" },
  { title: "SEO 및 광고 채널 통합 자동화", name: "toprank", href: "https://github.com/nowork-studio/toprank", area: "콘텐츠·마케팅", difficulty: "설정좀필요", kind: "공유" },
  { title: "코딩 몰라도 Claude Code 입문 한국어 가이드", name: "CC101", href: "https://cc101.axwith.com/ko", area: "클로드코드", difficulty: "설치만하면됨", kind: "공유" },
  { title: "Supabase AI 에이전트용 공식 스킬 모음", name: "Supabase agent-skills", href: "https://github.com/supabase/agent-skills", area: "개발도구", difficulty: "설정좀필요", kind: "공유" },
];

const AREAS: ("전체" | SkillArea)[] = ["전체", "클로드코드", "콘텐츠·마케팅", "개발도구", "생산성"];
const DIFFICULTIES: ("전체" | SkillDifficulty)[] = ["전체", "설치만하면됨", "설정좀필요", "코드만져야함"];
const KINDS: ("전체" | SkillKind)[] = ["전체", "써본후기", "공유"];

const TAG_STYLES: Record<SkillArea | SkillDifficulty | SkillKind, { background: string; color: string }> = {
  클로드코드: { background: "#E8F0F9", color: "#0F4A85" },
  "콘텐츠·마케팅": { background: "#FFF1D6", color: "#8A5A00" },
  개발도구: { background: "#F0F3F5", color: "#40505C" },
  생산성: { background: "#F1EDF8", color: "#5A3B84" },
  설치만하면됨: { background: "#E8F3EC", color: "#0D5A3A" },
  설정좀필요: { background: "#FFF1D6", color: "#8A5A00" },
  코드만져야함: { background: "#FDECEC", color: "#9A2E2E" },
  써본후기: { background: "#EEEDFE", color: "#3C3489" },
  공유: { background: "#EAF3F8", color: "#24566A" },
};

function filterButtonClass(active: boolean) {
  return [
    "text-xs px-3 py-1.5 rounded-full border tracking-[-0.01em] transition-all",
    active
      ? "font-medium bg-[#E8F0F9] border-[#0F4A85] text-[#0F4A85]"
      : "font-normal bg-white border-[#E0DED6] text-[#73726c] hover:border-[#c8c5b8]",
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

function Tag({ children }: { children: SkillArea | SkillDifficulty | SkillKind }) {
  return (
    <span
      className="text-[11px] px-2.5 py-[3px] rounded-full whitespace-nowrap font-medium tracking-[-0.01em]"
      style={TAG_STYLES[children]}
    >
      {children}
    </span>
  );
}

function SkillCard({ item, index }: { item: SkillItem; index: number }) {
  return (
    <article
      id={`skill_${String(index + 1).padStart(2, "0")}_${item.name.split(" ")[0]}`}
      className="border border-[#ECEAE2] rounded-xl bg-white transition-all flex flex-col h-full hover:border-[#c8c5b8] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
        <div className="p-[18px] flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-2">
            <span className="text-sm font-semibold text-[#15161A] tracking-[-0.01em] leading-snug flex-1">
              {item.title}
            </span>
            {item.usedBy ? (
              <span
                className="text-[11px] px-2.5 py-[3px] rounded-full whitespace-nowrap font-medium shrink-0"
                style={TAG_STYLES.써본후기}
              >
                🔥 {item.usedBy}명이 써봄
              </span>
            ) : null}
          </div>
          <p className="text-[13px] text-[#73726c] leading-relaxed m-0 tracking-[-0.01em]">{item.name}</p>
        </div>

        {item.quotes?.length ? (
          <div className="px-[18px] pb-[14px] flex flex-col gap-2.5 border-t border-[#F4F3F0] pt-[14px]">
            <p className="text-[11px] text-[#A8A6A0] tracking-wider m-0">💬 써본 사람들이 발견한 것</p>
            {item.quotes.slice(0, 3).map((quote) => (
              <div className="flex items-start gap-2" key={`${item.name}-${quote.author}`}>
                <span className="text-[#C8C5BC] text-lg leading-none -mt-0.5 shrink-0">“</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#4A4946] leading-relaxed m-0 tracking-[-0.01em]">{quote.text}</p>
                  <p className="text-[11px] text-[#A8A6A0] m-0 mt-0.5 tracking-[-0.01em]">— {quote.author}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-auto px-[18px] pb-[14px] pt-[12px] border-t border-[#F4F3F0] flex flex-col gap-2">
          <div className="flex gap-1.5 flex-wrap">
            <Tag>{item.area}</Tag>
            <Tag>{item.difficulty}</Tag>
            <Tag>{item.kind}</Tag>
          </div>
          {item.flow ? (
            <div className="text-[11px] text-[#4D43B8] flex items-center gap-1.5 tracking-[-0.01em]">
              <span>↻</span> {item.flow}
            </div>
          ) : null}
        </div>
      </a>
    </article>
  );
}

export function SkillsClient() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<(typeof AREAS)[number]>("전체");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("전체");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("전체");

  const filtered = useMemo(
    () =>
      SKILLS.filter((item) => {
        if (area !== "전체" && item.area !== area) return false;
        if (difficulty !== "전체" && item.difficulty !== difficulty) return false;
        if (kind !== "전체" && item.kind !== kind) return false;
        return matchesQuery(item, query);
      }),
    [area, difficulty, kind, query],
  );

  const reviews = SKILLS.filter((item) => item.kind === "써본후기").length;
  const shares = SKILLS.filter((item) => item.kind === "공유").length;

  return (
    <>
      <Header active="skills" breadcrumb="스킬 & 인사이트" />
      <main className="max-w-6xl mx-auto px-5 py-6 flex-1 w-full">
        <div className="space-y-5">
          <section className="pt-2 pb-1">
            <div className="text-[11px] text-[#A8A6A0] tracking-wider mb-2">스폰지클럽 1기 · 데굴데굴 큐레이션</div>
            <h1 className="text-[28px] font-semibold m-0 text-[#15161A] tracking-[-0.02em]">스킬 &amp; 인사이트</h1>
            <p className="text-sm text-[#73726c] mt-2.5 leading-relaxed tracking-[-0.01em]">
              스폰지들이 직접 써본 스킬과 가이드. <strong className="text-[#15161A] font-semibold">“누가 발견 → 누가 써봄”</strong> 흐름까지 같이 봐요.
            </p>
            <div className="flex gap-3 mt-4 text-xs text-[#73726c] flex-wrap items-center">
              <span><strong className="text-[#15161A] font-semibold">{SKILLS.length}개</strong> 스킬</span>
              <span className="text-[#DAD8CF]">·</span>
              <span>써본후기 <strong className="text-[#15161A] font-semibold">{reviews}건</strong></span>
              <span className="text-[#DAD8CF]">·</span>
              <span>공유 <strong className="text-[#15161A] font-semibold">{shares}건</strong></span>
              <span className="text-[#DAD8CF]">·</span>
              <span>표시 중 <strong className="text-[#15161A] font-semibold">{filtered.length}</strong>개</span>
            </div>
          </section>

          <section className="bg-white border border-[#ECEAE2] rounded-xl p-4 space-y-3">
            <div className="flex gap-2.5 flex-wrap items-center">
              <span className="text-[11px] text-[#A8A6A0] min-w-[36px] tracking-wider">검색</span>
              <div className="relative flex-1 min-w-0">
                <input
                  type="search"
                  placeholder="스킬명·요약·키워드·후기·사람으로 찾기"
                  autoComplete="off"
                  aria-label="스킬 검색"
                  className="w-full h-8 pl-3 pr-9 text-[13px] tracking-[-0.005em] rounded-full border border-[#E0DED6] bg-white text-[#15161A] placeholder:text-[#A8A6A0] focus:outline-none focus:border-[#0F4A85] focus:ring-3 focus:ring-[#0F4A85]/10 transition-colors appearance-none [&::-webkit-search-cancel-button]:hidden"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2.5 flex-wrap items-center">
              <span className="text-[11px] text-[#A8A6A0] min-w-[36px] tracking-wider">분야</span>
              {AREAS.map((value) => (
                <button key={value} type="button" className={filterButtonClass(area === value)} onClick={() => setArea(value)}>{value}</button>
              ))}
            </div>
            <div className="flex gap-2.5 flex-wrap items-center">
              <span className="text-[11px] text-[#A8A6A0] min-w-[36px] tracking-wider">난이도</span>
              {DIFFICULTIES.map((value) => (
                <button key={value} type="button" className={filterButtonClass(difficulty === value)} onClick={() => setDifficulty(value)}>{value}</button>
              ))}
            </div>
            <div className="flex gap-2.5 flex-wrap items-center">
              <span className="text-[11px] text-[#A8A6A0] min-w-[36px] tracking-wider">게시</span>
              {KINDS.map((value) => (
                <button key={value} type="button" className={filterButtonClass(kind === value)} onClick={() => setKind(value)}>{value}</button>
              ))}
            </div>
          </section>

          {filtered.length ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {filtered.map((item, index) => <SkillCard key={item.href} item={item} index={index} />)}
            </div>
          ) : (
            <section className="rounded-xl border border-dashed border-[#DAD8CF] p-8 text-center text-sm text-[#73726c]">
              조건에 맞는 스킬이 없습니다.
            </section>
          )}
        </div>
      </main>
    </>
  );
}
