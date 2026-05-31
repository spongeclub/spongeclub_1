"use client";

import { useRef, useState } from "react";

// ============ 데이터 ============
type Quote = {
  text: string;
  author: string;
};

type Skill = {
  id: number;
  name: string;
  title: string;
  cat: "cc" | "cm" | "dev" | "prod";
  diff: "easy" | "mid" | "hard";
  type: "skill" | "guide";
  post: "review" | "share";
  reviews: number;
  authors: string[];
  flow: string | null;
  aud: string[];
  links: string;
  quotes: Quote[];
};

const skills: Skill[] = [
  {
    id: 1,
    name: "skillers-finder",
    title: "내 상황에 맞는 스킬 자동 추천 + 설치",
    cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 8,
    authors: ["키노","마라","설록","하늘","애니","슬로우퀵","민트","달빛그린"],
    flow: "에밀리 공유회 → 8명이 써봄",
    aud: ["코딩초보","마케터"],
    links: "github.com/emily-mkt/skillers-finder",
    quotes: [
      { text: "뭘 깔아야 할지 몰랐는데 검색부터 설치까지 5분 컷", author: "달빛그린" },
      { text: "기획만 잘하면 스킬을 알아서 찾아주는구나", author: "하늘" },
      { text: "평소 디자인 쪽으로만 생각하다가 시야가 넓어지는 효과", author: "키노" },
    ],
  },
  {
    id: 2,
    name: "claude-mem",
    title: "세션 간 영속 메모리 플러그인",
    cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 2,
    authors: ["그린","먼지민"],
    flow: "먼지민이 발견 → 그린이 써봄",
    aud: ["코딩초보","일반"],
    links: "github.com/thedotmack/claude-mem",
    quotes: [
      { text: "메모리 불러와서 일목요연하게 정리해줌. 심지어 이어서 어떤 걸 하길 원하는지 연결해줌", author: "그린" },
      { text: "프로젝트 작업할 때 바로 다 못 끝내니까 시작 전 사용하기 좋네요", author: "리보" },
    ],
  },
  {
    id: 3,
    name: "obsidian-cardnews-skill",
    title: "md → 인스타 카드뉴스 자동 변환",
    cat: "cm", diff: "easy", type: "skill", post: "review", reviews: 1,
    authors: ["연수"],
    flow: "오웬 스킬 → 연수가 써봄",
    aud: ["마케터"],
    links: "github.com/owenleekr/obsidian-cardnews-skill",
    quotes: [
      { text: "과제 내용을 보고 알아서 카피를 만들어 카드뉴스까지 만들어주는 게 신기했는데, 내가 SNS에 말하고 싶은 부분만 써주지는 않아서 몇 번 수정 요청함", author: "연수" },
      { text: "다음과제는 냅다 저 오웬스킬 사용해서 후기남겨야겠어요", author: "리보" },
    ],
  },
  {
    id: 4,
    name: "social-media-skills + remotion-ads",
    title: "훅 카피 → 캐릭터 애니메이션 MP4 파이프라인",
    cat: "cm", diff: "hard", type: "skill", post: "review", reviews: 1,
    authors: ["슬로우퀵"],
    flow: "에밀리 공유회 → 슬로우퀵이 파이프라인 구축",
    aud: ["마케터","디자이너"],
    links: "github.com/charlie947/social-media-skills",
    quotes: [
      { text: "'스킬이 움직이게 하고, 에이전트가 그 스킬을 불러온다'는 말이 정확히 무슨 뜻인지 이번에 처음으로 체감했습니다", author: "슬로우퀵" },
    ],
  },
  {
    id: 5,
    name: "claude-design-skill",
    title: "Claude Code를 디자인 전문가로 바꿔주는 스킬",
    cat: "cm", diff: "easy", type: "skill", post: "review", reviews: 1,
    authors: ["슬로우퀵"],
    flow: "skillers-finder 추천 → 슬로우퀵이 적용",
    aud: ["디자이너","코딩초보"],
    links: "github.com/jiji262/claude-design-skill",
    quotes: [
      { text: "혼자 만든 결과물이 왠지 촌스럽고 뭔가 비어있는 느낌을 지울 수 없었다. [...] 전체적인 디자인이 확실히 정돈되는 느낌을 받았다", author: "슬로우퀵" },
    ],
  },
  {
    id: 6,
    name: "claude-md-management",
    title: "CLAUDE.md 6개 기준 자동 감사 (공식)",
    cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 1,
    authors: ["먼지민"],
    flow: null,
    aud: ["일반"],
    links: "github.com/anthropics/claude-plugins-official",
    quotes: [
      { text: "숫자보다 '어디서 깎이는지 패턴'을 보는 도구로 쓰는 게 맞음", author: "먼지민" },
    ],
  },
  {
    id: 7,
    name: "context7",
    title: "AI 답변 전 공식 문서 자동 참조",
    cat: "dev", diff: "mid", type: "skill", post: "review", reviews: 1,
    authors: ["먼지민"],
    flow: null,
    aud: ["개발자","코딩초보"],
    links: "github.com/upstash/context7",
    quotes: [
      { text: "AI가 모르면서 자신만만하게 답하는 일이 줄어요", author: "먼지민" },
    ],
  },
  {
    id: 8,
    name: "superpowers",
    title: "질문-대답으로 OS 규칙 설계 브레인스토밍",
    cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 1,
    authors: ["Galia"],
    flow: null,
    aud: ["일반"],
    links: "github.com/obra/superpowers",
    quotes: [
      { text: "'뭘 골라야 하지'가 아니라 '어떤 게 나한테 맞지'에 집중 가능", author: "Galia" },
    ],
  },
  {
    id: 9,
    name: "open-carrusel",
    title: "Chat → HTML 캐러셀 자동 생성 + PNG 내보내기",
    cat: "cm", diff: "easy", type: "skill", post: "review", reviews: 1,
    authors: ["민트"],
    flow: "skillers-finder 추천 → 민트가 써봄",
    aud: ["마케터","디자이너"],
    links: "github.com/Hainrixz/open-carrusel",
    quotes: [
      { text: "스킬을 '있는 그대로 쓰는 것'과 '공유받은 노하우로 응용하는 것'의 차이가 진짜 크다는 걸 체감함. 역시 냅다 하기!!", author: "민트" },
    ],
  },
  {
    id: 10,
    name: "claude-blog",
    title: "블로그 풀사이클 — 초안부터 SEO까지",
    cat: "cm", diff: "mid", type: "skill", post: "review", reviews: 1,
    authors: ["연수"],
    flow: null,
    aud: ["마케터"],
    links: "github.com/AgriciDaniel/claude-blog",
    quotes: [
      { text: "SEO는 잘 모르는데 알아서 진단해주는게 매우 편함!", author: "연수" },
    ],
  },
  {
    id: 11,
    name: "claude-hud",
    title: "현재 컨텍스트·브랜치·모델 항상 표시",
    cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 1,
    authors: ["먼지민"],
    flow: null,
    aud: ["일반","코딩초보"],
    links: "github.com/nullx/claude-hud",
    quotes: [
      { text: "시각화된 컨텍스트 바·git 브랜치·모델명이 항상 보이는 게 의외로 큰 안정감", author: "먼지민" },
    ],
  },
  {
    id: 12,
    name: "UI-Inspector MCP",
    title: "브라우저 UI 실시간 검사 · 코드 변환",
    cat: "dev", diff: "mid", type: "skill", post: "share", reviews: 0,
    authors: [], flow: null, aud: ["개발자","디자이너"],
    links: "github.com/beyondworks/UI-Inspector",
    quotes: [],
  },
  {
    id: 13,
    name: "mckinsey-pptx",
    title: "한 줄이면 맥킨지 스타일 PPT 완성",
    cat: "prod", diff: "easy", type: "skill", post: "share", reviews: 0,
    authors: [], flow: null, aud: ["일반"],
    links: "github.com/seulee26/mckinsey-pptx",
    quotes: [],
  },
  {
    id: 14,
    name: "toprank",
    title: "SEO 및 광고 채널 통합 자동화",
    cat: "cm", diff: "mid", type: "skill", post: "share", reviews: 0,
    authors: [], flow: null, aud: ["마케터"],
    links: "github.com/nowork-studio/toprank",
    quotes: [],
  },
  {
    id: 15,
    name: "CC101",
    title: "코딩 몰라도 Claude Code 입문 한국어 가이드",
    cat: "cc", diff: "easy", type: "guide", post: "share", reviews: 0,
    authors: [], flow: null, aud: ["코딩초보","일반"],
    links: "cc101.axwith.com/ko",
    quotes: [],
  },
  {
    id: 16,
    name: "Supabase agent-skills",
    title: "Supabase AI 에이전트용 공식 스킬 모음",
    cat: "dev", diff: "mid", type: "skill", post: "share", reviews: 0,
    authors: [], flow: null, aud: ["개발자"],
    links: "github.com/supabase/agent-skills",
    quotes: [],
  },
];

const catMap = { all: "전체", cc: "클로드코드", cm: "콘텐츠·마케팅", dev: "개발도구", prod: "생산성" } as const;
const diffMap = { easy: "설치만하면됨", mid: "설정좀필요", hard: "코드만져야함" } as const;
const diffColor = {
  easy: { bg: "#E8F3EC", text: "#0D5A3A" },
  mid:  { bg: "#FBF1DE", text: "#6B4410" },
  hard: { bg: "#FBEAEA", text: "#7B2424" },
} as const;
const catColor = {
  cc:   { bg: "#E8F0F9", text: "#0F4A85" },
  cm:   { bg: "#F8ECF1", text: "#7A2A45" },
  dev:  { bg: "#E8F3EC", text: "#0D5A3A" },
  prod: { bg: "#FBF1DE", text: "#6B4410" },
} as const;

type CatKey = keyof typeof catMap;
type DiffKey = keyof typeof diffMap;

// ============ 공통 칩 ============
function Pill({ bg, text, children }: { bg: string; text: string; children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] px-2.5 py-[3px] rounded-full whitespace-nowrap font-medium tracking-[-0.01em]"
      style={{ background: bg, color: text }}
    >
      {children}
    </span>
  );
}

// ============ 페이지 헤더 ============
function PageHeader({ total, shown }: { total: number; shown: number }) {
  return (
    <div className="pt-2 pb-1">
      <div className="text-[11px] text-ink-300 tracking-wider mb-2">
        스폰지클럽 1기 · 이기적인 스킬러들 유닛
      </div>
      <h1 className="text-[28px] font-semibold m-0 text-ink-900 tracking-[-0.02em]">
        스킬 &amp; 인사이트
      </h1>
      <p className="text-sm text-ink-500 mt-2.5 leading-relaxed tracking-[-0.01em]">
        스폰지들이 직접 써본 스킬과 가이드. <strong className="text-ink-900 font-semibold">&quot;누가 발견 → 누가 써봄&quot;</strong> 흐름까지 같이 봐요.
      </p>
      <div className="flex gap-4 mt-4 text-xs text-ink-500 flex-wrap items-center">
        <span><strong className="text-ink-900 font-semibold">{total}개</strong> 스킬</span>
        <span className="text-ink-100">·</span>
        <span><strong className="text-ink-900 font-semibold">{shown}개</strong> 표시 중</span>
        <span className="text-ink-100">·</span>
        <span>
          Slack <code className="bg-[#F1EFE8] px-1.5 py-0.5 rounded text-[11px]">#이기적인-스킬러들</code> 자동 수집
        </span>
      </div>
    </div>
  );
}

// ============ 필터 ============
type FiltersProps = {
  cat: CatKey;
  setCat: (v: CatKey) => void;
  diff: DiffKey | null;
  setDiff: (v: DiffKey | null) => void;
  postF: "review" | "share" | null;
  setPostF: (v: "review" | "share" | null) => void;
};

function Filters({ cat, setCat, diff, setDiff, postF, setPostF }: FiltersProps) {
  const catBtn = (val: CatKey) => {
    const active = cat === val;
    const palette = val === "all" ? { bg: "#E8F0F9", text: "#0F4A85" } : catColor[val];
    return {
      className: `text-xs px-3 py-1.5 rounded-full border transition-all tracking-[-0.01em] ${active ? "font-medium" : "font-normal hover:border-[#c8c5b8]"}`,
      style: {
        borderColor: active ? palette.text : "#E0DED6",
        background: active ? palette.bg : "white",
        color: active ? palette.text : "#73726c",
      },
    };
  };

  const diffBtn = (val: DiffKey) => {
    const active = diff === val;
    const palette = diffColor[val];
    return {
      className: `text-xs px-3 py-1.5 rounded-full border transition-all tracking-[-0.01em] ${active ? "font-medium" : "font-normal hover:border-[#c8c5b8]"}`,
      style: {
        borderColor: active ? palette.text : "#E0DED6",
        background: active ? palette.bg : "white",
        color: active ? palette.text : "#73726c",
      },
    };
  };

  const filterChip = (active: boolean) => ({
    className: `text-xs px-3 py-1.5 rounded-full border transition-all tracking-[-0.01em] ${active ? "font-medium" : "font-normal hover:border-[#c8c5b8]"}`,
    style: {
      borderColor: active ? "#4D43B8" : "#E0DED6",
      background: active ? "#EEEDFE" : "white",
      color: active ? "#3C3489" : "#73726c",
    },
  });

  return (
    <div className="bg-white border border-[#ECEAE2] rounded-xl p-4 space-y-3">
      <div className="flex gap-2.5 flex-wrap items-center">
        <span className="text-[11px] text-ink-300 min-w-[36px] tracking-wider">분야</span>
        {(Object.keys(catMap) as CatKey[]).map((k) => {
          const b = catBtn(k);
          return (
            <button key={k} onClick={() => setCat(k)} className={b.className} style={b.style}>
              {catMap[k]}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2.5 flex-wrap items-center">
        <span className="text-[11px] text-ink-300 min-w-[36px] tracking-wider">난이도</span>
        {(Object.keys(diffMap) as DiffKey[]).map((k) => {
          const b = diffBtn(k);
          return (
            <button
              key={k}
              onClick={() => setDiff(diff === k ? null : k)}
              className={b.className}
              style={b.style}
            >
              {diffMap[k]}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2.5 flex-wrap items-center">
        <span className="text-[11px] text-ink-300 min-w-[36px] tracking-wider">게시</span>
        {(["review", "share"] as const).map((v) => {
          const label = v === "review" ? "써본후기" : "공유";
          const b = filterChip(postF === v);
          return (
            <button key={v} onClick={() => setPostF(postF === v ? null : v)} className={b.className} style={b.style}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ 스킬 카드 ============
function SkillCard({ s, onClick }: { s: Skill; onClick: () => void }) {
  const hasQuotes = s.quotes.length > 0;

  return (
    <div
      onClick={onClick}
      className="border border-[#ECEAE2] rounded-xl bg-white cursor-pointer transition-all flex flex-col h-full hover:border-[#c8c5b8] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
    >
      {/* 상단: 이름 + 후기 수 + 설명 */}
      <div className="p-[18px] flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <span className="text-sm font-semibold text-ink-900 tracking-[-0.01em] leading-snug">
            {s.title}
          </span>
          {s.reviews > 0 && (
            <span className="text-[11px] bg-[#EEEDFE] text-[#3C3489] px-2.5 py-[3px] rounded-full whitespace-nowrap font-medium shrink-0">
              🔥 {s.reviews}명이 써봄
            </span>
          )}
        </div>
        <p className="text-[13px] text-ink-500 leading-relaxed m-0 tracking-[-0.01em]">
          {s.name}
        </p>
      </div>

      {/* 중단: 인용 */}
      {hasQuotes && (
        <div className="px-[18px] pb-[14px] flex flex-col gap-2.5 border-t border-[#F4F3F0] pt-[14px]">
          <p className="text-[11px] text-ink-300 tracking-wider m-0">💬 써본 사람들이 발견한 것</p>
          {s.quotes.map((q, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#C8C5BC] text-lg leading-none mt-[-2px] shrink-0">&ldquo;</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-ink-700 leading-relaxed m-0 tracking-[-0.01em]">
                  {q.text}
                </p>
                <p className="text-[11px] text-ink-300 m-0 mt-0.5 tracking-[-0.01em]">— {q.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 하단: 태그 + 순환 흐름 */}
      <div className="px-[18px] pb-[14px] pt-[12px] border-t border-[#F4F3F0] flex flex-col gap-2">
        <div className="flex gap-1.5 flex-wrap">
          <Pill bg={catColor[s.cat].bg} text={catColor[s.cat].text}>{catMap[s.cat]}</Pill>
          <Pill bg={diffColor[s.diff].bg} text={diffColor[s.diff].text}>{diffMap[s.diff]}</Pill>
          {s.type === "guide" && <Pill bg="#E8F0F9" text="#0F4A85">가이드</Pill>}
          {s.post === "review" && <Pill bg="#EEEDFE" text="#3C3489">써본후기</Pill>}
        </div>
        {s.flow && (
          <div className="text-[11px] text-[#4D43B8] flex items-center gap-1.5 tracking-[-0.01em]">
            <span>↻</span> {s.flow}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ 상세 패널 ============
function DetailPanel({ s, onClose }: { s: Skill; onClose: () => void }) {
  return (
    <div className="border border-[#4D43B8] rounded-xl p-6 bg-white shadow-[0_4px_16px_rgba(77,67,184,0.08)]">
      <div className="flex justify-between items-start mb-3.5 gap-3">
        <div>
          <h3 className="text-lg font-semibold m-0 mb-1.5 text-ink-900 tracking-[-0.02em]">
            {s.title}
          </h3>
          <p className="text-sm text-ink-500 m-0 tracking-[-0.01em]">{s.name}</p>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-0 text-lg cursor-pointer text-ink-300 p-1 leading-none hover:text-ink-700"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        <Pill bg={catColor[s.cat].bg} text={catColor[s.cat].text}>{catMap[s.cat]}</Pill>
        <Pill bg={diffColor[s.diff].bg} text={diffColor[s.diff].text}>{diffMap[s.diff]}</Pill>
        {s.aud.map((a) => (
          <Pill key={a} bg="#F1EFE8" text="#5F5E5A">{a}</Pill>
        ))}
      </div>
      {s.flow && (
        <div className="bg-[#F4F3FD] rounded-[10px] px-4 py-3 mb-4 text-[13px] text-[#3C3489] tracking-[-0.01em]">
          <span className="font-semibold">↻ 순환 흐름</span> · {s.flow}
        </div>
      )}
      {s.quotes.length > 0 && (
        <div className="mb-4 bg-[#FAFAF8] rounded-xl p-4 flex flex-col gap-3">
          <p className="text-[11px] text-ink-300 tracking-wider m-0">💬 써본 사람들이 발견한 것</p>
          {s.quotes.map((q, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#C8C5BC] text-lg leading-none mt-[-2px] shrink-0">&ldquo;</span>
              <div>
                <p className="text-[13px] text-ink-700 leading-relaxed m-0 tracking-[-0.01em]">{q.text}</p>
                <p className="text-[11px] text-ink-400 m-0 mt-0.5">— {q.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {s.reviews > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium m-0 mb-2 text-ink-500 tracking-wider">써본 사람들</p>
          <div className="flex gap-1.5 flex-wrap">
            {s.authors.map((a) => (
              <span
                key={a}
                className="text-xs px-3 py-1 rounded-full bg-[#F8F7F4] text-[#5F5E5A] border border-[#ECEAE2] tracking-[-0.01em]"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="text-[13px] border-t border-[#F1EFE8] pt-3.5">
        <a
          href={`https://${s.links}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F4A85] no-underline tracking-[-0.01em] hover:underline"
        >
          ↗ {s.links}
        </a>
        <a
          href="https://selfishclub.slack.com/archives/C0B25TW69MW"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg bg-[#EEEDFE] text-[#3C3489] text-sm font-medium tracking-[-0.01em] hover:bg-[#E0DEFA] transition-colors"
        >
          💬 슬랙에서 원본 보기
        </a>
      </div>
    </div>
  );
}

// ============ 메인 ============
export function SkillsBoard() {
  const [cat, setCat] = useState<CatKey>("all");
  const [diff, setDiff] = useState<DiffKey | null>(null);
  const [postF, setPostF] = useState<"review" | "share" | null>(null);
  const [selected, setSelected] = useState<Skill | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const filtered = skills.filter((s) => {
    if (cat !== "all" && s.cat !== cat) return false;
    if (diff && s.diff !== diff) return false;
    if (postF === "review" && s.post !== "review") return false;
    if (postF === "share" && s.post !== "share") return false;
    return true;
  });

  function handleSelect(s: Skill) {
    setSelected(s);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <div className="space-y-5">
      <PageHeader total={skills.length} shown={filtered.length} />
      <Filters
        cat={cat}
        setCat={setCat}
        diff={diff}
        setDiff={setDiff}
        postF={postF}
        setPostF={setPostF}
      />

      {selected && (
        <div ref={detailRef} className="scroll-mt-16">
          <DetailPanel s={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {filtered.map((s) => (
          <SkillCard key={s.id} s={s} onClick={() => handleSelect(s)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-ink-300 text-sm bg-white border border-[#ECEAE2] rounded-xl">
          해당하는 스킬이 없어요. 필터를 조정해보세요.
        </div>
      )}
    </div>
  );
}
