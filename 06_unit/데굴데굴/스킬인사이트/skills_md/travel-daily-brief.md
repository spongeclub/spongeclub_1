---
# 식별
title: "travel-daily-brief 써본 후기"
skill_name: travel-daily-brief
summary: "매일 아침 주요 여행 사이트 7곳 프로모션 자동 점검"

# 작성자
author: [애니(박상임)]
team:

# 분류
type: 스킬
post_type: 써본후기
category:
audience: []
difficulty:

# 순환 연결
inspired_by:

# 참조
href: https://github.com/sangimpark/travel-daily-brief
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779256952666699

# 운영
created: 2026-05-27
updated: 2026-06-04
published: false
featured: false
---

## 한 줄 요약
- 매일 아침 주요 여행 사이트 7곳 프로모션 정보 자동 점검

## 주요 내용
- WebFetch + Claude in Chrome MCP 결합 → 봇 차단 사이트(클룩/KKday)와 로그인 SPA(3hoursahead)까지 자동 추출
- 결과를 8컬럼 표 (광고주·캠페인·종류·핵심+추천이유·마감·:link:)로 출력, 매일 마크다운 파일 누적
- 자주 제외할 카테고리(결제수단·커미션 상향)는 룰로 자동 필터, 단독 상품 > 할인 순 정렬

## 써본 상황 + 결과
- 어떤 상황에서: 여행 CPA 블로거로써 매일 아침 광고주 직접 사이트 들어가 어떤 프로모션을 하고있는지 확인하는 게 부담.
- 어떻게 썼는지: OS 인터뷰로 청사진 잡고 → cpa-daily-brief부터 부품 단위로 만들고 → 손에 익은 후 Claude in Chrome MCP로 수동 점검 4곳까지 자동화 업그레이드.
- 결과 / 인사이트: 수동 입력 4번 → 0번 / 매일 5~10분 → 2~3분.
더 큰 인사이트는 "OS 부품을 작게 쪼개서 누적하면 일이 시스템이 된다"는 것.

## 결과·인사이트
> "수동 입력 4번 → 0번 / 매일 5~10분 → 2~3분" — 애니(박상임)
