# OpenClaw 셋업 가이드

> 이 가이드는 OpenClaw을 처음 접하는 사람을 위한 **설치부터 메신저로 첫 응답을 받기까지**의 전 과정을 다룹니다.
> 셋업 데이 참가자라면 메인 플로우(Step 1~4)를 따라가면 됩니다. 약 45분 소요.
>
> **출처**: [OpenClaw 공식 문서](https://docs.openclaw.ai), [뽀짝이의 서재](https://bbojjak-library.gpters.org/lessons)

---

## 🌱 이 가이드 핵심 마인드셋

오픈클로 셋업은 **"JSON 파일을 직접 짜는 일"이 아닙니다.**

오픈클로에는 **온보딩 마법사**가 있습니다. 마법사가 "어떻게 할까요?"라고 묻고, 여러분은 답만 하면 됩니다.

> "도구에 자동화를 얹는 게 아니라,
> 처음부터 에이전트가 운영할 수 있게 설계한다."

이 가이드의 메인 플로우는 **"마법사가 묻는 질문에 어떻게 답해야 하는가"** 의 관점에서 정리되어 있습니다.

수동으로 직접 설정하고 싶다면 **부록 A, B**를 참고하세요. 처음 셋업하시는 분은 부록은 건너뛰셔도 됩니다.

---

## 📖 이 가이드 사용법

| 상황 | 어디부터 보면 되나요? |
|---|---|
| **셋업 데이 참석 전 준비** | 0장 (행사 오기 전 체크리스트) |
| **처음 셋업하시는 분** | Step 1 → Step 4까지 (약 45분) |
| **개념을 먼저 이해하고 싶은 분** | 1장 → 2장 → Step 1 순서로 |
| **나중에 깊게 파고 싶은 분** | Step 5 (인격 부여) → Step 6 (하트비트) → 부록 |
| **막혔을 때** | 부록 D 트러블슈팅 → 그래도 안 되면 흐민/오웬/젬마에게 |

> 💡 **셋업 데이 참가자 추천 동선**: 0장 → Step 1, 2 (점심 전) → Step 3 (점심 전 미니 마일스톤) → Step 4 (점심 후) → 시간 남으면 Step 5

---

## 목차

**메인 플로우**
- [0장. 행사 오기 전 체크리스트](#0장-행사-오기-전-체크리스트)
- [1장. OpenClaw이란?](#1장-openclaw이란)
- [2장. 핵심 개념 정리](#2장-핵심-개념-정리)
- [3장. 준비물](#3장-준비물)
- [Step 1. OpenClaw 설치](#step-1--openclaw-설치) 🎯 워크숍 체크포인트 1
- [Step 2. 온보딩 마법사 (QuickStart)](#step-2--온보딩-마법사-quickstart) ⭐ 메인 이벤트
- [Step 3. 검증 — 첫 응답 받기](#step-3--검증--첫-응답-받기) ☕ 점심 전 미니 마일스톤
- [Step 4. 채널 연결 (메신저 추가)](#step-4--채널-연결) 🎯 워크숍 체크포인트 2
- [Step 5. 에이전트 인격 부여](#step-5--에이전트-인격-부여)
- [Step 6. 하트비트 & 크론잡 (선택)](#step-6--하트비트--크론잡-선택)

**부록**
- [부록 A. Manual 모드 셋업](#부록-a-manual-모드-셋업)
- [부록 B. openclaw.json 수동 편집 레퍼런스](#부록-b-openclawjson-수동-편집-레퍼런스)
- [부록 C. 보안 강화](#부록-c-보안-강화)
- [부록 D. 트러블슈팅](#부록-d-트러블슈팅)

---

# 메인 플로우

## 0장. 행사 오기 전 체크리스트

> ⏰ **셋업 데이 당일 시간을 절약하기 위해 반드시 미리 확인하세요.**
> 7시간 워크숍이지만 의외로 시간이 빠듯합니다. 사전 준비가 안 되면 셋업만 하다 끝납니다.

### ✅ 필수 체크리스트

- [ ] **상시 운용 기기 결정** — 맥미니 / 노트북 / 서버 중 하나
  - Best는 맥미니 (24시간 켜두기 좋음)
  - 안 쓰는 노트북도 OK
  - 본인 메인 노트북은 비추천 (Gateway가 항상 돌아야 함)
- [ ] **Node.js 설치 상태 확인** (또는 미설치로 와도 OK)
  - 확인: `node --version` → v22.16 이상 권장 (없으면 설치 스크립트가 처리)
- [ ] **ChatGPT Plus/Pro 구독 활성화 확인**
  - 없으면 당일 가입 필요 (별도 시간 소요)
- [ ] **이 가이드 한 번 훑어보기**
  - 모르는 용어/개념 미리 체크 → 당일 질문 정리

### 🖥 (맥미니 지참자) 추가 체크

- [ ] **서브 모니터 또는 아이패드 준비** — 화면 공유 시 한글 입력 이슈 회피용
- [ ] **HDMI/USB-C 케이블 점검**
- [ ] **맥미니 OS 최신화** (macOS 12+)

### 🪟 (Windows 노트북 지참자) 추가 체크

- [ ] **WSL2 설치 권장** (Ubuntu 22.04 등)
- [ ] **Windows Terminal 사용 권장** (기본 cmd 비추천)

---

## 1장. OpenClaw이란?

OpenClaw은 **메신저로 명령을 받고, 컴퓨터에서 실제 작업을 수행하고, 결과를 보고하는** 자율형 AI 에이전트 플랫폼입니다.

Claude Code 코드베이스에서 출발한 오픈소스 프로젝트로, 이름의 변천을 거쳐 현재의 OpenClaw로 정착했습니다 (Clawdbot → Moltbot → OpenClaw).

### Claude Code와의 차이

| 항목 | Claude Code | OpenClaw |
|---|---|---|
| 동작 방식 | 시킬 때만 일함 | 24/7 깨어 있음 |
| 인터페이스 | 터미널 기반 | 메신저 거주 (텔레그램/슬랙/디스코드 등) |
| 컨텍스트 한계 | 토큰 제한 있음 | 벡터DB/그래프DB로 무한 확장 |
| 자율 실행 | 없음 | Heartbeat (주기적 점검) + 크론잡 |
| 멀티 프로젝트 | 1개씩 | 동시 운영 |

> **결정적 차별점**: Heartbeat — 명령 없이도 스스로 깨어나서 일합니다.

---

## 2장. 핵심 개념 정리

| 용어 | 의미 |
|---|---|
| **Gateway** | 제어 중추. 백그라운드에서 항상 돌아가는 서버 (포트 18789) |
| **Workspace** | 에이전트의 인격·기억이 저장되는 폴더 (`~/.openclaw/workspace`) |
| **Channel** | 메신저 연결 (Telegram/Slack/Discord 등 50종+) |
| **Skill** | 능력 패키지 (ClawHub에 5,700+개 등록) |
| **Heartbeat** | 주기적 자율 실행 (매시간 등) |
| **Cron Job** | 정해진 시간에 실행 (매일 9시 브리핑 등) |
| **SOUL.md** | 에이전트의 핵심 인격 정의 파일 |

> 자세한 구조는 [OpenClaw 공식 문서](https://docs.openclaw.ai)를 참고하세요.

---

## 3장. 준비물

| 항목 | 권장 사양 |
|---|---|
| **OS** | macOS / Linux / Windows (WSL2 권장) |
| **Node.js** | v22.16 이상 (없으면 설치 스크립트가 자동 처리) |
| **AI 구독** | ChatGPT Plus 또는 Pro (Codex 모델 사용) |
| **인터넷** | 안정적인 연결 (OAuth 로그인용) |
| **터미널** | macOS Terminal / iTerm2 / Windows Terminal 등 |

---

## Step 1 — OpenClaw 설치

### 🖥 OS별 주의사항

| OS | 주의사항 |
|---|---|
| **macOS** | 가장 안정적. 본 가이드 기본 환경 |
| **Linux (Ubuntu)** | 동일하게 동작. systemd 데몬 사용 |
| **Windows (WSL2)** | WSL2 환경(Ubuntu 등)에서 실행 권장 |
| **Windows 네이티브** | install.ps1 지원하지만 일부 기능 제한 가능 — WSL2 추천 |

### 1-1. 설치 명령어 실행

**macOS / Linux:**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

이 스크립트는 다음을 자동으로 처리합니다:
- Node.js 설치 (없으면)
- npm으로 OpenClaw 글로벌 설치
- PATH 등록

> 💡 **이미 Node.js 22+ 가 있다면**, 직접 설치도 가능: `npm install -g openclaw@latest`

### 1-2. 설치 확인

```bash
openclaw --version
```

버전 번호가 출력되면 설치 성공입니다.

### 🟢 PATH/설치 문제 해결 — AI에게 시키기

`openclaw: command not found` 같은 에러가 뜨면, 옆에서 돌아가는 클로드 코드(혹은 ChatGPT)에게 이렇게 물어보세요:

```
방금 OpenClaw 설치했는데 'openclaw: command not found' 에러 떠.
- macOS / Linux / WSL2 환경
- npm으로 설치함
PATH 설정 봐주고 ~/.zshrc에 추가해줘.
```

수동으로 처리하고 싶으면:
```bash
export PATH="$(npm prefix -g)/bin:$PATH" >> ~/.zshrc
source ~/.zshrc
```

---

> ## 🎯 워크숍 체크포인트 1 — "OpenClaw 설치 완료"
>
> ```bash
> openclaw --version          # 버전 번호가 출력되면 OK
> ```
>
> 안 되면? → 위의 PATH 문제 해결 또는 [부록 D 트러블슈팅](#부록-d-트러블슈팅)

---

## Step 2 — 온보딩 마법사 (QuickStart)

여기서부터가 **OpenClaw 셋업의 메인 이벤트**입니다.

### 2-0. 온보딩 시작

```bash
openclaw onboard --install-daemon
```

`--install-daemon` 플래그는 **OpenClaw을 백그라운드 서비스(데몬)로 등록** 합니다 (macOS: launchd / Linux: systemd / Windows: Service). 컴퓨터 켜면 자동 실행, 끄지 않는 한 계속 돌아갑니다.

> 💡 **이게 왜 중요한가?** 데몬 등록 안 하면 터미널 닫을 때마다 OpenClaw도 꺼집니다. 셋업 데이에서는 **반드시 `--install-daemon` 포함**해서 실행하세요.

이제 마법사가 11개의 질문을 차례로 물어봅니다. 하나씩 가이드해드릴게요.

---

### 2-1. 보안 동의 (Security disclaimer)

```
OpenClaw will run with full access to your computer.
Do you acknowledge the security implications? [y/N]
```

**👉 답변: `y` (Yes)**

> ⚠️ **이게 의미하는 것**: 오픈클로는 여러분 컴퓨터의 거의 모든 권한을 갖게 됩니다 — 파일 읽고 쓰기, 명령어 실행, 네트워크 접근 등. AI에게 이 권한을 주는 건 양날의 검입니다. 보안 강화 방법은 [부록 C](#부록-c-보안-강화)를 참고하세요.

---

### 2-2. Setup mode 선택

```
Choose setup mode:
> QuickStart (recommended for most users)
  Manual (advanced network/port configuration)
```

**👉 답변: `QuickStart`**

> 💡 **셋업 데이 참가자는 무조건 QuickStart**. Manual은 VPS 배포, 커스텀 포트, Tailscale 노출 같은 고급 시나리오용입니다. ([부록 A](#부록-a-manual-모드-셋업) 참고)

---

### 2-3. Model / Auth 선택

```
Select model provider and authentication method:
> OpenAI Codex (Browser Login)         ← 추천
  OpenAI Codex (Device Pairing)        ← 모니터 없는 환경
  Anthropic API Key
  Google Gemini API Key
  Other (OpenRouter / Groq / ...)
```

**👉 답변: `OpenAI Codex (Browser Login)`**

> 💡 **왜 Codex인가?**
> - 앤스로픽이 서드파티 도구의 클로드 구독 모델 커버리지를 종료해서, 합법적이고 안정적으로 운용하려면 다른 모델이 필요
> - Codex는 도구 호출(tool calling) 능력에서 가장 안정적
> - ChatGPT Plus/Pro 구독에 포함되어 있어 별도 API 과금 없음

> 🖥 **모니터 없는 환경(헤드리스)**: SSH로 원격 접속한 맥미니나 Linux 서버에서는 `Device Pairing`을 선택하세요. 표시되는 코드를 다른 기기 브라우저에서 입력하면 인증됩니다.

---

### 2-4. OpenAI 로그인

`Browser Login`을 선택하면 자동으로 브라우저가 열립니다.

1. ChatGPT 계정으로 로그인
2. OpenClaw 권한 승인
3. 브라우저가 "Authentication successful" 표시
4. 터미널로 돌아오면 마법사가 자동으로 다음 단계로 진행

> ⚠️ 브라우저가 자동으로 안 열리면 터미널에 표시된 URL을 직접 복사해서 여세요.

---

### 2-5. 기본 모델 확인

```
Default model: openai-codex/gpt-5.5
Press Enter to keep, or type a different model:
```

**👉 답변: 그냥 `Enter` (기본값 유지)**

> 💡 **`openai-codex/gpt-5.5` 표기 주의**: 일반 OpenAI API 모델(`openai/`)과 Codex 런타임(`openai-codex/`)은 다른 프로바이더 ID입니다. 셋업 데이에서는 기본값을 그대로 쓰세요.

---

### 2-6. QuickStart 요약 확인

```
QuickStart configuration:
  Gateway port:        18789
  Gateway bind:        Loopback (127.0.0.1)
  Gateway auth:        Token
  Tailscale exposure:  Off

Continue? [Y/n]
```

**👉 답변: `Y` (또는 그냥 Enter)**

> 💡 **각 항목의 의미:**
> - **port 18789**: Gateway가 사용할 포트 (이게 막혀있으면 안 됨)
> - **Loopback (127.0.0.1)**: 같은 컴퓨터 안에서만 접근 가능 (보안 기본값) — `0.0.0.0`으로 바꾸면 외부 네트워크에서도 접근 가능 = 매우 위험
> - **Token auth**: 모든 요청에 토큰이 필요 (자동 생성됨)
> - **Tailscale exposure: Off**: VPN으로 원격 접근 제공 옵션 (지금은 끔)
>
> 셋업 데이에서는 **모두 기본값**이 정답입니다.

---

### 2-7. Channel 선택

```
Select channels to connect now:
> Skip for now           ← 추천
  Telegram
  Slack
  Discord
  WhatsApp
  iMessage (macOS only)
```

**👉 답변: `Skip for now`**

> 💡 **왜 지금은 Skip?**
> - 셋업 자체가 꼬였을 때 채널 토큰까지 같이 꼬이면 디버깅 지옥
> - "일단 작동하는 것 → 채널 추가"가 멘탈 모델에 더 잘 맞음
> - 채널 연결은 [Step 4](#step-4--채널-연결)에서 별도로 진행합니다

---

### 2-8. Web search provider

```
Select web search provider:
> Skip for now           ← 추천
  Brave Search
  Perplexity (via OpenRouter)
```

**👉 답변: `Skip for now`**

> 💡 **나중에 추가**: 웹 검색은 에이전트의 능력을 크게 높이지만, 셋업 데이에서는 일단 Skip. 나중에 [부록 B](#부록-b-openclawjson-수동-편집-레퍼런스)에서 추가 가능.

---

### 2-9. Skills setup

이 단계는 참가자 PC 환경에 따라 보이는 내용이 달라집니다. 일반적인 흐름은:

#### 2-9-a. Skills status 요약

```
Skills status
  Eligible:                N
  Missing requirements:    N
  Unsupported on this OS:  N
  Blocked by allowlist:    N
```

각 항목 의미:
- **Eligible**: 바로 쓸 수 있는 스킬
- **Missing requirements**: CLI/env/config 설치 필요한 스킬
- **Unsupported on this OS**: OS 미지원
- **Blocked by allowlist**: 설정상 막힌 스킬

#### 2-9-b. Configure skills now?

```
Configure skills now? (recommended)
> Yes
  No
```

**👉 답변: `No` (셋업 데이 추천)**

> 💡 **왜 No?**
> 셋업 데이에서 Yes를 고르면, 부족한 도구(brew, npm 패키지, API 키 등)를 설치하느라 시간이 튈 수 있습니다. 일단 기본 셋업을 끝내고, 나중에 필요한 스킬만 추가하는 게 안전합니다.

#### 2-9-c. (만약 Yes를 골랐다면) Install missing skill dependencies

```
Install missing skill dependencies
> Skip for now / Continue without installing dependencies   ← 추천
  🔐 1password
  📝 apple-notes
  ⏰ apple-reminders
  🐙 github          — Install GitHub CLI (brew)
  🎬 video-frames    — Install ffmpeg (brew)
  🧵 tmux
  ☔ weather
  ... (환경에 따라 다름)
```

**👉 답변: `Skip for now`**

#### 2-9-d. (Skip 안 했다면) Node manager 선택

선택한 스킬 중 npm 기반 설치가 있으면:
```
Preferred node manager for skill installs:
> npm        ← 추천 (Node.js와 함께 기본 설치됨)
  pnpm
  bun
```

**👉 답변: `npm`**

#### 2-9-e. (Skip 안 했다면) API key 입력 요청

```
Set ELEVENLABS_API_KEY for sag? [y/N]
Set NOTION_API_KEY for notion? [y/N]
Set OPENAI_API_KEY for openai-whisper-api? [y/N]
```

**👉 답변: 미리 준비한 키가 없으면 `N`**

> 💡 셋업 데이 정리:
> - **빠른 셋업이 목표** → `Configure skills now?` → **No**
> - **여유 있고 도구도 같이 깔고 싶다** → `Yes` → 그러나 **Install dependencies는 Skip for now**
> - 어차피 필요한 스킬은 나중에 `clawhub install <skill-name>` 로 추가 가능

---

### 2-10. Gateway service 설치

```
Install OpenClaw as a system service? [Y/n]
```

**👉 답변: `Y` (또는 그냥 Enter)**

> 💡 **이 단계의 의미**: macOS는 launchd, Linux는 systemd에 OpenClaw을 등록합니다. 컴퓨터를 재시작해도 자동으로 다시 켜집니다. `--install-daemon` 플래그를 처음에 붙였으면 자동으로 진행될 수도 있습니다.

---

### 2-11. Hatch (에이전트 인격 부여)

```
How do you want to hatch your agent?
> Hatch in Terminal (recommended)        ← 추천
  Open the Web UI
  Do this later
```

**👉 답변: `Hatch in Terminal`**

> 💡 **Hatch란?**
> "부화"라는 뜻으로, 에이전트에게 이름·인격·역할을 부여하는 단계입니다. Terminal 모드에서는 인터랙티브하게 질문에 답하면서 인격을 만듭니다.
>
> 셋업 데이에서는 **간단한 기본 인격**만 만들어두고, 나중에 [Step 5](#step-5--에이전트-인격-부여)에서 SOUL.md를 직접 편집해 깊게 다듬는 게 좋습니다.
>
> **시간이 빠듯하면 `Do this later`** 도 OK. Step 5에서 처음부터 만들어도 됩니다.

---

### ✅ 온보딩 완료!

마법사가 마지막으로 이런 메시지를 보여주면 성공:

```
✓ Gateway running on port 18789
✓ Model authenticated: openai-codex/gpt-5.5
✓ Workspace: ~/.openclaw/workspace
✓ Daemon installed

Setup complete. Try: openclaw dashboard
```

---

## Step 3 — 검증 — 첫 응답 받기

온보딩이 끝났다면, 실제로 동작하는지 확인합니다.

### 3-1. Health check

```bash
openclaw doctor
openclaw health
```

깨끗한 출력 예시:
```
✓ Gateway running on port 18789
✓ Model authenticated: openai-codex/gpt-5.5
✓ Workspace: ~/.openclaw/workspace
All checks passed.
```

문제 발견되면 자동 수정 시도:
```bash
openclaw doctor --fix
```

### 3-2. 첫 응답 받기 (대시보드)

```bash
openclaw dashboard
```

브라우저가 자동으로 열리거나, `http://127.0.0.1:18789` 주소를 직접 여세요.

채팅창에 "안녕"을 입력하고 응답이 오면 성공입니다.

### 3-3. 또는 터미널에서 (TUI)

```bash
openclaw tui
```

터미널 안에서 인터랙티브한 대시보드가 열립니다. 단축키:
- `Tab` — 패널 전환
- `L` — 로그 보기
- `R` — Gateway 재시작
- `Q` — TUI 종료 (Gateway는 계속 실행)

---

> ## ☕ 여기까지가 점심 전 미니 마일스톤
>
> 다음 두 가지가 되면 점심 먹으러 가도 OK:
>
> 1. **OpenClaw 설치 + Gateway 실행 중**
>    - `openclaw health` 가 OK
> 2. **터미널/대시보드에서 첫 응답 받기**
>
> 하지만 이건 아직 **"클로드 코드와 별 차이 없는 단계"** 입니다.
> 진짜 오픈클로의 가치는 **메신저로 대화하는 것** — Step 4로 가야 진짜 시작이에요!

---

## Step 4 — 채널 연결

> ## 🎯 워크숍 체크포인트 2 — "메신저로 오픈클로와 소통"
>
> 이 단계가 셋업 데이의 **진짜 목적지**입니다. 메신저로 오픈클로와 첫 대화를 나누면 워크숍의 1차 미션 완료!

| 채널 | 난이도 | 특징 | 추천 케이스 |
|---|---|---|---|
| **Telegram** | ⭐ 쉬움 | 봇 생성 30초, 토큰 1개 | **처음 셋업 추천** |
| **Slack** | ⭐⭐⭐ 까다로움 | 봇 생성+권한 설정+토큰 2개 | 이미 슬랙 쓰는 팀 |
| **Discord** | ⭐⭐ 중간 | Developer Portal에서 생성 | 게임/커뮤니티 운영 |

> 💡 **추천 동선**: 일단 Telegram 먼저 연결 → 응답 받으면 셋업 데이 미션 완료 → 시간 남으면 Slack/Discord 추가

---

### 📱 Telegram 연결 (가장 쉬움 · 추천 스타팅 포인트)

#### 1단계: BotFather로 봇 만들기 (텔레그램 앱 안에서)

1. 텔레그램에서 [@BotFather](https://t.me/BotFather) 검색해서 채팅 시작
2. `/newbot` 명령어 입력
3. 봇 이름 입력 (예: `My OpenClaw`)
4. 봇 username 입력 (예: `my_openclaw_bot` — `_bot`으로 끝나야 함)
5. **봇 토큰 받기** (예: `123456:ABC-DEF...`) — 이걸 절대 노출하지 마세요

#### 2단계: 본인 텔레그램 user ID 확인 (보안용)

1. 텔레그램에서 [@userinfobot](https://t.me/userinfobot) 검색
2. 아무 메시지나 보내면 본인 user ID 알려줌 (예: `123456789`)

#### 3단계: 🟢 권장 — AI에게 시키기

오픈클로 대시보드나 클로드 코드에서 이렇게 물어보세요:

```
텔레그램 채널 연결해줘.
- 봇 토큰: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
- 내 user ID: 123456789 (allowFrom으로 보안 설정)
- 그룹에서는 멘션 시에만 반응
설정 후 Gateway 재시작도 부탁해.
```

#### 3단계 대안: ⚙️ CLI로 직접 추가

```bash
openclaw channels add --channel telegram --token <bot-token>
openclaw gateway restart
```

#### 4단계: 페어링 승인 (DM 보안)

기본 정책에서는 처음 메시지 보내는 사용자가 차단됩니다.

1. 봇에게 텔레그램으로 메시지 전송: "안녕"
2. 페어링 코드를 받음 (오픈클로 콘솔에 표시됨)
3. 승인:
   ```bash
   openclaw pairing approve telegram <code>
   ```
   또는 AI에게: "방금 페어링 코드 [코드값] 승인해줘"

#### 5단계: 첫 응답 받기 🎉

봇에게 메시지를 보내면 응답이 옵니다. **여기까지 됐다면 워크숍 체크포인트 2 통과!**

---

### 💼 Slack 연결

> ⚠️ Telegram 대비 봇 생성 단계가 많습니다. 이미 Slack을 메인으로 쓰는 팀이 아니라면 Telegram 먼저 권장.

#### 1단계: Slack 앱 만들기

1. [api.slack.com/apps](https://api.slack.com/apps) 접속 → "Create New App" → "From scratch"
2. 앱 이름 입력, 워크스페이스 선택
3. 좌측 메뉴 **"Socket Mode"** → 활성화 → **App Token 발급** (`xapp-...`)
4. 좌측 메뉴 **"OAuth & Permissions"** → Bot Token Scopes 추가:
   - `app_mentions:read`, `chat:write`, `channels:history`, `groups:history`, `im:history`, `im:read`, `im:write`, `mpim:history`
5. **"Install to Workspace"** → 승인 → **Bot User OAuth Token 발급** (`xoxb-...`)
6. 좌측 메뉴 **"Event Subscriptions"** → 활성화 → 이벤트 구독:
   - `app_mention`, `message.channels`, `message.im`, `message.groups`

#### 2단계: 🟢 권장 — AI에게 시키기

```
슬랙 채널 연결해줘.
- Bot Token: xoxb-여기에토큰
- App Token: xapp-여기에토큰
설정 후 검증하고 Gateway 재시작.
```

#### 3단계: 봇을 채널에 초대

슬랙 채널에서 `/invite @your-bot-name` 입력하면 봇이 채널에 들어옵니다.

#### 4단계: 첫 응답 받기

채널에서 `@봇이름 안녕` 으로 멘션하면 응답이 옵니다.

---

### 🎮 Discord 연결

#### 1단계: Discord 봇 만들기

1. [discord.com/developers/applications](https://discord.com/developers/applications) 접속 → "New Application"
2. 좌측 메뉴 **"Bot"** → "Reset Token" → **봇 토큰 복사** (한 번만 보임!)
3. **Privileged Gateway Intents** 모두 활성화:
   - PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGE CONTENT INTENT
4. 좌측 메뉴 **"OAuth2 → URL Generator"**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Read Message History`, `View Channels`
5. 생성된 URL을 브라우저에서 열어 봇을 서버에 초대

#### 2단계: 🟢 권장 — AI에게 시키기

```
디스코드 채널 연결해줘.
- 봇 토큰: 여기에토큰
- 메시지 인텐트 활성화 가정
설정 검증하고 Gateway 재시작.
```

#### 3단계: 첫 응답 받기

봇이 들어간 서버에서 `@봇이름 안녕` 으로 멘션하면 응답이 옵니다.

---

### 세션 동작 원리

채널을 여러 개 연결했을 때 대화 맥락이 어떻게 분리되는지:

- **같은 채널 / 다른 스레드** = **같은 세션**
- **다른 채널 / DM / 다른 텔레그램 채팅방** = **다른 세션**
- 대화 맥락은 세션별로 분리되지만, 워크스페이스 파일(SOUL.md 등)은 **모든 세션이 공유**

> 즉, "텔레그램에서 들었던 얘기"가 "슬랙에서는 다시 처음부터" 입니다.
> 하지만 SOUL.md에 적힌 성격이나 USER.md에 적힌 사용자 정보는 모든 채널에서 동일하게 적용됩니다.

---

> ## 🎉 여기까지 됐다면, 셋업 데이의 1차 미션 완료!
>
> - ✅ OpenClaw 설치 + Gateway 실행 중
> - ✅ 메신저(Telegram/Slack/Discord 중 하나)로 오픈클로와 첫 대화 성공
>
> 이제 진짜 시작입니다. 시간이 남으면 **Step 5에서 인격 부여** 까지 해보세요.

---

## Step 5 — 에이전트 인격 부여

지금 여러분의 에이전트는 **이름은 있지만 인격이 없는** 상태입니다. SOUL.md를 채우면 진짜 "내 동료"로 변신합니다.

### 워크스페이스 구조 이해

`~/.openclaw/workspace/` 안에는 다음 파일들이 있습니다:

| 파일 | 역할 |
|---|---|
| `SOUL.md` | 에이전트의 핵심 인격 — 톤, 가치관, 커뮤니케이션 스타일, 절대 규칙 |
| `USER.md` | **나**에 대한 정보 — 이름, 역할, 선호도, 일하는 시간, 사용 도구 |
| `IDENTITY.md` | 에이전트 자기소개 — 이름, 페르소나, 인사말 |
| `AGENTS.md` | 에이전트가 무엇을 하는지에 대한 상위 지침 |
| `TOOLS.md` | 에이전트가 사용 가능한 도구 설명 |
| `HEARTBEAT.md` | 하트비트 체크리스트 (Step 6에서 사용) |
| `memory/` | 누적 지식 저장 디렉토리 |

> 💡 모든 파일은 단순한 마크다운입니다. 어떤 텍스트 에디터로든 편집 가능.

### 5-1. SOUL.md — 에이전트의 핵심 인격

가장 중요한 파일입니다.

```bash
# 워크스페이스로 이동
cd ~/.openclaw/workspace

# SOUL.md 편집 (vim, nano, code 등 아무거나)
code SOUL.md
```

#### 🟢 권장: AI에게 시키기

오픈클로(또는 클로드 코드)에게 물어보세요:

```
내 SOUL.md 작성 도와줘.
- 나는 [본인 직업/역할]
- 톤은 [캐주얼/프로페셔널/직설적] 으로
- 절대 규칙: [중요한 룰 1-2개]
- 도메인: [내가 일하는 분야]
- 포맷 선호도: [긴 글/짧은 글/불릿 포인트]
이 정보로 SOUL.md 만들어줘.
```

#### 5-2. SOUL.md 템플릿 (직접 작성하는 경우)

```markdown
# Soul

## Who I Am
나는 [본인 이름]의 개인 AI 어시스턴트입니다. 
[역할 — 예: "마케팅 매니저", "콘텐츠 전략가"]로 일하며, 
일반 챗봇이 아니라 신뢰받는 동료로 동작합니다.

## Communication Style
- [캐주얼/프로페셔널/직설적] 톤으로 작성
- [간결/상세/중간] 정도의 응답
- 상대방의 에너지에 맞춤 (간결하면 나도 간결)
- 이모지는 명시적 요청이 있을 때만 사용
- "Sure!", "Of course!", "Great question!" 같은 시작 금지
- "synergy", "leverage" 같은 기업 jargon 회피

## Hard Rules
- 데이터, 통계, 인용을 절대 fabricate하지 않음. 모르면 모른다고 말함.
- 고위험 작업 전에는 반드시 명확화 질문
- 콘텐츠 작성 시 항상 라이브러리의 톤/스타일 매칭
- [본인 이름]의 개인 정보를 누구와도 공유하지 않음

## Domain Knowledge
- [본인 산업 — 예: "B2B SaaS 마케팅"]에 깊은 이해
- 사용 도구: [Notion, Slack, Figma 등]
- 주요 경쟁사: [리스트]
- 타겟 오디언스: [정의]

## Formatting Preferences
- 이메일: 짧은 단락, 단락당 3문장 이하
- 소셜 포스트: 후크 우선, X/Twitter는 280자 이하
- 블로그: 2-3 단락마다 소제목, 상단에 TL;DR
```

### 5-3. USER.md — 나에 대한 정보

에이전트가 나를 더 잘 이해하도록.

```markdown
# User Profile

## Basic Info
- 이름: [본인 이름]
- 위치: [도시], [타임존]
- 역할: [본인 직책]

## Work Context
- 산업: [본인 산업]
- 회사 규모: [팀 사이즈]
- 주요 도구: Notion, Slack, Google Workspace 등
- 근무 시간: 평일 9 AM – 7 PM

## Preferences
- 내부 커뮤니케이션은 불릿 포인트 선호
- 데이터 기반 주장 선호 — 가능하면 숫자 포함
- 카톡 > 이메일 (긴급 건은 카톡으로)
- 콘텐츠는 친구에게 말하듯 대화체

## Current Projects
- [현재 진행 중인 프로젝트 1]
- [현재 진행 중인 프로젝트 2]
```

### 5-4. 작성 샘플 추가 (옵션, 강력 추천)

본인이 실제로 쓴 글을 `samples/` 디렉토리에 모으면, 에이전트가 본인 목소리를 학습합니다.

```bash
mkdir -p ~/.openclaw/workspace/samples
```

이 폴더에 본인이 쓴 이메일, 슬랙 메시지, 블로그 포스트, SNS 글을 마크다운 파일로 저장하세요. 파일이 많아질수록 에이전트가 본인처럼 글을 씁니다.

### 5-5. 변경 적용

설정 변경 후 Gateway 재시작:
```bash
openclaw gateway restart
```

이제 에이전트에게 "내 스타일로 이메일 초안 써줘"라고 시켜보세요. SOUL.md 적용 전후의 차이가 확연히 느껴질 겁니다.

---

## Step 6 — 하트비트 & 크론잡 (선택)

> 💡 **이 단계의 의미**: 하트비트/크론잡은 오픈클로의 **결정적 차별점**입니다.
> 클로드 코드와 다르게, 내가 시키지 않아도 스스로 깨어나서 일하는 동료가 됩니다.
> 셋업 데이에서는 시간이 남으면 도전, 부족하면 행사 후 자율 학습.

### 하트비트 — "주기적 순찰"

에이전트가 정해진 간격으로 깨어나서 `HEARTBEAT.md` 체크리스트를 실행합니다.

#### 🟢 권장: AI에게 시키기

```
하트비트 셋업해줘.
- 30분마다 깨어남
- 활성 시간: 오전 9시 ~ 오후 10시
- 마지막 활성 채널에 보고
HEARTBEAT.md도 만들어줘. 항목은 다음으로:
- Slack에 새 메시지 확인
- Linear에서 오늘 마감 이슈 확인
- 처리 안 된 TODO 스캔
```

### 크론잡 — "정해진 시간에 실행"

```
매일 아침 9시 (한국시간)에 오늘 일정과 할 일 정리해서 슬랙으로 보내는 크론잡 추가해줘.
이름은 "아침 브리핑".
```

**둘 다 한 번에:**
```
나만의 운영 자동화 셋업해줘.
- 30분마다 슬랙/이슈 모니터링 (하트비트)
- 매일 아침 9시 브리핑 (크론잡)
- 매주 금요일 오후 5시 주간 회고 (크론잡)
```

수동 설정은 [부록 B](#부록-b-openclawjson-수동-편집-레퍼런스) 참고.

---

# 부록

## 부록 A. Manual 모드 셋업

QuickStart 대신 Manual 모드를 선택하면 더 세밀한 제어가 가능합니다. 다음과 같은 경우에 유용:

- VPS / 클라우드 서버 배포
- Tailscale 등 VPN으로 외부 접근 제공
- 커스텀 포트 / 바인드 주소 사용
- 멀티에이전트 분리 환경

```bash
openclaw onboard --install-daemon
# 마법사에서 "Manual" 선택
```

Manual 모드에서 추가로 묻는 질문:
- Gateway port (기본 18789, 변경 가능)
- Bind address (`loopback` / `0.0.0.0` / 특정 IP)
- Auth token 생성/입력
- Tailscale exposure (외부 접근 허용 여부)
- TLS 설정 (HTTPS 사용 여부)

> ⚠️ **`0.0.0.0` 으로 바인드하지 말 것** — 같은 네트워크의 누구나 Gateway에 접근 가능. 외부 접근이 필요하면 SSH 터널이나 Tailscale을 사용하세요.

### Non-interactive 셋업 (스크립트 / 자동화)

서버에 자동 배포하는 경우:
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
```

---

## 부록 B. openclaw.json 수동 편집 레퍼런스

핵심 설정 파일은 `~/.openclaw/openclaw.json` 입니다. JSON5 형식이라 주석과 trailing comma가 가능.

> 💡 **대부분의 경우 직접 편집 안 해도 됨** — 마법사와 AI 시키기로 처리 가능. 이 부록은 "직접 만지고 싶을 때" 참고용입니다.

### 최소 설정

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      model: {
        primary: "openai-codex/gpt-5.5"
      }
    }
  }
}
```

### 폴백 모델 추가

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "openai-codex/gpt-5.5",
        fallbacks: ["anthropic/claude-sonnet-4-6"]
      }
    }
  }
}
```

### 멀티에이전트

```json5
{
  agents: {
    list: [
      { id: "home", default: true, workspace: "~/.openclaw/workspace-home" },
      { id: "work", workspace: "~/.openclaw/workspace-work" }
    ]
  },
  bindings: [
    { agentId: "home", match: { channel: "telegram", accountId: "personal" } },
    { agentId: "work", match: { channel: "slack", accountId: "company" } }
  ]
}
```

### 채널 설정 (수동)

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "${TELEGRAM_BOT_TOKEN}",
      dmPolicy: "pairing",
      groupPolicy: "mention",
      allowFrom: ["YOUR_TELEGRAM_USER_ID"]
    },
    slack: {
      enabled: true,
      mode: "socket",
      botToken: "${SLACK_BOT_TOKEN}",
      appToken: "${SLACK_APP_TOKEN}"
    },
    discord: {
      enabled: true,
      token: "${DISCORD_BOT_TOKEN}",
      dm: { enabled: true, allowFrom: ["YOUR_DISCORD_USER_ID"] }
    }
  }
}
```

### 하트비트 / 크론

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        lightContext: true,
        isolatedSession: true,
        activeHours: { start: "08:00", end: "22:00" }
      }
    }
  }
}
```

크론은 CLI로 추가 권장:
```bash
openclaw cron add \
  --name "Morning brief" \
  --cron "0 9 * * *" \
  --tz "Asia/Seoul" \
  --session isolated \
  --message "오늘 일정과 할 일 브리핑해줘" \
  --announce
```

### 웹 검색

```json5
{
  tools: {
    web: {
      search: {
        enabled: true,
        provider: "brave",
        apiKey: "${BRAVE_API_KEY}",
        maxResults: 5
      },
      fetch: { enabled: true }
    }
  }
}
```

### 설정 검증

```bash
openclaw config validate    # 문법 검증
openclaw config schema      # 전체 스키마 출력
openclaw doctor --fix       # 자동 수정
```

---

## 부록 C. 보안 강화

### 핵심 원칙

OpenClaw은 컴퓨터의 거의 모든 권한을 가진 **상시 실행 데몬**입니다. 다음은 최소한의 보안 설정:

### 1. Allowlist — 누가 메시지를 보낼 수 있는지 제한

```json5
{
  channels: {
    telegram: {
      allowFrom: ["YOUR_TELEGRAM_USER_ID"]   // 본인 ID만
    }
  }
}
```

### 2. Secrets — API 키를 .env로 분리

`~/.openclaw/.env` 파일에 저장:
```
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=123456:ABC...
OPENCLAW_GATEWAY_TOKEN=...   # openssl rand -hex 32 로 생성
```

권한 제한:
```bash
chmod 600 ~/.openclaw/.env
echo ".env" >> ~/.openclaw/.gitignore
```

`openclaw.json`에서는 `${VAR_NAME}` 으로 참조:
```json5
{
  channels: {
    telegram: { botToken: "${TELEGRAM_BOT_TOKEN}" }
  }
}
```

검증:
```bash
openclaw secrets audit --check
```

### 3. Gateway Bind — 외부 노출 막기

```json5
{
  gateway: {
    bind: "loopback"   // 같은 컴퓨터 안에서만 접근
  }
}
```

> ⚠️ `0.0.0.0` 은 같은 네트워크 누구나 접근 가능 = **매우 위험**. 외부 접근 필요하면 SSH 터널 또는 Tailscale 사용.

### 4. Sandbox — 작업을 Docker 컨테이너로 격리 (고급)

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        backend: "docker",
        scope: "agent",
        workspaceAccess: "none",
        docker: {
          image: "openclaw-sandbox:bookworm-slim",
          readOnlyRoot: true,
          network: "none",
          capDrop: ["ALL"],
          memory: "1g"
        }
      }
    }
  }
}
```

### 5. Tool Permissions — 능력 제한

```json5
{
  tools: {
    sandbox: {
      tools: {
        allow: ["read"],
        deny: ["exec", "write", "edit"]
      }
    }
  }
}
```

### 6. Webhook Token

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    allowRequestSessionKey: false
  }
}
```

### 7. 정기 점검

```bash
openclaw doctor              # 헬스 체크
openclaw secrets audit       # 평문 키 검출
openclaw channels status     # 채널 상태
```

---

## 부록 D. 트러블슈팅

### "command not found: openclaw"

설치 안 됐거나 PATH 문제.

```bash
# 재설치
curl -fsSL https://openclaw.ai/install.sh | bash

# 또는 PATH 확인
which openclaw
```

`which` 가 빈 결과면 터미널 재시작 후 다시 시도.

### "Gateway failed to start: gateway already running"

이미 데몬으로 실행 중. 정상 상황입니다.
```bash
openclaw health
openclaw gateway restart
```

### "Config invalid / Unrecognized keys"

설정 파일에 잘못된 키.
```bash
openclaw doctor --fix
```

### "Model authentication failed"

API 키 만료 또는 잘못됨.
```bash
openclaw models status
openclaw models auth setup-token --provider openai-codex
```

### "Port 18789 is already in use"

다른 프로세스가 포트 점유.
```bash
# macOS:
lsof -i :18789

# Linux:
sudo ss -tlnp | grep 18789
```

OpenClaw 자신이면 `restart`. 다른 프로세스면 종료 또는 다른 포트 사용:
```bash
openclaw gateway --port 18790
```

### 맥미니/서버에 모니터가 없는 경우 (헤드리스)

OAuth 브라우저를 띄울 수 없는 환경:
```bash
openclaw models auth login --provider openai-codex --device-code
```

표시되는 코드를 다른 기기 브라우저에서 입력.

### 채널 연결됐는데 응답 없음

```bash
# 채널 상태 확인
openclaw channels status --probe

# Telegram 페어링 확인
openclaw pairing list telegram

# 본인 ID가 allowFrom에 있는지 확인
cat ~/.openclaw/openclaw.json | grep allowFrom
```

### 크론 안 트리거됨

```bash
# Gateway 실행 중인지
openclaw health

# 크론 리스트
openclaw cron list

# 로그 실시간 확인
openclaw logs --follow
# Ctrl+C 로 중지
```

### Config 깨져서 아무것도 안 됨

```bash
# 자동 수정 시도
openclaw doctor --fix

# JSON 문법 검증
cat ~/.openclaw/openclaw.json | python3 -m json.tool

# 백업에서 복원
openclaw backup create   # 미리 백업 만들어두기
# 또는 git 사용 시:
cd ~/.openclaw/workspace && git checkout -- .
```

### 그래도 안 되면

전체 에러 출력을 복사해서 흐민/오웬/젬마에게 보여주세요. 또는 클로드 코드/ChatGPT에 다음과 같이 물어보세요:

```
OpenClaw 셋업 중에 [어떤 작업] 하다가 이 에러 떴어:

[전체 에러 메시지 붙여넣기]

내 환경:
- OS: [macOS/Linux/Windows]
- Node 버전: [node --version 결과]
- OpenClaw 버전: [openclaw --version 결과]

진단하고 해결 방법 알려줘.
```

---

## 자주 쓰는 명령어 모음

| 작업 | 명령어 |
|---|---|
| 헬스 체크 | `openclaw doctor` |
| 자동 수정 | `openclaw doctor --fix` |
| 설정 보기 | `cat ~/.openclaw/openclaw.json` |
| 설정 편집 | `nano ~/.openclaw/openclaw.json` |
| 모델 리스트 | `openclaw models list` |
| Gateway 시작 | `openclaw gateway` |
| Gateway 재시작 | `openclaw gateway restart` |
| 채널 상태 | `openclaw channels status --probe` |
| 크론 리스트 | `openclaw cron list` |
| 로그 실시간 | `openclaw logs --follow` |
| 대시보드 | `openclaw dashboard` |
| TUI | `openclaw tui` |
| 백업 | `openclaw backup create --verify` |
| 업데이트 | `openclaw update` |

---

## 다음 단계

셋업 데이가 끝났다면, 이제 진짜 시작입니다.

**1주차**: 하트비트 1개, 크론잡 1개 켜고 살아보세요. 알람이 유용한지 짜증나는지 느껴보고 조정.

**2주차**: SOUL.md를 더 디테일하게. 1주차에서 에이전트가 잘못한 부분을 보고 규칙 추가. 작성 샘플 더 추가.

**3주차+**: 진짜 자동화 시도. 콘텐츠 파이프라인, 개인 CRM, 모니터링 등.

**지속적으로**: 워크스페이스를 git으로 관리. 정기 백업. 모델/플러그인 업데이트.

> "도구에 자동화를 얹는 게 아니라, 처음부터 에이전트가 운영할 수 있게 설계한다."
>
> 시간이 갈수록 "어, 이것도 뽀짝이가 할 수 있겠네?" 하는 순간이 늘어납니다. 그게 native한 운영의 시작입니다.

Happy hatching. 🐈‍⬛
