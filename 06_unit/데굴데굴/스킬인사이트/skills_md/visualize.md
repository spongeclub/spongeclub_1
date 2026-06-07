---
# 식별
title: "visualize 써본 후기"
skill_name: visualize
summary: "텍스트/문서 → 단일 HTML, 슬라이드·대시보드·인포그래픽에 강함"

# 작성자
author: [하늘]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 개발도구
audience: []
difficulty: 설정좀필요

# 순환 연결
inspired_by:

# 참조
href: https://github.com/careerhackeralex/visualize
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779260003285539

# 운영
created: 2026-05-27
updated: 2026-06-06
published: false
featured: false
---

## 한 줄 요약
- 텍스트/문서 한 덩이를 "보기 좋은 단일 HTML"로 바꿔주는 Claude Code 스킬.
  슬라이드·대시보드·인포그래픽·결과페이지에 강함. 외부 의존성 없는 self-contained 산출.

## 주요 내용
- 단일 .html 파일로 출력 → 브라우저에서 바로 열림, 오프라인 OK, 메일 첨부 OK
- 라이트/다크 테마, 인쇄/PDF, 접근성(skip-link·aria), 스크롤 등장 애니메이션 기본 탑재
- 출처: 커뮤니티 깃헙, ⭐104, https://github.com/careerhackeralex/visualize

## 써본 상황 + 결과
- 어떤 상황: 기능의학 7-시스템 기반 영양 자가진단 도구의 "결과페이지"를 코드로 옮기는 중.
  엔진 문서(73문항 + 결과페이지 5종)는 이미 작성돼 있었음.
- 어떻게 썼는지: 한 줄 명령으로 호출 →
  "visualize로 해독 시스템 결과페이지를 단일 HTML로, 내 브랜드 토큰(#FAFAF7 베이지/#2D6CDF 파랑)·
   한국어 폰트·이모지 최소·가설 톤으로"
- 결과 / 인사이트:
  · 콘텐츠가 준비돼 있으면 결과페이지 1장이 거의 즉시 나옴 (수동으로 짰으면 1~2시간 → 수 분)
  · ★중요 팁: 기본값이 Inter 폰트 + Chart.js + html-to-image CDN을 끌고 옴.
    한국어 브랜드/오프라인 배포가 중요하면 "외부 CDN 없이, 시스템 한글 폰트, 내 디자인 토큰"이라고
    명시해야 깔끔하게 self-contained로 나옴. (안 하면 영어 폰트·불필요한 의존성이 붙음)
  · 단점: 디자인 토큰을 안 박으면 "AI가 만든 듯한" 기본 룩이 나옴 → 브랜드 컬러를 args에 꼭 넣을 것

## 결과·인사이트
> "콘텐츠가 준비돼 있으면 결과페이지 1장이 거의 즉시 나옴 (수동으로 짰으면 1~2시간 → 수 분)" — 하늘
