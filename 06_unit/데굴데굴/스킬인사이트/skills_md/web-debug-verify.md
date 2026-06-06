---
# 식별
title: "web-debug-verify 써본 후기"
skill_name: web-debug-verify
summary: "단일 HTML/JS 웹앱 버그를 근본 원인→최소 수정→실제 검증 순서로"

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
href:
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780214579194659

# 운영
created: 2026-06-06
updated: 2026-06-06
published: false
featured: false
---

## 한 줄 요약
• 단일 HTML/JS 웹앱의 버그를, 추측 패치 없이 **근본 원인 → 최소 수정 → 실제 검증** 순서로 잡아주는 클로드 웹채팅 전용 스킬. systematic-debugging + webapp-testing + verification-before-completion 세 기능을 하나로 통합.

## 주요 내용
• "또 깨진다 / 왜 또 / 다시" 신호를 감지하면 패치를 멈추고 **전수조사 모드**로 전환 (같은 버그 패턴을 한 번에 일괄 수정)
• Playwright 없이 **코드 실행 환경의 node --check·HTML 파싱·grep**으로 직접 검증
• "고쳤다" 선언 전에 구문/중복/적용/부작용을 검사하는 **완료 검증 강제**

## 써본 상황 + 결과
• 어떤 상황에서: 과제로 프로덕트 만드는데 계ㅔ속 버그가 반복되고 사람 돌게 해서 냅다 만듦.
• 어떻게 썼는지: 버그 보고마다 이 스킬 절차로 원인 추적 → 수정 → 같은 패턴 전수조사.
• 결과 / 인사이트:
    ◦ 프론트엔드 단에서 보이지 않는 **계산 로직 버그를 전수조사로 발견**.
    ◦ 버그 하나 고칠 때 **같은 계열 버그를 1~2개 더 잡아냄**.
    ◦ 부작용도 검증 단계에서 포착 (이미지 압축 시 투명 PNG가 검게 되는 문제).
    ◦ **예전과 비교해 매우 덜 빡치게 됨.** 아주 만족스러움.
    ◦ 괜히 기분이 그런지 모르겠지만 토큰 소모량도 현저히 줄어든 느낌.

## 결과·인사이트
> "버그 하나 고칠 때 같은 계열 버그를 1~2개 더 잡아냄. 예전보다 매우 덜 빡치게 됨" — 마라
