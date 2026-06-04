---
# 식별
title: "threads-carousel 써본 후기"
skill_name: threads-carousel
summary: "주제 입력 → 슬라이드 자동 생성 + PNG/PDF 내보내기"

# 작성자
author: [달빛그린(윤지윤)]
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
href: https://github.com/itchernetski/threads-carousel-claude-skill
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595817803409

# 운영
created: 2026-05-27
updated: 2026-06-04
published: false
featured: false
---

## 한 줄 요약
- 주제만 입력하면 Claude가 슬라이드 내용 자동 생성 → 브라우저에서 바로 미리보기 + PNG/PDF 내보내기까지 되는 캐러셀 생성기를 Claude Code로 만들었다

## 주요 내용
- 기반 스킬: threads-carousel (커뮤니티, 880가지 스타일 조합)
- 추가 구현:
  - 주제 입력창 UI (상단 텍스트박스 + 생성 버튼)
  - Next.js API 라우트 → Claude Code CLI 호출 → 슬라이드 JSON 자동 생성
  - API 키 없이 Claude Code 구독만으로 작동
  - 툴바 한국어화 (폰트·배경색·강조색·포맷 등)
- 출력물: PNG 개별 저장 / PDF 전체 묶음 내보내기

## 써본 상황 + 결과
- 어떤 상황에서: "다이어트하는 법" 주제로 인스타 캐러셀 제작
- 어떻게 썼는지: 브라우저 열고 주제 입력 → 생성 클릭 → 30초 대기
- 결과 / 인사이트: 슬라이드 7장 (hook·stats·list·checklist·comparison·cta) 자동 생성됨. Anthropic API 키 없이 Claude Code 구독만으로 돌아가는 게 핵심. 별도 디자인 툴 없이 PNG 바로 뽑아짐.

## 결과·인사이트
> "Anthropic API 키 없이 Claude Code 구독만으로 돌아가는 게 핵심. 별도 디자인 툴 없이 PNG 바로 뽑아짐" — 달빛그린(윤지윤)
