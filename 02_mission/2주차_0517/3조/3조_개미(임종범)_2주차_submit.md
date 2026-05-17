---
team: 3조
member: 개미
role: 조원
week: 2
submitted: true
---

# 2주차 과제 — 개미
---
## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

텔레그램 봇(@sponge_ant_bot)과 Claude Code를 Channels 기능으로 실시간 연결해 "즐거운 개미 OS"의 핵심 입력 창구를 구축했다. 메인 세션(라우터) + B 서브에이전트(분류·저장) 구조로 8개 Notion DB에 메모를 자동 분류·저장하는 시스템을 완성했다.

### 최종 구현 결과물

- `claude-code-telegram-integration.md` — 7단계 셋업 가이드 (Bun 설치 ~ allowlist 잠금) + 트러블슈팅 5건 정리
- `.claude/agents/b-agent.md` — B 서브에이전트 v3 (6태그 라우팅, 8개 Notion DB 저장, 교차 제안, 거절 메모리, 성능 최적화 포함)
- `start-claude-tg.ps1` — PowerShell 자동 시작 스크립트 (profile 로드 → claude-tg 실행)
- `check_bom.ps1` — .env 파일의 UTF-8 BOM 여부 확인 스크립트
- `CLAUDE.md` (sponge_Telegram) — 메인 세션 라우팅 규칙, B 서브에이전트 위임 조건 정의

### 과정 (타임라인별 + 삽질)

- 2026-05-10: 1~7단계 진행 (Bun 설치, @sponge_ant_bot BotFather 생성, telegram 플러그인 설치, 토큰 등록, `--channels` 재시작, 텔레그램 페어링, allowlist 잠금) — 범위 외 참고용
- 2026-05-10: `/plugin` 명령 IDE 확장 환경에서 차단 → 별도 PowerShell 창에서 `claude` 직접 실행으로 해결
- 2026-05-10: `EBUSY: resource busy or locked` 에러 → 다른 Claude Code 프로세스 종료 + 작업관리자에서 `claude.exe` 잔여 프로세스 확인 후 재시도
- 2026-05-10: 토큰 스크린샷 2회 노출 → BotFather `/revoke`로 새 토큰 발급 + `/telegram:configure` 재실행
- 2026-05-10: `--channels` 명령을 백그라운드로 실행 시도 → 인터랙티브 서버라 불가, Windows PowerShell 창을 직접 새로 열어 실행
- 2026-05-16: 전체 셋업 과정을 `claude-code-telegram-integration.md`로 문서화 (OS 기획 공유용)
- 2026-05-17: B 서브에이전트 v3 개선 — 도움말 응답 수정(`b-agent.v3.before-help-fix.2026-05-17.md` 백업), 성능 최적화(`b-agent.v3.before-performance-optimization.2026-05-17.md` 백업)
    - 성능 최적화 내용: fetch 검증을 [#AI·](app://obsidian.md/index.html#AI%C2%B7)[#작가](app://obsidian.md/index.html#%EC%9E%91%EA%B0%80) 메모 및 원문 300자 이상에만 선택 적용, 텔레그램 응답 2~3문장 이내 단축, 교차 제안 신뢰도 임계값 80% 이상으로 강화
- 2026-05-17: `start-claude-tg.ps1` 작성 — 로그 기록 + profile 로드 + `claude-tg` 명령 실행
- 2026-05-17: `check_bom.ps1` 작성 — .env 파일의 BOM 유무 확인 (토큰 인식 오류 디버깅용)
- 2026-05-17 18:38: `start-claude-tg.ps1` 첫 실행 확인 (`claude-tg-autostart.log` 기록)

### 공유할만한 인사이트

1. 하나의 AI에게 의존하면 디버깅 지옥에 갇혀서 시간을 버릴 수 있다.
2. 채팅방을 바꿀 경우 생각보다 이전 채팅방 정보를 온전히 가져오지 못해서 시간을 버릴 수 있다.

 - Claude Code `--channels` 플래그는 매 실행마다 붙여야 함. `settings.json`으로 영구 설정 불가
> - 봇 토큰을 스크린샷에 포함시키는 실수가 발생하기 쉬움 → 공유 전 가리기 습관화 필요
> - `--channels` 서버는 인터랙티브 서버라 다른 Claude 세션의 백그라운드 Bash로 띄울 수 없음 → PowerShell 창 직접 열어야 함
> - B 서브에이전트 성능: "저장 먼저, 설명 나중" 원칙 적용하면 체감 속도 크게 향상됨
> - 학습자 원본 본문 보존(한 글자도 변형 금지)을 위해 저장 후 fetch 재조회로 1:1 비교하는 패턴이 데이터 무결성에 효과적

---
## 미션2: SNS 작성

- [https://www.instagram.com/stories/lim_bell1224/3898286555772801985?utm_source=ig_story_item_share&igsh=b2U0Y2ZsdzU2bXZo](https://www.instagram.com/stories/lim_bell1224/3898286555772801985?utm_source=ig_story_item_share&igsh=b2U0Y2ZsdzU2bXZo)

---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

> [!ai]- 🗑 분류 불명 — 2026-05-11~17 세션에서 미션과 매칭되지 않은 작업
> 미션 키워드와 매칭이 약해서 자동 분류에서 뺀 항목입니다.
> 보고 어느 미션으로 옮길지 / 무시할지 본인이 판단해주세요.
>
> - 2026-05-17: `check_bom.ps1` 작성 — .env UTF-8 BOM 확인용 디버깅 스크립트 (이유: OS 구현 인프라 작업이나 미션1 주제어 직결보다 보조 디버깅 성격이 강함 — 미션1 포함 여부 본인 판단)
> - 2026-05-16: `CLAUDE.md` (sponge_Telegram) 작성 — 메인 세션 라우팅 규칙 정의 (이유: OS 설계 문서이므로 미션1에 포함 가능하나 별도 판단 필요)
