---
title: "텔레그램 봇 2개(Ops VPCT·헤르메스) Anthropic Claude 폴백 구성"
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
status: completed
duration_estimate: "미기록"
tools_used:
  - "openclaw CLI (gateway install/config)"
  - "Claude Pro/Max setup-token"
  - "Hermes Agent config.yaml"
---

## 작업 요약
Codex(ChatGPT) 구독 사용량 한도 초과로 응답 불가 상태였던 텔레그램 봇 2개(Ops VPCT = OpenClaw, 헤르메스 브레인 = Hermes Agent)에 Anthropic Claude 폴백을 구성. 그 과정에서 발견된 설정 버그 4건, 정체 미확인이었던 별도 시스템 1건을 함께 해결.

## 배경
- 맥미니에서 운영 중인 텔레그램 봇 2개가 OpenAI Codex 구독 사용량 한도 초과(리셋 예정: 2026-07-26 01:36 KST)로 응답 불가.
- 목표: Codex 한도 초과 시 Anthropic Claude로 자동 폴백되는 2단계 구조 구축, 7/26 리셋 시 자동 복귀.

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

### 2. 헤르메스 브레인 (Hermes Agent)
1. 정체 조사: OpenClaw와 별개인 Nous Research의 오픈소스 "Hermes Agent"(github.com/NousResearch/Hermes-Agent, MIT 라이선스)로 확인. 같은 맥미니에 git clone돼 독립 구동 중이며, OpenClaw와 같은 Codex 계정을 공유해 동시에 한도 초과됨
2. "Provider authentication failed" 진짜 원인: 인증 문제가 아니라 Codex quota exhausted(429)를 Hermes가 잘못 표시한 것
3. `~/.hermes/config.yaml`에 `fallback_providers: anthropic/claude-sonnet-5` 추가 (.env에 ANTHROPIC_API_KEY 이미 있어 별도 인증 불필요)
4. 부수 사고: 봇에게 직접 서비스 정의 정리를 요청했더니, stop→start를 순차 실행하다 stop이 자기 프로세스를 죽여 완전 다운됨 → `hermes gateway start`로 복구
5. 최종 검증: 로그에서 "Switched to fallback model: default via moa → claude-sonnet-5 via anthropic" 확인 — 폴백 실전 작동 검증 완료

## 배운 점 / 인사이트
- config hot-reload는 살아있는 세션 상태까지 갱신하지 않는다. 폴백 설정 변경 후엔 완전 재시작이 필요하다.
- `/model` 수동 고정은 폴백을 완전히 무력화시킨다. 테스트 전 항상 `/model default`로 해제 확인 필요 (세션별 별도 관리)
- 자율 에이전트가 자기 자신이 실행 중인 서비스를 stop→start로 재시작시키면 stop이 자기 프로세스를 죽여 start가 실행 안 될 위험이 있다.
- 같은 맥미니에 완전히 별개인 AI 에이전트 프레임워크 2개(OpenClaw, Hermes Agent)가 같은 Codex 계정을 공유하며 나란히 돌고 있었다.
- 프로바이더의 에러 메시지를 곧이곧대로 믿지 않고 로그 원본 에러 코드까지 파고든 게 진단에 결정적이었다(Provider auth failed → 실제론 429 quota exhausted).

## 다음 할 일
- [ ] 2026-07-26 01:36 KST Codex 리셋 확인 (자동 알림 예정)
- [ ] 리셋 후 헤르메스 DM의 moa `/model` 오버라이드 재정리: `/model gpt-5.6-sol --provider openai-codex --session`
- [ ] 리셋 후 1주일 뒤 Usage 화면에서 토큰 소진 원인 재점검
- [ ] (선택) OpenClaw 오래된 세션 파일 정리, 시크릿 저장 방식 개선
- [ ] (선택) 두 시스템이 공유 중인 Codex 계정 분리 검토
