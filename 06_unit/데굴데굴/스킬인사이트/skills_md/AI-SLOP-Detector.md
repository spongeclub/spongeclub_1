---
# 식별
title: "AI-SLOP-Detector 써본 후기"
skill_name: AI-SLOP-Detector
summary: "god함수·복잡도를 수치화해 '한 곳 고치면 깨지는' 원인을 정량 진단"

# 작성자
author: [마라]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 개발도구
audience: []
difficulty: 코드만져야함

# 순환 연결
inspired_by:

# 참조
href: https://github.com/flamehaven01/AI-SLOP-Detector
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1781092128099989

# 운영
created: 2026-06-11
updated: 2026-06-11
published: true
featured: false
---

## 한 줄 요약
• AI가 짠 코드의 "가짜 완성"(빈 함수·죽은 코드·복붙 클론·거대 함수)을 점수로 잡아내는 검사기. 바이브코딩으로 오래 쌓인 코드 청소할 때 좋음.

## 주요 내용
• 25개 패턴 5범주 검사: 빈 코드(stub)·안티패턴·잘못된 언어 문법·god함수/죽은코드/깊은중첩·환각 패키지(없는 라이브러리 import)
• 파일별 0~100 결손 점수 + LDR(코드 밀도)·복잡도·중첩 깊이까지 수치로.
• JS/TS도 [js] 옵션으로 지원

## 써본 상황 + 결과
• 어떤 상황에서: 11세션 동안 AI 패치로 쌓인 단일 HTML 투자 로드맵 앱(JS 2,100줄, 함수 142개) 재배포 전 점검
• 어떻게 썼는지: pip install "ai-slop-detector[js]" → HTML에서 <script> 추출 → slop-detector richsister.js --js
• 결과 / 인사이트: slop 50점. god함수(거대 함수) 32개 + 최대 복잡도 68 — "한 곳 고치면 다른 데 깨지는" 원인을 수치로 확인. 죽은 코드는 0건(의외로 깔끔).
• 단점: 검사 대상이 기본 Python이라 JS는 --js 꼭 붙여야 하고, HTML 단일 파일은 <script>를 직접 뽑아내야 함. 그리고 발견 443건 중 396건이 var→let 스타일 권고라 "진짜 문제(god함수)"만 골라봐야 함.
• 웹채팅에서도 사용 가능

## 결과·인사이트
> "god함수 32개에 최대 복잡도 68 — '한 곳 고치면 다른 데 깨지는' 원인을 수치로 확인했어요" — 마라
