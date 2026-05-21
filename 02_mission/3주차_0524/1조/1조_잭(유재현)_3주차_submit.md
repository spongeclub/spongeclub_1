---
team: 1조
member: 잭(유재현)
role: 조원
week: 3
submitted: true
---

# 3주차 과제 — 잭(유재현)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

@coach_unick 인스타그램 캐러셀 콘텐츠를 기획-생성-편집하는 올인원 웹앱 **Carousel OS**를 Cowork + Claude Opus로 이틀 만에 풀스택 구현. 아이데이션부터 AI 카피 생성, 슬라이드 비주얼 프리뷰, 보관함까지 콘텐츠 제작 전체 워크플로우를 하나의 앱으로 자동화.

### 최종 구현 결과물

- **라이브 URL**: https://coach-unick-carousel.vercel.app
- **GitHub**: vupercentmove/CoachUnickCarousel (Private)
- **기술 스택**: Next.js 14 + TypeScript + Tailwind + Supabase + Vercel
- **LLM**: Claude Sonnet (primary) + Gemini Flash (fallback) 자동 전환

**3탭 구조:**
1. **아이데이션** — 주제 입력 → 콘텐츠 유형 5종 → 김낙타 훅 공식 7종 + 욕구 4종 선택 → AI 커버 제목 3개 생성 → 캐러셀 생성
2. **에디터** — 10장 슬라이드 실시간 프리뷰(1000x1250px) + 카피 편집 + 캡션/ManyChat DM/공유멘트
3. **보관함** — Supabase 기반 저장/불러오기/삭제

### 과정 (타임라인별 + 삽질)

**Day 1 (5/20) — 전체 빌드 (26개 태스크)**

Cowork에서 Claude Opus와 페어프로그래밍으로 진행. 태스크 리스트로 진행 관리.

- 프로젝트 초기 세팅 → 탭 네비게이션 → 아이데이션 탭 UI
- 에디터 탭 비주얼 전면 리빌드 (2차까지)
- 뷰퍼센트 디자인 시스템 구축: 4색 배경(blue #162cd8, black, white, bg #f0f0ee) + 라임 강조색 #cbff00 + Pretendard
- 10장 배경 리듬 패턴: blue→white→bg→black→blue→bg→black→white→bg→black
- SlidePreview 12종 레이아웃 구현
- LLM 추상화 레이어 (Claude primary + Gemini fallback)
- 김낙타 훅 프레임워크 통합: 7공식(부정/질문/숫자/경고/통념파괴/관점전환/고백) + 4욕구(FOMO/주인공/과시/지름길) + 40템플릿
- Supabase 보관함 + Vercel 배포

**삽질 1: 인코딩 지옥**
Cowork의 Edit 도구로 한국어 파일을 수정하면 Linux 샌드박스 동기화 과정에서 파일이 잘리는 현상 발생. `types.ts`가 `selectedFormulas: ` 에서 뚝 잘려서 빌드 에러 폭탄.
→ 해결: Python heredoc(`python3 << 'PYEOF'`)으로 UTF-8 인코딩 지정하여 전체 파일 쓰기로 우회. 모든 한국어 포함 파일을 이 방식으로 재작성.

**삽질 2: Git index.lock**
샌드박스에서 `.git/index.lock` 삭제 권한 없음 → git 명령 전부 블로킹.
→ 해결: PowerShell에서 수동으로 `Remove-Item .git\index.lock` 후 push.

**삽질 3: autoprefixer/postcss 충돌**
Tailwind CSS 빌드 시 autoprefixer 버전 호환 문제.
→ 해결: `autoprefixer@10.4.20`, `postcss@8.5.1` 고정.

**Day 2 (5/21) — 기능 추가 + 버그 수정**

- **훅 공식/욕구 직접 선택 기능**: 기존 자동 배정에서 7공식+4욕구 멀티셀렉트 토글로 확장. 6개 파일 동시 수정.
- **"캐러셀 생성" 버튼 버그**: AI가 제목 생성해도 `selectedCoverIndex`가 null → 버튼 disabled. 자동선택 + 포커스 선택 + 안내 문구로 해결.
- **이야기 자본 DB 연동**: Notion MCP + Tiro MCP로 코칭 에피소드 직접 조회 → 캐러셀 소스로 활용.
- **블러핏 "자존감 지킴이" 캐러셀**: 7장 완성본 → 10장으로 확장, 성희님 8원칙 적용.
- **프로젝트 인스트럭션 작성**: Claude Projects용 커스텀 인스트럭션 문서.

### 공유할만한 인사이트

**Cowork + Opus 페어프로그래밍의 위력**: 풀스택 웹앱을 이틀 만에 배포까지 완료. 태스크 리스트로 진행 관리하면 컨텍스트가 길어져도 흐름을 안 잃음.

**인코딩 이슈는 패턴으로 외우기**: Cowork에서 한국어 파일 수정할 때는 Edit 도구 대신 Python heredoc 사용. 이거 모르면 반나절 날림.

**"운영체제"의 정의**: 나한테 OS란 "반복되는 판단을 자동화해서, 나는 판단의 질에만 집중하게 만드는 것". Carousel OS는 콘텐츠 기획 시 매번 하던 훅 고민, 구조 설계, 카피 작성을 자동화해서 "이 에피소드를 어떤 각도로 풀까?"라는 핵심 판단에만 집중하게 해줌.

---

## 미션2: Cowork 활용 — Notion/Tiro MCP 연동으로 콘텐츠 소스 자동화

### Summary

Carousel OS 웹앱에 직접 코드를 추가하지 않고, Cowork 대화에서 Notion 이야기 자본 DB와 Tiro 코칭 녹음을 MCP로 직접 조회하여 캐러셀 콘텐츠 소스로 활용하는 워크플로우 구축.

### 최종 구현 결과물

- Notion 이야기 자본 DB (15개 필드, 서사유형/서술구조/인사이트유형/훅패턴 등) 조회 가능
- Tiro 코칭 세션 (메리엣, 셀리나, 블러핏, 뮤즈인미 등 10+ 고객사) 검색 + 속기록 조회 가능
- "블러핏 자존감 지킴이" 에피소드 → 10장 캐러셀 카피 + 캡션 + ManyChat DM + 공유멘트 생성 완료

### 과정

1. Tiro MCP로 "성장 매출 코칭" 키워드 검색 → 10개 코칭 세션 발견
2. Notion MCP로 이야기 자본 DB 스키마 분석 (collection://0f986602...)
3. 성공 에피소드 후보 4개 추출 (블러핏/제이블린/매출80%/피크온)
4. 블러핏 "자존감 지킴이" 선택 → 성희님 8원칙 적용하여 10장 캐러셀 작성
5. 원칙 체크 8개 항목 모두 통과

### 공유할만한 인사이트

웹앱 코드를 건드리지 않고도 MCP 연동만으로 데이터 소스를 확장할 수 있다는 점이 Cowork의 강점. "코드를 짜는 것"과 "콘텐츠를 만드는 것"을 같은 대화에서 넘나들 수 있음.
