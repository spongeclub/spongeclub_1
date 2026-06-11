---
description: 슬랙 후기 → 스킬카드 빌드 (raw_data 검증 → 빌드 → backfill → 노출 토글 → 검증 → 인사이트 생성) [3조 코니 / web]
argument-hint: [--slug=슬러그] (생략 시 전체)
---

슬랙에서 모은 스킬 후기를 스킬카드 데이터(`skills.generated.json`)로 빌드한다.
**대상:** 3조 코니. 작업 위치 `06_unit/데굴데굴/web` (Next.js 16, 비표준 — AGENTS.md 경고).

> **판정 기준은 `06_unit/데굴데굴/스킬인사이트/docs/02-rules.md`를 따른다.** 이 문서는 *절차*(생성·빌드·검증), 02-rules.md는 *기준*(분야·난이도·인용·비중·톤). 무인 자동화 시 02-rules.md대로 분류·인용·요약을 판정한다. 시스템 전체 맥락은 정본 `docs/README.md` 참고.

## 트리거 문구
- `/build-skills`
- "스킬 빌드해줘", "후기 카드 다시 만들어줘", "스킬카드 갱신"

## 입력 파일 (모두 `06_unit/데굴데굴/스킬인사이트/`)
| 파일 | 역할 | 핵심 |
|------|------|------|
| `raw_data.md` | 슬랙 원본 | 마커 `:pushpin:`(한줄요약) `:mag:`(주요내용) `:briefcase:`(써본상황) `:link:`(링크), 메시지 헤더 `[날짜] 작성자 (ts=...)` |
| `messages_extracted.md` | 파이프 테이블 | `msgNum(G/S/W…) | … | author | slug | summary | … | slackUrl` |
| `quote_picks.md` | 인용 선별 | `## slug` + `### 인용 N` + `- 본문/작성자/메시지 번호/추천 이유` |

> **quote_picks.md에 slug가 없으면 그 카드는 생성되지 않는다.** 새 카드를 추가하려면 세 파일 모두에 데이터가 있어야 한다(특히 quote_picks 필수).

## 실행 절차

작업 디렉토리는 항상 `06_unit/데굴데굴/web`. 모든 `node` 명령은 이 폴더에서 실행.

### 1. 마커 표준 검증 (raw_data.md)
새로 추가된 메시지 블록의 마커가 표준인지 확인한다. 비표준이면 본문이 어긋나 `## 주요 내용`이 안 생기고 카드 본문이 빈다.
- 표준: `:pushpin:` `:mag:` `:briefcase:` `:link:` (각 줄 시작)
- 자주 나는 오류: `:label:`, `:test_tube:`, 마커 같은 줄에 라벨+본문 혼재
- 비표준 발견 시 → raw_data.md의 마커를 표준으로 교정한 뒤 진행 (사용자에게 무엇을 고쳤는지 한 줄 보고)

### 2. Dry-run 미리보기
무엇이 생성/덮어쓰기 되는지 먼저 보여준다 (파일 안 건드림).
```bash
node scripts/build-skills.mjs --dry-run            # 전체
node scripts/build-skills.mjs --dry-run --slug=<슬러그>   # 단일
```
- `[SKIP] <slug>: 인용 없음` → quote_picks에 인용이 없는 것. 의도한 거면 무시, 아니면 quote_picks 보강.
- `본문 N건 누락` → messages_extracted의 slackUrl ts와 raw_data의 ts가 안 맞은 것. 채택본 ts 확인.
- 결과를 사용자에게 요약 보고하고 **실행 승인을 받는다.**

### 3. 빌드 실행
승인 후 실제 생성.
```bash
node scripts/build-skills.mjs                        # 또는 --slug=<슬러그>
node scripts/build-skill-bodies.mjs                  # skills_md → 2개 JSON
```
> `npm run build`의 prebuild가 `build-skill-bodies.mjs`를 자동 실행하지만, `build-skills.mjs`(raw_data→skills_md)는 **수동**이다. 순서를 지킬 것.

### 4. 신규 카드 backfill (분야·난이도)
새로 생성된 카드는 `category`/`difficulty`가 빈칸이다 → 칩·필터에서 누락된다.
`스킬인사이트/skills_md/{slug}.md` frontmatter를 채운다. **이 두 칸은 사람 입력칸이라 재빌드해도 보존된다.**
- **분야(category) — 4개만:** `클로드코드` | `콘텐츠마케팅` | `개발도구` | `생산성`
  (`콘텐츠마케팅`으로 쓰면 빌드가 `콘텐츠·마케팅`으로 정규화)
- **난이도(difficulty) — 3개만:** `설치만하면됨` | `설정좀필요` | `코드만져야함`
- 채운 뒤 `node scripts/build-skill-bodies.mjs` 재실행.

### 5. 노출 토글 (VISIBLE_SLUGS)
화면 노출 여부는 `web/scripts/build-skill-bodies.mjs`의 `VISIBLE_SLUGS` Set이 결정한다 (데이터 존재와 별개, 완전 가역).
- 새 카드를 **노출**하려면 → `VISIBLE_SLUGS`에 slug 추가
- 카드를 **숨기려면** → slug 제거 (데이터는 보존됨)
- 수정 후 `node scripts/build-skill-bodies.mjs` 재실행.

### 6. 검증 (커밋 전 필수)
`web/src/data/skills.generated.json`에서 **visible=true 카드만** 점검:
```bash
node -e "const s=require('./src/data/skills.generated.json');const bad=Object.entries(s).filter(([k,v])=>v.visible&&(!v.body||!v.area||!v.difficulty||!v.quotes.length));console.log('visible:',Object.values(s).filter(v=>v.visible).length);console.log('문제 카드:',bad.map(([k])=>k));"
```
- visible 카드 중 `body`/`area`/`difficulty`/`quotes` 빈 것이 **0이어야** 한다.
- 문제 있으면 원인별로: body 빔→1·3단계 / area·difficulty 빔→4단계 / quotes 빔→quote_picks 보강.
- 최종 `npm run build` 통과 확인(`/skills` 정적 프리렌더).

### 7. 인사이트 블록 생성 (자동)
페이지 상단 "이번 주 인사이트" 박스 문구를 자동 생성한다. 손으로 쓰지 않는다.
```bash
node scripts/build-insights.mjs   # 신호(사실)만 출력 — 문장은 안 씀
```
- 출력되는 **신호(최다 사용 / 분야 분포 / 솔직후기 후보)** 를 보고, **카드화규칙.md 파트2 톤 규칙**대로 2~3문장을 작성한다.
  - ~어요/~예요 관찰체, 문장마다 구체 사실(스킬명·숫자·흐름) 1개 이상, 1~2문장씩 짧게
  - 이모지 문장당 0~1개, 무색 단어("다양한"·"활발히"·"생산성 향상") 금지
  - **솔직후기 후보는 멤버명을 빼고** 스킬명만 쓴다 (박제 방지). 스크립트 후보는 단어 매칭이라 오탐이 섞이니, 진짜 아쉬운 후기인지 문맥으로 판단해 1개만 골라 쓴다. (톤 규칙 상세는 `docs/02-rules.md` 파트2)
- 작성한 문장을 `src/data/insights.generated.json`에 `{ "items": ["문장1", "문장2", ...] }` 형태로 덮어쓴다.
- 화면은 `loadInsights()`(`_site/src/lib/skills-generated.ts`)가 이 JSON을 읽어 반영한다.

### 8. 커밋 범위 가드
빌드 산출물 + 사람 입력칸만 커밋. 작업 메모·로컬 상태는 제외.
```bash
git add 06_unit/데굴데굴/web/src/data/skills.generated.json \
        06_unit/데굴데굴/web/src/data/skill-bodies.generated.json \
        06_unit/데굴데굴/web/src/data/insights.generated.json \
        06_unit/데굴데굴/web/scripts/build-skill-bodies.mjs \
        06_unit/데굴데굴/web/scripts/build-insights.mjs \
        06_unit/데굴데굴/스킬인사이트/skills_md/
```
- **제외:** `결정시트_*.md`, `classification_*.md`, `_curation_detail.md`, 백업 폴더, `.obsidian/`, `.claude/`, `submissions.generated.json`
- **`git add -A`/`.` 금지** — 작업 메모·시크릿 혼입 방지. 파일명 명시.
- 커밋 메시지: `[insight] 3조 코니 - 스킬카드 빌드 (...)` 또는 `[site]`(노출 변경 시).
- 제출은 `/submit` 또는 CLAUDE.md 워크플로우(브랜치→PR→squash 머지)를 따른다. **main 직접 push 금지.**

## 주의
- 입력 파일(raw_data/messages_extracted/quote_picks)을 **사용자 데이터 추가 없이 임의로 만들어 채우지 않는다.** 후기는 슬랙에서 온 실제 데이터다.
- `setup*`/`initialize*` 함수 실행 금지 (CLAUDE.md). 이 스킬은 빌드 스크립트만 호출하므로 안전.
- messages_extracted 파이프 테이블은 빈 셀이 드롭되므로 **작성일 등 셀을 비우면 안 된다** (cells 인덱스 밀림).

## 사용 예
```
/build-skills                  → 전체 빌드 (dry-run → 승인 → 실행 → 검증)
/build-skills --slug=remotion  → remotion 카드만
스킬 빌드해줘                    → 동일 동작
```
