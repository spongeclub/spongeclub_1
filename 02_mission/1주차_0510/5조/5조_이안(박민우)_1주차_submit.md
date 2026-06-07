---
team: 5조
member: 이안
role: 조원
week: 1
submitted: true
mvp: false
mvp_reason: ""
---

# 1주차 과제 — 이안

## 미션 1: claude code 로 인터뷰스킬 사용해서 인터뷰 까지 진행

### Summary

외부에서 받은 `os-interview-skill`(6단계 인터뷰형 Claude 스킬)을 임시 폴더에 두고 본인 OS 인터뷰를 진행. 약 40분간 6단계(풍경 → 통점 → 이상향 → 부품 매핑 → 첫 부품 결정 → 결과물 작성)를 거쳐 영상 도메인의 OS 청사진을 그리고, 첫 부품으로 **`script2storyboard`** Claude 스킬을 v0.1.1까지 다듬어 완성.

**OS 선언문 (영상 한정)**: *"나는 대본 작성과 최종 편집만 하고, 나머지는 시스템이 한다."*

### 최종 구현 결과물

**산출물 위치**: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/`

| 파일 | 역할 |
|---|---|
| `os-blueprint.md` | OS 청사진 — 선언문 / 풍경 / 통점 / 이상향 / 부품 8개(난이도·의존성) / 검증 마일스톤 M1·M2·M3 |
| `script2storyboard.skill.md` | 첫 부품 — 대본 .md → 호흡(8~15초) + 시각 컷(1~3초) **2-layer 콘티 표** 자동 생성 |
| `script-template.md` | 권장 대본 형식 (스킬이 호흡 단위 정확히 인식하도록) |

**스킬 영구 설치 방법** (다음 사용 시):

```bash
mkdir -p ~/.claude/skills/script2storyboard
cp ~/Dropbox/Spongeclub/temp/os-interview-skill/output/script2storyboard.skill.md \
   ~/.claude/skills/script2storyboard/SKILL.md
cp ~/Dropbox/Spongeclub/temp/os-interview-skill/output/script-template.md \
   ~/.claude/skills/script2storyboard/script-template.md
```

새 세션에서 `"콘티 만들어줘 [대본경로]"` 또는 `"권장 대본 형식 알려줘"` 던지면 발동.

### 과정 (타임라인별 + 삽질)

**1. 인터뷰 진행 (약 40분, 6단계)**

- Step 1 풍경 — "AI 레버리지로 동시에 사업·유튜브를 굴리는 1인 창작자"
- Step 2 통점 — 영상·사업 두 영역 모두 **"MVP 만드는 단계의 (a) 설계 비용"** 이 공통. 매번 0부터 설계해야 하는 막힘.
- Step 3 이상향 ⭐ — 영상 파이프라인 자동화. 한 문장 압축으로 OS 선언문 도출.
- Step 4 부품 매핑 — 8개 부품을 변환·생성·조립 3묶음으로 분류.
- Step 5 첫 부품 결정 — 1번(대본 → 콘티)으로. 형태는 A(Claude 스킬).
- Step 6 결과물 1차 작성 — `script2storyboard.skill.md` v0.1.

**2. ultrathink 리뷰 (15분, 삽질의 핵심 단계)**

직접 리뷰 요청해 **결함 12개** 발견. 우선순위(🔴/🟡/🟢)로 정리:

- 🔴 1-layer(8~15초만) 가정 → 시각 단조로움
- 🔴 200~300호흡 한 번에 만들고 검증의 비현실성 → 비용 $100~400 손실 위험
- 🟡 클립 프롬프트 한국어/영어 미결정 (Seedance 한국어 지원 미확인)
- 🟡 톤 4분류 협소 / 비용 인지 부재 / 대본 .md 형식 미정의 / Harness 규칙 누락
- 🟢 작성일 placeholder, BGM 컬럼 다음 부품 인터페이스 흐릿 등
- **청사진 차원**: 선언문 scope, 복직 시간 압박, 검증 마일스톤 부재

**3. 2차 수정 (v0.1.1)**

- 🔴 **2-layer 콘티 도입** — Layer A(호흡, Seedance 클립 단위) + Layer B(시각 컷, 1~3초 화면 전환). 호흡당 2~5개 시각 컷 자동 분할.
- 🔴 **샘플 검증(Step 4-A)** — 첫 5호흡으로 톤 검증 후 전량 생성. 톤 안 맞으면 Step 2 회귀.
- 🟡 클립 프롬프트 **한국어+영어** 양쪽 출력. 톤 자유 입력. 비용 추정 컬럼. 권장 대본 형식 별도 파일 + "권장 대본 형식 알려줘" 트리거.
- 🟡 청사진 보강 — 부품 표에 **난이도(L/M/H)·의존성** 컬럼, **검증 마일스톤 M1·M2·M3**, 다음 인터뷰(사업 OS·연구 OS) 명시.

**4. NLE 패키징 결정**

청사진 §3 5번(영상 조립 패키징)을 처음엔 `.fcpxml`로 잡았는데, ultrathink 리뷰에서 캡컷 `.draft`도 비공식·버전 변동 큼을 확인. 표준 포맷(OTIO/EDL)도 캡컷 직접 지원 안 됨. → **클립 폴더 일괄 import**(`001_xxx.mp4` 시간순 prefix)로 결정. 단순 파일 정렬 + rename으로 부품 #5의 난이도 H → L로 떨어짐.

**삽질 포인트 정리**:

- "한 호흡 = 한 AI 클립" 단순화는 직관적이었지만 시청자 입장의 시각 다양성을 못 살림. 2-layer 분리가 본질 — 생성 단위(호흡)와 편집 단위(시각 컷)는 다름.
- 비공식 NLE 포맷에 매달리지 않고 **가장 단순한 해법(폴더 + 시간순 prefix)이 가장 robust**. 표준 포맷 매달리는 게 함정.
- 인터뷰만으로 끝내면 1-layer 결함을 못 잡음. **자기 비판 라운드(ultrathink 리뷰)** 가 v0.1.1을 만든 결정적 단계.

### 공유할만한 인사이트

1. **인터뷰형 스킬의 두 톤 분리가 실제로 작동함**. Phase 1(R 톤, 사고 파트너)에서 가설 던지기·검증받기로 사용자 본인이 못 본 패턴 발견(영상·사업의 (a) 설계 비용 공통 통점). Phase 3(Q 톤, 발판형)에서 발판 깔아주면 빠르게 답이 모임. 같은 인터뷰 안에서 톤이 바뀌는 설계가 핵심.

2. **AI 산출물에 ultrathink 리뷰 한 번 거치면 결함 10+개가 나옴**. 인터뷰가 끝나도 산출물은 "1차 초안". 자기 비판 라운드를 명시적으로 요청하면 결함이 우선순위(🔴/🟡/🟢)와 함께 깔끔히 정리됨. **인터뷰 → 산출 → ultrathink 비판 → 수정** 4단계가 v0.1.1 만드는 데 필수.

3. **검증 마일스톤(M1·M2·M3)이 부품 우선순위를 잡아줌**. 부품 8개를 다 만들기보다 영상 1편을 끝까지 만들고 어디가 가장 노가다인지 측정 → 그 지점이 다음 부품. 복직(2달 뒤) 시간 압박 하에서 합리적 전략. "다 만들고 시작" 함정 회피.

4. **표준 포맷에 매달리지 않기**. NLE 자동 import (.fcpxml/.draft) 대신 클립 폴더 + 시간순 prefix 일괄 import가 가장 robust. 비공식 포맷은 버전 변동 위험. 가장 단순한 해법이 가장 오래 감.

5. **"AI 도구 제약 = 콘티 단위" 가정의 함정**. Seedance 8~15초 제약을 그대로 콘티 단위로 가져가면 시청자 입장의 시각 다양성(1~3초 화면 전환)을 잃음. **2-layer 분리(생성 단위 vs 편집 단위)** 로 풀림. 도구 제약과 콘텐츠 단위는 다른 차원.

---

## 미션 2: 따라해보고 싶은 개인/업무/삶 OS 따라서 만들어보기 - SNS(유튜브 등) 에서 찾아 벤치마킹 해오기

### Summary

**Curious Refuge** (Caleb Ward · Shelby Ward 공동 창업 · [YouTube](https://www.youtube.com/@curiousrefuge) · [curiousrefuge.com](https://curiousrefuge.com/)) **1명을 깊게 분석**. AI filmmaking 4주 강좌 + 주간 1시간 Zoom Q&A를 운영하는 교육자/크리에이터. 처음엔 5명 후보 리스트로 시작했으나 "2달 뒤 복직 시간 압박 하에서 다 따라할 시간 없음"을 인지하고 1명 깊게로 전환. 이미 **Seedance**를 강좌에서 다루고 있어 미션 1의 청사진 가정과 직접 매치.

### 최종 구현 결과물

**1줄 소개**: "AI는 필수 도구 (컴퓨터처럼). 흩어진 튜토리얼 대신 구조화된 학습 경로 제공" — Caleb Ward의 철학. 학생이 4주에 단편 영화 1편을 capstone으로 제작.

**Curious Refuge AI Filmmaking 워크플로우 단계 + 도구 스택**:

| Stage | 도구 |
|---|---|
| Ideation + Scriptwriting | ChatGPT (custom GPTs for filmmaking) |
| Art Direction + Storyboard | Midjourney (이미지) |
| Prompt Mastering + Directing | 텍스트 — 카메라 타입(35mm Panavision/Sony FX3) · 색감 · 사운드 명시 |
| Video Generation | **Runway + Seedance 2.0** |
| Voice / VO | **ElevenLabs** |
| Editing | Premiere Pro / After Effects (NLE는 자유 — 캡컷도 OK) |
| Enhancement | Topaz AI (Photo AI 2 / Video AI 4) |
| Distribution | (별도 모듈) |

**한 편 분량·비용 (실제 학생 사례)**:
- 분량: **10분 전문급 단편** (이안의 20~40분 롱폼과 분량 차이)
- 도구 비용: **$200~500/편** (청사진 비용 추정 $100~400과 일치)
- 강좌 비용: $749 일시 / $149/월

**이안 청사진 부품 8개 매핑**:

| # | 이안 부품 | Curious Refuge 해법 | 따라할 가치 |
|---|---|---|---|
| 1 | 대본 → 콘티 (`script2storyboard` ✅) | ChatGPT(스크립트) → Midjourney(스토리보드 이미지) | ⭐ 콘티 시각화에 Midjourney 차용 |
| 2 | 콘티 → Seedance 프롬프트 | "Prompt Mastering" — 4요소(피사체+동작+카메라 타입+색감/스타일) | ⭐⭐ 직접 차용 |
| 3 | 프롬프트 → 클립 생성 | **Runway + Seedance 2.0** | ⭐⭐ 직접 차용 (가정 일치) |
| 4 | B-roll·BGM 매칭 | Midjourney 이미지 + AI 사운드 디자인 | ⭐ 부분 |
| 5 | 클립 폴더 패키징 | (학생이 NLE로 수동 — 자동화 안 함) | △ 격차 |
| 6 | 썸네일 자동 생성 | Midjourney + Photoshop + Topaz | ⭐ |
| 7 | 자막 (SRT) | (별도 언급 없음) | △ |
| 8 | TTS 더빙 | **ElevenLabs** | ⭐⭐ 직접 차용 |

**다음 주 M2 마일스톤(영상 1편 끝까지)에서 Curious Refuge에서 빌릴 **한 가지****:

> 콘티의 "클립 프롬프트(한국어/영어)" 컬럼을 채울 때 **Curious Refuge 4요소 프레임**을 그대로 적용 — `피사체 + 동작 + 카메라 타입(예: 35mm Panavision) + 색감·스타일`. 추상적 묘사 대신 구체적 영화 어휘로 좁힘. ChatGPT custom GPT로 콘티 행 → 4요소 프롬프트 자동 변환 시도(부품 #2의 첫 구현).

### 과정 (타임라인별 + 삽질)

1. **5명 후보 리스트로 시작** — Curious Refuge / MattVidPro AI / Theoretically Media / The AI Advantage / Olivio Sarikas. 한국 1~2명도 추가하려 했으나 시간 압박 인지 후 **1명 깊게로 전환** (본인 결정).
2. **WebSearch 2회 병렬** — 워크플로우·도구 스택 / 4주 강좌 커리큘럼 키워드.
3. **WebFetch 3회 병렬** — `start-here`(무료 입문) / `ai-filmmaking`(4주 강좌) / [Better Editor 리뷰](https://www.bettereditor.be/curious-refuge-ai-filmmaking-course-reviewed/) / [Hollywood Reporter 기사](https://www.hollywoodreporter.com/movies/movie-features/curious-refuge-ai-film-school-hollywood-1236546505/).
4. **삽질**: 공식 페이지(start-here, ai-filmmaking)는 마케팅 톤이라 도구 이름이 거의 안 나옴. **3rd-party 리뷰(Better Editor) + 언론 기사(Hollywood Reporter)**에서 실제 도구 스택을 추출(Midjourney·Runway·Seedance 2.0·ElevenLabs·Premiere·Topaz). **공식보다 3rd-party가 정보 밀도 높음**.
5. **부품 8개 매핑** — #2/#3/#8(TTS)이 직접 차용 가능, #5(폴더 패키징)는 격차 큼(Curious Refuge는 NLE 수동, 이안은 자동화 목표).

### 공유할만한 인사이트

1. **Curious Refuge OS의 본질 = "흩어진 튜토리얼 대신 구조화된 경로"**. 이안이 이번 주에 만든 청사진 자체와 **같은 발상**. 부품 8개로 분해하고 도구·순서·의존성을 명시한 OS를 갖는 것이 핵심. **벤치마킹의 진짜 가치는 도구 카탈로그가 아니라 "분해 방식"** 임을 확인.

2. **Seedance가 실제 강좌에서 다뤄진다는 사실로 청사진 가정 검증됨**. 이안이 "Seedance 가정"으로 청사진을 만든 게 임의 선택이 아니라 업계 방향과 일치. Hollywood Reporter도 Seedance 2.0을 viral 사례로 명시.

3. **"프롬프트 마스터링" = 영화적 어휘를 명시적으로 담는 것**. `35mm Panavision` · `Sony FX3` 같은 카메라 타입, 구체적 색감·사운드. 콘티 표 "클립 프롬프트" 컬럼을 추상적 묘사로 채우면 Seedance 결과가 들쭉날쭉. **4요소 프레임(피사체+동작+카메라+스타일)이 다음 주 M2 첫 액션**.

4. **장르 격차 인지**: Curious Refuge = 시네마틱 단편(10분) / 이안 = 정보형 롱폼(20~40분). 도구 스택은 같이 빌리되 사용 방식은 다름. 시네마틱 단편의 "한 컷=한 앵글"을 그대로 가져오면 정보형 영상에선 단조로움. **청사진 v0.1.1의 2-layer(호흡+시각 컷)가 이 격차를 메우려는 설계 — 미션 1 결정이 정당화됨**.

5. **"5명 얕게 < 1명 깊게" 의사결정 패턴**. 다중 후보 비교는 선택 도구일 뿐 결과물 본질이 아님. 이미 직관적으로 1명 알고 있으면 거기에 시간 다 쓰는 게 합리적. **Plan 단계에서 "5명 리스트"를 default로 잡은 건 over-engineering**. 본인이 답을 알고 있는데 옵션 펼치기를 default로 두면 시간 낭비.

---

---

## 후속 갱신: v0.1.2 (2026-05-09)

미션 2(Curious Refuge 분석) 진행 중 도구 스택 검증에서 발견한 이슈를 청사진·스킬에 반영.

### 발견

- **Runway 통합 Seedance**는 가장 비싸고 자동화에 부적합. **fal.ai/Replicate direct API** 가 약 **10배 저렴** ($0.10/클립 vs $1/클립). 한 편(200호흡) 영상 비용: Runway $200~400 → direct API **$20~30**.
- 청사진 부품 #3의 실제 구현은 Runway 웹 UI가 아니라 **Python API 호출 한 줄**. 추측 난이도 M → 실제 L.
- 한국 specific 차단 없음. USD 결제, 일반 카드 OK.

### v0.1.2 변경 (`os-blueprint.md` + `script2storyboard.skill.md`)

- 청사진 §3 이상향 5번에 "fal.ai/Replicate direct API (10× 절감)" 명시
- 청사진 §4 부품 표:
  - #2 이름에 "Curious Refuge 4요소 프레임 차용"
  - **#3 난이도 M → L** + 이름 구체화 ("fal.ai/Replicate direct API")
  - #5 이름 "받은 mp4를 시간순 prefix 폴더 정리"
- 청사진 §7 **M2 마일스톤을 4단계로 세분화** (M2-1 API 키 발급 → M2-2 5호흡 샘플 실단가 측정 → M2-3 200호흡 자동 호출 → M2-4 캡컷 편집)
- 스킬 Output format 비용 헤더 **두 시나리오 동시 표기** (direct API vs Runway)
- 스킬 Step 4-B에 **Curious Refuge 4요소 프레임** 작성 규칙 신설 (피사체 + 동작 + 카메라 타입 + 색감/스타일)

### 추가 인사이트 (인사이트 6·7)

6. **벤치마킹 대상의 도구 스택을 그대로 쓰면 함정**. Curious Refuge가 Runway·Seedance를 쓴다고 해서 Runway 구독을 default로 잡으면 비용·자동화 양쪽 호구. 진짜 벤치마킹은 도구 카탈로그가 아니라 **"프롬프트 프레임 같은 사고 방식"** 을 차용하는 것. 비용·자동화는 본인 워크플로우에 맞게 별도 설계.

7. **추측 난이도 vs 실제 난이도**. 부품 #3을 M(중간)으로 잡았던 건 "API 호출 잘 모르겠음" 추측. 30분 검증으로 L(낮음)으로 떨어짐. 시간 압박 하에서 추측 난이도가 부품 우선순위를 왜곡할 수 있음 → **청사진 만들 때 추측만으로 난이도 박지 말고 5분 검증 루프 추가**가 다음 청사진 작업 (사업 OS·연구 OS 인터뷰)의 개선점.

### 📍 현재 상태 (다음 세션 시작점)

**위치**: 1주차 산출물 v0.1.2 완료. M1 진입 직전. 미션 3 미작성. 미션 노트 미제출(`submitted: false`).

**완성된 부품**: #1 `script2storyboard` (Claude 스킬 v0.1.2)
**다음 부품**: #2 (콘티 → Seedance 프롬프트, Curious Refuge 4요소 적용) → #3+#5 통합 스크립트 (fal.ai/Replicate API 호출 + 시간순 prefix 폴더 정리)

**산출물 인덱스**:
- 청사진: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/os-blueprint.md` (v0.1.2)
- 스킬: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/script2storyboard.skill.md` (v0.1.2)
- 권장 대본 형식: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/script-template.md`
- 메모리: `~/.claude/projects/-Users-minwoo-Library-CloudStorage-Dropbox-Spongeclub-spongeclub-1/memory/` (vault 시작 시 자동 로드)

**검증 마일스톤 트래커**:
- [ ] **M1**: `script2storyboard`로 콘티 1편 생성 → 콘티 품질 평가
- [ ] **M2**: 영상 1편 끝까지 (4단계)
  - [ ] M2-1: fal.ai 또는 Replicate 계정 + API 키 발급 (USD 결제)
  - [ ] M2-2: 5호흡 샘플 API 호출 → 실단가·렌더 시간·품질 측정 → 청사진 비용 메모 갱신
  - [ ] M2-3: 200호흡 자동 호출 → 시간순 prefix(`001_*.mp4`) 폴더 패키징
  - [ ] M2-4: 캡컷 일괄 import → 편집 → 첫 영상 퍼블리싱
- [ ] **M3**: 영상 2편 후 유튜브 vs 사업 무게중심 재평가

### ✅ 다음 주 (2026-05-12 주) Todo

우선순위 순. 1·2·4는 의존성 없어 병렬 가능, 3은 1+2 후, 5는 3+4 후.

1. **스킬 영구 설치** (5분, 1회) — 임시폴더 → `~/.claude/skills/script2storyboard/`. 첫 부품 발동 가능해짐.
   ```
   mkdir -p ~/.claude/skills/script2storyboard
   cp ~/Dropbox/Spongeclub/temp/os-interview-skill/output/script2storyboard.skill.md ~/.claude/skills/script2storyboard/SKILL.md
   cp ~/Dropbox/Spongeclub/temp/os-interview-skill/output/script-template.md ~/.claude/skills/script2storyboard/script-template.md
   ```
2. **본인 영상 대본 1편 준비** (.md 형식, 권장 대본 형식 따라서). 새 세션에서 "권장 대본 형식 알려줘"로 형식 확인 가능.
3. **콘티 1편 생성** (M1). 새 세션에서 "콘티 만들어줘 [대본경로]" → 5호흡 샘플 검증 → 전량 생성.
4. **fal.ai 또는 Replicate API 키 발급** (M2-1). 신용카드 등록 필요. **fal.ai default 권장** (영상 모델 친화적).
5. **5호흡 샘플 API 호출** (M2-2). 콘티의 첫 5호흡 프롬프트로 mp4 받아보기. 실단가·렌더 시간·품질 측정 → 청사진·스킬의 비용 메모 갱신.

**보너스 (시간 남으면)**:
- 미션 3(SNS 글, AI 없이) 작성 → `/submit`으로 1주차 제출
- 1일 세미나(AI 영상 만든 사람) 수강 후 청사진에 통합

**막혔을 때 어디 보면 되는지**:
- M2 디테일: 청사진 §7
- 비용 추정 포맷·4요소 프롬프트 예시: 스킬 "Output format" 섹션
- 도구 결정 메타: 청사진 §4 부품 #2·#3 메모

### 🚀 다음 세션 한 줄 트리거

vault에서 새 세션 시작 (`cd ~/Library/CloudStorage/Dropbox/Spongeclub/spongeclub_1 && claude`) 후:
> **"이안 영상 OS 이어서. 이 미션 노트 읽고 M1부터 진행하자."**

vault 시작 시 메모리(user/project/feedback) 자동 로드 + 미션 노트 Read = 컨텍스트 80%+ 재구축.

---

## 후속 갱신: 무료 로컬 트랙 — M1.5 (2026-05-10)

미션 1·2 완료 후 M2(유료 fal.ai)로 넘어가기 전, **M5 맥북에어 16GB 한 대로 풀 파이프라인 무료 검증**(M1.5 신설). 비용 0으로 파이프라인 전체 막힘 지점을 미리 잡는 것이 목적.

### 결정 — 왜 무료 로컬 우회?

1. **비용 추정 갱신**: 5분 영상 = $5~10 추정이 너무 낙관적. 8초 호흡 50개로는 Seedance Fast 기준 $96~120, 80호흡까지면 $150 안팎. fal.ai 결제 전 변수가 너무 많음.
2. **단일 모델 한계**: 5분 단편을 단일 모델로 끝낸 사례가 사실상 없음 (Kling+Sora+Luma 하이브리드가 표준). "Seedance만으로 끝까지" 가정이 흔들림.
3. **하드웨어 가용**: M5 맥북에어 16GB 한 대로도 image+video+music 풀 파이프라인 실측 가능 (mflux + SVD + MusicGen 셋 다 16GB 검증).
4. **M2 진입 조건 명확화**: 무료 트랙 통과 후 (a) 품질 부족하면 fal.ai로 / (b) 충분하면 그대로. 결제 결정의 근거 데이터 확보.

### 신규 벤치마크: Nicolas Neubert "Genesis"

미션 2 (Curious Refuge) 후 추가 발굴.

- **누구**: AI filmmaker, 시니어 프로덕트 디자이너. *Genesis* SF 트레일러로 알려짐.
- **왜 정량 황금 표준**: 끝까지 시간·비용·프롬프트 수를 모두 공개한 거의 유일한 사례.
  - 총 **7시간** / 월 구독 **$125** (Midjourney $30 + Runway $95)
  - 프롬프트 **316개** → Runway 비디오 **310개** 생성 → 최종 사용 **44클립** (사용률 14%)
- **이안 청사진과의 정합성**: 이안 2-layer(호흡 8~15초 + 시각 컷 1~3초)와 거의 1:1 매칭. Neubert는 음악 먼저 → "Setting → Threat → Climax" 3단 호흡 → 0.5~2초 시각 컷 + 1.5~3배속 가속. **이안 컨셉이 검증된 결**.
- **출처**: [X 스레드](https://x.com/iamneubert/status/1684989102213476359) · [VentureBeat 인터뷰](https://venturebeat.com/ai/meet-the-ai-creative-senior-product-designer-nicolas-neubert-creator-of-sci-fi-movie-trailer-genesis) · [Maginative 메이킹](https://www.maginative.com/article/the-making-of-genesis-movie-trailer-midjourney-runway/)

추가 발굴 (얕게): Dor Brothers (Seedance 2.0 + Halo AI 하이브리드, 7일/편) · Martin Haerlin (Seedance 타임스탬프 프롬프트) · PJ Ace (image-first + 2x2 grid 일관성 트릭).

### Genesis 흐름 → OS_try1 무료 매핑

| 단계 | Genesis (유료) | OS_try1 무료 (M5 Air 16GB) | 첫 1회 다운로드 |
|---|---|---|---|
| 음악 먼저 | Pixabay 스톡 | **MusicGen-small** (Meta, audiocraft) | ~1.5GB |
| 호흡 3단 콘티 | 직관 | `script2storyboard` ✅ | — |
| 키 이미지 (호흡당 1장) | Midjourney v5 | **mflux + Flux.1 schnell** (MLX 네이티브, Apache 2.0) | ~7GB |
| 이미지→영상 | Runway Gen-2 | **SVD via diffusers + MPS** (gated, HF 토큰 필요) | ~5GB |
| 시간순 prefix 폴더 | 수동 | `pipeline.package` | — |
| NLE 편집 | CapCut | CapCut (그대로) | — |

> **TTS는 첫 검증에서 스킵.** Genesis도 음악만으로 트레일러 결.

### OS_try1 폴더 신설 (vault 외부, Dropbox 동기화)

코드·산출물은 git 외 — Dropbox로 다른 기기에 자동 sync.

**위치**: `~/Dropbox/Spongeclub/OS_try1/`

```
OS_try1/
├── README.md · CONCEPT.md · PLAN.md   ← 청사진 try1 정리
├── pipeline/
│   ├── README.md           ← 셋업·실행 가이드 (가장 먼저 읽기)
│   ├── config.py           ← 16GB 맞춤 default
│   ├── conti_parser.py     ← .storyboard.md → Beat list
│   ├── image_gen.py        ← mflux CLI 호출
│   ├── video_gen.py        ← SVD via diffusers + MPS
│   ├── music_gen.py        ← MusicGen-small
│   └── package.py          ← 시간순 prefix 폴더
├── scripts/
│   ├── 01_smoke_image.py   ← 이미지 1장 (~3분)
│   ├── 02_smoke_video.py   ← 키 이미지→2초 영상 (~15-25분)
│   ├── 03_smoke_music.py   ← 30초 BGM (~1-3분)
│   └── 04_run_pipeline.py  ← 콘티 → 전체 파이프라인
├── test_input/
│   ├── 무협_정파_3분.md           ← 테스트 대본
│   └── 무협_정파_3분.storyboard.md ← 콘티 (15호흡, 3분)
├── .env.example            ← HF_TOKEN 플레이스홀더 (.env로 복사 후 채움)
├── requirements.txt
└── .gitignore
```

### 테스트 대본·콘티 — 무협 정파 3분

첫 검증용. 5분도 길다고 판단 → 3분 압축.

- **주제 결정 과정**:
  1. 처음엔 "9대문파 + 5대세가 메타 설명" 결로 작성 → 너무 백과사전적
  2. **개별 문파/세가 깊이 소개**로 pivot — 셋만, 결이 가장 뚜렷한 것으로
  3. 최종: **무당파 (부드러움·태극) · 점창파 (빠름·사일검법) · 남궁세가 (패도·창궁대연검법)**
- **시각 차별화** (카메라·색감·모션 셋 다 분리):
  - 무당 = Sony FX3 다큐결 / 차가운 청회색·안개 / **둥근 원** 모션
  - 점창 = ARRI Alexa 35 시네마결 / 황금빛 역광 ↔ 청회색 정적 / **한 줄기 빛** 모션
  - 남궁 = 35mm Panavision 영웅결 / 깊은 푸른색 / **직선 정면 돌격** 모션
- **호흡 분배**: 인트로 2 + 각 4호흡씩(12) + 마무리 1 = 15호흡 × ~12s = 3분

### 추가 인사이트 (8·9·10)

8. **유료 도구 결정 전 무료 로컬 끝까지 검증**. 5분 단편 한 편이면 비용 $96~150 추정인데 변수 너무 많음. M5 Air 16GB 한 대로 풀 파이프라인 한 사이클 돌려보면 (a) 어느 단계가 진짜 노가다인지 (b) 품질이 충분한지 (c) 그러므로 결제할 가치가 있는지 0원으로 결정 가능. **비용 검증 ≠ 결제 검증**.

9. **벤치마크는 "정량 공개"가 황금**. Nicolas Neubert 1명만 시간/비용/프롬프트 수/사용률을 다 공개. 나머지 7명(Dor Brothers·PJ Ace 등)은 정성적 표현만. 이안이 5분 테스트 결과를 같은 포맷으로 정리만 해도 한국발 영어 콘텐츠 슬롯이 비어있음. **외부 공개 자산 = 수치 공개**.

10. **단일 머신 제약이 도구 선택을 명확히 함**. M5 Air 16GB라는 제약이 mflux(MLX 친화) + SVD(MPS) + MusicGen-small(가벼움) 셋을 자동으로 골라줌. 하드웨어 옵션이 많을수록 결정 비용이 커짐 — **제약은 자유의 적이 아니라 결정의 친구**.

### M1.5 마일스톤 신설

| 단계 | 액션 | 측정 |
|---|---|---|
| **M1.5-1** | HF 토큰 발급 + SVD 라이선스 동의 | ~5분 |
| **M1.5-2** | Python 3.11 venv + `pip install -r requirements.txt` | ~10분 |
| **M1.5-3** | smoke 3개 실행 (이미지·음악·영상) | 각 단계 도는지만 확인. 약 30분 + 첫 다운로드 ~14GB |
| **M1.5-4** | 콘티 1호흡 사이클 검증 (`--limit 1`) | 약 25-30분, 비용 0원 |
| **M1.5-5** | 결과 평가 → 무료 트랙 계속 / 유료 fal.ai 결제 결정 | — |

### 📍 갱신된 현재 상태 (다른 기기에서 이어가기)

**위치**: M1 진입 → **M1.5 진행 중 (무료 로컬 검증)**. M2(유료) 진입은 M1.5 결과 후.

**완성된 부품**: #1 `script2storyboard` (Claude 스킬 v0.1.2) + **OS_try1 무료 파이프라인 코드 (M5 Air 16GB)** + **무협 정파 3분 콘티**

**다음 액션 — 다른 기기에서 이어가기 (Cold Start)**:

1. **HF 토큰 발급 + 라이선스 동의** (한 번만, ~5분)
   - https://huggingface.co/settings/tokens 에서 read 권한 토큰 발급
   - https://huggingface.co/stabilityai/stable-video-diffusion-img2vid 에서 "Agree and access repository" 클릭
2. **OS_try1 폴더에서 환경 셋업** (~10분)
   ```bash
   cd ~/Dropbox/Spongeclub/OS_try1
   python3.11 -m venv .venv && source .venv/bin/activate
   pip install -U pip && pip install -r requirements.txt
   cp .env.example .env
   # .env 열어서 HF_TOKEN=hf_... 채움
   ```
3. **smoke 3개 순서대로** (~30분 + 첫 다운로드 ~14GB)
   ```bash
   python scripts/01_smoke_image.py   # Flux schnell, ~3분 + 다운로드
   python scripts/03_smoke_music.py   # MusicGen, ~1-3분 + 다운로드
   python scripts/02_smoke_video.py   # SVD, ~15-25분 + 다운로드
   ```
4. **콘티 1호흡 검증** (~25분, 비용 0원)
   ```bash
   python scripts/04_run_pipeline.py test_input/무협_정파_3분.storyboard.md --limit 1
   ```
5. 통과 시 `--limit 5` → 전량. 막히면 `pipeline/README.md` §4 폴백 표 참조 (SVD 막히면 `--skip-video` + DrawThings GUI).

**산출물 인덱스 (갱신)**:
- 청사진 v0.1.2: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/os-blueprint.md`
- 스킬 v0.1.2: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/script2storyboard.skill.md`
- 권장 대본 형식: `~/Dropbox/Spongeclub/temp/os-interview-skill/output/script-template.md`
- **무료 파이프라인 코드**: `~/Dropbox/Spongeclub/OS_try1/{pipeline,scripts}/`
- **테스트 대본**: `~/Dropbox/Spongeclub/OS_try1/test_input/무협_정파_3분.md`
- **테스트 콘티**: `~/Dropbox/Spongeclub/OS_try1/test_input/무협_정파_3분.storyboard.md`
- 메모리: `~/.claude/projects/-Users-minwoo-Library-CloudStorage-Dropbox-Spongeclub-spongeclub-1/memory/` (vault 시작 시 자동 로드)

**검증 마일스톤 트래커 (갱신)**:
- [x] **M1**: `script2storyboard`로 콘티 1편 생성 → 콘티 품질 평가 *(무협 정파 3분 콘티 작성 완료)*
- [ ] **M1.5 (신설)**: 무료 로컬 검증 (M5 Air 16GB)
  - [ ] M1.5-1: HF 토큰 발급 + SVD 라이선스 동의
  - [ ] M1.5-2: venv + 의존성 설치
  - [ ] M1.5-3: smoke 3개 통과
  - [ ] M1.5-4: 콘티 1호흡 사이클 검증
  - [ ] M1.5-5: 무료 트랙 계속 / 유료 fal.ai 결제 결정
- [ ] **M2**: 영상 1편 끝까지 (4단계, M1.5-5 결과에 따라 무료 또는 유료 트랙)
- [ ] **M3**: 영상 2편 후 유튜브 vs 사업 무게중심 재평가

### 🚀 다음 세션 한 줄 트리거 (갱신)

vault에서 새 세션 시작 (`cd ~/Library/CloudStorage/Dropbox/Spongeclub/spongeclub_1 && claude`) 후:
> **"OS_try1 M1.5 이어서. 이 미션 노트 후속 갱신 섹션 읽고 다음 액션부터."**

---

## 미션 3: AI 도움 없이 1주차 SNS 글 작성 - 링크드인/인스타그램

### 링크
https://www.linkedin.com/posts/minwoo-park-0997782a0_셀피쉬클럽의-스폰지클럽-프로그램에-참여중이다-ai활용을-서로서로-공유하며-share-7458638503698935811-S-bd/
