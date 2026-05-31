---
team: 4조
member: 리보
role: 조원
week: 1
submitted: true
mvp: false
mvp_reason: ""
---

# 1주차 과제 — 리보

## 미션 1: claude code 로 인터뷰스킬 사용해서 인터뷰 까지 진행

### Summary
## 1. Summary

> **한 문장**: "멀티채널 발행 운영자"의 OS 청사진을 그리고, 호출형 부품 1개(`html-maker` 플러그인)로 시작점을 만들었다.

- **OS 선언문**: "나는 **결정과 컨펌**만 하고, 나머지는 시스템이 한다"
- **첫 부품 형태**: B (Claude Code 플러그인)
- **소요 시간**: 약 50분 / 6단계 완주
- **결과물**: 6개 파일 (청사진 1 + 플러그인 5)
### 최종 구현 결과물
### 📄 OS 청사진 (`os-blueprint.md`)

- 풍경 / 통점 4갈래 / 이상향(자동 라인+호출 라인) / 부품 8개 / 첫 부품 / 다음 부품 후보

### 🔌 플러그인 (`html-maker/`)

|파일|역할|
|---|---|
|`plugin.json`|메타데이터 + 의존성(Python+Pillow)|
|`README.md`|설치/사용법, 두 모드 설명, 첫 검증 가이드|
|`commands/html-maker.md`|`/html-maker` 슬래시 커맨드의 7단계 워크플로우|
|`skills/image-to-html/SKILL.md`|자연어 트리거 ("이미지로 HTML 만들어줘")|

### 핵심 설계 결정

- **두 모드 분기**: auto(Claude 자동 영역 분석) + guide(빨간 박스 인식) — 사용자가 직접 추가
- **컴포넌트 2개 묶음**: 슬래시 커맨드 + 스킬 → 명시적/자연어 두 진입점
- **외부 API 없음**: 로컬 이미지 처리(Pillow)만 — MCP/훅 불필요
### 과정 (타임라인별 + 삽질)
- 🟡 **Step 5 폼팩터 선택에서 흔들림 발생** — 사용자가 처음엔 C(PRD)→i를 골랐다가 재고. 추천 옵션(B+iii)의 이유 설명을 더 강하게 / 처음부터 추천 강하게 짚어줘야
- 🟡 **부품 분류(자동 vs 호출)가 첫 부품 선택을 살짝 가렸음** — "호출 라인은 우선순위 낮음" 같은 가정이 깔려 있어서, 사용자가 "근데 매일 쓸 만한 게 빠졌다"고 정정해야 했음. **분류는 가이드일 뿐, 빈도/효과는 사용자가 정해야 한다**는 안내가 있어야
- 🟡 **사용자의 자발적 추가 요구(두 모드)** — 이게 결과물 품질을 크게 높임. Step 6에서 "추가하고 싶은 거?"를 명시 항목으로 박는 게 좋음

**스킬 자체에 추가하면 좋을 트리거**:

- Phase 1에서 "추상 단어 차단" 규칙 발동 사례가 이번엔 없었음 — 사용자가 처음부터 구체적이었음. 다른 사용자에선 어떨지 추가 케이스 필요

### 공유할만한 인사이트
OS가 아닌 플랫폼형태로 혼자서 따로 만드는 것이 있었는데 이부분이 OS 내용과 겹치는 프로젝트여서, 중복을 피하기위해서는 OS와 플랫폼의 영역 분리와 어떻게 큰그림으로 가져갈지를 고민하는게 중요함

---

## 미션 2: 따라해보고 싶은 개인/업무/삶 OS 따라서 만들어보기 - SNS(유튜브 등) 에서 찾아 벤치마킹 해오기

### Summary
https://www.youtube.com/watch?v=BKRZOgKe1Dw

목적 : 그동안 관심있는 부분을 캡쳐, 이미지 저장, 링크, 글 등을 카카오톡 나에게 보내기로 보냈는데 보내기만 하고, 보관만 할뿐 정리는 안되고, 찾으려고해도 찾기 어려워서 이 부분을 대시보드나 웹앱형태로 보여지고, 사고싶은 물건 List, 책읽었는지 등 할일 추가, 결과확인까지도 연동하고 싶었음

현재 OS 인터뷰 후 MVP완료 > 텔레그램 봇 연결완료함

> **카톡 자기채팅에 흩어진 캡처를 옵시디언 vault + 텔레그램 봇 + AI 분류 시스템으로 묶어, 매일 아침 home.md 한 화면이 OS의 입구가 되는 1인 인생OS의 입력층·콘트롤타워층을 빌드한 이틀.**

- **Day 1 (5/9)**: 인터뷰 → PRD → 22개 task 자동 빌드 → 첫 시연 → 분류기 버그 → 패치 → 5개 emergent 카테고리 자동 분류 성공
- **Day 2 (5/10)**: Gemini 통합 패치 → 사진 keyboard + URL fetcher 강화 → 텔레그램으로 폰 캡처 시작 → Gemini SDK deprecated 발견
- **현재**: 작동하는 MVP + 1주 검증 진입 직전 + 1개의 명확한 next-action(SDK 마이그레이션)
### 최종 구현 결과물
최종은 계속 다듬어야할 듯
현재 옵시디언, 텔레그램 봇까지 완성![[Pasted image 20260510145250.png]]
**OS 선언문**:

> _"나는 캡처와 판단만 하고, 나머지(분류·추적·상기·통합)는 시스템이 한다."_

**부제** (gpters 차용):

> _"사람이 판단하고, AI가 실행하고, 시스템이 기억한다."_

**풍경**: 혼합형 지식노동자 (본업·정보소비·투자·사이드 4갈래)  
**통점**: 입력 4갈래 → 인박스 1개(카톡) → 출력 4갈래. **post-capture pipeline 통째로 비어있음**.  
**이상향**: 4갈래 캡처가 의미 묶음별로 자동 정리되어 매일 아침 한 화면으로 보임.

**부품 후보 매트릭스**:

|묶음|부품|상태|
|---|---|---|
|(a) 입력 처리|A1 카톡 인제스터 + A2 emergent 분류기|✅ 첫 부품|
|(b) 결정 보조|B1 독서 트래커, B2 주식 모니터, B3 오늘의 5개, **B4 /morning-brief, B5 /decide, B6 /weekly-review**|🔴 미구현|
|(c) 출력 생성|C1 동적 카테고리 대시보드, C2 회고 뷰, **C3 home.md 콘트롤타워, C4 데일리 노트**|🟡 부분|
|(d) 인생OS 인프라|D1 나침반 타이머, D2 블로그 자동 발행|🔴 미구현|

→ **첫 부품**: A1 + A2 + C1 + C3 + C4 통합 = `inbox-os`
![[Pasted image 20260510145209.png|229]]
### 과정 (타임라인별 + 삽질)
### 🌅 Day 1 (5/9) 오전: 인터뷰 (30분)

```
/os-interview 발동  ↓6스텝 인터뷰  - 풍경 (혼합형 노동자, 4갈래 활동)  - 통점 (카톡 스크롤하다 목적 잃음, post-capture 공백)  - 이상향 (4갈래 자동 정리, OS 선언문 도출)  - 부품 매핑 (입력/결정/출력 3묶음)  - 첫 부품 결정 (A1+A2+C1, form C)  - PRD 작성  ↓PRD v0.5 (벤치마킹 5회 적용:  - YouTube "1만 메모 자동 분류" 영상  - gpters "AI 참모와 인생OS" 스터디  - 사용자 직접 피드백 → 카테고리 emergent  - 사용자 직접 피드백 → AI 참모 친화 인터페이스  - 사용자 직접 피드백 → 데일리 노트·home.md·즉시 피드백·D-n)  ↓2개 산출 파일 (os-blueprint.md, inbox-os.prd.md)
```

### ☀️ Day 1 (5/9) 낮: Claude Code 빌드 (3시간)

```
T1 Project Scaffold ✅T2 Config + Models ✅T3 SQLite Database ✅ (44개 테스트)T4 Embedder Module ✅ (모델 다운로드 5분 11초, 471MB)T5 Category Registry ✅ (22/22 테스트 → self-review 22개 추가 발견)T6 Claude API Client ✅  ↓ 사용자 inject: T_URL 추가 ↓T7 Image Processor + T_URL URL Fetcher ✅ (병렬)T8 Classifier Pipeline ✅ (44/44, 회귀 0)T9 Vault Writer ✅T10 Compass ModuleT11 Daily Note + home.mdT12 vault/CLAUDE.md Updater (60/60)T13 Core Pipeline IntegrationT14 WatcherT15 Telegram Bot + FeedbackT16-T18 (Bulk import + Cat operations + FastAPI)T19-T21 Next.js 대시보드 + E2E + README ✅ (99/99 통과)
```

### 🌆 Day 1 (5/9) 저녁: 첫 시연 → 2번 막힘

**삽질 1**: PowerShell `Out-File`의 BOM + race condition

```
증상: "messages.0: user messages must have non-empty content"원인: 파일 생성 직후 watcher가 미완성 상태 읽음해결: BOM 없는 atomic move 워크어라운드 → 그 후 patch로 영구 fix
```

**삽질 2**: torch DLL 로딩 실패

```
증상: [WinError 1114] DLL 초기화 루틴 실행 실패원인: Python 3.13 + Windows + Visual C++ Redistributable 미설치해결: VC++ Redist 설치 (~5분) → torch 정상 로드 → 모델 다운로드 5분 11초
```

**삽질 3**: 분류기 6개 동시 버그

```
증상: 모든 캡처가 "미분류" + AI 요약 안 들어감 + 카운트 0원인: Claude API 응답이 markdown fence/preamble로 감싸져서 JSON 파싱 실패       → fallback이 placeholder 처리 + count update 누락 + daily note append 누락해결: 통합 패치 1회로 6개 fix       (preamble strip + markdown fence + 1 retry + count sync + daily append + BOM·race)결과: 8개 캡처가 5개 emergent 카테고리에 깔끔 분류 ✅       옵시디언에서 home.md 첫 모습 확인
```

### ☀️ Day 2 (5/10) 오전: Gemini 통합 패치 설계

```
Day 1 결과 본격 사용 → 새 갭 3가지 발견:  1. 사진이 다 "개발문서"로 잘못 분류  2. YouTube playlist 음악 분류 안 됨  3. 롱블랙 본문 요약 안 됨대응: 통합 패치 6섹션  [1] 사진 분류 + 사용자 keyboard + Brave 검색  [2] Gemini API 통합  [3] url_fetcher 4단계 → 3단계 fallback  [4] frontmatter 확장  [5] 14개 테스트  [6] README 보강3가지 아키텍처 결정 (Claude Code 미리 물음):  - Article fallback Playwright → 제거 (의존성)  - 카테고리 직접입력 → 버튼 전용 (복잡도)  - Callback 상태 → in-memory (봇 재시작 드물)  → 모두 "단순성" 일관 선택
```

### ☀️ Day 2 (5/10) 낮: 116개 테스트 통과 + 커밋

```
TDD 사이클 정석:  RED → 6개 fix 테스트 작성 → 실패 확인  ↓  google-generativeai introspection 3회 (dir, help, getsource)  ↓  GREEN → 구현 → 테스트 통과 → 회귀 0  ↓  commit 79358d4  .env 갱신 (사용자 직접):  GEMINI_API_KEY=AIzaSy... 추가  (Brave는 카드 대기 중).env.example 갱신 + commit 9a60ba2
```

### 🌆 Day 2 (5/10) 저녁: 폰에서 실제 캡처 → 부분 갭 발견

**삽질 4**: Gemini SDK deprecated

```
증상: YouTube 캡처 일부가 generic placeholder로 처리됨       + frontmatter에 chapters 필드 없음직접 진단:  python -c "from inbox_os.gemini_client import analyze_youtube; print(...)"  → FutureWarning: google.generativeai package has ended  → grpc._channel._InactiveRpcError원인: Google이 SDK 갈아엎음 (google-generativeai → google-genai)       우리 패치가 deprecated SDK 사용 중해결 (내일 패치):  - google-genai로 마이그레이션  - chapters/topics 전파 로직 추가  - placeholder fallback → yt-dlp metadata fallback
```

### 공유할만한 인사이트
### 💡 1. PRD-first 접근의 위력

- 인터뷰 30분 → PRD 6시간치 작업 가이드
- Claude Code가 22개 task 자동 분해 + 우선순위 + 의존성 그래프
- *"코드 짜기 전 합의"*가 짜고 나서 후회를 막음

### 💡 2. TDD 사이클이 진짜 버그를 잡음

- _"테스트가 올바른 이유로 실패하는지"_ 검증 (RED)
- self-review subagent가 streak 로직·테스트 격리 같은 잠재 버그 자체 검출
- 단, **TDD가 통과한 코드도 production에선 다른 식으로 깨짐** (예: BOM, deprecated SDK)
- → **실사용 검증 단계가 unit 테스트만큼 중요**

### 💡 3. 외부 SDK 변동성

- Google 같은 큰 회사도 SDK 갈아엎음 (`google.generativeai` → `google.genai`)
- 빌드 시점에서 LLM이 학습한 SDK가 deprecated된 상태일 수 있음
- **새 LLM 프로젝트는 SDK 안정성도 점검 항목**

### 💡 4. 단순성 = 진짜 선택지

3가지 아키텍처 결정에서 _"강력한 vs 단순한"_ 매번 단순 선택:

- Playwright vs Gemini raw HTML → Gemini만
- ConversationHandler vs 버튼 전용 → 버튼만
- SQLite 영속화 vs in-memory dict → in-memory
- 결과: 디버깅 가능성 ↑, 미래 갭 보일 때 추가 가능

### 💡 5. Emergent vs Predefined 구조

- 카테고리를 미리 정의하지 않고 **시스템이 발견**하게 한 게 핵심 설계
- 사용자가 _"카테고리 뭐로 할지"_ 결정 부담 0
- 8개 캡처에 5개 카테고리가 자연스럽게 형성됨
- → **AI 시대의 데이터 구조는 사전 정의가 아니라 실사용으로 발견**

### 💡 6. 다층 fallback의 가치

URL 본문 추출 4단계 (Playwright 빼고 3단계로 단순화):

```
trafilatura → BS4 → Gemini raw HTML
```

- 1단계 실패해도 2단계가 잡고, 그것도 실패하면 3단계가 잡음
- LLM이 fallback 요소로 들어오면 *"룰 못 짜는 케이스"*도 처리
- **AI가 룰의 마지막 fallback이 되는 패턴**

### 💡 7. 환경 의존성의 함정

- Python 3.13 + Windows + ML 패키지 = VC++ Redist 같은 OS 레벨 의존성
- *"코드가 통과하는 테스트"*와 _"내 PC에서 작동"_ 사이의 갭
- → **첫 시연은 빌드 후 가장 빨리, 항상 깨질 수 있다고 가정**

### 💡 8. 디버깅 기록의 학습 가치

- 막힐 때마다 진단 → 가설 → 검증 → 수정 → 회고
- 이 사이클이 _"왜 안 됨?"_ → *"이 한 줄 때문"*으로 좁혀가는 훈련
- 막힘 자체가 학습 자산. 막힘 없이 끝난 빌드는 회고할 게 없음

### 💡 9. 비용 모니터링 = 1인 OS 위생

- 프로젝트별 API key 분리 (Anthropic, Gemini)
- 월 spend limit 설정 (Anthropic $15)
- 무료 한도 안에서 시작 (Gemini 무료, Brave $5 크레딧)
- → **개인 프로젝트도 회사처럼 관리하면 폭주 안 함**

### 💡 10. _"옵시디언+웹"_ 듀얼 뷰의 잠재력

- 같은 데이터가 두 가지 형태로 보임:
    - 옵시디언: 깊이 보기·노트 편집·plug-in 활용
    - Next.js 대시보드: 시각·트렌드·메트릭
- 사용자가 모드별 자유롭게 선택 → **OS의 진정한 의미**
---

## 미션 3: AI 도움 없이 1주차 SNS 글 작성 - 링크드인/인스타그램

### 링크
<!-- 작성한 SNS 글 URL -->
https://www.instagram.com/p/DYGcDxZDwn3/?igsh=cjJ4cDBmN2htbzVh