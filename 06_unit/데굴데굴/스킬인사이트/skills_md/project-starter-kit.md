---
# 식별
title: "project-starter-kit 써본 후기"
skill_name: project-starter-kit
summary: "프로젝트 시작 전 CLAUDE.md·AGENTS.md·DESIGN.md 3종 세트를 대화형 인터뷰로 자동 생성"

# 작성자
author: [애니]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 클로드코드
audience: []
difficulty: 설정좀필요

# 순환 연결
inspired_by:

# 참조
href:
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780308071047789

# 운영
created: 2026-06-06
updated: 2026-06-06
published: false
featured: false
---

## 한 줄 요약
- 프로젝트 시작 전에 CLAUDE.md / AGENTS.md / DESIGN.md
  3종 세트를 대화형 인터뷰로 자동 생성해주는 스킬

## 주요 내용
- 22개 질문을 4단계로 나눠 진행 (Phase 1 → CLAUDE → AGENTS → DESIGN)
- 매 질문마다 선택지 + "잘 모르겠어요" 옵션 → 결정 부담 없이 끝까지 갈 수 있음
- 답변이 누락되면 Claude가 페르소나·맥락 기반으로 자동 추론해서 채워줌
- 결과물 3개 파일이 서로 참조하도록 구조화 (CLAUDE.md 상단에 @AGENTS.md import)

## 써본 상황 + 결과
- 어떤 상황에서:
  스킬을 막 설치하고 동작 확인용으로 가볍게 돌려봄.
  실제 프로젝트는 없어서 "개인 독서 기록 웹앱"을
  가상 페르소나로 잡고 진행.
- 어떻게 썼는지:
  대부분의 질문에 "잘 모르겠어요"로 답하고
  Claude가 추천하는 옵션을 받는 방식으로 빠르게 진행.
  중간중간 추천이 부적절할 때는(예: 1인 프로젝트에
  "코드 수정 전 항상 확인" 규칙) Claude가 먼저 짚어줘서
  옵션을 다시 잡음.
- 결과 / 인사이트:
  · Next.js + Supabase + Tailwind 기반 풀스택 셋업 문서가
    16턴 만에 완성됨
  · "잘 모르겠어요" 분기가 핵심 기능 — 결정 피로 없이 끝까지 감
  · 다만 22개는 여전히 많음. 핵심 5~6개만 묻는 fast mode가
    있으면 더 가벼울 듯
  · 추천 옵션의 적합성 체크가 부족 → 사용자가 그대로
    받아들이면 나중에 후회할 수 있음
  · AGENTS.md import가 실제 Claude Code에서 동작하는지는
    실제 프로젝트에서 검증 필요

## 결과·인사이트
> "매 질문마다 '잘 모르겠어요' 옵션 → 결정 부담 없이 끝까지 갈 수 있음" — 애니
