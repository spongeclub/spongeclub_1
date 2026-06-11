---
# 식별
title: "claude-mermaid 써본 후기"
skill_name: claude-mermaid
summary: "'그려줘' 한 마디면 mermaid 다이어그램 생성 (문법 몰라도 됨)"

# 작성자
author: [먼지민]
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
href: https://github.com/veelenga/claude-mermaid
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779342454650859

# 운영
created: 2026-05-27
updated: 2026-06-11
published: false
featured: false
---

## 한 줄 요약
• Claude한테 자연어로 "그려줘" 한 마디면 다이어그램이 나오는 조합. mermaid 문법 몰라도 됨.

## 주요 내용
• 이런 순간에 유용
   ㄴ 회의에서 "프로세스 어떻게 흘러요?" 질문 받을 때
   ㄴ 새 팀원에게 워크플로우 설명할 때
   ㄴ 기획 단계 IA·사용자 플로우 그릴 때
   ㄴ 보고서·발표자료에 다이어그램 한 장 넣을 때
• 사용법
   ㄴ Claude한테 자연어로 설명 (한국어·이모지 OK)
   ㄴ SVG·PNG로 떨어짐
   ㄴ 슬랙·노션·문서에 바로 붙이기
• 도구 조합
   ㄴ claude-mermaid 플러그인 + @mermaid-js/mermaid-cli
   ㄴ 설치: /plugin marketplace add veelenga/claude-mermaid
   ㄴ 그 다음: /plugin install claude-mermaid@claude-mermaid
직접 써본 후기
• 시도한 것: 내 30일 git 활동을 다이어그램으로 외부화
• 3번 디벨롭 (상세 → 일상어 → 큰 흐름만)
• 알게 된 4가지
   ㄴ 시스템 만드는 것 자체가 일
   ㄴ 모든 게 한 폴더에서 흐른다
   ㄴ 화요일이 다른 요일의 2배 바쁨
   ㄴ 저녁 5시~새벽 1시가 집중 시간
솔직 후기
• 좋은 점
   ㄴ mermaid 문법 학습 0
   ㄴ "더 단순화해줘" 한 마디로 즉시 재가공
   ㄴ SVG·PNG 한 번에 나옴
• 함정
   ㄴ 라이브 리로드는 버그라 안 씀
   ㄴ mermaid-cli로 SVG 직접 만드는 우회가 안정적
   ㄴ Puppeteer Chrome 환경 셋업 1회 필요

## 결과·인사이트
> "mermaid 문법 학습 0 / '더 단순화해줘' 한 마디로 즉시 재가공 / SVG·PNG 한 번에 나옴" — 먼지민
