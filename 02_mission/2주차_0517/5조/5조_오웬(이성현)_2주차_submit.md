---
team: 5조
member: 오웬
role: 조장
week: 2
submitted: true
---

# 2주차 과제 — 오웬

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

저는 찜마켓 디벨롭 + 5월 신규 프로젝트 + 모아(개인 일정, 회고 비서)를 진행하고 있어요!

### 최종 구현 결과물

![](attachments/Pasted%20image%2020260516192204.png)

### 과정 (타임라인별 + 삽질)

## 1. OpenClaw 설치

맥 환경 기준 설치 명령어:

bash

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

스크립트가 Node.js 설치 + npm 글로벌 설치 + PATH 등록까지 자동 처리한다.

설치 확인:

bash

```bash
openclaw --version
```

버전 번호가 출력되면 성공. → **워크숍 체크포인트 1 통과**

> [!tip] `command not found` 떴을 때 PATH 문제다. 옆에 켜둔 클로드 코드한테 "openclaw 설치했는데 command not found, npm 설치, macOS — PATH 잡아서 ~/.zshrc에 추가해줘"라고 시키는 게 제일 빠르다.

---

## 2. 온보딩 마법사 — 11개 질문 답변 기록

`openclaw onboard --install-daemon` 실행. `--install-daemon`은 컴퓨터 켜면 자동 실행되는 백그라운드 서비스로 등록하는 플래그라 **반드시 포함**했다.

마법사가 던지는 11개 질문에 대한 내 답변:

|#|질문|내 답변|이유|
|---|---|---|---|
|2-1|보안 동의|`y`|모아가 컴퓨터 거의 모든 권한을 갖는다는 점 인지|
|2-2|Setup mode|`QuickStart`|Manual은 VPS/커스텀 포트용 고급 시나리오|
|2-3|Model / Auth|`OpenAI Codex (Browser Login)`|Codex가 tool calling 안정적 + ChatGPT 구독에 포함|
|2-4|OpenAI 로그인|ChatGPT 계정 로그인 → 권한 승인|브라우저 자동 실행|
|2-5|기본 모델|`Enter` (기본값 유지)|`openai-codex/gpt-5.5` 그대로 사용|
|2-6|QuickStart 요약|`Y`|port 18789 / Loopback / Token auth — 전부 기본값이 정답|
|2-7|Channel|`Skip for now`|채널은 Step 4에서 따로 — 셋업 꼬임 방지|
|2-8|Web search|`Skip for now`|나중에 부록 B에서 추가 가능|
|2-9|Configure skills now?|`No`|의존성 설치하다 시간 새는 것 방지, 스킬은 나중에|
|2-10|Gateway service 설치|`Y`|launchd 등록 → 재부팅해도 자동 실행|
|2-11|Hatch|`Hatch in Terminal`|에이전트 이름 **모아** 부여, 인격은 Step 5에서 다듬음|

온보딩 완료 메시지:

```
✓ Gateway running on port 18789
✓ Model authenticated: openai-codex/gpt-5.5
✓ Workspace: ~/.openclaw/workspace
✓ Daemon installed
```

---

## 3. 검증 — 첫 응답 받기

헬스 체크:

bash

```bash
openclaw doctor
openclaw health
```

`All checks passed.` 확인 후 대시보드로 첫 응답 테스트:

bash

```bash
openclaw dashboard
```

`http://127.0.0.1:18789` 채팅창에 "안녕" 입력 → 응답 도착.

> [!success] 점심 전 미니 마일스톤 통과 설치 + Gateway 실행 + 첫 응답까지 완료. 하지만 아직 모아가 메신저에 없다 — 진짜 가치는 Step 4부터.

---

## 4. 텔레그램 채널 연결 — 모아와 첫 대화

### 1단계 · BotFather로 봇 생성

텔레그램에서 [@BotFather](https://t.me/BotFather) → `/newbot`

- 봇 이름: `모아`
- 봇 username: `_bot`으로 끝나게 설정
- **봇 토큰 발급** (`123456:ABC-DEF...`) — 절대 노출 금지

### 2단계 · 내 텔레그램 user ID 확인

[@userinfobot](https://t.me/userinfobot)에 아무 메시지 → 내 user ID 확인 (allowFrom 보안 설정용)

### 3단계 · AI에게 채널 연결 시키기

대시보드에서:

```
텔레그램 채널 연결해줘.
- 봇 토큰: [발급받은 토큰]
- 내 user ID: [내 ID] (allowFrom으로 보안 설정)
- 그룹에서는 멘션 시에만 반응
설정 후 Gateway 재시작도 부탁해.
```

CLI 대안:

bash

```bash
openclaw channels add --channel telegram --token <bot-token>
openclaw gateway restart
```

### 4단계 · 페어링 승인

기본 정책상 첫 메시지를 보내는 사용자는 차단된다. 봇에게 "안녕"을 보내면 페어링 코드가 콘솔에 표시되고:

bash

```bash
openclaw pairing approve telegram <code>
```

### 5단계 · 첫 응답 🎉

봇에게 메시지 → 응답 도착. → **워크숍 체크포인트 2 통과 / 1차 미션 완료**

> [!warning] 막혔던 부분 (실제 트러블슈팅 기록) 슬랙도 붙여볼까 하다가 Gateway가 시작 실패했다. 원인은 **Slack bot token 환경변수 누락**. `openclaw channels status --probe`로 채널 상태부터 확인하고, `.env`에 토큰을 채운 뒤 `openclaw gateway restart`로 해결. → 교훈: 셋업 가이드 권장대로 **텔레그램 하나만 먼저 안정화**시키고, 슬랙은 별도로 천천히 붙이는 게 맞다.

---

## 5. 모아에게 인격 부여 (이번 과제의 핵심)

`~/.openclaw/workspace/` 안의 마크다운 파일들을 채우면 모아가 "내 동료"가 된다.

|파일|역할|
|---|---|
|`SOUL.md`|모아의 핵심 인격 — 톤, 가치관, 절대 규칙|
|`USER.md`|나(오웬)에 대한 정보|
|`IDENTITY.md`|모아 자기소개|
|`samples/`|내가 실제로 쓴 글 — 모아가 내 목소리를 학습|

### 5-1. SOUL.md — 모아의 핵심 인격

markdown

```markdown
# Soul

## Who I Am
나는 오웬의 개인 AI 어시스턴트 "모아"다.
오웬은 13년차 IT/핀테크 창업가 출신 솔로프리너이고,
지금은 12개월 12개 제품 런칭 챌린지와 B2B 컨설팅을 병행한다.
나는 일반 챗봇이 아니라, 빠르게 움직이는 1인 메이커 옆에서
흩어진 정보를 모으고 다음 액션을 챙기는 신뢰받는 동료로 동작한다.

## Communication Style
- 직설적이고 캐주얼한 톤. 군더더기 빼고 본론부터.
- 설명보다 구체적인 명령·다음 액션을 먼저 제시한다.
- 상대방 에너지에 맞춤 — 짧게 물으면 짧게 답한다.
- 기술 용어는 영어 그대로 (MVP, ICP, UTM, MCP, LaunchAgent).
- 이모지는 명시적 요청이 있을 때만.
- "Sure!", "물론이죠!", "좋은 질문이에요!" 같은 시작 금지.
- "시너지", "레버리지" 같은 기업 jargon 회피.

## Hard Rules
- 데이터·통계·인용을 절대 fabricate하지 않는다. 모르면 모른다고 말한다.
- 고위험 작업(배포, 삭제, 외부 발송) 전에는 반드시 명확화 질문.
- 콘텐츠 작성 시 samples/ 의 톤·스타일을 매칭한다.
- 오웬의 개인 정보·고객사 정보를 누구와도 공유하지 않는다.

## Domain Knowledge
- 한국 이커머스 (에이블리, 지그재그, 무신사, 스마트스토어, 쿠팡)에 깊은 이해.
- B2B 핀테크 (펌뱅킹, 가상계좌, 선정산)와 동대문 패션 공급망 배경.
- 인디 메이커 / AI 실무 커뮤니티 (셀피쉬클럽, AAA팀) 맥락 이해.
- 사용 도구: Claude Code, Notion, Vercel, n8n, KakaoTalk, Slack, Telegram.

## Formatting Preferences
- 텔레그램 보고: 짧은 단락, 핵심부터. 불릿 적극 활용.
- 콘텐츠: 후크 우선, 친구에게 말하듯 대화체.
- 제안서·문서: 데이터 기반 주장, 가능하면 숫자 포함.
```

### 5-2. USER.md — 나에 대한 정보

markdown

```markdown
# User Profile

## Basic Info
- 이름: 오웬 (이성현)
- 위치: 서울, KST (Asia/Seoul)
- 역할: 솔로프리너 / B2B 컨설턴트

## Work Context
- 산업: IT·핀테크 스타트업 (13년 경력), 한국 이커머스
- 배경: B2B 패션 셀러 선정산 플랫폼 바이나우(Bynow) 공동창업 → 2026년 1월 M&A 엑싯
- 운영 형태: 1인 운영, 프로젝트 단위 협업자
- 주요 도구: Claude Code, Notion, Vercel, n8n, KakaoTalk, Slack, Telegram
- 근무: 프로젝트 기반, 유동적

## Preferences
- 직설적이고 캐주얼한 커뮤니케이션 선호
- 설명보다 구체적인 명령·실행 단위를 선호
- 기술 용어는 영어로 (MVP, ICP, UTM, MCP)
- 데이터 기반 주장 선호 — 가능하면 숫자 포함
- 카톡·텔레그램 > 이메일

## Current Projects
- 12개월 12개 제품 런칭 챌린지 진행 중
- 찜마켓 (zzim-exchange.vercel.app) — 신뢰 기반 셀러 매칭
- 토닉카카오 (tonickakao.vercel.app) — 카톡 단톡방 AI 큐레이션
- 플러스모어 B2B 컨설팅 (3개월 engagement)
- 포트폴리오: lsh-story.vercel.app
```

### 5-3. 작성 샘플 추가

bash

```bash
mkdir -p ~/.openclaw/workspace/samples
```

이 폴더에 내가 쓴 실제 글을 마크다운으로 모은다:

- 찜마켓 카톡 셀러 커뮤니티 홍보 카피
- AAA 공유회 멀티채널 홍보 문구 ("3주간 삽질 → 문제가 명확해진 순간 돌파" 서사)
- "오웬의 생초보 AI 실습일지" SNS 시리즈

파일이 쌓일수록 모아가 내 목소리에 가까워진다.

### 5-4. 변경 적용

bash

```bash
openclaw gateway restart
```

적용 후 "내 스타일로 찜마켓 업데이트 공지 초안 써줘"로 테스트 → SOUL.md 적용 전후 차이가 확연.

---

## 6. 하트비트 & 크론잡 — 모아를 진짜 동료로

OpenClaw의 결정적 차별점. 시키지 않아도 스스로 깨어나 일한다.

### 하트비트 — 주기적 순찰

```
하트비트 셋업해줘.
- 30분마다 깨어남
- 활성 시간: 오전 9시 ~ 오후 10시
- 마지막 활성 채널(텔레그램)에 보고
HEARTBEAT.md 항목:
- 카톡 셀러 커뮤니티 새 동향 확인
- Notion에서 오늘 마감 TODO 확인
- 처리 안 된 작업 스캔
```

### 크론잡 — 정해진 시간에 실행

```
매일 아침 9시(한국시간)에 핀테크 뉴스 + 오늘 일정/할 일 정리해서
텔레그램으로 보내는 크론잡 추가해줘. 이름은 "아침 브리핑".

매주 금요일 오후 5시에 이번 주 12개 챌린지 진행 상황 회고도 추가해줘.
```

### 공유할만한 인사이트

## 회고

- **잘된 점**: 가이드의 권장 동선(텔레그램 먼저, 스킬·웹검색 나중)을 그대로 따른 게 시간을 아꼈다. 마법사 11개 질문은 "기본값이 정답"인 경우가 대부분이라 부담 없었다.
- **막혔던 점**: 슬랙을 성급하게 붙이려다 Gateway 시작 실패(토큰 환경변수 누락). 가이드 경고대로 한 채널씩 안정화하는 게 맞았다.
- **핵심 인사이트**: 셋업 자체는 45분이면 끝나지만, 모아가 진짜 쓸모 있어지는 건 SOUL.md / USER.md / samples를 얼마나 잘 채우느냐에 달렸다. "도구에 자동화를 얹는 게 아니라, 처음부터 에이전트가 운영할 수 있게 설계한다."

---

## 미션2: SNS 작성


instagram.com/p/DYZWtDSiTmu/?igsh=MXZ1eTl1MmY3NGg5cg==