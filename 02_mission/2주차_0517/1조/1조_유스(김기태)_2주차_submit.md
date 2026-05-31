---
team: 1조
member: 유스
role: 조원
week: 2
submitted: true
mvp: false
mvp_reason: ""
---

# 2주차 과제 — 유스

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

# 미션1: MEDIT CX Hub — 내 일의 운영체제

## Summary

MEDIT HQ CX 팀원으로서 매주 화요일 위클리 준비, 월간 임원 보고서, 글로벌 CX 뉴스레터, FAQ 작성 등 흩어진 업무를 **하나의 흐름으로 묶는 웹 OS**를 6일 동안 구현했다.

**OS 선언문**: *"나는 모아진 데이터와 요약된 내용으로 확인·검토만 하고, 나머지는 시스템이 한다."*

추가 비용 0원 제약 안에서 Supabase + Next.js + Gemini + Vercel 무료 티어로 9개 부품을 만들고 배포했다. Zendesk 티켓 sync부터 LLM 원인 요약, 회의록·월간 보고서·뉴스레터 자동 export, Help Center 자동 인용까지 위클리·월간 산출물의 80%가 자동화됐다.

- 🌐 Production: https://medit-cx-hub.vercel.app
- 🔗 GitHub: https://github.com/kitae-k/medit-cx-hub (private)

---

## 최종 구현 결과물

### OS 흐름

```
[Zendesk 티켓] + [Help Center 매뉴얼]
       ↓
   수동 Sync → Supabase
       ↓
대시보드 · 자유 분석 빌더
       ↓
Gemini LLM 원인 요약 + 사람 인사이트 + ⭐ 특이 이슈
       ↓
위클리 회의록 / 월간 보고서 / 글로벌 CX 뉴스레터 (Markdown)
       ↓
Notion · Confluence · Teams 공유
```

### 검증된 9개 부품

| # | 부품 | 핵심 |
|---|---|---|
| 1 | Zendesk Sync | Incremental Export · KST 보정 · multi-brand |
| 2 | 대시보드 (위클리) | Top 5 · 증감 · 신규 카테고리 · 일별 추이·분포 차트 |
| 3 | 자유 분석 빌더 (`/analytics`) | 차원·차트·필터·NULL 진단 자유 조합 |
| 4 | Gemini LLM 원인 요약 | 샘플 사이즈 조정 · 캐싱 · 비례 추정 |
| 5 | Help Center Sync | Medit + CX Guide brand별 sync |
| 6 | 위클리 회의록 export | Markdown 클립보드 / .md 다운로드 |
| 7 | 월간 임원 보고서 / 뉴스레터 | 두 톤 토글 · Help Center 자동 인용 |
| 8 | ⭐ 특이 이슈 큐레이션 | Top 5 외 사용자가 직접 마킹 → 보고서 자동 포함 |
| 9 | 티켓 drill-down 모달 | 카테고리별 raw 티켓 검색 · 본문 · Zendesk 링크 |

---

## 과정 (타임라인별 + 삽질)

### Day 1 (5/15 낮) — 청사진
- OS 인터뷰 6단계로 풍경·통점·이상향 발굴
- 핵심 통점: "팀원 여러명이 각자 다른 방식으로 작업"이라는 것을 표면적 의식, 진짜 통점은 "**위클리 준비의 반복 비용**" + "**산출물 표준화 부재**"
- 첫 부품 = "주간 VOC 분석 엔진" + 형태 = 웹 (팀 공유 가능) 결정
- PRD + OS 청사진 2개 파일로 출력

### Day 2 (5/15 밤) — 인프라
- Supabase 계정·프로젝트 생성 → DB 스키마 → Auth
- Next.js 16 프로젝트 셋업 + 로그인/로그아웃 동작 검증
- **🪤 삽질 1**: Next.js 16의 breaking change — `middleware.ts` → `proxy.ts`로 rename 필요. 첫 부팅 시 deprecation 경고로 발견.
- **🪤 삽질 2**: Gemini API 키 오타 — 키 prefix가 `Alza...`(소문자 L) vs 정답 `AIza...`(대문자 I). 폰트 차이로 손으로 옮기다 깨진 케이스. 새로 발급해서 해결.

### Day 3 (5/16) — 분석·요약
- Zendesk Search API → 1000건 한도 발견 → Incremental Tickets Export API로 전환
- **🪤 삽질 3**: KST timezone 보정. 처음엔 UTC 자정 기준으로 필터링해서 5/8~5/10 데이터가 비어보였음. 사용자가 *"왜 금~일에 데이터가 없지?"* 라고 짚어줘서 알아챔. 모든 시간 처리를 KST(UTC+9)로 보정.
- **🪤 삽질 4**: Supabase가 1212건 중 1000건만 fetch. PostgREST 기본 max-rows가 1000인 것. 페이지네이션 추가.
- 자유 분석 빌더 + LLM 원인 요약 + 회의록 export 추가
- MEDIT 워크북의 브랜드 컬러·폰트로 디자인 시스템 적용

### Day 4 (5/17) — 발행·운영
- Vercel 배포 → production URL 동작 확인
- 즉시 보안 검토 → **🪤 삽질 5**: Supabase 신규 가입이 기본 열려있어서 외부인이 직접 API로 가입 가능. 차단.
- Help Center sync 첫 구현 → 588건 가져옴 → 사용자가 *"CX Guide brand도 있는데?"* 라고 짚음 → **🪤 삽질 6**: Multi-brand Zendesk 인지 못함. `/api/v2/brands.json` 호출 + brand별 fetch로 보강.
- 월간 임원 보고서 + 글로벌 CX 뉴스레터 빌더 (한 데이터, 두 톤)
- ⭐ 특이 이슈 큐레이션 + 티켓 drill-down 모달
- NULL 제외 토글이 Top 5 자동 요약에도 반영되도록 보강

---

## 공유할만한 인사이트

### 1. "AI 자동"과 "사람 판단"은 분리해서 함께 두기
LLM 원인 요약을 자동으로 받지만, 그 옆 사용자 인사이트 메모와 ⭐ 특이 이슈를 **별도 영역**으로 분리. 보고서에는 둘 다 들어가되 "AI 분석" / "담당자 인사이트"로 라벨링.

> 자동화는 시간을 돌려주지만 판단은 사람만 할 수 있다. 둘을 섞지 않고 분리하면, 사람의 판단이 살아남는다.

### 2. "자유 빌더"는 결정 비용을 사용자에게 전가한다
처음엔 Zendesk Analytics 같은 자유 분석 빌더에 끌렸지만, 만들기 전에 한 번 멈춰서 검토.
*매번 X축·Y축·차트·필터를 골라야 한다* = 매번 결정 비용. 위클리·월간 같은 **반복 시나리오는 미리 굳힌 화면**, 탐색적 분석만 자유 빌더에.

> 자유도와 효율은 반비례. 정해진 흐름은 굳히고, 변하는 부분만 자유롭게.

### 3. "되겠지" 대신 "어떤지" 묻기 — 사용자 검증이 회사의 구조를 드러낸다
- KST timezone 문제 — 사용자가 "왜 5/8 이후가 비어?" 짚어줘서 발견
- Multi-brand 문제 — 사용자가 "CX Guide도 있는데?" 짚어줘서 발견

회사의 실제 구조는 코드 작성 후 가 아니라 사용자 검증에서 드러난다. *"문서대로 동작했겠지"* 라는 가정은 가장 비싼 가정.

### 4. 데이터의 정확성이 분석의 90%다
KST 보정, multi-brand sync, NULL 처리, 페이지네이션, 중복 dedupe — 차트 그리기 전에 데이터가 정확해야 한다. **분석 빌더의 멋진 차트보다 timezone 한 줄 보정이 임팩트가 컸다.**

### 5. 제약은 부정하지 않는다, 그 안에서 일을 좁힌다
"추가 비용 0원" 제약을 한 번도 어기지 않음. Supabase + Vercel + Gemini 모두 무료 티어. 1년치 사용량을 미리 시뮬레이션 + 위험 시점만 정의 (2~3년 후 DB 한계 근접 시 archive 또는 Pro 전환). 제약이 오히려 *"이걸 만들어야 하나?"* 라는 질문을 명료하게 해줬다.

### 6. 출시는 보안 검토 완료 시점이다, 코드 동작 시점이 아니다
Vercel 배포 직후 보안 점검을 의식적으로 했다. 공개 가입 차단, 환경변수 격리, RLS, GitHub 비공개. 만약 점검 안 했으면 누구나 가입해서 회사 VOC 데이터 접근 가능했을 것. **"동작한다" ≠ "출시 가능"**.

### 7. 부품은 부품끼리 격리한다
client component가 server-only 모듈을 직접 import 하지 않게. 타입과 상수는 별도 파일로 (`lib/analytics/types.ts`). 한 부품의 server-only 의존성이 client component까지 끌려가서 빌드 에러난 적이 있었고, 그 한 번을 통해 격리 원칙을 새로 발견.

---

> **만들면서 깨달은 한 줄**:
> OS는 한 번 만들고 끝나는 게 아니라, **사용한 사람의 손맛이 매번 추가되는 살아있는 시스템**이다. 자동화는 사람의 시간을 비워주고, 그 비워진 시간에 사람이 새로운 손맛을 추가한다.


---

