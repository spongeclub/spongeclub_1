# 스폰지클럽 매거진 사이트 (`_site/`)

스폰지클럽 매거진 홈페이지 · Astro + Vercel.
**이 폴더는 vault 레포(`spongeclub_1`) 안에 함께 들어 있다** — 콘텐츠와 사이트가 한 레포.

## 데이터 소스

vault 루트(상위 폴더 `..`)의 `02_mission/`, `99_meta/멤버목록.md`를 빌드 시 스캔한다.

- 사이트 코드는 `spongeclub_1/_site/`, vault 콘텐츠는 그 상위 폴더.
- 환경변수 `VAULT_PATH`로 위치를 덮어쓸 수 있다 (기본값: `..`).
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

- `/` — 매거진 랜딩 (이번 호 표지 + 지난 호 아카이브)
- `/issue/[week]/` — 주차별 이슈 (조별 기록 모음)
- `/board/` — 주차 탭 + 조별/전체 토글 과제 현황판
- `/w/[week]/[team]/[member]/` — 멤버별 주차 노트 (vault md 렌더링)
