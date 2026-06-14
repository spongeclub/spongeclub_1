---
# 식별
title: "claude-mem 써본 후기"
skill_name: claude-mem
summary: "세션 끝나도 이전 작업 기억 — 맥락 재설명 마찰 제거"

# 작성자
author: [먼지민, 그린]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 클로드코드
audience: []
difficulty: 설치만하면됨

# 순환 연결
inspired_by:

# 참조
href: https://github.com/thedotmack/claude-mem
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778744105931809
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779010543580379

# 운영
created: 2026-05-27
updated: 2026-06-11
published: false
featured: false
---

## 한 줄 요약
• 세션이 끝나도 Claude가 "어제 우리가 뭐 했는지" 기억하게 해주는 영속 메모리 플러그인. 매번 같은 맥락 다시 설명하는 마찰을 줄여줌.

## 주요 내용
• 3단계 자동 동작 — Capture(세션 중 작업 기록) → Compress(AI로 압축) → Inject(다음 세션 시작 시 자동 주입)
• 자연어로 과거 검색: "지난 세션에서 뭐 결정했지", "지난주에 고친 버그 뭐였더라", "이 파일 언제 바꿨지"
• 89K+ stars (2026.2 트렌딩 폭발, 첫 3일 5,000개+)
• 로컬 저장. &lt;private&gt; 태그로 감싸면 저장 제외 가능 (회사 정보 노출 방지)
• 설치: /plugin marketplace add thedotmack/claude-mem → /plugin install claude-mem → Claude Code 재시작

## 결과·인사이트
> "매번 같은 맥락 다시 설명하는 마찰을 줄여줌" — 먼지민

> "메모리 불러와서 일목요연하게 정리해줌. 심지어 이어서 어떤 걸 하길 원하는지 연결해줌" — 그린
