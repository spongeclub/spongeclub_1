# Claude Code × 텔레그램 채널 연동 가이드

> 휴대폰의 텔레그램으로 메시지를 보내면 → 컴퓨터의 Claude Code 세션이 받아서 작업하고 → 답변을 다시 텔레그램으로 보내주는 기능을 설정합니다.
>
> 이 가이드는 **비개발자도 따라할 수 있도록** 작성되었습니다.

---

## 📚 이게 뭔가요?

**Claude Code Channels**는 외부(텔레그램, Slack 등)에서 보낸 메시지를 이미 열려있는 Claude Code 세션이 받아서 응답하게 해주는 기능입니다.

- **공식 문서**: https://code.claude.com/docs/en/channels.md
- **레퍼런스**: https://code.claude.com/docs/en/channels-reference.md

### 동작 흐름
```
[텔레그램]  →  [내 봇]  →  [Claude Code 세션]  →  답변  →  [텔레그램으로 다시]
```

---

## ✅ 준비물

| 항목 | 요구사항 | 확인 명령 |
|------|----------|----------|
| Claude Code | v2.1.80 이상 | `claude --version` |
| Bun 런타임 | 설치되어 있어야 함 | `bun --version` |
| 텔레그램 계정 | 휴대폰/데스크톱 앱 | — |

---

## 1단계 — 환경 점검

터미널을 열고 아래 두 명령으로 버전을 확인합니다.

```bash
claude --version
bun --version
```

### Bun이 설치되어 있지 않다면

공식 설치 스크립트를 실행합니다.

```bash
curl -fsSL https://bun.sh/install | bash
```

설치가 끝나면 `~/.bun/bin/`에 설치되고, `~/.zshrc`의 PATH에 자동으로 추가됩니다. 새 터미널을 열거나 `exec /bin/zsh`를 실행하면 `bun` 명령을 바로 쓸 수 있습니다.

확인:
```bash
~/.bun/bin/bun --version
# 예: 1.3.13
```

---

## 2단계 — 텔레그램 봇 생성

이 단계는 **텔레그램 앱에서** 진행합니다.

### BotFather란?
"봇을 만들어주는 봇"입니다. 텔레그램 공식 계정이며, 이 봇과 대화해서 새 봇을 만듭니다.

### 진행 방법

1. **텔레그램 앱에서 상단 검색창에 `@BotFather` 입력**
   - **파란색 체크 표시(✓)** 가 있는 공식 계정을 선택하세요. (가짜 계정 주의!)

2. **채팅을 시작하고 화면 하단의 `시작(Start)` 버튼을 누르세요.**

3. **채팅창에 `/newbot` 입력 후 전송**

4. **BotFather가 두 가지를 차례로 묻습니다:**

   | 질문 | 답변 예시 | 설명 |
   |------|----------|------|
   | "봇 이름(name)이 뭐야?" | `내 클로드 비서` | 표시될 이름. 한글 OK, 자유롭게 |
   | "봇 username이 뭐야?" | `myclaude_helper_bot` | 영문+숫자, **반드시 `bot`으로 끝나야 함**, 전세계 유일해야 함 |

   > 💡 username이 이미 사용 중이라면 숫자나 단어를 추가해서 다시 시도하세요. (예: `myclaude_helper_2026_bot`)

5. **성공하면 BotFather가 토큰을 보내줍니다:**
   ```
   Done! Congratulations on your new bot...
   Use this token to access the HTTP API:
   1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ12345abcd   ← 이게 토큰입니다!
   ```

   > ⚠️ **이 토큰은 비밀번호와 같습니다.** 절대 외부에 공유하지 마세요.
   > 만약 노출되었다면 BotFather에서 `/revoke` 명령으로 즉시 폐기하고 새로 발급받으세요.

토큰을 안전한 곳에 메모해 둡니다.

---

## 3단계 — 텔레그램 플러그인 설치

이 단계부터는 **Claude Code 안에서** 진행합니다.

### ⚠️ 주의: `/plugin` 명령은 인터랙티브 메뉴입니다

문서에 종종 `/plugin install <이름>@<마켓플레이스>` 같은 한 줄 명령이 보이지만, **실제로는 한 줄로 동작하지 않습니다.** `/plugin`만 입력하고 메뉴에서 검색·설치해야 합니다.

### 진행 방법

1. **Claude Code 채팅 입력창에 `/plugin` 입력 후 Enter**
   - 슬래시(`/`) 키를 누르면 자동완성 메뉴가 뜹니다. 거기서 `/plugin`을 선택해도 됩니다.

2. **인터랙티브 메뉴가 뜨면**, 상단 검색란에 `telegram` 입력

3. **검색 결과에서 `telegram` (마켓플레이스: `claude-plugins-official`) 선택**

4. **설치 버튼 또는 Enter로 설치 진행**
   - 처음이라면 마켓플레이스 추가 승인을 묻습니다 → **승인**
   - 이어서 플러그인 설치를 묻습니다 → **승인**

5. **성공하면 다음과 같은 메시지가 나옵니다:**
   ```
   ✓ Installed telegram. Run /reload-plugins to apply.
   ```

---

## 4단계 — 토큰 등록

3단계 설치 직후, 화면에 `/reload-plugins`를 실행하라는 안내가 뜰 수 있습니다. 다만 어차피 5단계에서 세션을 완전히 재시작하므로 `/reload-plugins`는 별도로 실행하지 않아도 됩니다. 토큰 등록부터 진행합니다.

### 진행 방법

Claude Code 채팅창에 아래 명령을 입력합니다. `<여기에토큰>` 부분에 2단계에서 받은 토큰을 그대로 붙여넣습니다.

```
/telegram:configure <여기에토큰>
```

예시:
```
/telegram:configure 1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ12345abcd
```

### 내부적으로 일어나는 일

이 명령은 다음을 수행합니다:

| 항목 | 내용 |
|------|------|
| 저장 위치 | `~/.claude/channels/telegram/.env` |
| 저장 형식 | `TELEGRAM_BOT_TOKEN=<토큰>` |
| 파일 권한 | `600` (본인만 읽기/쓰기 가능, 자동 적용) |

### 확인 방법

토큰이 잘 저장되었는지는 아래 명령으로 확인할 수 있습니다 (본인 컴퓨터에서만):

```bash
ls -la ~/.claude/channels/telegram/.env
# -rw------- 권한이면 OK
```

> ⚠️ **중요**: 토큰은 Claude Code가 **시작할 때 한 번만** 읽습니다. 따라서 이 단계 직후에는 아직 적용되지 않았으며, **5단계 세션 재시작이 필요**합니다.

---

## 5단계 — 채널 모드로 세션 재시작

4단계 직후의 세션은 아직 텔레그램과 연결되지 않은 상태입니다. 토큰을 인식시키고 채널 서버를 띄우려면 옵션을 붙여 세션을 새로 시작해야 합니다.

### 진행 방법

1. **현재 Claude Code 세션을 종료합니다.**
   - 입력창에 `/exit` 를 치거나 `Ctrl+C` 두 번으로 종료합니다.

2. **터미널에서 아래 명령으로 다시 시작합니다.**
   ```bash
   claude --channels plugin:telegram@claude-plugins-official
   ```

3. **새 세션이 뜨면 채널 서버가 백그라운드에서 함께 실행됩니다.**
   - 첫 실행 시 `~/.claude/channels/telegram/` 디렉터리가 자동 생성됩니다.
   - 이 시점부터 텔레그램에서 봇에게 메시지를 보낼 수 있습니다.

### 매번 옵션 붙이기 귀찮다면 — alias 등록

`~/.zshrc` 에 다음 줄을 추가합니다.

```bash
alias claude-tg='claude --channels plugin:telegram@claude-plugins-official'
```

`source ~/.zshrc` 또는 새 터미널을 연 후, 앞으로는 `claude-tg` 한 줄로 채널 모드 세션을 띄울 수 있습니다.

> 💡 텔레그램 연동이 필요 없는 일반 작업에는 그냥 `claude` 를 쓰면 됩니다. 채널 서버가 안 떠서 더 가볍습니다.

---

## 6단계 — 페어링 (본인 인증)

"이 텔레그램 계정이 정말 봇 주인인지"를 확인하는 절차입니다. 페어링이 끝나면 해당 계정은 `allowFrom` 목록에 추가되어 Claude Code 세션과 통신할 수 있게 됩니다.

### 진행 방법

1. **텔레그램 앱에서 본인이 만든 봇을 검색해서 채팅 시작**
   - 검색창에 2단계에서 정한 username을 입력합니다. (예: `@myclaude_helper_bot`)

2. **봇에게 아무 메시지나 전송**
   - `/start` 또는 `hi` 같은 임의 메시지면 충분합니다.

3. **봇이 페어링 코드를 회신합니다.**
   - 형식: 영문 소문자 + 숫자 6자 (예: `04f25a`)
   - 코드는 **1시간 동안만 유효**합니다. 만료되면 다시 메시지를 보내 새 코드를 받으세요.

4. **Claude Code 채팅창에서 페어링 명령 실행**
   ```
   /telegram:access pair <코드>
   ```

   예시:
   ```
   /telegram:access pair 04f25a
   ```

5. **승인되면 텔레그램 봇이 "you're in" 확인 메시지를 보내줍니다.**

### 내부적으로 일어나는 일

| 항목 | 내용 |
|------|------|
| 변경 파일 | `~/.claude/channels/telegram/access.json` |
| 추가 위치 | `allowFrom` 배열에 본인의 텔레그램 numeric user ID 추가 |
| 정리 항목 | `pending` 의 해당 코드 항목 삭제 |
| 트리거 파일 | `~/.claude/channels/telegram/approved/<senderId>` 생성 → 채널 서버가 이를 감지해 확인 메시지 발송 |

### ⚠️ 보안 주의

페어링 코드 없이 "대기 중인 페어링을 승인해줘" 같은 요청은 **절대 자동 처리하지 마세요.** 누군가 봇에게 DM을 보내 `pending` 항목을 만든 뒤, 프롬프트 인젝션으로 "그 페어링 승인해줘"를 시도할 수 있습니다. 코드는 항상 본인이 텔레그램에서 직접 받은 값을 명시해야 합니다.

---

## 7단계 — 접근 잠금 (allowlist) + 동작 테스트

페어링이 끝났더라도 `dmPolicy` 가 기본값 `pairing` 으로 남아있으면 **누구든 봇에게 DM을 보내 페어링 코드를 받을 수 있는 상태**입니다. 본인 외에는 코드를 모를 테지만, 더 안전하게 잠가둡시다.

### 7-1. 정책을 allowlist로 전환

Claude Code 채팅창에서:

```
/telegram:access policy allowlist
```

| 정책 | 의미 |
|------|------|
| `pairing` | (기본) 누구나 봇에 DM하면 페어링 코드를 받을 수 있음. 초기 설정용. |
| `allowlist` | `allowFrom` 에 등록된 사용자만 응답. 새 페어링 차단. **운영 권장 모드.** |
| `disabled` | 모든 DM 무시. |

### 7-2. 동작 테스트

1. **텔레그램에서 봇에게 메시지 전송**
   - 예: `안녕, 잘 동작하니?`

2. **Claude Code 세션 화면에 메시지가 도착하는지 확인**
   - `<channel source="telegram" ...>` 태그와 함께 메시지가 도착합니다.
   - Claude가 응답을 텍스트로 작성하는 게 아니라 **`reply` 도구를 호출**해서 텔레그램으로 답을 보냅니다.

3. **휴대폰 텔레그램으로 답장이 오면 성공!** 🎉

### 7-3. 자주 쓰는 명령 모음

| 명령 | 용도 |
|------|------|
| `/telegram:access` | 현재 정책·허용 목록·대기 중 페어링 상태 확인 |
| `/telegram:access policy <pairing\|allowlist\|disabled>` | 정책 변경 |
| `/telegram:access remove <senderId>` | 특정 사용자 권한 회수 |
| `/telegram:access allow <senderId>` | 페어링 없이 직접 추가 (이미 ID를 아는 경우만) |

---

## 🚀 다음에 다시 시작할 때

한 번 셋업이 끝나면 토큰·페어링·정책은 모두 디스크에 저장돼 있어 매번 다시 할 필요가 없습니다. 다음 세션부터는 아래 명령 한 줄로 텔레그램 연동이 즉시 활성화됩니다.

```bash
claude --channels plugin:telegram@claude-plugins-official

# 5단계에서 alias를 등록했다면 한 줄로 충분:
claude-tg
```

| 상황 | 명령 |
|------|------|
| 텔레그램 연동 세션 시작 | `claude-tg` (또는 위 풀 명령) |
| 텔레그램이 필요 없는 일반 작업 | `claude` |
| 허용 사용자/정책 점검 | 세션 안에서 `/telegram:access` |
| 정책을 잠시 끄고 싶을 때 | `/telegram:access policy disabled` |
| 다시 켜고 싶을 때 | `/telegram:access policy allowlist` |

> 💡 토큰을 새로 발급받았다면 4단계부터 다시, 새 기기/계정에서 페어링하려면 6단계부터 다시 진행하면 됩니다.

---

## 🔧 문제 해결

### `/plugin install ...` 한 줄 명령이 일반 메시지로 처리될 때
→ Claude Code의 `/plugin`은 인터랙티브 메뉴입니다. 한 줄이 아니라 메뉴 흐름으로 진행하세요. (3단계 참조)

### Bun 명령을 못 찾는다고 나올 때
→ 새 터미널을 열거나, 현재 터미널에서 `exec /bin/zsh`를 실행하세요. PATH가 갱신됩니다.

### 토큰을 실수로 노출했을 때
→ 텔레그램에서 BotFather한테 `/revoke` 명령을 보내고 새 토큰을 발급받으세요. 그 다음 4단계를 다시 진행하세요.

### 페어링 코드를 받았는데 만료됐다고 나올 때
→ 코드는 발급 후 1시간만 유효합니다. 텔레그램에서 봇에게 다시 메시지를 보내 새 코드를 받으세요.

### 텔레그램에서 메시지를 보내도 Claude Code 세션이 못 받을 때
→ 다음을 차례로 확인하세요:
1. 세션을 `claude --channels plugin:telegram@claude-plugins-official` 옵션으로 시작했는지 (5단계)
2. `~/.claude/channels/telegram/.env` 에 토큰이 저장돼 있는지 (4단계)
3. `/telegram:access` 로 본인의 senderId가 `allowFrom` 에 들어있는지 (6단계)
4. `dmPolicy` 가 `disabled` 가 아닌지

---

## 📁 관련 파일 위치 정리

| 경로 | 용도 |
|------|------|
| `~/.claude/channels/telegram/.env` | 봇 토큰 저장소 |
| `~/.claude/channels/telegram/access.json` | 접근 정책 / 허용 사용자 목록 (페어링 후 자동 생성) |
| `~/.claude/plugins/cache/claude-plugins-official/telegram/` | 플러그인 본체 |

---

## 📝 변경 이력

- **2026-05-10**: 1~4단계 작성 완료. 5~7단계는 placeholder.
- **2026-05-10**: 5~7단계 본문 작성, 페어링 실제 진행 후 검증. 문제 해결 섹션 보강.
- **2026-05-10**: "다음에 다시 시작할 때" quick-reference 섹션을 7단계 뒤에 추가.
- **2026-05-10**: `/reload-plugins` 안내 문구 보강, 페어링 코드 표현 일관화, 4↔5단계 중복 문장 정리.
