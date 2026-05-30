---
team: 3조
member: 율리아
role: 조원
week: 3
submitted: true
mvp: false
mvp_reason: ""
---

# 3주차 과제 — 율리아

# AXops: 설문을 Paperclip 운영 구조로 바꾸는 AX 온보딩 MVP

## 한 줄 요약

이번 미션에서 내가 검증한 것은 “AI가 답을 잘하는 제품”이 아니라, 고객의 반복 업무를 Paperclip 안의 목표, 역할, 이슈, 승인 게이트, 루틴으로 바꾸는 AX 온보딩 구조다.

처음에는 단순한 인터뷰 UI나 설문 도구에 가까웠지만, 작업을 진행하면서 방향이 더 선명해졌다. AXops의 핵심 가치는 고객의 답변을 바탕으로 Paperclip에 들어갈 회사 목표, AX CEO 역할, agent 조직, issue tree, approval gate, routine, seed packet을 만들어주는 것이다.

여기서 Paperclip은 AX 전환을 위한 회사 목표, agent 조직, 실행 과제, 승인 흐름, 루틴을 관리하는 control plane으로 사용했다. seed packet은 Paperclip company를 만들기 전에 사람이 검토할 수 있는 초기 운영 구조 묶음이다. 회사 목표, agent 역할, issue tree, approval gate, routine, handoff 문서를 포함한다.

중요한 점은 “바로 자동 실행”이 아니라 “검토 가능한 운영 구조”를 먼저 만든다는 것이다. 고객 업무를 충분히 이해하지 못한 상태에서 production mutation이나 외부 발송을 자동화하면 제품 가치보다 리스크가 먼저 커진다. 그래서 이번 MVP는 자동화보다 먼저, 안전하게 검토할 수 있는 Paperclip 초기 세팅 구조를 만드는 데 집중했다.

---

## 미션1: 내 고객은 누구고 왜 쓰는가 — 클로드 코드로 프로덕트 구현하기

### Summary

AXops의 주요 고객은 반복 운영 업무가 많고 AI 도입 필요성은 느끼지만, 기존 업무를 어떤 목표·역할·과제·승인 흐름으로 바꿔야 할지 모르는 회사다.

더 구체적으로는 “AI agent를 써보고 싶다”는 막연한 관심은 있지만, 어떤 업무부터 agent화해야 하는지, 어떤 정보가 부족한지, 어디까지 자동화하고 어디서 사람 승인을 둬야 하는지, agent에게 어떤 역할과 instruction을 줘야 하는지 판단하기 어려운 팀이 고객이다.

처음에는 AXops가 SYM이나 Nuri Table 같은 고객 업무를 분석하는 인터뷰 UI에 가까웠다. 하지만 이 상태로는 고객이 왜 돈을 내야 하는지 약했다. 고객 입장에서는 잘 만든 설문지나 컨설팅 intake와 크게 다르지 않아 보일 수 있기 때문이다.

진짜 제품 가치는 설문 자체가 아니라 설문 이후의 실행 구조에 있었다. 고객은 “AI가 우리 업무를 이해했다”는 리포트보다, “우리 업무가 실제로 agent 조직, goal, issue tree, approval gate, routine으로 바뀌었다”는 결과에 더 큰 가치를 느낄 가능성이 높다.

그래서 AXops의 방향을 다음처럼 다시 정의했다.

> AXops는 고객 인터뷰를 Paperclip에서 실행 가능한 AX 회사 운영 구조로 바꿔주는 온보딩 제품이다.

### 고객이 쓰는 이유

고객이 AXops를 쓰는 이유는 단순히 업무를 정리하기 위해서가 아니다. 고객은 “AI를 어디에 쓸지”보다 “AI가 실제 업무를 어떻게 맡고, 어디서 사람이 승인해야 하며, 그 결과가 어떤 실행 과제로 관리되는지”를 알고 싶어 한다.

AXops는 이 애매한 전환 과정을 Paperclip의 회사 목표, 역할, 이슈, 승인 게이트, 루틴으로 바꿔준다.

고객이 겪는 문제는 다음과 같다.

- AI 도입 필요성은 느끼지만 어디서부터 시작해야 할지 모른다.
- 회사 목표를 agent가 실행 가능한 구조로 바꾸는 법을 모른다.
- 어떤 업무를 자동화해야 하고, 어떤 업무는 사람 승인을 둬야 하는지 판단하기 어렵다.
- agent.md, SOUL.md, HEARTBEAT.md 같은 운영 문서를 직접 쓰기 어렵다.
- “AI를 써보자”에서 끝나는 것이 아니라 실제 업무 전환 사이클을 만들고 싶다.
- 리포트나 제안서가 아니라 실제 운영 시스템 안에 들어갈 초기 구조가 필요하다.

참고
- https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
- https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai

이 제품을 “설문하면 자동화 추천해주는 툴”로 포지셔닝하면 약하다. 그런 제품은 너무 흔하고, 고객 입장에서는 ChatGPT나 컨설턴트와 차이가 약하다.

강한 포지셔닝은 이것이다.

> 우리 회사 업무를 Paperclip에서 운영 가능한 AX 조직으로 초기 세팅해주는 제품.

즉 결과물이 리포트가 아니라 다음이어야 한다.

- company goal
- AX CEO
- agent 조직도
- agent.md / SOUL.md / HEARTBEAT.md
- issue tree
- approval gate
- routine
- seed packet
- handoff

이건 고객이 직접 하기 귀찮고 어렵다. 특히 Paperclip을 도입하려는 고객에게는 명확한 구매 이유가 된다.

### 시장성 판단

지금 시장은 “AI agent를 써보고 싶다”에서 “업무에 안전하게 어떻게 넣지?”로 넘어가고 있다. McKinsey 2025 AI survey에서 봤을 때, agentic AI는 실험과 확산 단계에 있으며, 많은 조직이 pilot에서 실질 impact로 넘어가는 데 어려움을 겪고 있다.

Gartner도 enterprise application 안에 task-specific AI agent가 빠르게 들어갈 것으로 보고 있다. 하지만 이것은 “agent가 많아진다”는 뜻이지, “회사가 agent를 잘 운영할 수 있다”는 뜻은 아니다.

여기서 AXops의 기회가 있다. 고객은 agent 자체보다 다음을 더 어려워한다.

- 어떤 업무부터 agent화해야 하는가
- 어떤 정보가 부족한가
- 어디까지 자동화하고 어디서 사람 승인을 둬야 하는가
- agent에게 어떤 역할과 instruction을 줘야 하는가
- 이걸 실제 운영 시스템 안에 어떻게 세팅해야 하는가

AXops가 이 과정을 Paperclip company setup으로 바꿔주면 가치가 생긴다.

### 최종 구현 결과물

현재까지 구현/검증된 결과물은 다음이다.

- AXops 인터뷰/진단 사이트
  - http://127.0.0.1:4181
- Paperclip V1 고객 회사 2개 생성 완료
  - Nuri Table V1
  - SYM MVP V1

이번 검증은 실제 고객 도입 전 단계로, Nuri Table과 SYM MVP라는 두 개의 fictional customer를 만들어 A-Z onboarding 흐름을 검증한 것이다.

각 회사에는 다음이 생성됐다.

- 회사 goal 1개
- AX CEO 포함 agent 4명
- issue 4개
- routine 1개
- approval 1개
- company-goal 문서
- agent-instructions 문서
- seed-packet 문서
- handoff 문서

핵심은 “인터뷰 결과를 Paperclip 초기 운영 구조로 바꾸는 사이클”이 실제로 한 번 돌았다는 점이다.

### 과정 (타임라인별 + 삽질)

처음에는 AXops가 고객 업무를 분석하는 인터뷰 UI에 가까웠다. 하지만 이 상태로는 고객이 왜 돈을 내야 하는지 약했다. 고객이 직접 할 수 있는 설문/정리 도구처럼 보였기 때문이다.

그 다음 방향을 “고객 업무를 이해해서 다음 결정을 내려주는 도구”로 바꿨다. 단순 진단이 아니라 AX 전환을 위한 의사결정 도구가 되어야 한다고 봤다.

이후 더 구체화하면서 “Paperclip을 도입하고 싶은 회사가 설문을 작성하면 초기 Paperclip company setup을 편하게 해주는 제품”으로 정의가 잡혔다. 이때부터 시장가치가 생기기 시작했다. 고객이 직접 할 수 있는 설문이 아니라, 설문 결과가 바로 agent 운영 체계의 초안으로 바뀌기 때문이다.

가상의 고객 페르소나도 만들었다.

- Nuri Table: 커머스 운영 고객
- SYM MVP: 기존 SYM을 참고하되 완전히 새로운 음악 데이터 운영 고객

중간 삽질도 있었다.

- 기존 SYM 데이터를 그대로 쓰면 MVP 검증이 흐려졌다.
- Nuri/SYM/운영리더/고객 MVP 선택 구조가 너무 많아져 플로우가 헷갈렸다.
- Paperclip에 바로 push하는 것은 위험했다.
- 기존 MVP company를 삭제하고 재생성하려 했지만, 삭제 API가 500을 냈다.

그래서 “자동 반영”이 아니라 “사람이 검토 가능한 seed packet 생성”으로 경계를 잡았다. 최종적으로는 delete-first가 아니라 V1 company를 새로 만들고 검증한 뒤 기존 것은 보존하는 방식으로 바꿨다. 이 판단이 훨씬 제품적으로 안전했다.

### 공유할만한 인사이트

가장 큰 인사이트는 “AX 전환 제품의 고객 가치는 설문 자체가 아니라 설문 이후의 실행 구조”라는 점이다.

고객은 “우리 업무가 뭔지 정리해주는 서비스”에는 큰 돈을 내기 어렵다. 하지만 “우리 업무를 agent 조직, goal, issue tree, approval gate, routine으로 바꿔주는 서비스”에는 돈을 낼 가능성이 있다.

또 하나의 인사이트는 바로 자동화를 하면 안 된다는 점이다. AX 도입 초기에는 고객 업무를 충분히 이해하지 못한 상태라 바로 API push, 자동 실행, production mutation을 하면 제품 가치보다 리스크가 먼저 커진다.

따라서 지금 방향은 다음과 같다.

1. 인터뷰한다.
2. 업무를 구조화한다.
3. AX 전환 가능 범위를 판단한다.
4. Paperclip seed packet을 만든다.
5. 사람이 검토한다.
6. Paperclip company로 생성한다.
7. 첫 safe action만 실행한다.

이게 시장에서 팔릴 수 있는 가장 현실적인 MVP 경로라고 판단했다.

---

## 미션2: 내가 정의하고 적용해보고 싶은 하네스 + 오케스트레이션

### Summary

이번 미션에서 정의한 하네스는 “고객의 애매한 업무 설명을 바로 자동화하지 않고, 검토 가능한 Paperclip 운영 구조로 변환하는 반복 가능한 사이클”이다.

흐름은 다음과 같다.

> 생각 → 계획 → seed 생성 → Paperclip 반영 → 검증 → 기록

여기서 중요한 원칙은 위험한 자동화보다 검증 가능한 전환 사이클이 먼저라는 점이다.

단순히 코드를 짜는 것이 아니라, AX 전환이라는 불명확한 문제를 다루기 위해 다음 경계를 만들었다.

- 작업 전 WORK_SPEC 작성
- 삭제/생성 같은 위험 작업은 scope와 non-goal 명시
- seed packet은 바로 실행이 아니라 검토 가능한 packet으로 생성
- Paperclip company는 delete-first가 아니라 create-and-verify-first
- API 검증 + 브라우저 검증 + 테스트/빌드 검증
- 결과를 execution doc에 기록

이번 구현에서는 LLM으로 자유 생성하지 않고 deterministic blueprint generator 방향으로 시작했다. 이유는 첫 MVP에서 중요한 것이 창의적인 문장 생성이 아니라, 같은 입력이 같은 Paperclip 구조로 안정적으로 변환되고 테스트 가능해야 했기 때문이다.

### 구현한 하네스

이번 하네스는 고객 입력을 바로 자동화하지 않고, 안전하게 운영 구조로 바꾸기 위한 장치다.

구체적으로는 다음 역할을 한다.

1. 작업 전 WORK_SPEC으로 goal, scope, non-goal, risk를 고정한다.
2. 고객 입력을 바로 실행하지 않고 Paperclip seed packet으로 변환한다.
3. seed packet은 사람이 검토 가능한 형태로 만든다.
4. 기존 데이터를 destructive하게 삭제하지 않고 V1 company를 새로 만든다.
5. 생성된 V1 company가 정상 동작하는지 API와 브라우저에서 확인한다.
6. 테스트와 빌드를 통해 코드 통합 상태를 검증한다.
7. 결과와 삽질을 execution doc에 남긴다.

이 하네스에서 가장 중요한 판단은 delete-first를 버리고 create-and-verify-first를 선택한 것이다.

처음에는 기존 MVP 회사 2개를 삭제하고 새로 만드는 식으로 접근했다. 이론적으로는 깔끔했다. 기존 company를 지우고 같은 이름과 prefix로 다시 만들면 되기 때문이다.

하지만 실제로는 Paperclip deletion API가 500을 냈다. 이때 바로 DB를 직접 건드리거나 강제 삭제로 가면 위험했다. 그래서 방향을 바꿨다.

새로운 전략은 다음이었다.

- 기존 Nuri Table/NT, SYM MVP/SMV는 보존
- 새로 Nuri Table V1/NTV, SYM MVP V1/SYV 생성
- V1이 정상 동작하는지 검증
- 기존 삭제는 나중 cleanup으로 미룸

이 방식이 더 좋은 하네스였다. MVP 검증에서 중요한 건 “기존 것을 깨끗하게 삭제했는가”가 아니라 “새 고객을 onboarding해서 Paperclip 운영 구조가 만들어지는가”였기 때문이다.

### 최종 구현 결과물

구현된 하네스/오케스트레이션 결과물은 다음이다.

- AXops seed runner 추가
  - `apps/ax-ops-bridge/scripts/resetPaperclipMvpCompanies.mjs`
- 실행 명령 추가
  - `npm run paperclip:seed-v1`
- V1 Paperclip company 자동 생성 흐름 구현

생성 항목은 다음과 같다.

- company
- goal
- AX CEO
- AX PM
- specialist agents
- parent issue
- child issues
- routine
- approval
- issue documents

생성된 V1 company는 다음과 같다.

- Nuri Table V1 / NTV
- SYM MVP V1 / SYV

각 V1 company에는 다음이 생성됐다.

- 4 agents
- 1 goal
- 4 issues
- 1 routine
- 1 approval
- documents:
  - agent-instructions
  - company-goal
  - handoff
  - seed-packet

### 검증

데모 HTML 바로가기: [AXops 단일 HTML 데모](./axops-demo-standalone.html)

검증은 네 단계로 진행했다.

첫째, 테스트로 데이터 생성 로직을 확인했다.

- `npm test -- --run`
- 9 test files passed
- 30 tests passed

둘째, 빌드로 코드 통합 상태를 확인했다.

- `npm run build`
- TypeScript passed
- Vite build passed

셋째, Paperclip API 검증으로 생성된 회사 데이터가 조회되는지 확인했다.

- `npm run paperclip:seed-v1`
- Nuri Table V1 생성 확인
- SYM MVP V1 생성 확인

넷째, 브라우저 검증으로 Paperclip 화면에서 데이터가 실제로 보이는지 확인했다.

브라우저에서 확인한 내용은 다음과 같다.

- org 페이지 로드
- issues 페이지 로드
- AX CEO 표시
- AX PM 표시
- V1 company 이름 표시
- initial setup issue 표시
- not-found/error 상태 없음

### 과정 (타임라인별 + 삽질)

가장 큰 삽질은 기존 company 삭제였다.

처음에는 기존 MVP company를 삭제하고 같은 이름으로 다시 만들면 깔끔하다고 생각했다. 하지만 Paperclip deletion API가 500을 냈고, 이 문제를 해결하기 위해 DB를 직접 건드리는 것은 너무 위험했다.

그래서 이번 미션에서는 삭제를 목표로 하지 않기로 했다. 기존 데이터는 보존하고, V1 company를 새로 만든 뒤 검증하는 방식으로 바꿨다.

또 하나의 삽질은 Paperclip prefix였다. SYM MVP V1이라고 만들면 prefix가 원하는 대로 SMV1이 되는 것이 아니라, Paperclip이 영문 앞 3글자를 뽑는 구조라 SYV 같은 prefix가 된다. 그래서 V1 company의 실제 URL은 다음처럼 잡혔다.

- `/NTV`
- `/SYV`

이것도 제품적으로 중요한 학습이었다. URL/prefix 정책은 onboarding UX에 영향을 준다. 실제 고객용 제품에서는 proposed company name, issue prefix, route URL, prefix conflict 여부를 명확히 보여줘야 한다.

### 기술부채와 남은 과제

이번 결과물의 한계도 분명하다.

Nuri Table과 SYM MVP는 실제 고객이 아니라 fictional customer이며, 아직 시장 검증이 끝난 것은 아니다. 또한 Paperclip 생성 흐름은 local MVP로 검증했지만, 실제 제품에서는 다음 작업이 남아 있다.

- `resetPaperclipMvpCompanies.mjs` 이름 정리
  - 현재 이름은 reset처럼 보이지만 실제 동작은 V1 company seed 생성에 가깝다.
  - 이후 `seedPaperclipV1Companies.mjs` 같은 이름이 더 적절하다.
- `paperclip:reset-mvp` 같은 alias 정리
- Korean source string mojibake cleanup
- UI에서 seed 생성 → 검토 → Paperclip 반영까지 연결
- Paperclip prefix UX 명시
- duplicate company/prefix 처리
- 실제 고객 workflow로 반복 검증

그럼에도 이번 미션의 의미는 “설문 결과를 실행 가능한 운영 구조로 바꾸는 루프”가 실제로 한 번 돌았다는 점이다.

### 공유할만한 인사이트

이번에 정의한 하네스의 가장 중요한 원칙은 이것이다.

> 위험한 자동화보다 검증 가능한 전환 사이클이 먼저다.

AX 전환 제품은 고객의 실제 업무와 연결되기 때문에, 무조건 자동으로 밀어 넣는 게 좋은 UX가 아니다. 오히려 사람이 검토 가능한 seed packet을 만들고, 그 packet을 Paperclip company 생성으로 연결하는 것이 맞다.

하네스 관점에서 좋은 패턴도 생겼다.

- destructive 작업 전에 V1을 만든다.
- 기존 데이터는 fallback/reference로 둔다.
- 새 데이터가 검증되면 cleanup한다.
- cleanup이 실패해도 MVP 검증은 망가지지 않게 한다.

이건 앞으로도 계속 써야 할 패턴이다.

---

## 미션3: 스폰지클럽을 하며 남기고 싶은 생각과 고민 SNS 글 작성

https://www.threads.com/@data.yulia/post/DYt3uSlmgAj?xmt=AQF0b_ZslbfW7Ck-PuBPO4qrKzQ32JZdsCZdnxTf9l0-gqQ
