---
title: "텔레그램 봇 2개(Ops VPCT·헤르메스) Anthropic Claude 폴백 구성 + 헤르메스 Codex 전용 계정 분리"
date: 2026-07-21
project: "macmini-telegram-bots"
type: "debug"
tags:
  - telegram-bot
  - openclaw
  - hermes-agent
  - anthropic-fallback
  - codex-quota
  - config-bug
  - credential-pool
  - chatgpt-plus
  - multi-account
  - billing-path-verification
status: completed
duration_estimate: "미기록"
tools_used:
  - "openclaw CLI (gateway install/config)"
  - "Claude Pro/Max setup-token"
  - "Hermes Agent config.yaml"
  - "Hermes Agent credential pool (auth.json)"
---

## 작업 요약
Codex(ChatGPT) 구독 사용량 한도 초과로 응답 불가 상태였던 텔레그램 봇 2개(Ops VPCT = OpenClaw, 헤르메스 브레인 = Hermes Agent)에 Anthropic Claude 폴백을 구성. 그 과정에서 발견된 설정 버그 4건, 정체 미확인이었던 별도 시스템 1건을 함께 해결. 이후 헤르메스 쪽 폴백용 Anthropic 크레딧이 두 차례 소진되는 사고가 반복돼, API 키 방식 ↔ Claude Max 구독 OAuth 방식을 오가며 그때그때 살아있는 결제 경로로 전환해 임시 해결. 근본적으로는 OpenClaw와 Hermes가 같은 Codex 계정을 공유해 동시에 한도 초과되는 구조 자체가 원인이라 판단해, 헤르메스 전용 두 번째 ChatGPT Plus 계정을 credential pool에 추가하고 우선순위를 1순위로 올려 두 시스템의 Codex 계정을 분리했다. 마지막으로 "OpenClaw의 Anthropic 폴백도 같은 방식으로 계정을 분리해야 하는가"를 검증한 결과, OpenClaw(setup-token)와 Hermes(OAuth 세션 재사용)는 애초에 서로 다른 과금 경로(구독 기본 quota window vs extra usage 크레딧)를 쓰고 있어 셋째 계정은 불필요하다는 결론으로 마무리했다.

## 배경
- 맥미니에서 운영 중인 텔레그램 봇 2개가 OpenAI Codex 구독 사용량 한도 초과(리셋 예정: 2026-07-26 01:36 KST)로 응답 불가.
- 목표: Codex 한도 초과 시 Anthropic Claude로 자동 폴백되는 2단계 구조 구축, 7/26 리셋 시 자동 복귀.
- 이후 목표 추가: 헤르메스와 OpenClaw가 같은 Codex 계정을 공유하는 구조 자체를 해소해, 한쪽이 한도를 소진해도 다른 쪽은 영향받지 않게 만들기.

## 작업 내용

### 1. Ops VPCT (OpenClaw 메인 에이전트)
1. Claude Pro/Max 구독 setup-token 발급 및 anthropic 인증 등록
2. `agents.defaults.model.fallbacks`에 `anthropic/claude-sonnet-5` 설정 (Max 플랜이지만 개인 사용 한도 공유 고려해 Opus 대신 Sonnet 5 선택)
3. 버그 1 — 설정 미반영: 폴백 값이 실제로 이전 값(opus-4-8)으로 잘못 저장돼 있었음 → 재수정
4. 버그 2 — hot-reload 한계: config를 새로고침해도 이미 열려있던 세션은 폴백 상태를 갱신 안 함 → 게이트웨이 완전 재시작 필요 확인
5. 버그 3 — 버전 불일치: 게이트웨이 launchd 서비스가 구버전(2026.6.5)인데 CLI는 2026.7.1 → `openclaw gateway install --force`로 재설치, 버전 일치
6. 버그 4 (가장 심각) — 도구 정책 충돌: `tools.profile: "coding"`과 `agents.list[0].tools.allow: ["message"]`가 충돌해 message 도구 자체가 막혀 답장이 전혀 안 나가는 상태(그룹에서 태그해도 무응답) → `tools.profile`을 `"messaging"`으로 변경해 해결
7. 그룹 채팅은 @vpct_ops_bot 태그 없이는 응답 안 하는 게 텔레그램 Group Privacy에 따른 정상 동작으로 확인, 토큰 절약 위해 유지 결정
8. 최종 검증: DM/그룹 모두 텍스트 응답 + Model Fallback 알림 정상 확인

### 2. 헤르메스 브레인 (Hermes Agent) — 1차 사고: 인증·폴백 구성
1. 정체 조사: OpenClaw와 별개인 Nous Research의 오픈소스 "Hermes Agent"(github.com/NousResearch/Hermes-Agent, MIT 라이선스)로 확인. 같은 맥미니에 git clone돼 독립 구동 중이며, OpenClaw와 같은 Codex 계정을 공유해 동시에 한도 초과됨
2. "Provider authentication failed" 진짜 원인: 인증 문제가 아니라 Codex quota exhausted(429)를 Hermes가 잘못 표시한 것
3. `~/.hermes/config.yaml`에 `fallback_providers: anthropic/claude-sonnet-5` 추가 (.env에 ANTHROPIC_API_KEY 이미 있어 별도 인증 불필요)
4. 부수 사고: 봇에게 직접 서비스 정의 정리를 요청했더니, stop→start를 순차 실행하다 stop이 자기 프로세스를 죽여 완전 다운됨 → `hermes gateway start`로 복구
5. `/model` 세션 오버라이드(provider=moa) 잔존 확인 — 폴백 자체와는 별개 이슈로 확인, 세션 내에서 `/model gpt-5.6-sol --provider openai-codex --session`으로 해제 안내
6. **크레딧 소진 사고**: 위 폴백 구성 이후 정상 동작하다, 실제 사용량이 쌓이며 `~/.hermes/.env`의 `ANTHROPIC_API_KEY`(선불 API 크레딧 방식)가 소진돼 "The model provider failed after retries" 재발. `errors.log`에서 실제 원인이 HTTP 400 "credit balance too low"(non-retryable)임을 확인 — rate limit이 아니라 결제 잔액 문제였음
7. **OAuth 전환 시도 1 (중단)**: `hermes auth add anthropic --type oauth` 실행 → 기존 Claude Code 세션을 자동 채택하지 않고 `org:create_api_key` 권한까지 포함한 새 브라우저 OAuth 인가 플로우를 열려고 함 → 불필요하게 넓은 권한이라 판단해 로그인 진행하지 않고 중단(입력 없이 자동 만료, auth.json 변경 없음 확인)
8. **소스 코드로 근본 메커니즘 확인**: `agent/credential_pool.py`에서 anthropic 인증 방식이 `.env`의 `ANTHROPIC_API_KEY` 존재 여부로 자동 결정됨을 확인 — 이 값이 있으면(`api_key_path_explicit`) Hermes가 의도적으로 `~/.claude/.credentials.json`(로컬 Claude Code 로그인) 자동 채택을 막도록 설계돼 있음(동의 없는 credential 재사용 방지, PR #4210)
9. `~/.hermes/.env` 백업 후 `ANTHROPIC_API_KEY` 줄만 주석 처리 → 브라우저 로그인 없이 로컬 Claude Code 세션(subscriptionType: max, rateLimitTier: default_claude_max_20x — openclaw가 이미 쓰던 것과 동일 계정, 동일 만료시각으로 확인)이 자동 채택됨을 확인. 증거: 에러 문구가 API 키식 "credit balance too low / Plans & Billing"에서 구독식 **"You're out of extra usage. Add more at claude.ai/settings/usage"**로 바뀜, 실제 `fallback_providers` 체인 발동 로그(`Primary auth failed — switching to fallback: anthropic / claude-sonnet-5`)로 재현 확인
10. **extra usage 크레딧 발견 및 충전**: Claude Max 플랜은 기본 사용량이 아니라 별도 구매한 "extra usage" 크레딧만 서드파티 앱(Hermes) 과금에 쓰인다는 걸 문서·에러 문구로 확인 — 이 계정은 extra usage가 0이라 OAuth 전환 후에도 여전히 실패. 사용자가 claude.ai/settings/usage에서 직접 충전
11. 최종 검증: 충전 후 재트리거 → "out of extra usage" 에러 없이 정상 응답 확인. `hermes gateway restart`로 라이브 프로세스에도 반영, `hermes gateway status`·텔레그램 연결(`✓ telegram connected`)까지 재확인 완료

### 3. 헤르메스 크레딧 재소진 — 2차 사고 (오후)
1. 오전에 충전한 Claude Max **extra usage 크레딧이 오후에 다시 소진**됨. 이번엔 primary 모델 자체가 남아있던 `/model` 오버라이드(provider=moa, openrouter 미설정)로 먼저 실패하고, anthropic 폴백도 동일하게 `HTTP 400: You're out of extra usage`로 막혀 재차 무응답
2. `~/.hermes/logs/gateway.error.log`에서 `resolve_provider_client: openrouter requested but OPENROUTER_API_KEY not set`, `openai-codex requested but no Codex OAuth token found` 등도 함께 확인 — 여러 결제/인증 경로가 동시에 막혀있던 상태였음
3. 이번 조치는 오전과 **정반대**: `~/.hermes/.env`의 `ANTHROPIC_API_KEY` 줄 **주석을 다시 해제**해 OAuth(구독 extra usage) 대신 API 키(선불 결제) 경로로 되돌림 — 즉 오전엔 "API 키 소진 → OAuth로 전환", 오후엔 "OAuth(extra usage) 소진 → API 키로 재전환"의 왕복이 발생
4. `hermes gateway restart`(PID 92335 → 22656)로 라이브 반영, `hermes -z "ping" -m claude-sonnet-5 --provider anthropic` 실호출로 "pong" 정상 응답 확인, 재시작 후 `gateway.error.log`에 새 에러 없음까지 확인
5. 새로 배운 사실을 메모리(`hermes-anthropic-extra-usage-fallback.md`)에 기록

### 4. 전용 ChatGPT Plus 계정 분리 (Hermes Codex Credential Pool)
1. **동기**: 1·2차 사고 모두 근본 원인은 "OpenClaw와 Hermes가 같은 Codex 계정을 공유해 동시에 한도 초과된다"는 구조 — Anthropic 폴백은 매번 임시방편일 뿐이라, 헤르메스 전용 계정을 분리하기로 결정
2. **조사 1 — Hermes가 계정을 여러 개 지원하는가**: `hermes auth`가 provider별로 다중 OAuth/API 키를 "credential pool"로 관리하는 공식 기능(`agent/credential_pool.py`, 문서 `docs/user-guide/features/credential-pools.md`)임을 확인. `openai-codex`도 지원 대상. 기본 전략은 `fill_first`(우선순위 앞선 키를 소진할 때까지 쓰다 다음으로 전환), `hermes auth list`로 계정별 상태(`←`가 활성 계정) 확인 가능
3. **조사 2 — OpenAI도 Anthropic의 extra usage 같은 별도 과금 트랙이 있는가**: 웹 조사 결과 있음 — ChatGPT Plus/Pro의 5시간 롤링+주간 한도 소진 시, 토큰 기반 크레딧 충전(약 $40/1000크레딧, ChatGPT Codex 설정 > Usage 패널)으로 API 키 없이 계속 사용 가능. Plus 구독만으론 부족해질 수 있지만 계정 자체 설정에서 충전으로 해결 가능
4. `hermes auth add openai-codex --type oauth --label chatgpt-2nd-plus --no-browser` 실행 → device-code 로그인 URL(`https://auth.openai.com/codex/device`)과 코드 발급. 첫 시도는 백그라운드 프로세스 stdout이 파일로 리다이렉트되며 풀버퍼링돼 코드가 안 보이는 문제 발생 → `PYTHONUNBUFFERED=1`로 재실행해 해결
5. 사용자가 두 번째 ChatGPT Plus 계정 브라우저 세션에서 URL 접속·코드 입력 → 로그인 완료, `hermes auth list openai-codex`로 계정 2개(기존 계정 + `chatgpt-2nd-plus`) 등록 확인. OpenClaw 인증 저장소(`~/.openclaw/agents/main/agent/openclaw-agent.sqlite`)와 Hermes(`~/.hermes/auth.json`)는 완전히 분리돼 있어 이 작업이 OpenClaw 계정에 영향을 줄 위험은 없었음
6. 실호출(`hermes -z "ping" -m gpt-5.6-sol --provider openai-codex`)로 신규 계정 정상 동작 확인
7. **우선순위 조정**: 새 계정을 1순위(primary)로, 기존 공유 계정을 2순위(백업)로 만들어야 7/26 리셋 이후에도 OpenClaw와 계정을 안 나눠 쓰게 됨. 그런데 `hermes auth` CLI/대화형 메뉴 어디에도 개별 계정 우선순위를 바꾸는 기능은 없음(Add/Remove/Reset cooldown/Set rotation strategy뿐 — strategy는 전략 종류 선택이지 계정 순서 지정이 아님)
8. 소스 확인 결과 `CredentialPool.__init__`이 `sorted(entries, key=priority)`로 정렬해 `fill_first`가 그 순서의 첫 available 항목을 선택함을 파악 → `~/.hermes/auth.json`의 `credential_pool.openai-codex` 배열에서 두 계정의 `priority` 값을 직접 스왑(`chatgpt-2nd-plus`: 1→0, 기존 계정: 0→1). 수정 전 auth.json 백업
9. `hermes gateway restart`로 이미 떠 있던 텔레그램 봇 세션에도 반영(hot-reload 안 됨 — 1번 사고 때와 동일 패턴), `hermes auth list`로 순서 뒤바뀜(`chatgpt-2nd-plus` ← 표시) 확인, 실호출(`ping`→`pong`)로 최종 검증

## 배운 점 / 인사이트
- config hot-reload는 살아있는 세션 상태까지 갱신하지 않는다. 폴백/인증 설정 변경 후엔 완전 재시작이 필요하다 — 이 패턴이 오늘만 세 번(OpenClaw 폴백, 헤르메스 API 키 전환, 헤르메스 계정 우선순위 변경) 반복됐다.
- `/model` 수동 고정은 폴백을 완전히 무력화시킨다. 테스트 전 항상 `/model default`로 해제 확인 필요 (세션별 별도 관리)
- 자율 에이전트가 자기 자신이 실행 중인 서비스를 stop→start로 재시작시키면 stop이 자기 프로세스를 죽여 start가 실행 안 될 위험이 있다.
- 같은 맥미니에 완전히 별개인 AI 에이전트 프레임워크 2개(OpenClaw, Hermes Agent)가 같은 Codex 계정을 공유하며 나란히 돌고 있었다 — 오늘 헤르메스 쪽만 전용 계정으로 분리했고, OpenClaw는 여전히 기존 공유 계정을 쓴다.
- 프로바이더의 에러 메시지를 곧이곧대로 믿지 않고 로그 원본 에러 코드까지 파고든 게 진단에 결정적이었다(Provider auth failed → 실제론 429 quota exhausted, 이후 credit balance too low → 실제론 API 키식 결제 잔액 소진).
- `.env`/config에 시크릿 키가 "있다"는 사실 자체가 다른 인증 경로(OAuth 자동 채택)를 의도적으로 막는 스위치로 쓰이는 경우가 있다 — Hermes는 `ANTHROPIC_API_KEY` 존재 여부로 "사용자가 API 키 방식을 명시적으로 선택했다"고 해석해 로컬 Claude Code 세션 재사용을 차단하도록 설계돼 있었다. 소스를 직접 읽지 않았다면 "OAuth 미지원"으로 오판할 뻔했다.
- CLI가 제공하는 "편한 명령"(`hermes auth add ... --type oauth`)이 항상 최소 권한/기존 세션 재사용 경로는 아니다 — 이번엔 오히려 `org:create_api_key`까지 포함한 더 넓은 권한의 새 OAuth 앱을 새로 만들려 했다. 브라우저 로그인 창이 뜨는 순간 바로 멈추고 확인한 게 불필요한 권한 부여를 막았다.
- Claude Max 구독은 Claude Code 자체 사용량과 별개로, 서드파티 앱(Hermes 같은)이 쓰는 "extra usage" 크레딧이 따로 있고 기본 0으로 시작한다 — 구독이 있다고 자동으로 되는 게 아니라 별도 충전이 필요했다. **게다가 이 크레딧은 한 번 충전해도 다시 소진될 수 있다** — 오늘 실제로 오전에 충전한 뒤 오후에 재소진돼, API 키 방식으로 되돌리는 임시방편을 한 번 더 써야 했다.
- OpenAI Codex도 Anthropic extra usage와 유사하게 구독 한도 초과 시 토큰 기반 크레딧을 별도 충전할 수 있는 트랙이 있다 (2026년 기준, 약 $40/1000크레딧).
- Hermes의 credential pool은 계정 추가/삭제/쿨다운 리셋/로테이션 전략 선택까지는 CLI로 되지만, **개별 계정의 우선순위(어느 계정을 먼저 쓸지)를 바꾸는 기능은 없다** — 필요하면 `auth.json`을 직접 열어 `priority` 정수값을 바꿔야 한다(작을수록 우선). 소스(`CredentialPool.__init__`의 `sorted(entries, key=priority)`)를 확인하지 않았다면 이 방법을 몰랐을 것.
- 백그라운드로 hermes CLI를 실행해 device-code 로그인 URL 같은 대화형 중간 출력을 봐야 할 때, 파일로 리다이렉트된 stdout은 Python이 풀버퍼링해서 한참 안 보일 수 있다 — `PYTHONUNBUFFERED=1`을 앞에 붙이면 즉시 보인다.

## 다음 할 일
- [ ] 2026-07-26 01:36 KST Codex 리셋 확인 (자동 알림 예정) — 리셋 후에도 기존 공유 계정은 헤르메스에서 2순위(백업)로만 쓰이는지 확인
- [ ] 리셋 후 헤르메스 DM의 moa `/model` 오버라이드 재정리: `/model gpt-5.6-sol --provider openai-codex --session`
- [ ] **Claude Max extra usage 크레딧 잔액 모니터링** — 오늘 두 번 소진됐던 만큼, 충전분이 얼마나 가는지 지켜보고 재소진 시 API 키 ↔ OAuth 왕복 대신 근본적으로 사용량을 줄이거나 자동 알림을 걸 방법 검토
- [ ] **새 헤르메스 전용 Codex 계정(chatgpt-2nd-plus) 사용량 모니터링** — 예상보다 빨리 소진되는지, 기존 공유 계정과 패턴이 다른지 1주일 정도 지켜보기
- [ ] (선택) OpenClaw도 별도 Codex 계정으로 분리할지 검토 — 오늘은 헤르메스만 분리함, OpenClaw는 여전히 기존 공유 계정 사용 중
- [ ] (선택) OpenClaw 오래된 세션 파일 정리, 시크릿 저장 방식 개선
