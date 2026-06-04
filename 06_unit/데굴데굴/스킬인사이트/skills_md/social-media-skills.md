---
# 식별
title: "social-media-skills 써본 후기"
skill_name: social-media-skills
summary: "인스타 캐러셀 훅 카피 → 캐릭터 애니메이션 → MP4 영상 출력 파이프라인"

# 작성자
author: [슬로우퀵(박은아)]
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
href: https://github.com/charlie947/social-media-skills
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778605229551699

# 운영
created: 2026-05-27
updated: 2026-06-04
published: false
featured: false
---

## 한 줄 요약
인스타그램 캐러셀 훅 카피 → 캐릭터 애니메이션 → MP4 영상 출력까지,
  스킬 두 개가 각자 전문가 역할을 하면서 파이프라인이 완성됐습니다.
  ---

## 주요 내용
- social-media-skills: 훅 문구·캐러셀 카피·릴스 스크립트 등 17개
  서브스킬 모음
    → 인스타 콘텐츠를 만드는 각 단계마다 전문 역할을 합니다
  - remotion-ads: 영상 광고 제작 스킬 (Instagram Reels 1080×1350 포맷
   지원)
    → Puppeteer + FFmpeg 파이프라인을 설계하는 데 포맷 스펙 기준으로
  활용했습니다
  ---

## 써본 상황 + 결과
- 어떤 상황에서:
    claude-design-skill로 디자인 시스템을 잡은 캐러셀에 2차
  업그레이드를 하면서
    "카피도 다듬고, 움직이는 영상으로도 만들고 싶다"는 두 가지 목표가
   생겼습니다
  - 어떻게 썼는지:
    social-media-skills → 훅 문구 방향 참고 (구어체 톤 전환)
    remotion-ads → 영상 포맷 스펙(1080×1350, 4:5) 기준 삼아
    Puppeteer로 CSS 애니메이션 프레임 캡처 → FFmpeg로 MP4 인코딩하는
    파이프라인을 직접 구현했습니다
    결과: node export/record.js 한 줄로 슬라이드 8개가 각각 MP4로
  나옵니다
 - 결과 / 인사이트:
    에밀리 공유회에서 "스킬이 움직이게 하고, 에이전트가 그 스킬을
  불러온다"는 말이
    정확히 무슨 뜻인지 이번에 처음으로 체감했습니다.
    스킬은 각 분야의 전문가고, 에이전트는 그 전문가들을 필요한 순간에
   호출하는 구조인 거죠.
    지금 만든 게 딱 그 모양입니다. 디자인 전문가(claude-design-skill)
   → 카피 전문가(social-media-skills) → 영상 전문가(remotion-ads)를
  순서대로 붙인 것.
    아직 에이전트가 자동으로 하지는 않지만, 어떻게 만들어야 할지
  구조는 보입니다.

## 결과·인사이트
> "스킬은 각 분야의 전문가고, 에이전트는 그 전문가들을 필요한 순간에 호출하는 구조인 거죠" — 슬로우퀵(박은아)
