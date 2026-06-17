# 스폰지클럽 매거진 사이트 (`_site/`)

> ⭐ **사이트 소스의 진실은 여기 하나다.** (`spongeclub_1/_site/`)
> 예전 `spongeclub/spongeclub_homepage` 레포는 **2026-06-01 이 폴더로 통합·은퇴**했다. 그 레포는 더 이상 수정하지 않는다.

스폰지클럽 매거진 홈페이지 · Astro + Vercel.
**이 폴더는 vault 레포(`spongeclub_1`) 안에 함께 들어 있다** — 콘텐츠와 사이트가 한 레포.

## 어디를 고치나

| 바꾸려는 것 | 위치 |
|---|---|
| 페이지 레이아웃·디자인·기능 | `_site/src/pages/`, `_site/src/lib/`, `_site/src/styles/` |
| 갤러리 | `_site/src/pages/gallery.astro` |
| 스킬 & 인사이트 | `_site/src/pages/skills.astro` |
| 메인 | `_site/src/pages/index.astro` |
| 콘텐츠(미션·스킬후기·갤러리 항목 등) | vault 본체 폴더 (사이트 코드 아님) |

## 데이터 소스

vault 루트(상위 폴더 `..`)의 `02_mission/`, `99_meta/멤버목록.md`, `90_analysis/`, `06_unit/…/skills_md/` 등을 빌드 시 스캔한다.

- 사이트 코드는 `spongeclub_1/_site/`, vault 콘텐츠는 그 상위 폴더.
- 환경변수 `VAULT_PATH`로 위치를 덮어쓸 수 있다 (기본값: `..`). **반드시 `_site/` 안에서** 실행해야 콘텐츠를 읽는다.
- 멤버가 미션을 제출하면 같은 레포가 갱신되므로 Vercel이 자동 재빌드된다.

## 로컬 개발

```bash
cd _site
npm install
npm run dev          # http://localhost:4321
npm run build
```

## 배포 (Vercel)

Vercel 프로젝트를 `spongeclub_1` 레포에 연결하고 **Root Directory = `_site`** 로 지정한다.

- main 브랜치 push → Production
- PR push → Preview

## 라우트 (시즌 구조)

- `/` — **현재 시즌(2기) 메인.** 항상 `status:'active'` 시즌. 콘텐츠는 `src/data/season2.json`(현재 가상), 규모는 `src/config/seasons.ts`.
- `/season1/` — **1기 아카이브 랜딩** (지난 시즌 동결 스냅샷). 1기가 한 것을 그대로 보존.
- `/skills/` `/gallery/` `/members/` `/keywords/` `/archive/` `/board/` `/issue/[week]/` `/w/[week]/[team]/[member]/` `/member/[team]/[nickname]/`
  — **모두 1기 콘텐츠 페이지.** vault(1기) 데이터 기반. 이들의 "홈으로/brand" 링크는 `/season1/`을 가리킨다.

> 시즌 메타(번호·라벨·규모·시작일·경로)의 **단일 소스는 `src/config/seasons.ts`**. 2기 가상 콘텐츠는 `src/data/season2.json`(`status:'upcoming'`).

## 다음 시즌 올리기 (시즌 전환 런북)

3기가 시작될 때 (또는 2기 실데이터를 붙일 때):

1. `src/config/seasons.ts`에 새 시즌을 `status:'active'`로 추가하고, 직전 active(2기)를 `status:'archived'` + `path:'/season2'`로 바꾼다.
2. 직전 `src/pages/index.astro`를 `src/pages/season2.astro`로 복제한다. (`/`는 항상 active 시즌이 차지)
3. 새 `index.astro`의 본문/콘텐츠를 새 시즌에 맞게 작성한다. (가상이면 `season3.json`, 실데이터면 아래 ⚠️)
4. **새 active 시즌의 하위 페이지** "홈으로/brand" 링크가 그 시즌 랜딩을 가리키는지 점검한다 (이번 1기 전환과 동형 — `grep -rn 'href="/"' src/pages/`).
5. `npm run build` → `diff -r` 기준선 검증(의도된 변경만) → PR(`_site/` 경로만 스테이징) → 배포.

> chrome(헤더/스탯/푸터)은 **페이지별 유지가 설계**다. 3번째 시즌이 공유 형태를 실증하면 그때 컴포넌트화를 검토한다 (지금은 YAGNI).

### ⚠️ 실데이터 연결 시 (data.ts 시즌화 — 별도 과제)

`src/data/season2.json`의 가상값을 실데이터로 바꾸는 건 **한 줄 교체가 아니다.** `src/lib/data.ts`는
단일 `VAULT_PATH` + 1기 경로(`02_mission/`·`99_meta/멤버목록.md`·`90_analysis/teams`) + `TEAM_TOPICS` 1기 조장 하드코딩으로 묶여 있어,
그대로 `buildAllWeeks()`를 부르면 1기 데이터가 나온다. 실제 새 시즌 데이터를 읽으려면 다음 중 하나가 선행돼야 한다:
(a) 시즌별 별도 vault 경로, (b) vault 내 시즌 프리픽스 폴더, (c) `TEAM_TOPICS`/멤버목록/미션경로의 시즌 파라미터화.
또한 `publish-week.json` 게이트와 `/archive` 등 root 경로 네임스페이스도 시즌별로 정리해야 한다.

## 데이터 재생성

`analysis.json`(멤버 성장기록·키워드)은 빌드 전 1회 베이크 — 절차는 `scripts/generate-analysis.md`.
