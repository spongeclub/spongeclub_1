---
# 식별
title: "ai-marketing-campaign-analytics 써본 후기"
skill_name: ai-marketing-campaign-analytics
summary: "광고비 데이터만 있으면 ROAS·CVR·퍼널 분석까지 한 번에 뽑는 월간 리포트 스킬 조합"

# 작성자
author: [코니]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 콘텐츠마케팅
audience: []
difficulty: 코드만져야함

# 순환 연결
inspired_by:

# 참조
href: https://github.com/zubair-trabzada/ai-marketing-claude
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779853414063499

# 운영
created: 2026-06-06
updated: 2026-06-11
published: false
featured: false
---

## 한 줄 요약
- 광고비 데이터만 있으면 ROAS·CVR·퍼널 분석까지 한 번에 뽑아주는 월간 리포트 스킬 조합

## 주요 내용
- ai-marketing-claude: 15개 마케팅 서브스킬 + 병렬 서브에이전트 포함.
  market-report, market-funnel, market-ads 등 서브스킬별로 독립 실행 가능
  출처: 커뮤니티 (zubair-trabzada), 링크: https://github.com/zubair-trabzada/ai-marketing-claude
- campaign-analytics: 멀티터치 어트리뷰션 + 단계별 CVR 계산 + ROI 계산 프레임워크.
  플랫폼 무관하게 퍼널 데이터만 있으면 동작
  출처: 커뮤니티 (alirezarezvani), 링크: https://github.com/alirezarezvani/claude-skills/tree/main/marketing-skill/skills/campaign-analytics
- skillers-finder로 발굴 → 설치 → 즉시 적용까지 한 세션에 완료

## 써본 상황 + 결과
- 어떤 상황에서:
  성형외과 마케터로 바비톡·강남언니·네이버SA 3개 채널 광고비를
  Google Sheets로 추적 중인데 매달 리포트를 수기로 만들고 있었음.
  "채널별 ROAS가 얼마인지", "어느 채널이 더 효율적인지" 매번 계산이 번거로웠던 상황.
- 어떻게 썼는지:
  두 스킬의 프레임워크(market-report Paid Advertising 카테고리 + market-funnel CVR 분석)를
  Claude에게 먹인 뒤 광고 채널 구조와 예시 수치를 주고 리포트 생성 요청.
  실제 수치를 입력하면 ROAS·CPA·CVR이 자동 계산되는 구조로 나옴.
- 결과 / 인사이트:
  ✅ 채널별 효율 등급표 + ROAS 벤치마크 자동 생성 (Local Services 기준 2:1/3:1/5:1)
  ✅ 조회→상담→수술 3단계 퍼널 CVR 계산 + 업종 벤치마크 비교
  ✅ "CVR 1%p 개선 시 매출 얼마 추가" 형태의 수익 임팩트 추정까지 포함
  ✅ 30-60-90일 로드맵 자동 작성
  한계: 스킬 자체는 Google/Meta 기준으로 설계됨.
  한국 플랫폼(바비톡·강남언니)에 그대로 적용하려면
  CPV/CPA 수치를 직접 제공해야 하고 플랫폼 API 연동은 별도 작업 필요.
  하지만 분석 프레임워크 자체는 플랫폼 무관하게 바로 쓸 수 있음.

## 결과·인사이트
> "매달 수기로 만들던 리포트 → 광고 채널 구조와 수치만 주면 ROAS·CPA 자동 계산" — 코니
