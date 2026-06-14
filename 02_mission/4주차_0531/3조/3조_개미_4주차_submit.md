# 주간 작업 정리 — 즐거운 개미집 (2026-05-25 ~ 2026-05-31)

> 대상 폴더: `ant-universe` (Next.js App Router + Supabase, 브랜드명 `즐거운 개미집`)
> 작성일: 2026-05-31

---

## 1. Summary

이번 주는 **"보여주기용 정적 사이트"에서 "운영 가능한 커뮤니티 서비스"로 넘어가는 한 주**였다.
핵심은 세 갈래로 진행됐다.

1. **사용자 참여 기능 강화** — 맞춤형 모임 추천 설문(CTA형), 오늘의 질문 좋아요 토글(취소 가능), 숨김 답변 모더레이션.
2. **운영 기반 다지기** — 구글 로그인 v0 도입 + `user_id` 자동 연결, 그리고 배포 전 **RLS·GRANT 보안 하드닝**.
3. **브랜드·UX 완성도** — 새 로고 기반 favicon/PWA 아이콘 교체, 그리고 5/31 저녁의 **UX Phase 1~11 대규모 다듬기 스프린트**(카피·카드·필터·모바일 메뉴·후기 카드·캘린더 탭).

작업 원칙은 일관됐다: **보호 범위(Supabase 스키마·RLS·GRANT·환경변수)를 명시하고, 빠른 검증이 필요한 건 DB를 건드리지 않는 프론트엔드 MVP로 먼저 증명한다.** 보안이 얽힌 작업은 "추가"가 아니라 "교체"로 처리해 우회 가능성을 차단했다.

---

## 2. 최종 구현 결과물

### 사용자 기능
- **맞춤형 모임 추천 설문 (CTA형 MVP)** — `오늘의 질문` 하단의 접힌 CTA 카드 → 클릭 시 펼침. 3문항 × 4선택지, 선택지마다 가중치(primary +2 / secondary +1) 누적 → 최고점 모임 대표 추천 + 보조 1~2건 + 추천 이유 문구. **DB 저장 없음**(새로고침 시 초기화), 실제 존재하는 8개 정기모임 slug에만 매핑.
  - `lib/recommend.ts`, `components/main/RecommendSection.tsx`, `components/main/FeaturedContent.tsx`
- **오늘의 질문 좋아요 토글 (v0)** — 재클릭 시 좋아요 취소 + `like_count` 감소. 서버 반환 `liked` 기준 localStorage 보정 + Set ref 락으로 더블클릭 방지. `like_count`는 `greatest(0, …)`로 음수 방지.
  - `supabase/like-toggle.sql`(신규 `toggle_today_answer_like` RPC), `lib/today-content-service.ts`, `components/main/MainPageClient.tsx`
- **숨김 답변 모더레이션** — 운영자가 부적절 답변을 숨길 수 있는 컬럼 + RLS 정책.
  - `supabase/answer-moderation.sql`

### 운영 기반 (인증 · 보안)
- **구글 로그인 v0 + `user_id` 자동 연결** — `@supabase/ssr`의 browser/server 클라이언트 패턴. 로그인 **강제 없음**(비로그인도 답변·조회·좋아요 모두 가능), 로그인 사용자만 `user_id` 자동 채움. 우측 상단 Header 슬롯 UI.
  - `lib/supabase/{client,server}.ts`, `app/auth/callback/route.ts`, `components/layout/HeaderAuthSlot.tsx`
- **배포 전 RLS 하드닝** — 기존 insert 정책을 **동일 이름 drop 후 교체 재생성**: `(auth.uid() is null and user_id is null) or (auth.uid() = user_id)`로 "auth 상태 = user_id 상태" 불변식 강제. anon의 임의 `user_id` 위변조, 로그인 사용자의 익명 우회, 타인 `user_id` 위변조 insert를 모두 차단.
- **authenticated GRANT 보완** — 기존 GRANT가 anon 전용이었던 것을 발견 → 로그인 사용자용 parallel GRANT 5건 추가(스키마 usage, select/insert, RPC execute).
  - `supabase/auth-google-user-link.sql`

### 브랜드 · UX
- **새 로고 기반 favicon / PWA 아이콘 교체** — create-next-app 기본 마크 제거, 새 로고 기반 multi-size ICO + 192/512 + maskable 아이콘. 기존 설치된 `sharp`만 사용(신규 패키지 없음).
  - `app/favicon.ico`, `public/icon-*.png`, `app/manifest.ts`
- **UX Phase 1~11 스프린트** — 디자인 토큰·카피 정리, 히어로 문구·CTA, 모임 카드 메타데이터/뱃지/상태 위계, 카테고리 필터, 빈 상태/상태별 UX 라이팅, 후기 카드(정적 4개), About 재진입 CTA, 모임 상세 위계, **모바일 햄버거 메뉴**, **모임 목록 카드/캘린더 보기 탭 + 캘린더 empty state**.
  - `components/layout/MobileMenu.tsx`, `components/main/{MoimSection,MoimCard,StoriesPreview,BrandIntro}.tsx`, `app/about/page.tsx`, `app/moim/[slug]/MoimDetailPageClient.tsx`

### 검증
- `npx tsc --noEmit` / `npm run lint` 통과 기준 유지. 코드 수정 후 로컬 검증까지만, 배포는 사용자 명시 승인 후.

---

## 3. 과정 (타임라인 + 삽질)

### 타임라인

| 시점 | 작업 | 비고 |
|---|---|---|
| 5/28 오후 | 모임 추천 설문 CTA 플로우 (`fd951ff`) | 상시 펼침 → 부담스러움 판단 → CTA 카드형으로 전환 |
| 5/28 밤 | 숨김 답변 모더레이션 컬럼 + RLS (`759c9c7`) | 운영 안전장치 |
| 5/29 새벽 | 구글 로그인 v0 + `user_id` 연결 + RLS/GRANT 하드닝 (`240cade`) | 인증 + 보안을 한 커밋에 묶음 |
| 5/29 밤 | favicon/PWA 아이콘 교체 (`29c80cd` → `56441cf` → `3317309`) | 3차에 걸쳐 검은 모서리·maskable normalize 반복 다듬기 |
| 5/31 오후 | 좋아요 토글 v0 (`b46bcf3`) → 핫픽스 (`9791357`) | RPC 변수 충돌 즉시 수정 |
| 5/31 저녁 | UX Phase 1~11 스프린트 (`292e187` ~ `4165211`, 13커밋) | 토큰→카피→카드→필터→모바일→후기→캘린더 순차 |
| 5/31 밤 | 모임 캘린더 보기 탭 (미커밋 작업) | 보기 전환 + empty state만, 실제 일정 데이터는 후속 |

### 삽질 (막힌 지점과 해결)

1. **like-toggle RPC `variable_conflict`** — PL/pgSQL 함수 안의 변수명이 테이블 컬럼명과 충돌해 RPC가 실패. 변수/컬럼을 명시적으로 구분(`use_column`)해 재배포 (`9791357`). 배포 직후 바로 잡은 핫픽스.
2. **RLS permissive OR 함정** — insert 정책을 단순히 "추가"하면 기존 정책과 **OR로 결합**되어, 추가한 제약을 우회하는 경로가 남는다. 그래서 동일 이름으로 **drop → 재생성(교체)** 방식으로 처리해야 함을 확인.
3. **authenticated GRANT 누락 회귀 위험** — 기존 GRANT가 모두 anon 전용이라, 로그인 사용자가 PostgREST를 호출하면 즉시 `permission denied`로 회귀할 수 있었다. anon과 parallel structure로 authenticated GRANT 5건을 별도 추가.
4. **`column user_id does not exist` 배포 순서 함정** — SQL 미실행 상태에서 코드만 push하면 컬럼이 없어 전체가 회귀. → **(외부 OAuth 설정 → Supabase SQL 실행 → push → Vercel 자동배포)** 순서를 강제하는 안전 절차로 정리.
5. **Android PWA splash 윤곽선 잔존** — 검은 모서리 제거·maskable 외부 cream normalize까지 했으나, 홈 화면 실행 시 옅은 rounded-square 윤곽선이 남음. 원본 PNG에 명시적 stroke가 없어 OS/런처의 adaptive icon 렌더링 영향으로 판단 → 현재 수준에서 **의도적 보류**(완전 제거는 full-bleed 아이콘 재설계 필요).

---

## 4. 공유할만한 인사이트

- **보호 범위를 먼저 선언하고 MVP는 프론트만 건드린다.** "Supabase 스키마·RLS·GRANT·환경변수 미수정"을 매 작업의 전제로 명시하니, 빠른 기능 검증과 회귀 차단이 동시에 가능했다. 추천 설문은 이 원칙 덕에 DB 한 줄 안 건드리고 검증됐다.
- **보안 정책은 "추가"가 아니라 "교체"다.** RLS의 permissive 정책은 OR로 결합되므로, 제약을 더하려면 기존 정책을 drop하고 재생성해야 한다. "정책을 하나 더 추가했으니 안전하다"는 직관이 가장 위험하다.
- **불변식으로 사고하면 위변조 경로가 닫힌다.** "auth 상태 = user_id 상태"라는 한 줄 규칙(`with check`)으로 익명/로그인 우회·타인 위변조 3종을 한 번에 막았다. 케이스를 나열하는 대신 불변식을 강제하는 편이 견고하다.
- **데이터가 없으면 과장하지 말고 정직하게 표현한다.** 조회수 데이터가 없을 때 "인기 콘텐츠" 대신 **"먼저 둘러보기 좋은 콘텐츠"**로, 진단 톤("당신은 이런 사람") 대신 제안형("이런 모임이 잘 맞을 수 있어요")으로. 톤이 신뢰를 만든다.
- **배포는 코드가 아니라 순서의 문제다.** 스키마 변경이 동반된 기능은 "SQL 먼저, push 나중"이라는 순서를 어기면 전체가 회귀한다. 배포 순서 자체를 문서화된 안전장치로 둔다.
- **결정 로그를 단일 출처로 유지하면 협업 릴레이가 빨라진다.** `docs/decision-log.md`에 "결정·근거·반영 위치"를 표로 남기니, GPT ↔ 사용자 ↔ Claude Code 사이의 의사결정 전달 비용이 크게 줄었다.

---

## 5. 향후 진행사항

- **콘텐츠 입력** — 모임 실제 정보(일정/장소/가격/커리큘럼), 모집 중 모임 `applyUrl`, 운영자 인스타·문의 이메일. (공개 차단 요건)
- **캘린더 실제 일정 연결** — "모집 오픈일"이 아니라 **"모임 진행일" 기준** 날짜 필드 추가 + 렌더링. 카테고리 필터 연동은 후속.
- **후기 카드 실데이터 연동** — 로그인/멤버 프로필 안정화 후 실제 닉네임·프로필 이미지 연결.
- **추천 결과 DB 저장 + 실제 인기 통계** — 현재 휘발성 MVP를 영속화.
- **좋아요 토글 v1** — RPC에 `auth.uid()` 보조 검증 추가.
- **운영 시스템** — `/admin` 비공개 라우트, 등급제·포인트, 답변 seed 정책.
- **배포 마감** — `SITE_URL` 실도메인 교체, OG 이미지(1200×630), 커스텀 도메인 연결.
