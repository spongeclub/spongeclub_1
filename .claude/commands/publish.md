---
description: 스터디 아카이브 사이트 발행 — 발행 주차 올리기 + 빌드 검증 + PR 머지 (Vercel 자동 배포)
---

스폰지클럽 매거진 사이트를 발행해줘.

> ⭐ **사이트 소스는 이 레포의 `_site/` 하나다.** (2026-06-01 통합)
> 예전 별도 레포(`selfishclub/aaa-admin`, `spongeclub/spongeclub_homepage`)는 은퇴했다 — 건드리지 않는다.
> 콘텐츠 복사(`sync-content.sh`)도 없다. `_site/src/lib/data.ts`가 **vault를 빌드 시 직접 읽는다.**

## 실행 절차

### 0. 최신화

```bash
git checkout main && git pull origin main
```

충돌이 있으면 사용자에게 알리고 중단한다.

### 1. 무엇을 발행할지 확인

`_site/src/data/publish-week.json`의 `publishedWeek`가 메인('이번 호') 발행 게이트다.

- 숫자면 **그 주차까지만** 메인에 노출된다. 그 이후 주차는 MVP가 다 채워져도 안 나온다.
- `null`이면 폴더 날짜 기준 자동 전환.
- 사용자가 "발행해줘 / 이번 주차 올려줘"라고 하면 → 이 값을 **다음 주차로 올린다.**

> `/archive`는 이 게이트와 무관하게 제출된 주차를 모두 보여준다. 게이트는 메인 페이지에만 적용된다.

올리기 전에 해당 주차가 실제로 준비됐는지 확인한다:
- `02_mission/{주차}주차_*/` 에 제출 노트가 있는지
- 그 노트들의 frontmatter가 `submitted: true`인지 (`false`는 **템플릿 기본값**이라 정상 — 제출 확정된 것만 true)

### 2. analysis.json 재생성 (필요할 때만)

`_site/src/data/analysis.json`은 멤버 성장기록·주차 키워드의 원천이다. 빌드 전에 1회 베이크해 커밋하는 구조라, **새 주차 제출이 마감됐거나 노트가 크게 바뀐 경우에만** 다시 만든다.

절차는 `_site/scripts/generate-analysis.md`를 따른다. 변경이 없으면 이 단계는 건너뛴다.

### 3. 빌드 검증 (필수)

반드시 `_site/` 안에서 실행해야 vault를 읽는다.

```bash
cd _site && npm install && npm run build
```

- 에러가 나면 고치고 다시 빌드한다. **빌드가 깨진 채로 진행하지 않는다.**
- 빌드가 통과하면 `npm run preview`로 눈으로 확인할 수 있다.

### 4. 커밋 → PR → 머지

`main` 직접 push는 금지다. 브랜치를 파서 PR로 머지한다.

```bash
git checkout -b site/publish-{주차}주차
git add _site/src/data/publish-week.json   # analysis.json 등 바뀐 것도 함께
git commit -m "[site] {N}주차 발행"
git push -u origin site/publish-{주차}주차
gh pr create --title "[site] {N}주차 발행" --body ""
gh pr merge --squash
git checkout main && git pull origin main
```

### 5. 배포 확인

Vercel이 `spongeclub_1` 레포에 연결돼 있고 **Root Directory = `_site`**다.

- main 머지 → Production 자동 배포
- PR push → Preview 배포

배포가 끝나면 실제 URL을 열어 발행된 주차가 메인에 보이는지 확인하고 사용자에게 보고한다.
**소스만 고치고 "완료"라고 하지 않는다.**

## 참고 — 콘텐츠가 사이트에 반영되는 경로

| 사이트 | 읽는 vault 위치 |
|---|---|
| `/` 메인, `/archive/`, `/issue/[week]/`, `/w/...` | `02_mission/N주차_*/N조/` |
| `/skills/` 스킬 & 인사이트 | `06_unit/데굴데굴/스킬인사이트/skills_md/` |
| `/members/`, `/member/...` | `99_meta/멤버목록.md` + `90_analysis/` |
| `/gallery/` | `_site/src/data/gallery.json` (인풋: `02_mission/gallery input/`) |

멤버가 미션을 제출하면 같은 레포가 갱신되므로 Vercel이 자동 재빌드된다 — 별도 동기화 작업은 없다.
