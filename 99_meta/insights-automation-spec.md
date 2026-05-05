# 인사이트 자동화 파이프라인 — 운영 가이드

> 슬랙 #이기적인스킬러스 채널 → 옵시디언 `03_insights/` → (Phase 2) 다다 공개 사이트.
> Phase 1 = 무인 자동화. 사람 개입 없이 매주 일요일 11:00 KST에 GitHub Actions가 돈다.
>
> 설계 결정 근거(7라운드 deep interview 기록): [insights-deep-interview-spec.md](insights-deep-interview-spec.md).

## 한 줄 요약

매주 일요일 아침에 클로드코드도 노트북도 안 켜져 있어도, 슬랙에 올라온 한 주의 `/스킬공유` 글이 옵시디언에 카테고리별로 정리되고, 슬랙 채널에 주간 요약이 떨어진다.

## 동작 흐름

```
일요일 11:00 KST (= 02:00 UTC) 자동 트리거
   ↓
Slack API로 지난 주 글 fetch (윈도우: 지난 토 00:00 KST ~ 이번 토 00:00 KST)
   ↓
4섹션 템플릿(📌🔍💼🔗) 파싱 — 잡담 자동 제외
   ↓
Anthropic API로 카테고리 분류 + 베스트 2~3 추천 + 이유 작성
   ↓
03_insights/<카테고리>/<날짜>_<작성자>_<슬러그>.md 작성
   ↓
99_meta/insights-taxonomy.md 갱신 (새 카테고리 발생 시)
   ↓
99_meta/insights-cursor.json 갱신 (다음 주 시작점 저장)
   ↓
GitHub PR 자동 생성 (auto/insights-week-NN)
   ↓
[draft 모드] 운영자에게 DM으로 주간 요약 draft 발송 → 운영자가 검토·발행
[auto 모드]  슬랙 채널에 주간 요약 직접 발행
```

## 운영 모드

| 모드 | PR 처리 | Slack 발행 | 사용 시점 |
|------|---------|----------|----------|
| `draft` | 사람이 검토 후 머지 | 운영자 DM에 draft만 | **첫 2주** — 안정성 확인 |
| `auto`  | (옵션) 자동 머지 | 채널에 직접 발행 | 안정 확인 후 |

전환은 GitHub Actions secret `RUN_MODE` 값을 바꾸거나, 워크플로우 dispatch 입력에서 선택.

## 운영자가 해야 할 것

### 사전 1회 셋업
1. Slack 워크스페이스에서 **봇 토큰 발급** — 스코프: `channels:history`, `chat:write`, `users:read`, `im:write`
2. **`#이기적인스킬러스` 채널에 봇 초대** (`/invite @스폰지셸봇` 또는 신규 봇)
3. **Anthropic API key** 확보
4. GitHub repo Secrets에 등록:
   - `SLACK_BOT_TOKEN`
   - `SLACK_INSIGHTS_CHANNEL_ID` (`#이기적인스킬러스` 채널 ID, `C...`)
   - `SLACK_OPERATOR_USER_ID` (운영자 Slack 유저 ID, `U...` — DM 받을 사람)
   - `ANTHROPIC_API_KEY`

### 매주 일요일 (draft 모드)
1. 일요일 11시 직후 슬랙 DM 확인 → AI가 만든 주간 요약 draft 검토
2. GitHub repo의 `auto/insights-week-NN` PR 검토 — `03_insights/` 새 글, taxonomy 변경 합리적인지
3. PR squash merge
4. DM에서 받은 메시지 OK면 채널에 직접 붙여넣어 발행

### 안정 확인 후 (auto 모드 전환)
- GitHub Actions에서 `RUN_MODE=auto`로 전환
- 이후 매주 일요일 11시에 채널 자동 발행 + PR 자동 머지 (라벨 또는 후속 액션 설정 시)

## 카테고리 운영

- 초기 카테고리는 `99_meta/insights-taxonomy.md`에 7개 정의돼 있음
- AI가 새 글이 어디에도 안 맞다고 판단하면 새 카테고리를 제안 → 자동으로 taxonomy에 추가됨 → PR에 변경 포함
- 운영자가 이상한 카테고리가 추가되면 PR에서 직접 수정 후 머지

## Cursor (윈도우 누적 처리)

`99_meta/insights-cursor.json`이 마지막 처리 시각을 저장한다. 매 실행마다 cursor 이후 ~ 이번 토요일 00:00 KST 사이의 글을 가져온다. 다음 실행은 그 이후부터.

| 필드 | 의미 |
|------|------|
| `lastBatchEndIso` | 마지막 처리 윈도우의 endUtc (ISO UTC). 다음 실행의 startUtc로 사용. |
| `lastRunIso` | 마지막 실행 시각 (UTC). |
| `lastRunMode` | 마지막 실행 모드 (`draft` 또는 `auto`). |
| `lastRunMessages` | 마지막 실행에서 분류된 인사이트 수. |

cursor 충돌이 있을 수 있으니 PR 머지 시 cursor 파일은 가장 최신 commit을 기준으로.

## Phase 2 (다다 공개 사이트 통합) — 미정

다다와 협의 후:
- 옵시디언 `03_insights/` 콘텐츠를 공개 아카이브 사이트로 빌드
- 검색·필터·카테고리별 페이지·작성자별 페이지
- 기술 스택·빌드 방식 (sync-content / 빌드타임 fetch / Obsidian Publish 등) 결정 필요

## 코드·인프라

| 위치 | 역할 |
|------|------|
| `tools/insights-pipeline/` | TypeScript 파이프라인 코드 (Node 20+, tsx) |
| `tools/insights-pipeline/README.md` | 개발자용 상세 문서 |
| `.github/workflows/weekly-insights.yml` | cron + 워크플로우 정의 |
| `99_meta/insights-taxonomy.md` | 카테고리 정의 |
| `99_meta/insights-cursor.json` | 마지막 처리 시점 |
| `03_insights/` | 자동 적재되는 인사이트 콘텐츠 |

## 인접 시스템 (건드리지 않음)

- **스폰지셸봇**: 어드민 승인 후 +1🐚 지급. 우리는 읽기·쓰기 모두 X.
- **`spongeclub-community.vercel.app/mypage`**: 개인 셸 잔액. 우리는 손대지 않음.
- **셸 지급**: 다른 크루 담당.
