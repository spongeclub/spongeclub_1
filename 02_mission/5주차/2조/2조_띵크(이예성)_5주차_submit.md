---
team: 2조
member: 띵크
role: 조장
week: 5
submitted: true
---

# 5주차 과제 — 띵크

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: <'이기적공유' 할 프로덕트 마무리>

# Hermes Agent 도입기 — n8n 자동화에 AI 에이전트 붙이기

n8n 기반 자동화 인프라에 **Hermes Agent**(Nous Research의 오픈소스 자가호스팅 AI 에이전트)를 도입한 과정을 정리한 글입니다. 워크플로우를 대화로 실행하고 서버까지 관리해주는 에이전트를 기존 인프라에 붙이는 게 목표였습니다.

> ⚠️ 이 글은 **도입 과정과 아키텍처**에 초점을 둡니다. 보안 설정(봇 접근 제한, 포트 차단, 백업, 토큰 관리 등)은 다루지 않으니, 실제 운영 시엔 반드시 별도로 챙기세요. 특히 서버 관리 권한을 가진 에이전트는 보안 설계가 필수입니다.

---

## Hermes Agent란

- Nous Research의 **오픈소스 자가호스팅 AI 에이전트** (MIT 라이선스)
- Docker로 구동, 작은 VPS에서도 동작
- 메신저(Discord/Telegram/Slack 등) 연결, 장기 기억, 스킬, **MCP 연동** 지원
- 에이전트 자체는 무료 — LLM provider(API 또는 구독)만 연결하면 됨

---

## 아키텍처 결정 — 어디에 둘까

별도 서버를 새로 만들지 않고, **기존 n8n 서버에 컨테이너 하나로 함께 올리기로** 했습니다 (서버 비용 절약).

서버 관리까지 맡기기 위해 Docker 소켓을 컨테이너에 마운트해, 에이전트가 호스트의 컨테이너(예: n8n)를 다룰 수 있게 구성했습니다.

> 참고: Docker 소켓 마운트는 에이전트에 강력한 호스트 접근 권한을 주는 선택입니다. 격리를 더 원한다면 전용 서버에 두고 원격(SSH/MCP)으로 관리하는 구성도 가능합니다. (트레이드오프는 운영 방침에 따라 선택)

---

## 1. 설치 — Docker Compose

`docker-compose.yaml` (단일 컨테이너 구성):

```yaml
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes
    command: gateway run
    restart: unless-stopped
    ports:
      - "127.0.0.1:8642:8642"
    volumes:
      - ~/.hermes:/opt/data
      - /var/run/docker.sock:/var/run/docker.sock   # 서버 관리용 (생략 가능)
    shm_size: 1g
```

```bash
docker compose up -d
```

설정·기억·세션 등 모든 데이터는 `~/.hermes`에 저장됩니다(백업 대상).

---

## 2. 초기 설정 마법사

```bash
docker compose exec hermes hermes setup
```

- **터미널 백엔드: local** — 에이전트가 자기 컨테이너 안에서 명령을 실행. Docker 소켓을 통해 호스트 컨테이너 관리 가능
- **메신저: 일단 skip** — 핵심 기능부터 잡고 나중에 연결

---

## 3. LLM 연결 — 그리고 비용 교훈 ⭐

처음엔 **Anthropic API 키(Claude Sonnet)**로 연결했습니다. 그런데 에이전트를 24시간 돌리니 **pay-per-token 비용이 빠르게 쌓였습니다.**

그래서 **ChatGPT 구독(OpenAI Codex OAuth)으로 전환**했습니다. 구독은 정액이라 토큰 비용 출혈이 멈췄습니다.

```bash
# ChatGPT 구독 연결
docker compose exec hermes hermes auth add openai-codex
# → device-code 방식: 뜨는 URL을 브라우저에서 열고 ChatGPT 로그인 후 코드 입력

# 모델 선택
docker compose exec hermes hermes model     # → OpenAI Codex → gpt-5.5
```

**여기서 얻은 것들:**

- 💡 **24/7 에이전트에는 pay-per-token API보다 구독 정액제가 훨씬 경제적**
- ⚠️ provider 이름이 일부 문서엔 `codex-oauth`로 적혀 있는데, 실제로는 **`openai-codex`**가 맞습니다 (틀리면 "Unknown provider")
- ⚠️ Codex OAuth에서 401/라우팅 에러가 나면 **`gpt-5.3-codex`**가 가장 호환이 잘 됩니다
- 참고: 구독 정액도 무제한은 아니라 사용량 상한이 있습니다 (헤비 유저는 throttle 가능)

---

## 4. n8n 연동 — MCP

Hermes를 n8n의 **instance-level MCP 엔드포인트**에 MCP 클라이언트로 연결했습니다.

`~/.hermes/config.yaml`에 추가:

```yaml
mcp_servers:
  n8n:
    url: "https://<your-n8n-domain>/mcp-server/http"
    headers:
      Authorization: "Bearer ${N8N_MCP_TOKEN}"
    timeout: 180
    tools:
      include: []
```

**얻은 것들:**

- 인증은 n8n의 **Settings → MCP Access → Access Token**(Bearer)을 사용합니다. n8n REST API 키(`X-N8N-API-KEY`)와는 **다릅니다** (그건 `/api/v1`용)
- 연결되면 에이전트에 워크플로우 **검색 / 상세조회 / 실행** 3개 도구가 생깁니다
- ⚠️ **워크플로우가 instance-level MCP에 등록(enable)되어 있지 않으면 도구가 빈 결과로 나옵니다.** 에러가 아니라 조용히 빈 배열을 반환하므로, 연결이 안 될 땐 자격증명·네트워크보다 **워크플로우 등록 여부부터** 확인하세요 (디버깅 함정)

---

## 5. Discord 연결

어디서든 에이전트와 대화하기 위해 Discord 봇을 연결했습니다.

1. **Discord Developer Portal**에서 봇 생성 → **Message Content Intent 켜기** → 서버에 초대
2. 연결:
    
    ```bash
    docker compose exec hermes hermes setup gateway
    ```
    

**얻은 것들:**

- ⚠️ Developer Portal에서 **Message Content Intent**를 켜지 않으면 연결 시 `4014`(Disallowed Intents) 에러가 납니다
- ⚠️ 마법사의 플랫폼 선택은 **스페이스바로 토글**해야 합니다. 그냥 Enter를 치면 "선택 안 함"으로 조용히 종료됩니다
- ⚠️ Docker로 돌릴 땐 systemd 서비스 설치 프롬프트는 **건너뛰세요** (컨테이너 환경에선 해당 없음)

---

## 6. 안정성 — Fallback Provider

Codex OAuth 토큰은 1~3개월마다 만료됩니다. 만료 시 에이전트가 멈추지 않도록 **fallback provider**를 설정했습니다.

```bash
docker compose exec hermes hermes fallback add
```

primary 모델이 **인증 실패·rate limit·서버 에러**를 만나면, 대화를 잃지 않고 자동으로 백업 모델로 스왑됩니다. 토큰 만료 같은 상황에서 에이전트가 조용히 죽는 걸 방지합니다.

---

## 최종 구성

- Hermes 컨테이너 1개가 n8n 서버에서 동작
- LLM: **gpt-5.5 (ChatGPT 구독 / Codex OAuth)** — 정액 비용
- n8n 워크플로우 검색·조회·실행 (MCP)
- Discord로 어디서든 대화
- fallback으로 토큰 만료 시에도 끊김 없음

---

## 핵심 교훈 정리

1. **비용**: 24/7 에이전트는 pay-per-token API보다 **구독 정액제**가 훨씬 경제적
2. **Codex provider 이름은 `openai-codex`** (문서의 `codex-oauth`는 통하지 않을 수 있음)
3. **n8n MCP 인증은 Access Token(Bearer)** — REST API 키와 다름
4. **MCP 도구가 빈 결과면 → 워크플로우 등록(enrollment)부터 확인** (silent failure)
5. **긴 토큰/시크릿은 터미널에 바로 붙여넣기보다, 검증 후 입력** (붙여넣기 중 글자가 섞이거나 깨지기 쉬움)
6. **fallback을 걸어두면** 토큰 만료·장애 시에도 에이전트가 안 멈춤

---

_※ 다시 강조: 이 글은 도입 과정 중심이며 보안 설정은 의도적으로 제외했습니다. root급 권한을 가진 에이전트를 운영한다면, 접근 제한·포트 차단·백업·토큰 관리를 반드시 별도로 설계하세요._




---

## 미션2: <'이기적공유' 오프라인 모임 관련 SNS 글쓰기>

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

