# Slack 데이터 수집 인수인계 가이드

> 2026-05-15 작성 · 담당자 인수인계용
>
> 스폰지클럽 1기 미션 보드(`06_unit/데굴데굴`)에서 Slack 데이터를 가져와 표시하기 위한 작업 진행 상황과 다음 단계.

---

## 1. 큰 그림

확정된 아키텍처 (`주차별_미션_게시판_초안.md` §4.2):

```
[Slack]
  │ Events API (message_posted)
  ▼
[Vercel API Route: /api/slack/events]
  │ 채널 필터링 + 저장
  ▼
[Supabase Postgres: slack_messages 테이블]
  │
  │ 일 2회 GitHub Actions
  ▼
[Graphify 분류] → 주차 매칭 + 관련도 0~100점 + 해시태그
  │ (≥70점만 노출)
  ▼
[MissionDiscussion 컴포넌트] ← Supabase 클라이언트
```

### 수집 대상 채널 (`운영진_공유안.md` §6.4)

| 채널 | 용도 | 사이트 노출 위치 |
|------|------|-----------------|
| `#0-공지사항` | 공지사항 배너 | 홈 상단 배너 |
| 각 조별 채널 (1~6조) | 주차 미션 질문/공유 | 미션 토론 카드 |
| `#0-무지성질문아무나답변` | 질문 | 미션 토론 카드 |
| `#0-아무말대잔치` | 공유 | 미션 토론 카드 |
| `#a유닛-이기적인스킬러들-에밀리` | 스킬·도구 인사이트 | 스킬 페이지 |

> 비공개 채널은 없음 (확인됨, 2026-05-15)

---

## 2. 진행 완료 — Slack App 생성 + 데이터 fetch 검증

### 2.1 Slack App 생성

- https://api.slack.com/apps 에서 **Create New App** → **From scratch**
- App Name: `Sponge Mission Board` (또는 운영진과 협의)
- Workspace: `w1777265456-oc0196728`
- **App Home** → "Display Name (Bot Name)" 반드시 입력 (안 입력하면 Slack에서 봇이 검색 안됨)

### 2.2 Bot Token Scopes (4개)

OAuth & Permissions → Scopes → Bot Token Scopes:

| Scope | 용도 |
|-------|------|
| `channels:history` | 공개 채널 메시지 읽기 |
| `channels:read` | 공개 채널 목록 조회 |
| `users:read` | 작성자 닉네임 조회 |
| `reactions:read` | 이모지 반응 카운트 |

> **Note**: scope를 나중에 추가하면 워크스페이스 재설치(admin 재승인)가 필요하므로, 처음에 한 번에 추가하는 게 좋습니다.

### 2.3 Workspace 설치 후 토큰 발급

- 좌측 메뉴 **Install App** → "Install to Workspace"
- 워크스페이스 admin 승인 정책에 따라 자동 설치 또는 요청 발생
- 설치 완료되면 **OAuth & Permissions** 페이지에 `Bot User OAuth Token` (`xoxb-...`) 노출됨

### 2.4 봇을 채널에 초대 (필수)

봇은 자기가 멤버로 속한 채널의 history만 읽을 수 있습니다.

```
/invite @봇이름
```

또는: 채널명 클릭 → **Integrations** 탭 → **Add an App**

---

## 3. 테스트 스크립트: `web/scripts/test-slack-fetch.mjs`

미션 보드 레포의 `06_unit/데굴데굴/web/scripts/test-slack-fetch.mjs` — Bot 토큰으로 채널 목록/메시지/쓰레드 답글을 빠르게 확인할 수 있는 검증용 스크립트.

### 3.1 사용법

```bash
cd 06_unit/데굴데굴/web
export SLACK_TOKEN="xoxb-..."

# (1) 봇이 접근 가능한 채널 목록
node scripts/test-slack-fetch.mjs

# (2) 특정 채널 메시지 (기본 10개)
node scripts/test-slack-fetch.mjs <channel_name_or_id>

# (3) 메시지 + 모든 쓰레드 답글
node scripts/test-slack-fetch.mjs <channel> --threads

# (4) 특정 쓰레드 답글만
node scripts/test-slack-fetch.mjs <channel> --thread <thread_ts>
```

### 3.2 환경변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `SLACK_TOKEN` | ✅ | Bot 또는 User OAuth Token (`xoxb-` / `xoxp-`) |
| `LIMIT` | – | 가져올 메시지 수 (기본 10, 최대 999) |

```bash
LIMIT=200 node scripts/test-slack-fetch.mjs C0B25LQE01W
```

### 3.3 출력 예시

```
[2026-05-13 19:24] U0123ABC (ts=1747158284.123456)
  과제 어떻게 시작해야 할지 막막한 분들 참고하세요...
  💬3 +1×2 fire×1
```

- `[시간] 작성자 ID (ts=메시지타임스탬프)`
- `💬N` = 쓰레드 답글 N개
- `이모지×N` = 해당 이모지로 N명 반응

`--threads` 옵션 사용 시 답글 들여쓰기 표시:

```
[2026-05-13 19:24] U0123ABC (ts=1747158284.123456)
  부모 메시지 내용
  💬3 +1×2
    --- 쓰레드 ---
    ↳ [2026-05-13 19:30] U0456DEF (ts=1747158600.000200)
      답글1 내용

    ↳ [2026-05-13 19:35] U0789GHI (ts=1747158900.000300)
      답글2 내용
```

---

## 4. 검증된 동작 (2026-05-15)

테스트 채널 `C0B25LQE01W`에서 46개 메시지 fetch 성공. 확인된 항목:

- ✅ **메시지 본문** 가져오기 (`conversations.history`)
- ✅ **표준 이모지 반응** (`fire`, `+1`, `heart_eyes`, `saluting_face` 등)
- ✅ **워크스페이스 커스텀 이모지** — `galia`, `율리아`, `치코`, `코니`, `sponge`, `거북이의꿈` 등 멤버 닉네임으로 만든 커스텀 이모지가 그대로 반환됨
- ✅ **쓰레드 답글 수** (`reply_count`)
- ✅ **쓰레드 본문** (`conversations.replies`)

### 흥미로운 발견 — 커스텀 이모지 = 멤버 시그니처

스폰지클럽 워크스페이스의 멤버들이 자기 닉네임으로 커스텀 이모지를 등록해두고 서로 반응 도구로 쓰고 있음. 즉, 메시지에 `:율리아:` 이모지가 1개 달려 있으면 "율리아가 봤다/반응했다"는 신호로 해석 가능. **누가 반응했는지를 reactions 카운트만으로 추정할 수 있는 유의미한 신호**.

→ 활용 아이디어: 미션 게시판 카드에 "👁 율리아·치코·코니가 봄" 같은 표시 가능

---

## 5. 남은 작업 (다음 담당자 진행)

### 5.1 봇을 실제 운영 채널에 모두 초대

위 §1 표의 채널 전부:
- `#0-공지사항`
- `#0-무지성질문아무나답변`
- `#0-아무말대잔치`
- `#a유닛-이기적인스킬러들-에밀리`
- 1조 ~ 6조 채널

### 5.2 Supabase 프로젝트 셋업

`주차별_미션_게시판_초안.md` §4.2 기준. 자유 tier 가능.

권장 테이블 스키마 (`slack_messages`):

| 컬럼 | 타입 | 비고 |
|------|------|------|
| `id` | uuid PK | – |
| `slack_ts` | text | Slack 메시지 ts (unique per channel) |
| `channel_id` | text | `C...` |
| `channel_name` | text | `#0-공지사항` |
| `author_id` | text | Slack user ID |
| `author_nickname` | text | `users.info`로 resolve |
| `text` | text | 메시지 본문 |
| `thread_ts` | text nullable | 답글이면 부모 ts |
| `reaction_count` | int | 총 반응 수 (분석용) |
| `reactions` | jsonb | `[{name, count}]` 원본 |
| `reply_count` | int | – |
| `category` | text nullable | `#질문` / `#노하우` / `#사이트` (Graphify가 채움) |
| `week_number` | int nullable | Graphify가 채움 |
| `relevance_score` | int nullable | 0~100 (Graphify가 채움, ≥70만 노출) |
| `is_approved` | boolean default false | v1 초반은 운영진 승인 |
| `created_at` | timestamptz default now() | – |

추가 인덱스: `(channel_id, slack_ts)` unique, `(week_number, is_approved)`.

### 5.3 Vercel API Route 구현

경로: `06_unit/데굴데굴/web/src/app/api/slack/events/route.ts`

처리해야 할 것:
1. Slack 서명 검증 (`SLACK_SIGNING_SECRET` 헤더 + body 해시) — Slack 공식 가이드 참고
2. URL verification challenge 처리 (Slack App 등록 시 첫 핸드셰이크)
3. `event.type === 'message'` && `event.channel_type === 'channel'` 필터링
4. 수집 대상 채널 화이트리스트 체크
5. Supabase에 upsert (slack_ts 기준)

Slack App에서 **Event Subscriptions** 활성화 → Request URL: `https://<배포URL>/api/slack/events` → `message.channels` 이벤트 구독.

### 5.4 Graphify 분류 파이프라인

GitHub Actions cron (일 2회, `0 0,12 * * *`):
- Supabase에서 미분류 메시지 조회
- Graphify로 카테고리·주차·관련도 산출
- 결과로 row 업데이트

### 5.5 MissionDiscussion 컴포넌트 실데이터 연동

현재 `web/src/data/discussions.ts` 하드코딩 mock → Supabase 쿼리로 교체.

```sql
SELECT * FROM slack_messages
WHERE week_number = $1
  AND relevance_score >= 70
  AND is_approved = true
ORDER BY created_at DESC;
```

필터 탭(전체/질문/노하우/사이트)에 따라 `category` WHERE 절 추가.

---

## 6. 환경변수 정리 (Vercel에 등록 필요)

| 변수 | 어디서 발급 | 용도 |
|------|------------|------|
| `SLACK_BOT_TOKEN` | api.slack.com → OAuth | Slack Web API 호출 |
| `SLACK_SIGNING_SECRET` | api.slack.com → Basic Info | Event payload 서명 검증 |
| `SUPABASE_URL` | Supabase 프로젝트 설정 | DB endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API Keys | 서버 사이드 쓰기용 (절대 클라이언트 노출 금지) |
| `SUPABASE_ANON_KEY` | Supabase API Keys | 클라이언트 사이드 읽기용 |

`.env.local` 파일은 `.gitignore` 되어 있어 안전합니다.

---

## 7. 관련 파일 & 링크

- 설계 문서: `06_unit/데굴데굴/주차별_미션_게시판_초안.md`
- 운영진 공유안: `04_etc/` 내 운영진 공유안 (또는 별도 위치)
- 미션 보드 PR: https://github.com/spongeclub/spongeclub_1/pull/281
- Slack API 공식 docs: https://api.slack.com/methods
- Slack Events API: https://api.slack.com/apis/connections/events-api
- Supabase docs: https://supabase.com/docs

---

## 8. 미해결/논의 필요 항목

1. **Slack App admin 승인** — 현재 누가 admin인지, 봇 설치 가능한지 확인 필요
2. **수집 대상 채널 화이트리스트** — 어떤 채널까지 수집할지 (1조~6조 채널이 모두 public인지 재확인)
3. **PII 정책** — 작성자는 닉네임만 (본명·이메일·아바타 URL 저장 금지) → §4.3 참고
4. **v1 초반 승인 모드** — Slack 봇 메시지 ✅/❌ 버튼 vs admin 페이지에서 일괄 승인 (§4.3)
5. **6개 조 진척 데이터** — `spongeclub-homepage`와 어떻게 공유할지 (별도 작업, Slack과 무관)
