# 이기적인스킬러스 채널 자동화 — Phase 1 Spec (v2)

> **이 문서는 설계 결정 근거(deep interview 7라운드 + v2 보강)의 영구 기록.**
> 운영자가 매주 봐야 하는 가이드는 [insights-automation-spec.md](insights-automation-spec.md).
> 코드 구조는 [tools/insights-pipeline/README.md](../tools/insights-pipeline/README.md).

## Context

스폰지클럽 슬랙 `#이기적인스킬러스` 채널은 **이미 구조화된 인사이트 채널**이다 — `/스킬공유` 슬래시 커맨드 + 고정 4섹션 템플릿(📌 한줄 요약 / 🔍 주요 내용 / 💼 활용 포인트 / 🔗 링크). `스폰지셸봇`이 이미 어드민 승인 → +1🐚 지급까지 처리하고 `spongeclub-community.vercel.app/mypage`에서 개인 셸 잔액을 보여준다. **셸 지급은 다른 크루 담당**.

**우리가 채울 빈칸**: 슬랙 글 → 옵시디언 vault `03_insights/`에 카테고리별 자동 적재 + 매주 일요일 슬랙 채널에 주간 요약 메시지 발행. **사람(클로드 코드 세션 포함) 개입 없이** 매주 자동으로 굴러가야 한다.

## 2-Phase 로드맵

| Phase | 범위 | 다다 의존 | 시점 |
|-------|------|---------|------|
| **Phase 1 (이 plan)** | Slack → `03_insights/` 적재 + 일요일 주간 요약 (무인 자동화) | ❌ 독립 | 이번 일요일까지 가능 |
| **Phase 2** | 옵시디언 → 다다 공개 아카이브/대시보드 사이트 | ✅ 다다 input | 다다 진척 후 |

## 자동화 아키텍처 — GitHub Actions cron (추천)

**왜 GitHub Actions?**
- 이미 git repo 위에 있음 → 결과물(03_insights/*.md)을 commit/PR로 자연스럽게 vault에 적재
- 무료 (private repo 월 2000분, 이 작업은 분당 단위 사용)
- API key는 GitHub Secrets로 안전히 관리 (Slack bot token, Anthropic API key)
- 로그·실패 알림이 GitHub UI에 남음 (디버깅 쉬움)
- 에밀리 컴퓨터·클로드 코드와 완전 분리

**대안 비교 (요약):**

| 옵션 | 장점 | 단점 | 결론 |
|------|------|------|------|
| **A. GitHub Actions cron** | 무료, repo 통합, 무인 | API key 셋업 필요 | ✅ 추천 |
| B. Slack Workflow Builder + Zapier/Make | Slack 안에서 관리 | 외부 SaaS 비용·디버깅 분산 | 보조 |
| C. 스폰지셸봇 기능 추가 | 기존 시스템 통합 | 다다 의존 | Phase 2와 함께 검토 |
| D. 로컬 cron (에밀리 맥) | 단순 | 컴퓨터 켜져있어야 함 | ❌ "무인" 요구와 충돌 |

### 실행 흐름

```
GitHub Actions cron (매주 일요일 11:00 KST = 02:00 UTC)
    ↓
[1] Slack API: window=[지난 토:12:00, 이번 토:12:00) 메시지 fetch
    ↓
[2] Anthropic API: 카테고리 분류 + 베스트 2~3 추천 + 이유 생성
    ↓
[3] 03_insights/<카테고리>/<slug>.md 파일 생성 + frontmatter
    ↓
[4] 99_meta/insights-taxonomy.md 업데이트 (새 카테고리 발생 시)
    ↓
[5] git commit + PR (브랜치: auto/insights-week-NN)
    ↓
[6] GitHub Action에서 PR squash merge (운영자 검수 모드면 라벨 대기)
    ↓
[7] Slack chat.postMessage: 주간 요약 메시지 채널 발행
    ↓
[8] cursor 파일 갱신 (.omc/state/insights-cursor.json)
```

운영자 개입 0. 단, **첫 2주는 "draft 모드"** — PR 자동 머지 X, Slack 자동 발행 X. 에밀리가 PR과 메시지 draft 검토 후 머지·발행. 안정되면 fully auto로 전환.

## Goal

매주 일요일 11:00 KST에 GitHub Actions가 자동 실행:
1. 한 주간(토:12 ~ 토:12) `/스킬공유` 글을 옵시디언 `03_insights/<카테고리>/`에 자동 적재
2. 슬랙 채널에 **주간 요약 메시지** 자동 발행 (총 N개 + 카테고리 분포 + 베스트 2~3개 + 이유)

## Constraints

- **수집 윈도우**: `[지난 토요일 12:00 KST, 이번 토요일 12:00 KST)`. cursor 파일로 다음 배치 시작점 보존.
- **분류 전략**: AI 자율. 초기 시드 카테고리 5~8개(AI도구/프롬프트/자동화/시장동향/워크플로우/학습자료 등)로 시작, 매주 안 맞는 글이 나오면 새 카테고리 제안.
- **API key 관리**: GitHub Secrets에 `SLACK_BOT_TOKEN`, `ANTHROPIC_API_KEY` 저장. 코드에 노출 금지.
- **셸 지급 미터치**: 외부 크루 영역.
- **다다 시스템 미터치**: vercel.app·셸봇 그대로 둠.
- **백필 안 함**: 이번 주만 시작. 과거 글 일괄 적재는 별도 1회성 작업.
- **운영 모드 전환**: 첫 2주 draft → 안정화 후 auto.

## Non-Goals (Phase 1 범위 밖)

- 옵시디언 → 다다 공개 사이트 빌드 (Phase 2)
- 셸 자동 지급
- spongeclub-community.vercel.app 수정
- 슬랙 봇 신규 작성
- 채널 시작부터 일괄 백필

## Acceptance Criteria

- [ ] `.github/workflows/weekly-insights.yml`이 매주 일요일 11:00 KST에 자동 실행
- [ ] 실행 결과로 `03_insights/<카테고리>/<날짜>_<작성자>_<슬러그>.md` 파일 생성
- [ ] 각 노트 frontmatter: `작성자, 작성일, 카테고리, 슬랙_원본_링크, 한줄요약, 메시지_타임스탬프, 승인상태(가능시)`
- [ ] 본문은 템플릿 4섹션(📌🔍💼🔗) 원본 보존
- [ ] cursor 파일 갱신 — 다음 실행 시 윈도우 정확히 이어짐
- [ ] PR 자동 생성 (브랜치 `auto/insights-week-NN`) — draft 모드면 머지 대기, auto 모드면 squash merge
- [ ] 슬랙 채널에 주간 요약 메시지 발행 — 총 N개 / 카테고리 분포 / 베스트 2~3개 + 이유 1~2줄씩 / 옵시디언 링크
- [ ] `99_meta/insights-taxonomy.md`에 현재 카테고리 목록·정의·추가 로그
- [ ] 실패 시 GitHub Actions에서 운영자에게 Slack DM 알림 (옵션)

## 폴더 전략

| 위치 | 무엇이 들어가는가 | 이유 |
|------|-----------------|------|
| `03_insights/<카테고리>/*.md` | **인사이트 콘텐츠** (자동 적재) | vault 핵심 자산. 다다 사이트 인풋. |
| `99_meta/insights-taxonomy.md` | 카테고리 정의·진화 로그 | 운영 메타. 사람이 가끔 검토. |
| `99_meta/insights-automation-spec.md` | 이 spec의 사람용 사본 | 운영자가 vault 내에서 참조. |
| `tools/insights-pipeline/` | **자동화 스크립트** (Python 또는 Node/Bun) | 코드 vs 콘텐츠 분리. 옵시디언 빌드 시 제외 가능. |
| `tools/insights-pipeline/README.md` | 스크립트 사용법·환경변수·로컬 테스트 | 신규 컨트리뷰터·디버깅용. |
| `.github/workflows/weekly-insights.yml` | cron + 워크플로우 정의 | GitHub Actions 표준 위치. |
| `.omc/state/insights-cursor.json` | 마지막 배치 시점 (gitignore 또는 commit) | 작은 상태 파일. commit해두면 머신 변경에도 안전. |
| `.omc/specs/deep-interview-skillers.md` | 인터뷰 transcript 원본 | 의사결정 추적용. (선택) |

**현재 worktree(`.claude/worktrees/peaceful-benz-331591`) 처리**: 이번 작업이 끝나면 결과물을 `submit/스킬러스-자동화` 브랜치 PR로 main에 머지 후 worktree 정리 (CLAUDE.md 제출 워크플로우 준수).

**스킬러스 vault 자체**: 그대로 둠. 폴더 추가만 함 (03_insights/, tools/, .github/).

## 핵심 파일 (생성 예정)

```
.github/workflows/
└── weekly-insights.yml                   # cron + 스크립트 실행

tools/insights-pipeline/
├── README.md                             # 사용법·env·로컬 테스트
├── package.json (또는 requirements.txt)  # 의존성
├── src/
│   ├── fetch_slack.ts                    # Slack API: 메시지 fetch
│   ├── parse_template.ts                 # 4섹션 템플릿 파싱
│   ├── classify.ts                       # Anthropic API: 카테고리 분류 + 베스트 추천
│   ├── write_obsidian.ts                 # md 파일 + frontmatter 작성
│   ├── post_summary.ts                   # Slack chat.postMessage
│   ├── update_cursor.ts                  # cursor 갱신
│   └── main.ts                           # 오케스트레이션
└── tests/
    └── fixtures/                         # 슬랙 메시지 샘플 (실제 메시지 가공)

99_meta/
├── insights-taxonomy.md                  # 카테고리 정의·진화 로그
└── insights-automation-spec.md           # 이 spec의 사람용 사본

03_insights/                              # 자동 적재 (실행 시 카테고리 폴더 생성)
└── .gitkeep                              # 이미 존재

.omc/state/
└── insights-cursor.json                  # {last_batch_iso: "2026-05-09T03:00:00Z"}
```

## 구현 흐름

1. **사전 작업 (운영자 + 다다)**:
   - Slack 워크스페이스에서 봇 토큰 발급 (`channels:history`, `chat:write` 스코프)
   - Anthropic API key 확보
   - GitHub repo Secrets에 두 키 저장
   - **다다와 협의**: spongeclub-community 백엔드에 데이터가 있으면 거기서 읽는 옵션도 검토 (Slack API보다 깔끔할 수 있음)

2. **스크립트 작성** (`tools/insights-pipeline/`):
   - 언어: TypeScript + Bun (또는 Python — 둘 다 동등). Bun이면 의존성 가볍고 GitHub Actions에서 빠름.
   - Anthropic SDK + Slack Web API SDK
   - 모든 입출력에 dry-run 플래그

3. **GitHub Actions workflow 작성**:
   ```yaml
   name: Weekly Insights
   on:
     schedule:
       - cron: '0 2 * * 0'  # 일요일 02:00 UTC = 11:00 KST
     workflow_dispatch:       # 수동 트리거 가능
   jobs:
     run:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: oven-sh/setup-bun@v1
         - run: bun install
           working-directory: tools/insights-pipeline
         - run: bun run src/main.ts
           working-directory: tools/insights-pipeline
           env:
             SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
             ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
             RUN_MODE: draft   # 첫 2주는 draft, 안정 후 auto
         - name: Create PR
           uses: peter-evans/create-pull-request@v6
           with:
             branch: auto/insights-week-${{ github.run_number }}
             title: '[insight] Week NN 자동 적재'
             body: '주간 인사이트 자동 적재. draft 모드 — 검토 후 머지.'
   ```

4. **첫 실행 (draft 모드)**:
   - 이번 일요일 11:00 KST 자동 실행
   - PR 생성 (auto-merge X) + Slack 메시지 draft를 운영자 DM으로 발송
   - 에밀리: PR 검토 → 머지 + DM에서 메시지 OK → 채널 직접 발행

5. **2주차 안정성 확인 후 RUN_MODE=auto 전환**:
   - PR auto-merge ON
   - Slack 채널 자동 발행 ON

## Open Questions (다다와 상의)

1. `spongeclub-community.vercel.app` 백엔드에 슬래시 명령어 데이터가 저장돼 있는지? (있으면 Slack API 우회 가능 — 더 깔끔)
2. 다다 공개 사이트 기술 스택? (Phase 2 빌드 방식 결정에 필요)
3. GitHub repo가 public인가 private인가? (Actions 분 한도 영향)

## Verification (end-to-end 테스트)

1. **로컬 dry-run**:
   ```bash
   cd tools/insights-pipeline
   bun run src/main.ts --dry-run --window-end 2026-05-10T03:00:00Z
   ```
   결과 콘솔 출력만, 파일·슬랙 미터치.

2. **샘플 fixture 테스트**: `tests/fixtures/`에 샘플 슬랙 메시지 넣고 분류·파싱 결과 확인.

3. **첫 실제 실행 (이번 일요일)**:
   - workflow_dispatch로 수동 트리거 (cron 기다리지 않고)
   - PR 생성 확인 → 03_insights/ 콘텐츠 검수 → frontmatter 구조 확인
   - Slack DM으로 받은 메시지 draft 합리성 검수 → 채널 발행
   - cursor 파일 시각 확인

4. **2주차 자동 실행**:
   - 다음 일요일 cron 자동 트리거
   - 윈도우가 정확히 이어지는지 (지난주 cursor 시각 == 이번 윈도우 start)

5. **실패 시나리오**:
   - Slack API 토큰 만료 → workflow 실패 → GitHub 알림 (옵션: Slack DM)
   - 새 카테고리 발생 → taxonomy 파일에 추가 → PR에 변경 포함

## Interview Transcript

| Round | Q | A | Ambiguity |
|-------|---|---|-----------|
| 1 | 최우선 목표? | 데이터 파이프라인 (1번), 4가지 다 필요 | 100→57% |
| 2 | 카테고리 체계? | AI 자율 ("너가 알아서") | 57→50% |
| 3 | 수집 필터? | 필요 X — 템플릿 고정 채널 | 50→45% |
| 4 | 템플릿 + 옵시디언 가는 이유? | `/스킬공유` 4섹션 + 셸봇/Vercel 마이페이지 (기존), 옵시디언 = 아카이빙·대시보드 | 45→43% |
| 5 | vercel app vs 다다 사이트? | 다다 확인 필요 (Phase 분리) | 43→34% |
| 6 | MVP 범위? | 적재 + 주간 요약 (베스트 2~3 + AI 이유). 셸은 외부 | 34→22.5% |
| 7 | 첫 배치 수집 범위? | 이번 주만 — 토:12 ~ 토:12 cursor | 22.5→17% ✅ |
| **v2** | **무인 자동화 + 폴더?** | **GitHub Actions cron + tools/insights-pipeline + 99_meta/spec** | (반영됨) |

## Final Ontology (19개)

Slack(채널·메시지·템플릿·`/스킬공유`·셸봇·승인) / 콘텐츠(인사이트·카테고리·한줄요약) / 옵시디언(03_insights·99_meta) / 웹(Vercel 마이페이지·다다 사이트) / 사이클(토 마감·배치 윈도우·요약 메시지·cursor) / 사람(크루·운영자) / 화폐(셸·외부)
