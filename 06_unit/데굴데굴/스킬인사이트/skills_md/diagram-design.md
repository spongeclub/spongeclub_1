---
# 식별
title: "diagram-design 써본 후기"
skill_name: diagram-design
summary: "14가지 다이어그램을 자기완결 HTML 한 장으로 (스타일 가이드 게이트)"

# 작성자
author: [아가타]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 생산성
audience: []
difficulty: 설치만하면됨

# 순환 연결
inspired_by:

# 참조
href: https://github.com/cathrynlavery/diagram-design
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779874532486089

# 운영
created: 2026-06-06
updated: 2026-06-06
published: false
featured: false
---

## 한 줄 요약
• 14가지 다이어그램(플로우차트·아키텍처·중첩구조 등)을 자체 디자인 시스템 기반의 자기완결 HTML 파일 한 장으로 만들어주는 스킬

## 주요 내용
• 14가지 다이어그램 타입을 지원: flowchart, architecture, sequence, nested, ER, timeline, swimlane, quadrant, tree, org chart, layer stack, venn, pyramid, state machine
• 첫 실행 시 "스타일 가이드 게이트"가 자동 발동 — 디폴트 톤 그대로 뽑지 않게 막고, 브랜드 컬러부터 먼저 정하라고 강제함
• 브랜드 웹사이트 URL을 주면 거기서 컬러/폰트를 자동 추출해 토큰으로 채워주는 온보딩 플로우 내장
• "삭제가 최고의 작업"이라는 디자인 철학 — 노드 9개·액센트 2개·4px 그리드 등 복잡도 예산을 코드 레벨에서 강제
• 결과물은 외부 의존성 없는 HTML 단일 파일 (Google Fonts만 외부)

## 써본 상황 + 결과
• 어떤 상황에서 :공식 제출용 한 장짜리 구조도(예: 비즈니스 모델, 서비스 흐름)가 필요한 상황. 본문 텍스트보다 시각화로 보여줘야 설득력이 생기는 문서
• 어떻게 썼는지 :다이어그램 타입(nested/flowchart 중)을 고르고 호출 → 첫 실행이라 스타일 가이드 게이트가 발동 → 브랜드 SNS URL을 줬는데 로그인 게이트로 자동 추출 실패 → 대신 브랜드 비주얼 스크린샷 1장을 첨부해서 컬러 톤을 추출하고 토큰 매핑까지 진행
• 결과 / 인사이트 :
    a. 첫 실행 게이트 덕분에 "디폴트 톤 그대로 막 뽑는" 흔한 실수가 차단됨 — 브랜드 다이어그램은 톤 합의가 가장 비싸다
    b. 로그인이 필요한 URL(인스타·노션 등)은 자동 온보딩 불가.공개 웹페이지 URL이나 스크린샷 1장을 처음부터 주는 게 가장 빠름
    c. 브랜드 컬러를 배경 전체로 깔지 않고 "포컬 1–2개에만" 쓰게 강제하는 룰이 있어서, 가독성이 중요한 공식 문서에서 톤이 안정적으로 잡힌다

## 결과·인사이트
> "첫 실행 게이트 덕분에 '디폴트 톤 그대로 막 뽑는' 흔한 실수가 막힘" — 아가타
