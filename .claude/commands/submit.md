---
description: 미션 노트 제출 — 브랜치 → 커밋 → 푸쉬 → PR → 스쿼시 머지 자동
argument-hint: [주차번호 또는 메모]
---

미션 노트를 GitHub에 제출한다. 브랜치 → PR → 스쿼시 머지까지 자동 처리.

## 트리거 문구
사용자가 다음 중 하나를 말하면 이 커맨드를 실행:
- `/submit`
- "미션 제출할게"
- "제출해줘", "푸쉬해줘"

## 실행 절차

### 1. 멤버 + 변경 파일 확인

**멤버 정보**:
- `99_meta/멤버목록.md`에서 사용자 본인의 조와 닉네임 확인
- 모르면 물어본다: "본인 조와 닉네임 알려주세요 (예: 1조 나무)"

**변경 파일**:
```bash
git status -s
```
- `02_mission/N주차_.../조N/조N_닉네임_*` 패턴의 변경/신규 파일이 있는지 확인
- 본인 파일이 아닌 변경(다른 멤버, 다른 폴더)이 섞여 있으면 stage 분리 권유

### 2. 주차 자동 감지

변경된 파일 경로에서 주차 추출:
- `02_mission/0주차_OT_0503/...` → 0주차
- `02_mission/1주차_0510/...` → 1주차
- `02_mission/N주차*/...` → N주차

여러 주차가 섞여 있으면 사용자에게 확인.

### 3. 최신 main 동기화

```bash
git checkout main
git pull origin main
```

충돌/오류가 있으면 중단하고 사용자에게 안내.

### 4. 브랜치 생성

기본 형식: `submit/조N-닉네임-N주차`
- 예: `submit/1조-나무-1주차`, `submit/3조-흐민-OT`

```bash
git checkout -b submit/조N-닉네임-N주차
```

이미 같은 이름의 로컬/리모트 브랜치가 있으면 뒤에 `-2`, `-3` 등 숫자 붙이기.

### 5. 폴더 단위 stage + 커밋

**중요**: 개별 `.md` 파일이 아니라 **본인 폴더 단위**로 add 한다.
이미지(`.png`)와 첨부 파일이 자동 포함되어 누락 방지.

```bash
git add 02_mission/N주차_*/조N/
```

(필요하면 `99_meta/`, `03_insights/` 등 본인이 추가한 다른 폴더도 함께)

커밋:
```bash
git commit -m "[mission] 조N 닉네임 - N주차 제출"
```

여러 주차 동시 제출 시: `[mission] 조N 닉네임 - 1~3주차 제출`

### 6. Push + PR + 스쿼시 머지

```bash
git push -u origin submit/조N-닉네임-N주차

gh pr create \
  --title "[mission] 조N 닉네임 - N주차 제출" \
  --body ""

gh pr merge --squash --delete-branch
```

### 7. 정리

```bash
git checkout main
git pull origin main
```

### 8. 완료 보고

사용자에게 한 줄로 안내:
```
✅ PR #NN 머지 완료 — 조N 닉네임 N주차 제출
```

## 주의

- **main 직접 push 금지** (CLAUDE.md 규칙). 항상 브랜치 → PR → squash merge 흐름.
- **개별 `.md` add 금지** — 폴더 단위로 add 해야 이미지(.png)가 함께 포함됨.
  - ❌ `git add 02_mission/3주차_0524/1조/1조_나무_3주차_submit.md` (이미지 누락)
  - ✅ `git add 02_mission/3주차_0524/1조/` (.md + attachments/ 둘 다)
- **본인 파일만** stage. 다른 멤버 파일이나 운영 파일이 섞이면 분리 권유.
- 충돌 발생 시: 본인 작업만 살려서 다시 시도. 임의로 다른 사람 변경 덮어쓰기 금지.

## 사용 예

```
/submit                       → 변경 파일에서 주차 자동 감지
/submit 3                     → 3주차 명시
미션 제출할게                  → 동일 동작
```
