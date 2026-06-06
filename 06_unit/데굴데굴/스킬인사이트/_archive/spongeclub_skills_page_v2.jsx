import { useState } from "react";

// ============ 데이터 ============
const skills = [
  { id: 1, name: "skillers-finder", title: "내 상황에 맞는 스킬 자동 추천 + 설치", cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 7, authors: ["해인","슬로우퀵","모닉","링고","상임"], flow: "에밀리 공유회 → 7명이 써봄", aud: ["코딩초보","마케터"], links: "github.com/emily-mkt/skillers-finder" },
  { id: 2, name: "claude-mem", title: "세션 간 영속 메모리 플러그인", cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 2, authors: ["그린","먼지민"], flow: "먼지민이 발견 → 그린이 써봄", aud: ["코딩초보","일반"], links: "github.com/thedotmack/claude-mem" },
  { id: 3, name: "obsidian-cardnews-skill", title: "md → 인스타 카드뉴스 자동 변환", cat: "cm", diff: "easy", type: "skill", post: "review", reviews: 1, authors: ["연수"], flow: "오웬 스킬 → 연수가 써봄", aud: ["마케터"], links: "github.com/owenleekr/obsidian-cardnews-skill" },
  { id: 4, name: "social-media-skills + remotion-ads", title: "훅 카피 → 캐릭터 애니메이션 MP4 파이프라인", cat: "cm", diff: "hard", type: "skill", post: "review", reviews: 1, authors: ["슬로우퀵"], flow: "에밀리 공유회 → 슬로우퀵이 파이프라인 구축", aud: ["마케터","디자이너"], links: "github.com/charlie947/social-media-skills" },
  { id: 5, name: "claude-design-skill", title: "Claude Code를 디자인 전문가로 바꿔주는 스킬", cat: "cm", diff: "easy", type: "skill", post: "review", reviews: 1, authors: ["슬로우퀵"], flow: "skillers-finder 추천 → 슬로우퀵이 적용", aud: ["디자이너","코딩초보"], links: "github.com/jiji262/claude-design-skill" },
  { id: 6, name: "claude-md-management", title: "CLAUDE.md 6개 기준 자동 감사 (공식)", cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 1, authors: ["먼지민"], flow: null, aud: ["일반"], links: "github.com/anthropics/claude-plugins-official" },
  { id: 7, name: "context7", title: "AI 답변 전 공식 문서 자동 참조", cat: "dev", diff: "mid", type: "skill", post: "review", reviews: 1, authors: ["먼지민"], flow: null, aud: ["개발자","코딩초보"], links: "github.com/upstash/context7" },
  { id: 8, name: "superpowers", title: "질문-대답으로 OS 규칙 설계 브레인스토밍", cat: "cc", diff: "easy", type: "skill", post: "review", reviews: 1, authors: ["다다"], flow: null, aud: ["일반"], links: "github.com/obra/superpowers" },
  { id: 9, name: "open-carrusel", title: "Chat → HTML 캐러셀 자동 생성 + PNG 내보내기", cat: "cm", diff: "easy", type: "skill", post: "review", reviews: 1, authors: ["해인"], flow: "skillers-finder 추천 → 해인이 써봄", aud: ["마케터","디자이너"], links: "github.com/Hainrixz/open-carrusel" },
  { id: 10, name: "claude-blog", title: "블로그 풀사이클 — 초안부터 SEO까지", cat: "cm", diff: "mid", type: "skill", post: "review", reviews: 1, authors: ["연수"], flow: null, aud: ["마케터"], links: "github.com/AgriciDaniel/claude-blog" },
  { id: 11, name: "UI-Inspector MCP", title: "브라우저 UI 실시간 검사 · 코드 변환", cat: "dev", diff: "mid", type: "skill", post: "share", reviews: 0, authors: [], flow: null, aud: ["개발자","디자이너"], links: "github.com/beyondworks/UI-Inspector" },
  { id: 12, name: "mckinsey-pptx", title: "한 줄이면 맥킨지 스타일 PPT 완성", cat: "prod", diff: "easy", type: "skill", post: "share", reviews: 0, authors: [], flow: null, aud: ["일반"], links: "github.com/seulee26/mckinsey-pptx" },
  { id: 13, name: "toprank", title: "SEO 및 광고 채널 통합 자동화", cat: "cm", diff: "mid", type: "skill", post: "share", reviews: 0, authors: [], flow: null, aud: ["마케터"], links: "github.com/nowork-studio/toprank" },
  { id: 14, name: "CC101", title: "코딩 몰라도 Claude Code 입문 한국어 가이드", cat: "cc", diff: "easy", type: "guide", post: "share", reviews: 0, authors: [], flow: null, aud: ["코딩초보","일반"], links: "cc101.axwith.com/ko" },
  { id: 15, name: "Supabase agent-skills", title: "Supabase AI 에이전트용 공식 스킬 모음", cat: "dev", diff: "mid", type: "skill", post: "share", reviews: 0, authors: [], flow: null, aud: ["개발자"], links: "github.com/supabase/agent-skills" },
];

const catMap = { all: "전체", cc: "클로드코드", cm: "콘텐츠·마케팅", dev: "개발도구", prod: "생산성" };
const diffMap = { easy: "설치만하면됨", mid: "설정좀필요", hard: "코드만져야함" };
const diffColor = { easy: { bg: "#E8F3EC", text: "#0D5A3A" }, mid: { bg: "#FBF1DE", text: "#6B4410" }, hard: { bg: "#FBEAEA", text: "#7B2424" } };
const catColor = {
  cc:   { bg: "#E8F0F9", text: "#0F4A85" },
  cm:   { bg: "#F8ECF1", text: "#7A2A45" },
  dev:  { bg: "#E8F3EC", text: "#0D5A3A" },
  prod: { bg: "#FBF1DE", text: "#6B4410" },
};

// 7주 일정 (사이트랑 동일)
const weeks = [
  { n: 0, label: "0주차", date: "5/3" },
  { n: 1, label: "1주차", date: "5/10", current: true },
  { n: 2, label: "2주차", date: "5/17" },
  { n: 3, label: "3주차", date: "5/24" },
  { n: 4, label: "4주차", date: "5/31" },
  { n: 5, label: "5주차", date: "6/7" },
  { n: 6, label: "6주차", date: "6/14" },
];

// ============ 공통 UI ============
function Pill({ bg, text, children, size = "sm" }) {
  const padding = size === "sm" ? "3px 10px" : "4px 12px";
  const fontSize = size === "sm" ? 11 : 12;
  return (
    <span style={{ fontSize, padding, borderRadius: 20, background: bg, color: text, whiteSpace: "nowrap", fontWeight: 500, letterSpacing: "-0.01em" }}>
      {children}
    </span>
  );
}

// ============ 네비 ============
function Header() {
  return (
    <header style={{ background: "white", borderBottom: "1px solid #ECEAE2" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <a href="/" style={{ fontSize: 14, color: "#2e2e2a", textDecoration: "none", fontWeight: 500, letterSpacing: "-0.01em" }}>
            🧽스폰지클럽<span style={{ color: "#a8a69d" }}>/</span>스킬 & 인사이트
          </a>
          <nav style={{ display: "flex", gap: 4 }}>
            <a href="/" style={navLinkStyle(false)}>주차별 미션</a>
            <a href="/teams" style={navLinkStyle(false)}>조별 현황판</a>
            <a href="/skills" style={navLinkStyle(true)}>스킬 & 인사이트</a>
          </nav>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="https://bit.ly/selfish_zoom" style={extLinkStyle}>🎥 스폰지 ZOOM ↗</a>
          <a href="https://spongeclub-community.vercel.app/" style={extLinkStyle}>🧽 이기적인 스폰지들 ↗</a>
        </div>
      </div>
    </header>
  );
}

const navLinkStyle = (active) => ({
  fontSize: 13,
  padding: "6px 12px",
  borderRadius: 8,
  color: active ? "#0F4A85" : "#73726c",
  background: active ? "#E8F0F9" : "transparent",
  fontWeight: active ? 500 : 400,
  textDecoration: "none",
  letterSpacing: "-0.01em",
});

const extLinkStyle = {
  fontSize: 12,
  padding: "6px 12px",
  borderRadius: 8,
  color: "#5F5E5A",
  background: "#F8F7F4",
  textDecoration: "none",
  border: "1px solid #ECEAE2",
  letterSpacing: "-0.01em",
};

// ============ 7주 타임라인 ============
function WeekTimeline() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "#a8a69d", letterSpacing: "-0.01em" }}>7주 커리큘럼</span>
        <span style={{ fontSize: 11, color: "#a8a69d", letterSpacing: "-0.01em" }}>진행 1/6</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {weeks.map((w) => (
          <div key={w.n} style={{
            flex: 1,
            padding: "10px 8px",
            borderRadius: 8,
            background: w.current ? "#FFF7D9" : "white",
            border: `1px solid ${w.current ? "#F0D879" : "#ECEAE2"}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: w.current ? "#6B4410" : "#73726c", fontWeight: w.current ? 600 : 400 }}>{w.label}</div>
            <div style={{ fontSize: 10, color: w.current ? "#8E5D17" : "#a8a69d", marginTop: 2 }}>{w.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ 페이지 헤더 ============
function PageHeader({ total, shown }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 20px" }}>
      <div style={{ fontSize: 11, color: "#a8a69d", letterSpacing: "0.02em", marginBottom: 8 }}>스폰지클럽 1기 · 이기적인 스킬러들 유닛</div>
      <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0, color: "#2e2e2a", letterSpacing: "-0.02em" }}>
        스킬 & 인사이트
      </h1>
      <p style={{ fontSize: 14, color: "#73726c", margin: "10px 0 0", lineHeight: 1.6, letterSpacing: "-0.01em" }}>
        스폰지들이 직접 써본 스킬과 가이드. <strong style={{ color: "#2e2e2a", fontWeight: 600 }}>"누가 발견 → 누가 써봄"</strong> 흐름까지 같이 봐요.
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12, color: "#73726c" }}>
        <span><strong style={{ color: "#2e2e2a", fontWeight: 600 }}>{total}개</strong> 스킬</span>
        <span style={{ color: "#d3d1c7" }}>·</span>
        <span><strong style={{ color: "#2e2e2a", fontWeight: 600 }}>{shown}개</strong> 표시 중</span>
        <span style={{ color: "#d3d1c7" }}>·</span>
        <span>Slack <code style={{ background: "#F1EFE8", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>#이기적인-스킬러들</code> 자동 수집</span>
      </div>
    </div>
  );
}

// ============ 필터 ============
function Filters({ cat, setCat, diff, setDiff, typeF, setTypeF }) {
  const catBtnStyle = (val) => ({
    fontSize: 12,
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid",
    cursor: "pointer",
    transition: "all .15s",
    letterSpacing: "-0.01em",
    fontWeight: cat === val ? 500 : 400,
    borderColor: cat === val ? (val === "all" ? "#0F4A85" : catColor[val]?.text || "#0F4A85") : "#E0DED6",
    background: cat === val ? (val === "all" ? "#E8F0F9" : catColor[val]?.bg || "#E8F0F9") : "white",
    color: cat === val ? (val === "all" ? "#0F4A85" : catColor[val]?.text || "#0F4A85") : "#73726c",
  });

  const diffBtnStyle = (val) => ({
    fontSize: 12,
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    fontWeight: diff === val ? 500 : 400,
    borderColor: diff === val ? diffColor[val].text : "#E0DED6",
    background: diff === val ? diffColor[val].bg : "white",
    color: diff === val ? diffColor[val].text : "#73726c",
  });

  const typeBtnStyle = (val) => ({
    fontSize: 12,
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    fontWeight: typeF === val ? 500 : 400,
    borderColor: typeF === val ? "#4D43B8" : "#E0DED6",
    background: typeF === val ? "#EEEDFE" : "white",
    color: typeF === val ? "#3C3489" : "#73726c",
  });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 20px" }}>
      <div style={{ background: "white", border: "1px solid #ECEAE2", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "#a8a69d", minWidth: 36, letterSpacing: "0.02em" }}>분야</span>
          {Object.keys(catMap).map(k => (
            <button key={k} onClick={() => setCat(k)} style={catBtnStyle(k)}>{catMap[k]}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#a8a69d", minWidth: 36, letterSpacing: "0.02em" }}>난이도</span>
          {Object.keys(diffMap).map(k => (
            <button key={k} onClick={() => setDiff(diff === k ? null : k)} style={diffBtnStyle(k)}>{diffMap[k]}</button>
          ))}
          <div style={{ width: 1, height: 20, background: "#E0DED6", margin: "0 6px" }} />
          <button onClick={() => setTypeF(typeF === "review" ? null : "review")} style={typeBtnStyle("review")}>써본후기만</button>
          <button onClick={() => setTypeF(typeF === "guide" ? null : "guide")} style={typeBtnStyle("guide")}>가이드만</button>
        </div>
      </div>
    </div>
  );
}

// ============ 스킬 카드 ============
function SkillCard({ s, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ECEAE2",
        borderRadius: 12,
        padding: 18,
        background: "white",
        cursor: "pointer",
        transition: "all .15s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8c5b8"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#ECEAE2"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#2e2e2a", letterSpacing: "-0.01em", lineHeight: 1.35 }}>{s.name}</span>
        {s.reviews > 0 && (
          <span style={{ fontSize: 11, background: "#EEEDFE", color: "#3C3489", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: 500 }}>
            🔥 {s.reviews}명이 써봄
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: "#73726c", lineHeight: 1.55, margin: 0, letterSpacing: "-0.01em" }}>{s.title}</p>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        <Pill bg={catColor[s.cat].bg} text={catColor[s.cat].text}>{catMap[s.cat]}</Pill>
        <Pill bg={diffColor[s.diff].bg} text={diffColor[s.diff].text}>{diffMap[s.diff]}</Pill>
        {s.type === "guide" && <Pill bg="#E8F0F9" text="#0F4A85">가이드</Pill>}
        {s.post === "review" && <Pill bg="#EEEDFE" text="#3C3489">써본후기</Pill>}
      </div>
      {s.flow && (
        <div style={{ fontSize: 12, color: "#4D43B8", paddingTop: 10, borderTop: "1px solid #F1EFE8", display: "flex", alignItems: "center", gap: 6, letterSpacing: "-0.01em" }}>
          <span style={{ fontSize: 13 }}>↻</span> {s.flow}
        </div>
      )}
    </div>
  );
}

// ============ 상세 패널 ============
function DetailPanel({ s, onClose }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto 16px", padding: "0 24px" }}>
      <div style={{ border: "1px solid #4D43B8", borderRadius: 12, padding: 24, background: "white", boxShadow: "0 4px 16px rgba(77,67,184,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px", color: "#2e2e2a", letterSpacing: "-0.02em" }}>{s.name}</h3>
            <p style={{ fontSize: 14, color: "#73726c", margin: 0, letterSpacing: "-0.01em" }}>{s.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#a8a69d", padding: 4, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <Pill bg={catColor[s.cat].bg} text={catColor[s.cat].text}>{catMap[s.cat]}</Pill>
          <Pill bg={diffColor[s.diff].bg} text={diffColor[s.diff].text}>{diffMap[s.diff]}</Pill>
          {s.aud.map(a => <Pill key={a} bg="#F1EFE8" text="#5F5E5A">{a}</Pill>)}
        </div>
        {s.flow && (
          <div style={{ background: "#F4F3FD", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#3C3489", letterSpacing: "-0.01em" }}>
            <span style={{ fontWeight: 600 }}>↻ 순환 흐름</span> · {s.flow}
          </div>
        )}
        {s.reviews > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 500, margin: "0 0 8px", color: "#73726c", letterSpacing: "0.01em" }}>써본 사람들</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {s.authors.map(a => (
                <span key={a} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#F8F7F4", color: "#5F5E5A", border: "1px solid #ECEAE2", letterSpacing: "-0.01em" }}>{a}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ fontSize: 13, borderTop: "1px solid #F1EFE8", paddingTop: 14 }}>
          <a href={`https://${s.links}`} style={{ color: "#0F4A85", textDecoration: "none", letterSpacing: "-0.01em" }}>
            ↗ {s.links}
          </a>
        </div>
      </div>
    </div>
  );
}

// ============ 푸터 ============
function Footer() {
  return (
    <footer style={{ maxWidth: 960, margin: "40px auto 0", padding: "24px", borderTop: "1px solid #ECEAE2", fontSize: 11, color: "#a8a69d", textAlign: "center", letterSpacing: "-0.01em" }}>
      스폰지클럽 1기 · 스킬 & 인사이트 · v1 · 2026-05-19
    </footer>
  );
}

// ============ 메인 ============
export default function App() {
  const [cat, setCat] = useState("all");
  const [diff, setDiff] = useState(null);
  const [typeF, setTypeF] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = skills.filter(s => {
    if (cat !== "all" && s.cat !== cat) return false;
    if (diff && s.diff !== diff) return false;
    if (typeF === "review" && s.post !== "review") return false;
    if (typeF === "guide" && s.type !== "guide") return false;
    return true;
  });

  return (
    <div style={{
      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      background: "#F8F7F4",
      minHeight: "100vh",
      color: "#2e2e2a",
    }}>
      <Header />
      <WeekTimeline />
      <PageHeader total={skills.length} shown={filtered.length} />
      <Filters cat={cat} setCat={setCat} diff={diff} setDiff={setDiff} typeF={typeF} setTypeF={setTypeF} />

      {selected && <DetailPanel s={selected} onClose={() => setSelected(null)} />}

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map(s => <SkillCard key={s.id} s={s} onClick={() => setSelected(s)} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#a8a69d", fontSize: 14, background: "white", border: "1px solid #ECEAE2", borderRadius: 12 }}>
            해당하는 스킬이 없어요. 필터를 조정해보세요.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
