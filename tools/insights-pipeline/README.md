# insights-pipeline

스폰지클럽 Slack `#이기적인스킬러스` 채널의 `/스킬공유` 글을 매주 일요일 자동으로 옵시디언 vault `03_insights/` 카테고리별로 적재하고, 슬랙 채널에 주간 요약 메시지를 발행한다.

운영자(클로드 코드 세션 포함) 개입 없이 GitHub Actions cron으로 굴러가는 게 목표.

## 흐름

```
일요일 11:00 KST cron
  → Slack API: window=[지난 토:00 KST, 이번 토:00 KST) 메시지 fetch
  → 4섹션 템플릿(📌🔍💼🔗) 파싱
  → Anthropic API: 카테고리 분류 + 베스트 2~3 추천 + 이유 생성
  → 03_insights/<카테고리>/<날짜>_<작성자>_<슬러그>.md 작성
  → 99_meta/insights-taxonomy.md 업데이트 (새 카테고리 발생 시)
  → 99_meta/insights-cursor.json 갱신
  → GitHub PR 자동 생성 (auto/insights-week-NN)
  → 슬랙 채널 또는 운영자 DM에 주간 요약 메시지 발행
```

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `SLACK_BOT_TOKEN` | ✅ | `xoxb-...` 봇 토큰. 스코프: `channels:history`, `chat:write`, `users:read`, `im:write` |
| `SLACK_INSIGHTS_CHANNEL_ID` | ✅ | `#이기적인스킬러스` 채널 ID (`C...`) |
| `ANTHROPIC_API_KEY` | ✅ | Claude API 키 |
| `SLACK_OPERATOR_USER_ID` | ⚪ | 운영자 Slack 유저 ID (`U...`). draft 모드에서 DM 받는 사람. |
| `RUN_MODE` | ⚪ | `draft` (기본) 또는 `auto`. `auto`면 채널 직접 발행 + PR 자동 머지 가능. |
| `ANTHROPIC_MODEL` | ⚪ | 기본 `claude-sonnet-4-6` |
| `VAULT_ROOT` | ⚪ | vault 루트 절대경로. 기본은 이 디렉토리 기준 자동 감지 (`../..`). |
| `DISABLE_CHANNEL_POST` | ⚪ | `1`로 두면 슬랙 발행 스킵. 디버깅용. |

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 타입 체크
npm run typecheck

# 3. 테스트
npm test

# 4. 픽스처 기반 dry-run (LLM·Slack 안 침)
SKIP_LLM=1 npx tsx src/main.ts \
  --fixture tests/fixtures/sample-batch.json \
  --dry-run \
  --vault-root /tmp/vault-test

# 5. 실제 환경 dry-run (Slack/Anthropic 호출은 함, 파일 쓰기 안 함)
cp .env.example .env  # 그리고 키 채움
set -a; source .env; set +a
npm run dry-run
```

## GitHub Actions

매주 일요일 02:00 UTC (= 11:00 KST)에 `.github/workflows/weekly-insights.yml`이 cron으로 실행. `workflow_dispatch`로 수동 트리거도 가능.

GitHub repo Secrets에 다음 키 등록 필요:
- `SLACK_BOT_TOKEN`
- `SLACK_INSIGHTS_CHANNEL_ID`
- `SLACK_OPERATOR_USER_ID` (선택)
- `ANTHROPIC_API_KEY`

## 운영 모드

- **draft** (기본, 첫 2주): PR 자동 머지 X. Slack 채널 발행 X. 대신 운영자 DM으로 메시지 draft 발송. 사람이 검토 후 머지·발행.
- **auto** (안정 후): PR 자동 머지 (라벨 또는 후속 액션 필요). Slack 채널 자동 발행.

## 파일

| 위치 | 역할 |
|------|------|
| `src/main.ts` | 오케스트레이션 |
| `src/config.ts` | env 로딩 |
| `src/window.ts` | Saturday-midnight-KST 윈도우 계산 |
| `src/cursor.ts` | `99_meta/insights-cursor.json` 읽기·쓰기 |
| `src/fetch_slack.ts` | Slack `conversations.history` 호출 + permalink + user 디렉토리 |
| `src/parse_template.ts` | 4섹션(📌🔍💼🔗) 파서 |
| `src/classify.ts` | Anthropic API 분류 + 베스트 추천 |
| `src/write_obsidian.ts` | 옵시디언 노트 작성 + 택소노미 갱신 |
| `src/post_summary.ts` | 주간 요약 메시지 텍스트 + 채널/DM 발행 |

## Cursor 의미

`99_meta/insights-cursor.json`의 `lastBatchEndIso`는 **마지막으로 처리한 윈도우의 endUtc** (= 가장 최근 토요일 00:00 KST). 다음 실행은 이 시각 이후의 메시지부터 가져온다. cursor가 비어있으면 첫 실행으로 간주, endUtc - 7일을 startUtc로 사용.

## 인접 시스템

- **스폰지셸봇**: `/스킬공유` 슬래시 커맨드 처리 + `+1🐚` 지급. 우리는 건드리지 않음.
- **`spongeclub-community.vercel.app/mypage`**: 개인 셸 잔액. 우리는 읽지도 쓰지도 않음.
- **다다 공개 사이트** (Phase 2): 옵시디언 콘텐츠를 공개 아카이브로 빌드. 우리는 콘텐츠 적재까지만, 빌드는 다다.

## 알려진 한계

- 슬랙 봇 토큰의 채널 가입 필요 (`/invite @bot`). 그렇지 않으면 history 조회 권한 거부.
- Anthropic API 비용은 메시지 수에 거의 비례. 주당 30개 정도면 monthly < $1 (Sonnet 기준).
- 첫 실행은 cursor 없이 시작 → 윈도우 = 직전 7일. 이전 글 backfill은 별도 작업.
