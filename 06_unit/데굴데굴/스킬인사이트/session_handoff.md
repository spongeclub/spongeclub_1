# 세션 핸드오프 — 2026-06-04 (스킬 분류·자동화)

> 다음 Claude Code 세션이 이 파일만 읽으면 이어서 작업할 수 있게 정리. 시간순 X, 주제별 O.

---

## 오늘 완료 (2026-06-04 이어서)

### 화면 전환 + 데이터 청소 (최신)
- **3단계 화면 전환** (커밋 `bff5377`): 하드코딩 `SKILLS` 배열 제거 → `skills.generated.json` 읽기. 16개 카드 화면 확인 완료. `href`→`slug`로 펼침키 교체.
- **본명 자동 제거** (커밋 `9e13e7c`): `build-skills.mjs`에 `stripRealName`(끝 괄호+한글만). quote 작성자 + author 둘 다, 새 멤버도 자동 처리. **옵션 A**(소스 유지, 빌드만 거름).
- **이모지 코드 자동 변환** (커밋 `04954b2`): `build-skills.mjs`에 `convertEmoji`(8종 매핑). `cleanSlackText`에서 처리. 여러 카드 한 번에.

### 앞선 작업
- **href 자동 추출**: raw_data에 있던 깃허브 링크가 변환(`build-skills.mjs`)에서 버려지던 걸 살림. `body.link` → frontmatter `href`로 연결.
  - 거르기 규칙: 깃허브 우선 → 대표사이트(인스타·노션·슬랙 제외) → 빈값
  - 오추출 5개(interface-design·claude-design·playwright-skill 등)는 화면 안 뜨는 카드라 미뤄둠 (후속 참고)
- **2단계 빌드 확장**: `build-skill-bodies.mjs`가 frontmatter+인용까지 뽑아 **`skills.generated.json` 신규 생성** (32개 카드, 16 visible). 기존 `skill-bodies.generated.json`은 본문 전용으로 유지(스키마 안 깨짐).
- **backfill**: 화면 `SKILLS` 배열의 분야·난이도를 16개 md frontmatter에 자동 복사 (일회용 스크립트, 실행 후 삭제). 점 표기(`콘텐츠·마케팅`)는 md 기존 표기(`콘텐츠마케팅`)로 역정규화 → build에서 다시 정규화. **데이터 토대 완성.**

### 이번 세션 커밋 (브랜치 `submit/3조-코니-skills-automation`, **push/PR 안 함**)
- `20104d2 [insight] build-skills: 기존 파일 frontmatter 머지로 overwrite trap 해결` (0단계)
- `cd60353 [insight] create-closing 카드 frontmatter 채움 (분야/대상/난이도)` (1단계)
- href 자동 추출 커밋 (`build-skills.mjs` 수정)
- `09dfcf4 [insight] build-skill-bodies: 카드 메타+인용까지 JSON 확장` (2단계, 새 JSON 2개)
- `d16f518 [insight] skills_md 분야·난이도 backfill (12개) + JSON 재생성`
- 남은 미추적: `스킬인사이트/Design/`, `스킬인사이트/_backup_재긁기전/` (이번 작업 무관, 손 안 댐)

### 0~1단계 요약 (앞서 완료, 위 커밋 참조)
- overwrite trap 해결: `build-skills.mjs` 필드 단위 머지 → 재실행 시 사람 칸 보존, 데이터 칸만 재생성. 보존 칸: `title, summary, category, audience, difficulty, inspired_by, keywords, published, featured, created, team` + `href`.
- create-closing 카드 데이터 채움. taxonomy `설정좀필요` 설명 확장(환경 세팅 포함).

---

## 현재 상태

**화면 전환 + 데이터 청소 2건 완료.** `skills-client.tsx`가 `skills.generated.json`을 읽어 `visible:true` 16개를 렌더(하드코딩 배열 제거). `flow`는 화면 수동 맵 6개로 유지 중. 본문은 `skill-bodies.generated.json` 그대로.

전환 세부:
- 화면 큰 제목 `title` ← JSON `summary` (JSON `title`은 "{slug} 써본 후기" 자동 헤드라인이라 안 씀).
- `flow`는 JSON에 없어 슬러그→흐름 텍스트 수동 맵으로 유지(6개: skillers-finder, claude-mem, obsidian-cardnews-skill, social-media-skills, claude-design-skill, open-carrusel). 나머지 10개는 흐름 줄 없음(정상).
- 펼침키·React key를 `href`→`slug`로 교체(빈 href 카드 key 충돌 해소).
- 본문 조회 키를 `BODIES[item.slug]`로 통일.

데이터 청소(빌드 자동화, 손작업 없음):
- 본명: `build-skills.mjs` `stripRealName` — `닉네임(본명)` 끝 괄호+한글만 제거. quote 작성자 + frontmatter author 둘 다. 소스는 그대로 두고 빌드만 거름.
- 이모지: `build-skills.mjs` `convertEmoji` — 슬랙 코드 8종(🔴🟡🟢⭐✅1️⃣2️⃣🔗) 매핑 변환. `cleanSlackText` 체인에 연결. 미매핑 코드는 원문 유지.

---

## 바로 다음 할 일

- **펌프(AI 분류기)**: 슬랙 새 글 자동으로 카드 만드는 자동화 본편. ← **다음 본편**
- (나중, 안 급함) git 과거 기록에 본명 남은 거 → 다다한테 알리고 상의. 화면엔 이미 안 뜸.
- (나중) **author(올린 사람) 카드 표시**: `build-skills`에 authors 배열 출력 + 화면 코드 추가. "누구를 올린 사람으로 볼지" 정의부터.

**진행 원칙**: 한 단계씩, 계획 먼저 보여주고 승인받고 진행. 한 번에 다 하지 말 것.

---

## 후속 작업

- **새 발굴 11종** 분야·난이도 채워 visible 합류
- **href 오추출 5개 점검** (화면 전환 때 함께):
  - `interface-design`·`claude-design`·`playwright-skill` → 셋 다 `skillers-finder` 주소로 감. **원인**: 설록 S3 메시지(line 70)가 한 메시지에 4개 슬러그를 묶어 공유 → 셋의 firstTs 동일 → 첫 채택본 본문(skillers-finder `:link:`)을 공유해 같은 href를 주워옴.
  - `web-design-analyzer` → href 빈 값 (첫 공유자가 `:link:`에 깃허브 안 적음)
  - `project-instruction-optimizer` → 구글드라이브 주소 (깃허브 링크 없음)
- **AI 분류기(펌프)** — 분야·난이도 자동 분류

### 다다 협의 영역
- **메인 홈(`/`) 연동** — 인기 스킬 미리보기 섹션 추가
- **공식 사이트 레포(`sponge-unit`) 포팅** — `web/` 변경을 동일 반영 (handoff_for_dada.md 참조)

### 같이 정할 것
- **스킬 썸네일·대표 이미지** — 디자인 토큰엔 자리 있음, 디자인 가이드 + 데이터 소스 결정 필요
- **난이도 기준 정밀화** — AI 분류기 만들 때 애매한 케이스 모아 다듬기

---

## 원칙

**반복 패턴을 틀로** — 손으로 그 카드만 고치기 → 빌드에서 규칙으로 자동 처리로 전환. 본명·이모지 둘 다 이렇게 함. 새 카드가 들어와도 빌드가 알아서 거름. "한 번 고치면 끝"이 아니라 "규칙으로 영구 처리".

**검수 단계 빼기** — 화면도 없는데 데이터 미리 청소하는 건 "안 보이는 문제 미리 잡기". 화면 뜨면 눈으로 보고 고친다.

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
| `/skills` | **`skills.generated.json`**(메타+인용) + `skill-bodies.generated.json`(본문). `flow`만 화면 수동 맵 6개 | **거의 자동** (flow 6개 수동) |
| `/materials` | `src/data/materials.ts` 하드코딩 (Google Sheets 수동) | **수동** |

**핵심**: skills 페이지 카드의 제목·인용·카테고리·usedBy·href·본문은 이제 모두 파이프라인 자동(`skills.generated.json` + `skill-bodies.generated.json`). `flow`(6개)만 `skills-client.tsx` 수동 맵으로 남음 → 후속 자동화 후보.

---

## 알아둘 점
- Next.js 16.2.6 / Turbopack / React 19.2.4 / Tailwind 4.
- `web/AGENTS.md` 경고: "This is NOT the Next.js you know" — 표준 Next.js 가정 금지, `node_modules/next/dist/docs/` 참고.
- 디자인은 코니가 Claude Design으로 만든 시스템이 이미 적용됨. 색·타이포 신규 정의 불필요.
- 새 스킬 추가 시: `raw_data.md` 갱신 → `quote_picks.md`/`messages_extracted.md` 명단 추가 → `build-skills.mjs` 재실행 → 콘솔에서 누락 슬러그 카운트 확인.
- 핸드오프 문서 2종: 이 파일(`session_handoff.md`) + 다다용(`handoff_for_dada.md`).
