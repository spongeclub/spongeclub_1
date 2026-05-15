# 스폰지클럽 1기 — 주차별 미션 게시판 (v1)

> "딸깍 한 번으로는 갈 수 없는 곳까지, 함께"
>
> Slack에 흩어진 미션 관련 정보를 한 페이지로 모으는 랜딩 사이트.

## 빠른 시작

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

## 스택

- Next.js 16 (App Router · Server Components 기본)
- React 19 · TypeScript
- Tailwind CSS v4 (CSS-first `@theme` 토큰)
- Pretendard 폰트 (CDN `<link>`)

## 폴더 구조

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 한국어 lang, Pretendard, metadata
│   │   ├── page.tsx            # 주차별 미션 랜딩 (= 홈)
│   │   └── globals.css         # Tailwind v4 + 디자인 토큰
│   ├── components/             # 페이지 섹션 단위 컴포넌트 (server)
│   │   ├── Header.tsx
│   │   ├── WeekTimeline.tsx
│   │   ├── AnnouncementBanner.tsx
│   │   ├── MissionHero.tsx
│   │   ├── WeekSchedule.tsx
│   │   ├── TeamProgress.tsx
│   │   ├── MissionDiscussion.tsx
│   │   └── CommunityCTA.tsx
│   ├── data/                   # ★ v1 mock 데이터 (Phase 2에 Supabase로 교체)
│   │   ├── config.ts           # 외부 URL (Slack/community/homepage)
│   │   ├── weeks.ts            # 0~6 주차 타임라인
│   │   ├── mission.ts          # 이번주 미션 정보
│   │   ├── schedule.ts         # 이번주 일정 3카드
│   │   ├── teams.ts            # 6개 조 × 12-13명
│   │   ├── announcements.ts    # 공지 3건
│   │   └── discussions.ts      # 미션 관련 질문/노하우/사이트
│   └── lib/
│       └── types.ts            # 모든 데이터 타입
└── public/
```

## 페이지 구성 (위에서 아래)

1. **Header** — 워드마크 🧽 스폰지클럽 + 3-탭 nav (주차별 미션 / 스킬 / 이기적인 스폰지들 ↗)
2. **WeekTimeline** — 0~6주차 핀, 현재 주차 강조
3. **AnnouncementBanner** — `#0-공지사항` 자동 수집, 긴급·일정·자료 라벨
4. **MissionHero** — 이번주 미션 + 학습목표/결과물/학습자료 배너 3-col
5. **WeekSchedule** — 목 Q&A · 일 19시 마감(핵심) · 일 20시 이기적공유 3단
6. **TeamProgress** — 6개 조 × 멤버 칩 (✓제출 / ✏️작성 중 / ○미작성)
7. **MissionDiscussion** — Slack 자동 수집, 🎯 미션 관련도 ≥ 70% 게이팅, `#질문`/`#노하우`/`#사이트` 해시태그
8. **CommunityCTA** — 외부 `spongeclub-community.vercel.app` 진입점

## 디자인 토큰 (globals.css `@theme`)

- **Sponge yellow**: `sponge-{50,100,300,500,600,700}` — 브랜드·CTA·D-day 강조
- **Ink gray**: `ink-{50,100,300,500,700,900}` — 본문·헤더·서브텍스트
- 폰트: Pretendard (한국어 가독성)
- 6개 조 색상: `.team-1` ~ `.team-6` (오렌지·옐로우·블루·퍼플·그린·핑크)

## 명령

```bash
npm run dev    # 개발 서버 (Turbopack)
npm run build  # 프로덕션 빌드 + 정적 페이지 생성
npm run start  # 빌드된 결과 실행
npm run lint   # ESLint
```

## Phase 2 — 실데이터 연동 로드맵

`src/data/*.ts` 모듈은 모두 mock입니다. 같은 export 시그니처를 유지하면서
실제 데이터 소스로 교체하면 됩니다.

| 모듈 | Phase 1 (현재) | Phase 2 (실데이터) |
|---|---|---|
| `announcements.ts` | 정적 배열 | Supabase `announcements` 테이블 (Slack `#0-공지사항` 자동 수집) |
| `mission.ts`, `weeks.ts`, `schedule.ts` | 정적 객체 | 운영진 입력 CMS / 별도 데이터 소스 |
| `teams.ts` | 정적 멤버 | `spongeclub-homepage.vercel.app` 공유 DB / API |
| `discussions.ts` | 정적 배열 | Supabase `discussions` 테이블 + Graphify 관련도 스코어링 |

### Phase 2 추가 작업

1. Slack App + Events API 셋업 (워크스페이스 admin 권한 필요)
2. Vercel API Route — `/api/slack/events` (signing secret 검증, message 인제스트)
3. Supabase 스키마: `announcements`, `discussions`, `members`, `teams`
4. Graphify 분류 파이프라인 (GH Actions cron 일 2회)
   - 채널·키워드 기반 1차 분류
   - 미션 관련도 0~100 스코어 + 임계값 게이팅 (현재 70)
5. 운영진 승인 워크플로우 (Slack 봇 ✅/❌ 버튼 + admin 페이지)
6. Vercel 프로젝트 통합 (homepage + community + missions → 단일 진입점)

상세 설계는 [../주차별_미션_게시판_초안.md](../주차별_미션_게시판_초안.md) 참고.

## 디자인 레퍼런스

루트 디렉토리의 정적 HTML 프로토타입:

- `../missions_prototype.html` — 본 페이지의 원본 레퍼런스
- `../skills_prototype.html` — 다음 페이지 (스킬 & 인사이트)
