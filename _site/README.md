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

## 라우트

- `/` — 매거진 랜딩 (이번 호 표지 + 주차별 아카이브)
- `/skills/` — 스킬 & 인사이트 (떠오르는 / 새로 들어온 2섹션)
- `/gallery/` — 산출물 갤러리
- `/issue/[week]/` — 주차별 이슈 (조별 기록 모음)
- `/board/` — 주차 탭 + 조별/전체 토글 과제 현황판
- `/w/[week]/[team]/[member]/` — 멤버별 주차 노트 (vault md 렌더링)

## 데이터 재생성

`analysis.json`(멤버 성장기록·키워드)은 빌드 전 1회 베이크 — 절차는 `scripts/generate-analysis.md`.
