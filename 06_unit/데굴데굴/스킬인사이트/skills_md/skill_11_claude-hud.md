---
# 식별
title: "claude-hud 써본 후기"
skill_name: claude-hud
summary: "터미널 입력창 아래 컨텍스트·모델·브랜치 상시 표시 플러그인"

# 작성자
author: [먼지민(석지민)]
team:

# 분류
type: 스킬
post_type: 공유
category:
audience: []
difficulty:

# 순환 연결
inspired_by:

# 참조
href: https://github.com/jarrodwatts/claude-hud
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778467459173629

# 운영
created: 2026-05-27
updated: 2026-06-04
published: false
featured: false
---

## 한 줄 요약
Claude Code 입력창(터미널 환경) 아래에 항상 떠 있는 statusline. 컨텍스트 사용량(%) · 모델명 · git 브랜치 · effort level이 한 눈에 보이는 플러그인. (GitHub 2.2만 스타)

## 주요 내용
- Context 바: 색상 그라데이션으로 사용량 시각화 → 자동 압축 타이밍 직관적으로 감지
- 모델 + Effort: 현재 어떤 모델·effort로 돌고 있는지 매 순간 표시 (Sonnet 4.6 / Opus 4.7 헷갈릴 일 X)
- Git 브랜치: 작업 폴더의 git 상태가 자동으로 같이 뜸 → 폴더 옮겨다닐 때 안전망
- 모든 세션에 자동 부착, 입력 후 ~300ms 갱신

## 써본 상황 + 결과
- 어떤 상황에서: VS Code 통합 터미널에서 Claude Code 켜고 라이브세션 노트 다듬는 작업 중
- 어떻게 썼는지: /plugin marketplace add → /plugin install → /reload-plugins → /claude-hud:setup 순으로 설치. (Windows PowerShell 환경에선 setup 마지막 settings.json 쓰기 단계가 막혀서 ~/.claude/settings.json에 statusLine 블록 직접 추가)
- 결과 / 인사이트: 시각화된 컨텍스트 바 · git 브랜치 · 모델명이 항상 보이는 게 의외로 큰 안정감. "지금 모델 뭐였지?" "이 폴더 어느 브랜치였더라?" 매번 확인하느라 답답하셨던 분께 추천.

## 결과·인사이트
> "시각화된 컨텍스트 바·git 브랜치·모델명이 항상 보이는 게 의외로 큰 안정감" — 먼지민(석지민)
