---
team: 4조
member: 달빛그린
role: 조원
week: 5
submitted: true
---

# 5주차 과제 — 달빛그린

## 미션1: JY Creator Board — 텔레그램 봇 + 웹앱으로 캡처 아카이브 자동화

### Summary
3주차에 만든 JY Creator DB(이미지 올리면 분석해주는 웹앱)에서 한 단계 나아가, **텔레그램으로 캡처를 보내면 자동 분석 + GitHub 저장 + 웹에서 열람**까지 되는 시스템을 만들었다.

**프로덕트 URL**: https://jycreatboard.vercel.app
**GitHub**: https://github.com/sylvia049/jycreatboard

### 최종 구현 결과물

- **텔레그램 봇**: 이미지를 보내면 GPT-4o mini가 핵심 인사이트 추출 후 자동 저장
- **웹 UI**: 저장된 캡처를 카드 형태로 열람, 수정, 삭제 가능
- **웹 업로드**: 텔레그램 없이 웹에서 직접 이미지 업로드 → GitHub 자동 저장
- **저장소**: GitHub `jy-captures` repo를 DB로 활용
- **스택**: Vanilla JS + HTML/CSS (index.html 단일 파일) + Vercel Serverless Functions (Node.js) + GPT-4o mini + Telegram Bot API + GitHub API

```
핵심 구조:
api/
  analyze.js    # 웹 업로드 분석 (GPT-4o mini)
  telegram.js   # 텔레그램 봇 핸들러
  captures.js   # GitHub에서 캡처 목록 조회
  manage.js     # 수정/삭제/웹업로드 GitHub 저장
  image.js      # 이미지 프록시
public/
  index.html    # 메인 UI (전체 앱)
```

### 과정 (타임라인별 + 삽질)

**Initial commit — JY Creator Board**
- 3주차 웹앱(jycreatordb)에서 확장: 텔레그램 봇 + GitHub 저장소 연동 구조 설계
- Vercel Serverless + Telegram Webhook 기본 연결

**AI 모델 스위칭 삽질**
- Claude Haiku → OpenAI GPT-4o mini → Claude Haiku → GPT-4o mini로 4번 전환
- 이유: 이미지 85토큰 고정 비용에서 GPT-4o mini가 더 저렴하고 빠름
- `ANTHROPIC_API_KEY`는 환경변수에 남겨두고 `OPENAI_API_KEY`로 전환

**"分析" 한자 오타 전체 수정**
- index.html, analyze.js, telegram.js 전체에서 한자가 섞인 오타 발견 → 일괄 수정

**웹 업로드 → GitHub 자동 저장 구현**
- 웹에서 올린 이미지도 GitHub `jy-captures` repo에 자동 저장되도록 manage.js 확장

**UX 개선**
- JY DB 로고 클릭 → 전체 탭으로 이동
- 모바일 탭 터치 스크롤 개선
- nav-brand 클릭 커서 추가

**미디어 그룹(여러 장 동시 전송) 삽질 — 끝까지 미해결**
- Telegram은 여러 장을 보내면 N개의 별도 웹훅으로 전송 → Vercel 함수도 각각 별도 인스턴스 실행
- 시도한 방법들:
  1. 파일별 pending 시스템 → 실패
  2. GitHub 락 파일(acquireLock) → 실패
  3. TTL 기반 락(60초) → 실패
  4. 단일 JSON 배열 + SHA 원자적 업데이트 → 실패
  5. Telegram에 즉시 200 응답 후 백그라운드 처리 → 테스트 중
- 현재까지 1장만 처리되는 문제 미해결

### 공유할만한 인사이트

- **GitHub을 DB로 쓰는 건 강력하지만 한계가 있다**: 동시성 문제(미디어 그룹)가 발생했을 때 진짜 DB(Vercel KV 같은 Redis)였다면 원자적 조작으로 바로 해결됐을 것. 무료 스택의 trade-off를 직접 경험했다.
- **모델 선택은 비용으로 시작하라**: Claude vs GPT 논쟁보다 "이미지 1장당 얼마냐"가 프로덕트 지속 가능성의 핵심이었다. 기술적 우열보다 비용 구조가 먼저다.
- **삽질 기록이 곧 설계 문서다**: 5가지 방법을 시도하면서 왜 안 됐는지 기록했더니, 다음에 Vercel KV로 전환할 때 뭘 바꿔야 하는지 이미 보인다.

---

## 미션2: 내가 적용한 하네스 + 오케스트레이션 — Telegram → AI → GitHub 파이프라인

### Summary
JY Creator Board를 만들면서 텔레그램 봇이 트리거가 되고, AI가 처리하고, GitHub이 저장소가 되는 오케스트레이션을 직접 설계하고 적용했다.

### 최종 구현 결과물

**하네스 (Harness)**
> "Claude/GPT가 내 캡처 컨텍스트에서 동작하도록 세팅한 환경 전체"

- 환경변수 관리: `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `GITHUB_TOKEN` → Vercel Production 환경변수로 격리
- 시스템 프롬프트: 투자/세미나/SNS 카테고리 분류 기준 정의, 핵심 인사이트 추출 형식 고정
- 이미지 전처리: 분석용 512px 압축 / 저장용 2048px 분리 (비용 vs 화질 trade-off)
- Spending Limit 설정으로 비용 제어

**오케스트레이션 (Orchestration)**

```
📱 텔레그램에서 캡처 사진 전송
    ↓ (Webhook → Vercel Serverless)
🤖 telegram.js — 이미지 수신 + 즉시 200 응답
    ↓ (백그라운드 처리)
🧠 GPT-4o mini — 512px 이미지로 인사이트 추출
    ↓
💾 GitHub API — jy-captures repo에 원본(2048px) + 분석 결과 저장
    ↓
🌐 웹 UI — captures.js로 GitHub에서 조회 → 카드 렌더링
```

### 과정 (타임라인별 + 삽질)
- 처음엔 Telegram → 즉시 분석 → 응답의 단순 구조로 시작
- 5초 타임아웃 문제 발생 → 즉시 200 응답 후 백그라운드 처리로 재설계
- GitHub 저장을 동기로 처리하다 미디어 그룹 충돌 → 비동기 + 락 시스템 시도

### 공유할만한 인사이트
- **오케스트레이션은 "타임아웃과의 싸움"이다**: 웹훅 5초 제한 안에 응답하고 실제 처리는 백그라운드로 넘기는 구조를 배웠다
- **하네스의 핵심은 환경변수 격리**: API 키, 토큰을 코드에서 분리하니 모델 교체(Claude↔GPT)가 환경변수 1개 변경으로 끝났다

---

## 미션3: <제목>

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
