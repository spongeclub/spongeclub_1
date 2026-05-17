---
team: 4조
member: 다다
role: 조장
week: 2
submitted: true
---

# 2주차 과제 — 다다

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft 0510-0516` 실행됨 — 각 미션 헤더 위에 AI 초안 콜아웃이 생성됐습니다
> `dada-support` 폴더의 2026-05-10~05-16 클로드코드 작업을 기준으로 분류했습니다.
> 각 미션 헤더 위 콜아웃을 본문(`### Summary` 등)에 옮겨 다듬은 뒤, 콜아웃은 통째로 삭제 = 검토 완료.
> 분류 근거 아카이브: `99_meta/draft_archive/4조_다다_2주차_2026-05-17.md`

---

> [!ai]+ 🤖 미션1 초안 — 0510-0516 dada-support 세션에서 분류
> 아래 항목을 본문(`### Summary` 등)에 옮긴 뒤 본인 말투로 다듬어주세요.
> 정리 끝나면 이 콜아웃은 통째로 삭제 = 검토 완료.
>
> **Summary**
> 텔레그램으로 알림받는 개인 비서 봇("다다비서")을 세팅하고, 단방향 알림의 한계를 발견한 뒤 양방향 대화가 되는 Claude Code Channels 방식으로 전환을 준비했다.
>
> **최종 구현 결과물**
> - 텔레그램 OMC 알림 봇 `@tomost_dada_bot`(다다비서) — `~/.claude/.omc-config.json`에 봇 토큰·Chat ID(`6845260024`) 저장, 알림 이벤트: `session-end` / `ask-user-question`
> - `~/.zshrc` alias `claude='omc --telegram'` 추가 → 이후 Channels 전환을 위해 비활성화
> - Claude Code Channels 설치 사전준비 완료 — Bun v1.3.13 확인, 봇 토큰 보유
>
> **과정 (타임라인 + 삽질)**
> - 2026-05-10: `/oh-my-claudecode:configure-notifications` 스킬로 텔레그램 알림 설정 → `getMe`로 봇 토큰 검증(`@tomost_dada_bot`), `getUpdates`로 Chat ID 자동 조회(`6845260024`) → config 저장 + 테스트 메시지 발송 확인
> - 2026-05-10: 매번 `omc --telegram` 치기 번거로워 `~/.zshrc`에 `alias claude='omc --telegram'` 추가
> - 2026-05-10: "다다비서 채널에 물어봐도 답을 안 한다" → OMC 알림 봇은 **단방향 알림 전송기**임을 확인 (MCP = 대화 중 호출하는 도구 / Hook = 이벤트 발생 시 실행되는 스크립트, 봇은 메시지 수신함일 뿐 응답 로직이 없음)
> - 2026-05-15: 양방향 봇을 OMC 외 방법으로 찾던 중 `/oh-my-claudecode:configure-openclaw` 입력 → `Unknown command` 에러
> - 2026-05-15: hminn.xyz/selforge 사이트 리서치(WebFetch) + WebSearch → Selforge가 쓴 건 OMC가 아니라 Anthropic 공식 **Claude Code Channels** 플러그인임을 발견 (단방향 알림 ↔ 양방향 대화 차이 정리)
> - 2026-05-15: Channels 전환 준비 — `~/.zshrc` alias 비활성화(Edit), Bun 설치 확인 → v1.3.13
> - 2026-05-15: 일반 zsh 터미널에서 `/obsidian-cli` 입력 → `no such file or directory` 에러. 슬래시 명령은 Claude Code 세션 안에서만 동작함을 확인
>
> **공유할만한 인사이트**
> - 텔레그램 "봇"은 AI가 아니라 메시지 계정일 뿐 — 봇 뒤에 응답 로직(서버/Claude)이 있어야 대화가 된다
> - OMC 알림(hook 기반·단방향·무료)과 Claude Code Channels(메시지 수신 트리거·양방향·구독 내 포함)는 용도가 다른 별개 시스템 — 둘 다 같이 써도 된다
> - 슬래시 명령(`/...`)은 Claude Code 세션 안에서만 동작하고, 일반 터미널에서는 에러가 난다
>
> 📎 분류 근거: `dada-support` 폴더 = 다다의 개인 비서·자동화 시스템 구축 작업. 미션1 "각자만의 정의로 OS 구현"에 **주제 매칭**(개인용 텔레그램 비서 = 본인이 정의하는 OS의 인터페이스). 키워드 직매칭이 아닌 주제 매칭이라 사실 확인 권장.

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

텔레그렘으로 인풋을 넣고 

### 최종 구현 결과물
![](attachments/Pasted%20image%2020260517184917.png)
![](attachments/Pasted%20image%2020260517184912.png)

### 과정 (타임라인별 + 삽질)

처음에 연결을 잘 못했는지, 대화가 안되고 일방적인 입력만 되었음 
맥북이 켜져있고, 터미널에 클로드가 켜져있어야만 실행되는데..
이제 맥북이 켜져있기만 해도,아침 8시 브리핑이 온다고 하는데 내일 되어바야 알겠음


### 공유할만한 인사이트
음성메시지로 입력하는 것 굿 whisper 
구글캘린더 일정 등록되는 것 굿 --> 아직 테스트중 
연달아 하는 작업이 있다면, 그걸 연결하는 
미팅이 있어 이런내용으로 미팅 초안 만들어줘 
![](attachments/Pasted%20image%2020260517191555.png)
![](attachments/Pasted%20image%2020260517191607.png)
---

> [!ai]+ 🤖 미션2 초안 — 해당 작업 없음
> 0510-0516 `dada-support` 세션에서 미션2(SNS 작성)에 매칭되는 작업을 찾지 못했어요.
> 다른 도구로 작업했거나 아직 미진행일 수 있습니다. 직접 채워주세요.

## 미션2: SNS 작성

### Summary
https://www.linkedin.com/posts/%EB%8B%A4%EC%86%94-%EA%B9%80-5327a6228_swmudutfmtmmrvp-share-7461310724385087489---F7?utm_source=share&utm_medium=member_desktop&rcm=ACoAADkR6XYBTz4spo-25-hHEuScAgZ4wzNykQo

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

> [!ai]+ 🤖 미션3 초안 — 이번 주 미사용
> 미션3은 노트에 "(이번 주 미사용)"으로 표시돼 있어요. 채울 내용이 없으면 이 콜아웃과 미션3 섹션을 그대로 두거나 지워주세요.

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
