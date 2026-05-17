---
team: 6조
member: Hook2(이창환)
role: 조원
week: 2
submitted: true
---

# 2주차 과제 — Hook2(이창환)

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

**본인이 정의하는 OS**: 매일의 결정·실행을 시스템이 받쳐주고, 본인은 *언제·누구에게·왜*만 결정하는 운영 구조. 1주차 OS 청사진(부품 9개)에서 첫 부품(`visitor-crm`) 옆자리에 **이번 주 동시 구현한 두 부품**을 추가:

- **Part A — `self-discovery`** (개인 OS 3번 부품): 매일 아침 8시 텔레그램 봇이 행동 데이터 기반 회상 질문을 보내고 답변·후속 대화를 PARA vault에 누적 → 6개월 후 가치관·자기소개서 데이터로 자동 환원.
- **Part B — `kexpo-content-studio`** (팀 OS 부품): K-Expo 운영진·동료(비개발자)가 브라우저 버튼 한 번에 K-소비재 해외 진출 인사이트 콘텐츠 4,000자를 만드는 Vercel 웹앱.

두 부품 모두 **OS 선언문**("나는 결정만 하고, 보내고·합치고·추적하는 건 시스템이 한다")의 직접 구현체. 한 부품은 *내 안*을 향하고, 다른 부품은 *팀*을 향함.

---

### Part A — `self-discovery` (개인 OS 3번 부품)

#### 최종 구현 결과물

- **스킬 폴더**: `~/.claude/skills/self-discovery/` — `SKILL.md` + references 4개 + `trigger.ps1`
- **설계 문서**: `~/dev/my-os/docs/superpowers/specs/2026-05-13-self-discovery-system-design.md`
- **Windows 작업 스케줄러**: `"Self-Discovery Daily Question"` (매일 08:00 KST)
- **누적 저널**: `vault/2-Areas/Self-Discovery/2026-05-16.md`, `2026-05-17.md`, `theme-history.md` (3일치 정체성→정서→행동 패턴)
- **실 발송 5회 / 4일** (message_id 71, 137, 140, 150, 151)
- **사용 도구·스킬**: `superpowers:brainstorming` · `superpowers:writing-plans` · Claude Code Channels (telegram 플러그인 2.1.138) · Windows 작업 스케줄러 · PowerShell · `mklink /J` Junction · 옵시디언 · Tiago Forte PARA 메소드

#### 과정 (타임라인별 + 삽질)

1. **가설** — 매일 5분 답이 누적되면 1년 후 본인 이직 자기소개서·면접 자료가 자동 생성된다. "꿈이 뭐예요" 같은 추상 질문 X, vault 행동 데이터(캡처 자료 분포·보정 패턴·답변 단어 반복) 기반 회상 질문.
2. **설계** — `brainstorming` 스킬로 답변 후속(대화 파트너)·시간(아침 8시)·미답변(누적 모드) 결정. 6가지 신호 + fallback 30개 풀.
3. **구현** — self-discovery 스킬 5개 파일 + `trigger.ps1` + 작업 스케줄러 등록. 첫 발송 성공 (message_id 71).
4. **옵시디언 연동** — vault를 데스크탑 위치에서도 보고 싶어 `mklink /J`로 두 경로 연결 (복사 없이 같은 폴더 가리키게). `CLAUDE.md`로 새 Claude 세션 컨텍스트 자동 인식.
5. **삽질 #1 (5/16)** — 첫 답변은 수신했고 봇이 후속 질문을 만들었는데 텔레그램으로 안 감. `last-question.json`은 업데이트됨. 원인 = `mcp__plugin_telegram_telegram__reply` 도구 호출 누락. `SKILL.md` 강화 1차.
6. **삽질 #2 (5/17)** — 자발적 답("일이 되게 하는 사람")에서도 같은 누락 반복. 봇 PowerShell 출력 보니 *"다음 차임 때 거울 역할로 이어가기"*라 자율 판단으로 보류. `SKILL.md` 재구조 (reply가 FIRST ACTION). PowerShell `sendMessage`로 매번 수동 복구 (message_id 137, 140, 150, 151).

#### 공유할만한 인사이트

1. **자기 인식은 인터뷰 안에서가 아니라 잠 자기 직전·아침에 익어 떨어진다** — 5/14 정체성(*시스템 만드는 사람*) → 5/16 정서(*조급함*) → 5/17 행동(*일이 되게 하는 사람*). 며칠 단위로 정체성→정서→행동 차원 누적. 차임 발사 전에 사용자가 자발적으로 단어 던지는 패턴이 실제 발생.
2. **봇 채널 + 자연어 스킬은 자율 판단으로 reply를 보류한다** — `SKILL.md`에 "reply 필수" 적어도 Claude가 "자발적 답이라 응답 불필요"로 우회. **자연어 스킬만으로는 신뢰성 한계, PowerShell watcher 같은 결정적 폴백 필요.**
3. **`mklink /J` Junction이 데스크탑↔dev 폴더 동기를 비용 0으로 해결** — 옵시디언 vault(데스크탑)와 텔레그램 봇 저장(dev) 두 경로를 같은 폴더로. 관리자 권한 불필요, 복사 0배.

**벤치마킹**: Tiago Forte PARA — https://fortelabs.com/blog/para/

---

### Part B — `kexpo-content-studio` (팀 OS 부품)

#### 최종 구현 결과물

- **레포**: https://github.com/hook-lee/kexpo-content-studio (private, 5 commits)
- **배포**: `kexpo-content-studio.vercel.app` (Vercel Hobby)
- **로컬 작업본**: `C:\Users\leech\Documents\kexpo-content-studio\` (56 파일)
- **설계·플랜 문서**: `~/.claude/specs/2026-05-15-kexpo-content-studio-design.md`, `~/.claude/plans/2026-05-15-kexpo-content-studio-implementation.md`
- **시범 발행 가능 글 2편**: CPNP·TD 5가지(2026-W19) / PPWR TD 5가지(2026-W20). 둘 다 placeholder 4개만 치환하면 k-expo.org/insight 발행 가능
- **Stack**: Next.js 16 + Tailwind 4 + Vercel AI SDK 6 + `@ai-sdk/google` + Gemini 3 Flash Preview + Google Search grounding + Supabase Auth/Postgres + `youtube-transcript`. 기존 `b2b-content`·`yt2blog` 스킬의 references 자산 포팅.

#### 과정 (타임라인별 + 삽질)

1. **출발점** — 콘텐츠 1편 만드는 데 2주. 본인은 Claude Code 슬래시 커맨드(`yt2blog`/`content2blog`)로 자동화했지만 동료(비개발자)는 못 씀. **브라우저에서 누구나 쓸 수 있는 도구가 필요.**
2. **MVP-A 빌드** — Next.js 스캐폴드 + 단일 비밀번호 게이트 + 3개 streaming API (research/write/revise) + Wizard UI 4상태. 빌드 통과.
3. **첫 시범 글에서 환각 발견** — *"코리아 엑스포 USA에서 만난 바이어들은…"* (가공 인용) + *"MoCRA 2024"* (옛 자료). 실시간 검색 grounding 활성화 + `brand-voice.md`에 절대 원칙 4가지 박음 (가공 인용 금지, 정확한 박람회 명칭, 미래 시제, K-박람회 구분).
4. **팩트체크+비평 단계 추가** — `write → review → done` 2단계 파이프라인. 검증 안 된 익명 사례는 본문에서 빼는 룰.
5. **Supabase 통합** — localStorage 한계(같은 브라우저만) 해결. 이메일+비밀번호 가입, 팀 공유 `articles` 테이블, RLS 정책.
6. **재리서치 시 URL·파일 첨부** — 웹 본문은 WebFetch, PDF는 Gemini Files API 직접 첨부, YouTube는 자막(다국어 fallback + 자동생성) 추출.
7. **GitHub push + Vercel 배포**로 마무리.

**삽질**:
- **(a) 모델 ID 추측** — 처음 SDK API 추측만으로 `gemini-3.0-flash` 적어둠 → 실제 모델 ID는 `gemini-3-flash-preview` (dash). 사용자가 빈 응답 에러 보고 카드 등록까지 함 → 사실 결제 불필요했음.
- **(b) 과대 해석 ban** — "TL;DR" 표기 제거 요청을 "영문 약어 전체 금지"로 과대 해석해서 FAQ/CTA까지 ban했다가 되돌림.

#### 공유할만한 인사이트

1. **단일 LLM 호출은 자기 출력 검증 안 한다** — `write-article` 한 번으로는 가공 인용·옛 자료가 그대로 발행됨. 별도 `review-article` endpoint (search grounding + fact-check + K-수출 담당자 관점 비평)를 강제하니 *"한 K-헤어케어 브랜드가 매출 5만 달러 달성"* 같은 익명 가공 사례가 본문에서 빠짐. **검증 단계 분리가 신뢰성의 핵심.**
2. **Search grounding이 토큰비보다 훨씬 비싸다** — 글 1편 ₩78 중 토큰비 ₩10, 검색 grounding ₩60+. 처음엔 토큰만 계산해 ₩4/편 추정했는데 실제는 20배. 그래도 가공 인용 잡아낸 가치가 비용보다 큼.
3. **K-Expo 도메인 규칙은 prompt 최상단에 박아야 한다** — *"코리아 엑스포 USA"* 같은 잘못된 명칭, *"아메리카 박람회 참가 바이어가…"* 같은 미래 행사 과거형, K-박람회와 혼용 — 이 셋은 시드 자료가 잘못 안내해도 LLM이 그대로 빠짐. `brand-voice.md` 핵심 원칙 섹션 (다른 모든 룰보다 우선)에 명시적으로 박아야 일관 회피됨.

**벤치마킹**: 장병준 (AI Ground) "Claude Code 시작 가이드" — 서브에이전트 오케스트레이션 패턴, https://www.aiground.co.kr/ai-orchestration-guide/

---

## 미션2: SNS 작성

### Summary

이번 주 OS 부품 2개 동시 빌드 경험을 두 채널 톤에 맞춰 발행. 핵심 메시지: **"개인화된 서비스를 직접 만들어 쓰는 시대"** + 본인이 실무를 해보고 위임도 해본 사람이라야 *진짜* 도구를 만들 수 있다는 자각.

### 최종 구현 결과물

#### 링크 (발행 후 채워넣기)

- **LinkedIn**: <발행 후 URL 추가>
- **Threads**: <발행 후 URL 추가>

#### LinkedIn 글 (전문 톤)

```
지난주 1주차에는 클로드 코드, 깃허브, 옵시디언이라는 도구를 한 사이클 돌아보고 이해의 첫발을 디뎠습니다.

2주차인 이번 주는 그 위에서 한 걸음 더 — 직접 시도해보는 차원에서 작은 자동화 도구 두 가지를 만들어봤습니다.

하나는 '나'를 위한 것 — 매일 잠깐 답하는 작은 루틴이 6개월 쌓이면 나에 대한 입체적인 기록이 되는 시스템. 자기 인식을 한 번에 정리하려 하지 말고 시간에 맡겨보자는 실험이었습니다.

다른 하나는 '함께 쓸 수 있는' 도구 — 평소 시간이 많이 드는 반복 작업을 누구나 쉽게 처리할 수 있도록 만들어본 보조 도구입니다.

직접 만들어보면서 든 생각 세 가지:

1) 정말 '내가 필요한 도구를 내가 직접 만들어 쓰는 시대'가 됐다는 걸 체감했습니다. 실무 경험을 가진 사람이 AI 도움을 받으면, 자신에게 맞는 도구를 직접 빚어낼 수 있게 됐습니다.

2) 단, '뭘 만들어야 할지 모르면 엄두도 안 납니다'. 도구 만드는 능력보다 '문제를 알아보는 능력'이 먼저. 새 분야에 계속 호기심 갖고 공부해야겠다는 생각이 더 강해졌습니다.

3) AI 시대에 효율적으로 일하는 사람으로 한 걸음씩 성장하고 있다 느낍니다. 앞으로 남은 5주 동안 계속 시도하고 다듬어가면서 업무 생산성도 같이 끌어올려보려 합니다.

club selfish #스폰지클럽 #AI #AX
```

#### Threads 글 (캐주얼 톤)

```
지난주 1주차엔 클로드 코드, 깃허브, 옵시디언 한 사이클 돌아봤고, 이번 주는 그 위에서 한 걸음 더 가봤어.

직접 시도해보는 차원에서 작은 자동화 도구 두 개 만들어봤거든.
하나는 내가 매일 잠깐 답하면 6개월 후 나에 대한 기록이 쌓이는 시스템.
다른 하나는 함께 쓸 수 있는 작업 보조 도구.

만들면서 든 생각:
- 진짜 내가 필요한 도구를 내가 직접 만들어 쓰는 시대. 실무 경험 있는 사람이 AI랑 같이 만들면 더 잘 맞더라고
- 근데 모르면 뭘 만들어야 할지 엄두도 안 남. 결국 호기심·공부가 먼저
- AI 시대에 효율적으로 일하는 사람으로 한 걸음씩 성장 중

남은 5주도 헬스랑 개인 시간 좀 줄여서 계속 올라타볼게!

@selfishclub.official #스폰지클럽 #AI #AX
```

### 과정 (타임라인별 + 삽질)

1. **메시지 추출** — 이번 주 OS 부품 2개 빌드한 직접 경험에서 통찰 3가지 뽑음
2. **채널별 톤 분기** — LinkedIn은 전문·약간 김 (구체적 결과물·기술 스택 언급), Threads는 캐주얼·짧음
3. **본인 목소리 유지** — "내가 직접 만들어 쓰는 시대" / "엄두 안 남" / "기대됨" 같은 본인 표현 그대로

### 공유할만한 인사이트

1. **만든 직후가 가장 강한 글 시점** — OS 부품 빌드 직후 글을 쓰니 구체적 사례(텔레그램 봇 + Vercel 웹앱)가 자연스럽게 깔림. 1주 지난 뒤 쓰면 추상화돼서 와닿음이 떨어졌을 것.
2. **두 채널 = 같은 메시지 다른 길이** — LinkedIn은 *왜*(배경·기술)까지, Threads는 *그래서 뭐*(통찰만)으로 압축. 같은 통찰 3개를 길이·디테일만 다르게.

---

## 미션3: (이번 주 미사용)

N/A
