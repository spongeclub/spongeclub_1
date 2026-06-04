# 세션 핸드오프 — 2026-06-04 (스킬 분류·자동화)

> 다음 Claude Code 세션이 이 파일만 읽으면 이어서 작업할 수 있게 정리. 시간순 X, 주제별 O.

---

## 현재 상태 (한눈에)

- **슬랙 재긁기 완료**: `raw_data.md` 6/1까지 **188개 메시지** (이전 133개 → 갱신). 5/25 컷오프 line 2043.
- **새 스킬 분류 완료**: 5/25 이후 신규 메시지에서 새 스킬 추려냄. 기존 명단 26개와 대조. (읽기·분류만, 파일 이동 X)
- **overwrite trap 해결됨 (0단계 완료, 커밋됨)**: `build-skills.mjs`에 **필드 단위 머지** 적용. 재실행 시 사람 칸은 보존, 데이터 칸만 재생성.
  - 보존 칸(11개): `title, summary, category, audience, difficulty, inspired_by, keywords, published, featured, created, team`
  - 재생성 칸: `skill_name, author, type, post_type, links, updated, 본문·인용`
  - 구현: `parseExistingFrontmatter`로 빈칸과 미입력 구분 → 기존값 유지. 기존 파일 없으면 빈 템플릿(종전 동작).
  - dry-run/--slug은 **이미 있던 기능** (336~351줄). dry-run은 `console.log`만, `writeFileSync`(349줄)는 else 가지라 파일 안 건드림 — 검증 안전.
- **create-closing 카드 완료 (1단계 완료, 커밋됨)**:
  - 명단 2파일: `quote_picks.md`(인용 3개: 신연수/하늘/아가타), `messages_extracted.md`(`/써본스킬` S16~S18, ts 검증)
  - frontmatter 채움: **category=클로드코드, audience=[일반], difficulty=설정좀필요**, summary 등 손작업 값 유지.
  - `--dry-run --slug=create-closing`으로 검증 → 채운 값 안 날아감 확인. 본문 1건 매칭/0건 누락.
  - ⚠️ `created` 보존 동작은 코드로 확인했으나, create-closing이 마침 오늘(6/4) 생성이라 "유지=오늘"이 우연히 동일 → **날짜 다른 파일에서 재실행해야 시각적 증명됨** (미증명, 안전).
- **taxonomy 보강**: `insight_taxonomy.md` `설정좀필요` 설명을 넓힘 — API 키뿐 아니라 옵시디언·git 등 "내 환경 세팅"도 포함.

### 이번 세션 커밋 (브랜치 `submit/3조-코니-skills-automation`, **push/PR 안 함**)
- `20104d2 [insight] build-skills: 기존 파일 frontmatter 머지로 overwrite trap 해결`
- `cd60353 [insight] create-closing 카드 frontmatter 채움 (분야/대상/난이도)`
- 남은 미추적: `스킬인사이트/Design/`, `스킬인사이트/_backup_재긁기전/` (이번 작업 무관, 손 안 댐)

---

## 바로 다음 할 일 — 2단계: create-closing 화면 반영

0~1단계(trap 해결 + 카드 데이터)는 끝. 이제 **화면이 frontmatter를 읽게** 연결.

목표: `skills-client.tsx` `SKILLS` 배열에 **직접 박지 말고**, md frontmatter 값을 화면이 읽게 (메타데이터 자동 import).
→ 후속 작업 "SKILLS 16개 하드코딩 제거 → skills_md 자동 import"와 같은 줄기. create-closing을 첫 케이스로 붙이는 작업.

**진행 원칙**: 한 단계씩, 계획 먼저 보여주고 승인받고 진행. 한 번에 다 하지 말 것.

---

## 후속 작업

### 코니 작업 (skills 페이지 마무리)
1. **SKILLS 16개 하드코딩 제거 → skills_md 자동 import**
   - skills_md는 본문까지 채워진 상태. 빌드 타임에 frontmatter 포함 전체를 자동 import 하도록 전환.
2. **검색·필터 카운트 동적화** (위 작업에 딸림) — 헤더 "전체 16" 등 숫자 하드코딩 → 동적 계산.
3. **`bodySlug` 수동 override 3건 정리**
   - `social-media-skills + remotion-ads` → `social-media-skills`
   - `UI-Inspector MCP` → `UI-Inspector-MCP`
   - `Supabase agent-skills` → `supabase-agent-skills`

### 손으로 채운 카드 5개 명단 합류 (자동화 본편 과제 — create-closing 시범 끝나고)
명단(`quote_picks.md`)엔 없지만 화면(`skills-client.tsx`)엔 살아있는 카드 5개. frontmatter가 손으로 꽉 채워져 있어 지금은 (A) 그대로 둠. 본편에서 (B)로 전환:
- 대상 5개: `CC101`(가이드), `mckinsey-pptx`, `UI-Inspector-MCP`, `claude-md-management`(G-U1 미접수 건), `social-media-skills-remotion-ads`(합본)
- **할 일 1**: 5개를 명단으로 합류. (overwrite trap은 **0단계에서 이미 해결** — 머지 로직이 사람 칸 보존하므로, 명단 합류 후 build 재실행해도 손작업 frontmatter 안 날아감)
- **할 일 2**: `social-media-skills` 합본 중복 정리 — 명단엔 `social-media-skills`/`remotion-ads` 2개 따로인데 파일·화면 카드는 합본 1장. 어느 쪽으로 통일할지 결정 (위 `bodySlug` override 3건과 함께)

### 다다 협의 영역
- **메인 홈(`/`) 연동** — 인기 스킬 미리보기 섹션 추가
- **공식 사이트 레포(`sponge-unit`) 포팅** — `web/` 변경을 동일 반영 (handoff_for_dada.md 참조)

### 같이 정할 것
- **스킬 썸네일·대표 이미지** — 디자인 토큰엔 자리 있음, 디자인 가이드 + 데이터 소스 결정 필요
- **난이도 기준 정밀화** — AI 분류기(펌프) 만들 때, 27개 채우며 나온 애매한 케이스를 모아서 다듬기

---
--- 아래는 레퍼런스 ---
---

## 배포·PR 상태
- **PR**: https://github.com/spongeclub/spongeclub_1/pull/506 (미머지, 다다 머지 예정)
- **브랜치**: `submit/3조-코니-데굴데굴` → `main`
- **커밋**: `ffe91cd [site] skills page: 본문 노출, GitHub/Slack 버튼 분리, masonry 레이아웃, Vercel 빌드 graceful fallback`
- **프리뷰 배포**: https://cony-skills-preview.vercel.app (코니 개인 Vercel `moanin1209-1229s-projects`)
- **공식 사이트 레포**: `sponge-unit` — 동일 변경 포팅 필요 (다다 작업)

---

## 파이프라인 구조 + 실행 방법 (재현용)

```
스킬인사이트/raw_data.md          (슬랙 export 원본)
       ↓ build-skills.mjs
스킬인사이트/skills_md/*.md       (스킬별 md, frontmatter + 본문)
       ↓ build-skill-bodies.mjs
web/src/data/skill-bodies.generated.json   (프론트엔드용 JSON)
       ↓ import
web/src/app/skills/skills-client.tsx       (펼침 영역에 본문 노출)
```

**실행 명령어** (web/ 디렉토리에서):
- 한 슬러그만 미리보기: `node scripts/build-skills.mjs --dry-run --slug=create-closing`
- 전체 미리보기: `node scripts/build-skills.mjs --dry-run`
- 실제 실행: `node scripts/build-skills.mjs`
- `build-skill-bodies.mjs`는 `web/package.json`의 `predev`/`prebuild`에서 자동 실행.

**build-skills.mjs 동작 핵심 (수정·디버깅 시 필독)**:
- `BASE = ../../스킬인사이트`. 처리 대상 슬러그는 **`quote_picks.md`에 있는 것만** (`slugArg ? [slugArg] : [...quotesMap.keys()]`). 명단에 없으면 빌드 안 됨.
- `parseRawData()` — 슬랙 본문을 마커로 파싱: `:pushpin:`(한 줄 요약), `:mag:`(주요 내용), `:briefcase:`(써본 상황+결과), `:link:`(원본).
- Slack URL → ts 변환: `/p(\d{10})(\d{6})/` → `1779718739.261449` 형태. 이 ts로 raw_data 본문을 찾아 카드 헤드라인·요약을 뽑음(첫 행 ts 사용).
- `messages_extracted.md`는 마크다운 표. 파서가 `line.split('|').map(c=>c.trim()).filter(Boolean)` 후 `cells.length >= 8` 요구.
  ⚠️ **빈 셀은 filter(Boolean)에 걸려 사라지면서 인덱스가 밀림** → URL 이전 모든 칸은 비우지 말 것. 이모지/쓰레드 수는 빈칸 대신 `'0'`(truthy라 살아남음).
  - cells[0]=메시지번호, [2]=작성자, [3]=슬러그, [4]=요약, [7]=슬랙URL.
- 같은 슬러그에 여러 메시지면 **첫 공유자 본문만** 사용, 나머지는 인용으로.
- delegate: `/써본스킬 <url>`이 다른 메시지를 가리키면 그 메시지 본문을 가져옴.
- 메시지번호 정규식 `^[GSW][-\d]` (G-U2 같은 패턴 매칭).
- 슬랙 불릿(`•`, `◦`)을 마크다운(`-`, `  - `)으로 정규화 → react-markdown이 줄바꿈·중첩 인식.

---

## generated.json 커밋 정책 (중요)
`*.generated.json`은 **gitignore에 넣지 말고 커밋**.

**이유**: Vercel은 `web/` 디렉토리만 업로드. 원본 데이터(`02_mission/`, `스킬인사이트/`)는 `web/` 밖이라 Vercel 빌드 시 접근 불가 → 재생성 불가. 커밋된 JSON이 그대로 배포됨.

prebuild 스크립트는 `SRC_DIR`(부모 폴더 `스킬인사이트/`)이 없으면 "기존 JSON 유지"만 하고 종료(graceful fallback). 로컬에서 원본 갱신 → 스크립트 실행 → 생성된 JSON 커밋 흐름을 유지할 것. (Vercel 빌드 로그에 `skills_md not found — keeping existing JSON`이 떠도 정상.)

---

## 코드 현황 — 페이지별 데이터 출처
옵시디언 자체를 읽는 코드는 **없음**. "vault"라 부르지만 실제로는 GitHub 레포(`spongeclub/spongeclub_1`)를 읽음.

| 페이지 | 데이터 출처 | 자동 여부 |
|---|---|---|
| `/teams` 과제 현황판 | **GitHub API**로 `02_mission/{N주차}/{X조}/*_submit.md` fetch (5분 캐시) | **자동** |
| `/missions` 메인 | Supabase `yulia_site_announcements` + `yulia_site_questions` | 읽기 자동, 슬랙→Supabase 적재 수동 |
| `/announcements` | Supabase `yulia_site_announcements` | 동일 |
| `/discussions` | Supabase `yulia_site_questions` → fallback `discussions.generated.json` | 동일 |
| `/skills` | **`skills-client.tsx`에 SKILLS 하드코딩** + 본문만 `skill-bodies.generated.json` | 본문만 자동, 메타데이터 수동 |
| `/materials` | `src/data/materials.ts` 하드코딩 (Google Sheets 수동) | **수동** |

**핵심**: skills 페이지 카드의 제목·인용·카테고리·흐름·usedBy·href는 모두 `skills-client.tsx` `SKILLS` 배열에 사람이 직접 적은 값. **본문(주요 내용) 한 가지만** 파이프라인 자동. 두 흐름이 별개 → "바로 다음 할 일"이 이걸 합치는 작업.

---

## 알아둘 점
- Next.js 16.2.6 / Turbopack / React 19.2.4 / Tailwind 4.
- `web/AGENTS.md` 경고: "This is NOT the Next.js you know" — 표준 Next.js 가정 금지, `node_modules/next/dist/docs/` 참고.
- 디자인은 코니가 Claude Design으로 만든 시스템이 이미 적용됨. 색·타이포 신규 정의 불필요.
- 새 스킬 추가 시: `raw_data.md` 갱신 → `quote_picks.md`/`messages_extracted.md` 명단 추가 → `build-skills.mjs` 재실행 → 콘솔에서 누락 슬러그 카운트 확인.
- 핸드오프 문서 2종: 이 파일(`session_handoff.md`) + 다다용(`handoff_for_dada.md`).
