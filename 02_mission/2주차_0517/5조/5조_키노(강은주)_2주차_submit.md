---
team: 5조
member: 키노(강은주)
role: 부조장
week: 2
submitted: true
---

# 2주차 과제 — 키노(강은주)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

**OS 인터뷰**로 시작해서 나만의 운영 시스템 첫 번째 부품으로 만든 웹앱 **KENO-FLOW**.  
"나는 오늘 경험한 인사이트만 넣으면, 시스템이 분석하고 방향을 제안하고 콘텐츠까지 준비해둔다."


**페르소나**
- 🏃 ㅇㅇ강사 — 수업 기록, 클라이언트 관리
- 🤖 ㅇㅇ강사 — 수업 기록, 그룹별 커리큘럼 흐름

**기술 스택**
- 프레임워크: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- AI: Google Gemini 2.5 Flash Lite
- 저장소: Notion (인사이트/태스크), Google Sheets (운동기록/수업기록)
- 캘린더: Google Calendar API
- 배포: GitHub → Vercel

### 최종 구현 결과물

| 기능                | 설명                                      |
| ----------------- | --------------------------------------- |
| 주간 캘린더            | Google Calendar 연동, 날짜 클릭 → 일정 추가       |
| Eisenhower 태스크 보드 | AI가 할 일을 지금바로/계획/빠르게/제거 자동 분류           |
| 인사이트 사이드바         | 입력 → AI 분석 → Notion 저장 → 콘텐츠 초안 생성      |
| 콘텐츠 초안 페이지        | 인스타/블로그 초안 독립 생성 (/content)             |
| 페르소나 설정 시트        | Google Sheets에서 AI 프롬프트 직접 편집           |
| 전체 기록 페이지         | 인사이트 히스토리 (/history)                    |

### 과정 (타임라인별 + 삽질)

**1단계 — AI 모델 선택**

삽질: Gemini 2.0-flash, 2.0-flash-lite → 둘 다 할당량 0으로 quota 초과 오류

```
Error: quota exceeded
```

해결: `gemini-2.5-flash-lite` 로 변경. 이 모델은 할당량 있었음.

---

**2단계 — Notion SDK 버전 문제**

삽질: Notion 공식 SDK(`@notionhq/client`)로 DB 쿼리 시도했는데 `databases.query` 메서드가 없다는 오류 발생.

```
TypeError: client.databases.query is not a function
```

SDK 버전이 오래돼서 최신 API 메서드가 없었음. `databases.update`도 마찬가지로 properties 무시됨.

해결: SDK 버전 올리는 대신 **fetch로 직접 REST API 호출**로 전환.

```typescript
// SDK 대신 이렇게:
await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
  headers: { "Authorization": `Bearer ${NOTION_API_KEY}`, ... }
})
```

---

**3단계 — Google OAuth 계정 분리**

구글 계정이 여러 개 필요했음.


삽질: OAuth 스크립트가 같은 포트(4000) 하나만 있어서 두 번째 계정 토큰을 발급할 수가 없었음.

해결: 계정마다 다른 포트의 스크립트 작성.
- `get-google-token.mjs` → 포트 4000 (Calendar)
- `get-sheets-token.mjs` → 포트 4001 (Sheets)
- `get-persona-token.mjs` → 포트 4003 (페르소나)

삽질 2: kangart16 계정으로 Calendar 인증 시 "앱이 차단되었습니다 (Access blocked)" 오류.

해결: Google Cloud Console → OAuth 동의 화면 → 테스트 사용자에 kangart16@gmail.com 추가.

삽질 3: 포트 4000이 이미 사용 중 (EADDRINUSE).

해결:
```powershell
Get-NetTCPConnection -LocalPort 4000
Stop-Process -Id [PID] -Force
```

---

**4단계 — Google Calendar 토큰 만료**

삽질: 처음엔 캘린더 잘 됐는데 며칠 후부터 안 보임.

원인: Google OAuth 앱이 **테스트 모드**일 때 refresh token이 **7일마다 만료**됨.

해결: `node scripts/get-google-token.mjs` 재실행해서 새 토큰 발급.

근본 해결: Google Cloud Console에서 앱을 **프로덕션으로 게시**하면 토큰 만료 없음. (OAuth 동의 화면 → PUBLISH APP)

---

**5단계 — React 타입 오류**

삽질: 폼 이벤트 타입 오류.

```
Error: 'FormEvent' is deprecated
```

해결: `React.FormEvent` → `React.SyntheticEvent` 로 변경.

---

**6단계 — Google Sheets 범위 제한**

삽질: `getRows` 함수가 `A1:F100` 고정 범위라서 컬럼이 6개 넘는 시트는 데이터 누락.

해결: 범위를 `A1:Z500`으로 확장.

---

**7단계 — 페르소나 설정 시트 자동 초기화**

요구사항: AI 프롬프트(지침)를 코드 수정 없이 Google Sheets에서 직접 편집하고 싶음.

구현:
1. 앱 최초 실행 시 페르소나 시트에 페르소나별 탭 자동 생성
2. 기본 프롬프트 자동 입력
3. 5분 캐시 → 셀 수정 후 5분 내 자동 반영


---

**8단계 — Vercel 배포**

순서:
1. GitHub 레포 생성 (ieum16/Keno-flow)
2. `git remote add origin` + commit + push
3. Vercel CLI 설치 (`npm install -g vercel`)
4. `vercel login` → 브라우저 인증
5. `vercel link` → 프로젝트 연결
6. `vercel env add` × 10개 환경변수 등록
7. `vercel --prod` → 배포 완료

삽질: 환경변수를 Vercel 웹 UI에서 하나씩 입력하려 했는데 번거로움.

해결: CLI로 스크립트화해서 한 번에 처리.

```powershell
echo $value | vercel env add KEY_NAME production
```

### 공유할만한 인사이트

- **AI 모델 할당량 미리 확인**: Google AI Studio에서 모델별 할당량을 사전에 체크해야 함. 모델명이 비슷해도 할당량은 다름.
- **SDK가 항상 최신 API를 지원하지 않음**: SDK 오류 나면 REST 직접 호출이 더 안전한 경우가 있음.
- **OAuth 테스트 모드 주의**: Google OAuth 앱 테스트 모드에서는 refresh token이 7일마다 만료됨. 프로덕션 게시로 해결.
- **Vercel 환경변수는 CLI로**: 10개 이상 환경변수는 웹 UI보다 CLI 스크립트가 훨씬 빠름.

---

## 미션2: SNS 작성

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
