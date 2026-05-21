---
tags: [dev-log, carousel-os, vupercent, cowork]
created: 2026-05-20
updated: 2026-05-21
project: CoachUnickCarousel
repo: vupercentmove/CoachUnickCarousel
live: https://coach-unick-carousel.vercel.app
---

# Carousel OS 개발 기록 (5/20~21)

## 프로젝트 요약

@coach_unick 인스타그램 캐러셀 콘텐츠를 기획-생성-편집하는 올인원 웹앱.
에이블리/지그재그 여성의류 브랜드 대표 타겟 B2B 콘텐츠 도구.

## 기술 스택

Next.js 14 + TypeScript + Tailwind 3.4.17 + Supabase + Vercel
LLM: Claude Sonnet (primary) + Gemini Flash (fallback)
캔버스: 1000x1250px, Pretendard, 뷰퍼센트 디자인 시스템

## Day 1 (5/20) — 전체 빌드

Cowork + Claude Opus로 26개 태스크 완료.

1. **프로젝트 초기 세팅** — Next.js 14 App Router 셋업
2. **3탭 구조** — 아이데이션 / 에디터 / 보관함
3. **아이데이션 탭** — 주제 입력 → 콘텐츠 유형 5종 → 커버 제목 AI 생성
4. **에디터 탭** — 슬라이드 10장 프리뷰 + 카피 편집 + 캡션/ManyChat/공유멘트
5. **디자인 시스템** — 뷰퍼센트 4색 배경(blue/black/white/bg) + 배경 리듬 패턴
6. **SlidePreview** — 12종 레이아웃, 실제 인스타 비율 렌더링
7. **LLM 추상화** — Claude primary + Gemini fallback 자동 전환
8. **김낙타 훅 프레임워크 통합** — 7공식 + 4욕구 + 40템플릿 + 한정흥 훅스타일
9. **Supabase 보관함** — 저장/불러오기/삭제
10. **Vercel 배포** — https://coach-unick-carousel.vercel.app

### 삽질 포인트

- **인코딩 이슈**: Edit 도구로 한국어 파일 수정 시 Linux 샌드박스 동기화에서 파일 잘림 → Python heredoc으로 우회
- **Git index.lock**: 샌드박스에서 삭제 불가 → PowerShell에서 수동 처리
- **autoprefixer/postcss**: 버전 충돌 → 고정 버전으로 해결

## Day 2 (5/21) — 기능 추가 + 버그 수정 + 콘텐츠

### 훅 공식/욕구 직접 선택 기능 (#27-31)

기존: 콘텐츠 유형에 따라 자동 배정
변경: 7가지 훅 공식 + 4대 욕구 카테고리를 멀티셀렉트 토글로 직접 선택 가능
미선택 시 기존처럼 자동 추천.

수정 파일: types.ts, carousel-prompts.ts, generate-titles/route.ts, generate-carousel/route.ts, IdeationTab.tsx, page.tsx

### "캐러셀 생성" 버튼 비활성화 버그 (#34)

**원인**: AI가 커버 제목을 생성해도 `selectedCoverIndex`가 null로 유지 → `canCreate = false` → 버튼 disabled
**수정**: 
- AI 제목 생성 성공/실패 모두 `selectedCoverIndex: 0` 자동 설정
- 입력 필드 포커스 시 해당 커버 자동 선택
- 미선택 시 "커버 제목을 하나 선택해주세요" 안내 표시

### 이야기 자본 DB 연동 테스트

Notion 이야기 자본 DB + Tiro 코칭 녹음을 Cowork에서 직접 조회하여 캐러셀 소스로 활용 가능 확인.
블러핏 "자존감 지킴이" 에피소드 → 10장 캐러셀 카피 생성 완료.

### 프로젝트 인스트럭션 작성

Claude Projects용 커스텀 인스트럭션 문서 작성.
기술 구조 + 디자인 시스템 + 훅 프레임워크 + 8원칙 + 외부 연동 정보 포함.

## 파일 구조

```
src/
├── app/page.tsx              # 메인 (탭 상태)
├── app/api/generate-carousel  # 10장 생성 API
├── app/api/generate-titles    # 커버 제목 3개 API
├── components/
│   ├── IdeationTab.tsx        # 아이데이션 (주제→훅→커버→생성)
│   ├── EditorTab.tsx          # 에디터 (슬라이드 편집)
│   ├── SlidePreview.tsx       # 비주얼 프리뷰
│   └── ArchiveTab.tsx         # 보관함
└── lib/
    ├── design-tokens.ts       # 뷰퍼센트 디자인 시스템
    ├── hook-framework.ts      # 김낙타 훅 프레임워크
    ├── carousel-prompts.ts    # LLM 프롬프트 빌더
    └── llm-client.ts          # Claude+Gemini 추상화
```

## 다음 할 일

- [ ] GitHub push (버그 수정 + 인스트럭션)
- [ ] Claude 프로젝트 생성 (인스트럭션 + 지식 파일 등록)
- [ ] 에디터 탭 PNG/PDF 내보내기 기능
- [ ] 스레드 URL 자동 파싱 → 캐러셀 변환
- [ ] 이야기 자본 DB 브라우저 (웹앱 내장)
