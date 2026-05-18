# 스폰지클럽 — 프로젝트 메모리

> 6개조 × 12명 AI 스터디·커뮤니티. 매주 과제 제출 + 인사이트 공유 + Vercel 배포.

## 변경 로그
- [2026-05-18] 다다 — 사이트 코드를 별도 레포(`spongeclub_homepage`)에서 vault 레포 안 `_site/`로 통합. 단일 레포 운영.
- [2026-05-01] 다다 — 프로젝트 시작. AAA 하네스 복사 후 스폰지클럽 구조로 정리 (조 단위 반영, `/publish` 보류)

## 활성 의사결정
- **사이트 = vault 단일 레포** — Astro 사이트 코드는 `_site/`. 데이터는 vault 루트(`..`)에서 읽음. 멤버 미션 PR 머지 = 사이트 자동 재빌드. Vercel Root Directory는 `_site`. 기존 `spongeclub_homepage` 레포는 폐기.
- **파일명 규칙** — 미션·프로필 파일명에 `조N` 포함 (`Week_0N_조N_닉네임_submit.md`, `조N_닉네임_프로필.md`)
- **publish 명령어 삭제** — AAA 사이트(`selfishclub/aaa-admin`) 전용이라 스폰지클럽에 부적합

