---
team: 4조
member: 리보
role: 조원
week: 2
submitted: true
mvp: true
mvp_reason: "Inbox-OS를 단순 분류기 → 멀티 소스 콘텐츠 분석기로 진화시킨 9가지 삽질 기록. Gemini 통합·메타데이터 우선 사용 같은 검증된 인사이트와 반복 진단 사이클이 두드러짐."
---

# 2주차 과제 — 리보

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary


> **inbox-os가 단순 "분류기"에서 "콘텐츠 풍부 분석기"로 진화한 하루.**

전날 기본 분류만 했던 시스템에:

- **Gemini 통합** → YouTube 챕터·토픽 자동 추출
- **책 사진 분석** → 책 제목·저자 메타 추출 + 이미지 vault 임베드
- **음악 콘텐츠 특화** → yt-dlp `categories=['Music']` + 댓글 트랙리스트 추출
- **옵시디언 풍부도 ↑** → wiki 링크 백링크, 클릭 가능한 timestamp

오늘만 **7개 commit** + **5번의 진단 사이클** + **9가지 삽질**을 거쳐 _"진짜 매일 쓸 만한 OS"_ 수준으로.

---



### 최종 구현 결과물
### ✅ 검증된 시나리오

- **폴리마켓 1시간 영상** → chapters 8개 + topics 26개
- **책 표지 사진** → 책 제목 + 저자 추출 + 이미지 임베드
- **15분 음악 영상** → 챕터 + 🎵 prefix
- **1시간 음악 플리** → 댓글 트랙리스트 + "음악스크랩" 카테고리

### 📊 누적 통계

- **commits**: 7개 (오늘만)
- **tests**: 116개 → 166개 (+50)
- **modules**: +2 신규, 6개 수정
### 🆕 신규 모듈

|모듈|역할|
|---|---|
|`gemini_client.py`|Gemini API 호출 (analyze_youtube, analyze_article_html) — google-genai 새 SDK|
|`product_search.py`|Brave Search 통합 (카드 대기 중, key 들어가면 활성화)|

### 🔧 수정된 모듈

| 모듈                   | 변경                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `url_fetcher.py`     | YouTube 4단계 cascade (native chapters → description → 음악 댓글 → Gemini → transcript fallback). yt-dlp categories 활용. 토큰 절약 우선. |
| `classifier.py`      | chapters/topics/video_id 전파. `category_hint` 강제 매핑 (음악 영상 emergent 우회)                                                      |
| `vault_writer.py`    | 이미지 `_attachments/` 복사 + 본문 임베드. 챕터를 clickable timestamp 마크다운으로. 토픽을 `[[wiki]]` 링크로. 책 제목 기반 slug.                          |
| `image_processor.py` | vision 프롬프트에 book metadata 추출 추가. `_extract_json` 헬퍼로 silent failure 버그 fix.                                                |
| `telegram_bot.py`    | PendingPhoto dataclass + InlineKeyboard + callback handler. 사진 keyboard로 카테고리·검색결과 선택.                                      |
### 과정 (타임라인별 + 삽질)
### 🌅 오전 — 통합 패치 설계

```
09:00  어제 시연 갭 정리 → 3가지 발견       1. 사진 → "개발문서"로 잘못 분류       2. YouTube playlist 분류 부정확       3. 롱블랙 본문 추출 안 됨09:30  Brave Search 카드 부재 → [C] 분리, [A][B]만 먼저10:00  Gemini API key 발급 (새 프로젝트)10:30  통합 패치 의뢰 → Claude Code 3가지 아키텍처 결정 prompt:        - Article fallback Playwright? → 제거 (단순성)        - 카테고리 직접입력? → 버튼 전용 (복잡도)        - Callback 상태? → in-memory (봇 재시작 드물)       → 모두 "단순성" 일관 선택
```

### ☀️ 낮 — 패치 + 첫 검증

```
11:00  TDD RED → 구현 → GREEN → commit b8e0fed       (Gemini 통합 + 사진 keyboard + chapters frontmatter)       12:00  chapters 본문 렌더링 + topics wiki 링크 follow-up       commit 2eb400c, 0c0d32f13:00  봇 재시작 → 첫 YouTube URL 테스트 → 😱 안 됨
```

### 🌆 오후 — 진단 폭풍 및 책 사진+음악 플리 사이클

```
🚨 삽질 #1: source_method=transcript only, chapters 없음            → 진단: google-generativeai 패키지 deprecated            → patch: migrate to google-genai (commit 632fab6)🚨 삽질 #2: 재시도 → 여전히 안 됨            → pip show google-genai → "not found"            → 패치는 코드만 바꿨고 pip install 안 됨            → pip install google-genai🚨 삽질 #3: gemini-1.5-flash → 404 Not Found            → 모델 리스트 조회 → 1.5-flash는 v1beta에 없음🚨 삽질 #4: gemini-2.0-flash → 429 quota exhausted (limit: 0)            → 무료 tier에서 2.0-flash 불가            → gemini-2.5-flash로 변경 → ✅ 성공15:00  폴리마켓 영상 → chapters 8개 정상 ✅       옵시디언에서 timestamp 클릭 → YouTube 점프 ✅       wiki 토픽 백링크 ✅
```

 — 책 사진 + 음악 플리 사이클

```
17:00  추가 테스트: 책 사진 → 😱 "capture-1" 일반 이름, 본문 빈 상태       음악 1시간 영상 → Gemini 토큰 한도 초과🚨 삽질 #5: 책 사진 ↔ 메타 없음            → patch: image_processor vision 프롬프트 강화 (commit d6cfaba)🚨 삽질 #6: 패치 후에도 책 메타 안 들어감            → 진단: image_processor.py의 bare except가 silent fail            → patch: _extract_json 헬퍼 추가 (commit ???)20:00  책 사진 재테스트 → "윌리엄 오닐의 이기는 투자" 추출 ✅       파일명도 책 제목 기반 ✅🚨 삽질 #7: 1시간+ 음악 → Gemini 토큰 한도            → patch: cascade 4단계 (Gemini 호출 최소화)🚨 삽질 #8: 음악 플리 → "영상스크랩"으로 분류 + 트랙리스트 없음            → 진단 (yt-dlp 직접 호출):              - categories=['Music'] 무시됨              - description에 트랙리스트 없음 (채널 연락처만)🚨 삽질 #9 (사용자 발견 ⭐):            "요즘 트랙리스트는 description이 아닌 댓글에 있어"            → patch: yt-dlp categories 활용 + 댓글 fetch + category_hint              (commit 169a379)22:00  음악 플리 재테스트 → 음악스크랩 카테고리 + 댓글 트랙리스트 ✅       🎉 모든 패치 검증 완료
```

### 공유할만한 인사이트*제미나이 모델차이
### 💡 1. 외부 SDK 변동성은 진짜 리스크

Google이 `google-generativeai` → `google.genai`로 갈아엎음. **LLM이 학습한 패치 시점의 SDK가 이미 deprecated**일 수 있음. 새 AI 프로젝트는 **SDK 안정성도 점검 항목**으로.

### 💡 2. `bare except`의 silent failure 함정

```
except Exception:    return "", {}
```

한 줄로 모든 에러를 삼킴. **디버그 불가능**. 명시적 except + 로깅이 정공법. **AI 시대 코드도 인간 코드와 동일한 디버깅 위생** 필요.

### 💡 3. 메타데이터 우선 사용 — Gemini는 fallback

음악 영상 listup은:

- 1순위: YouTube native chapters (무료)
- 2순위: description timestamp parse (무료)
- 3순위: 댓글 트랙리스트 (yt-dlp comments, 거의 무료)
- 4순위: Gemini (비용·시간)

→ **LLM이 답이 아니라 메타데이터가 답인 경우가 많다.** 비용·속도·정확도 모두 우월.

### 💡 4. 사용자 관찰력의 가치

_"요즘은 트랙리스트가 댓글에 있어"_ — 이 한 마디로 5번의 패치보다 더 정확한 방향 잡힘. **사용자가 실제 도메인 컨텍스트를 가장 잘 안다.** 코드 자동화 안에서도 사용자 인사이트가 핵심.

### 💡 5. 반복 진단 사이클의 힘

한 번에 안 풀려도 _"진단 → 가설 → 검증 → 좁히기"_ 반복하면 결국 풀림.  
오늘만:

- Gemini 안 됨 → SDK 문제 → 모델 문제 → quota 문제 → 4단계로 좁힘
- 책 사진 안 됨 → 코드 문제 → bare except 발견 → fix
- 음악 플리 안 됨 → categories 무시 + 댓글 데이터 → 두 갭 해결

→ **막힘 자체가 학습 자산.** 막힘 없는 빌드는 회고할 게 없음.

### 💡 6. 단순성 vs 강력함의 일관 선택

3번 아키텍처 결정 모두 _"단순한 쪽"_ 선택:

- Playwright vs Gemini raw HTML → Gemini만
- ConversationHandler vs 버튼 전용 → 버튼만
- SQLite 영속화 vs in-memory → in-memory

→ **1주 검증 단계에선 단순성이 미덕.** 진짜 갭 보이면 그때 보강. **over-engineering 안 하는 길.**

### 💡 7. TDD 정석의 가치

Claude Code의 superpowers:test-driven-development 스킬 사용:

```
RED (실패 확인) → 구현 → GREEN (통과) → 회귀 → commit
```

_"올바른 이유로 실패하는지"_ 검증이 fix 후 의미 있는 GREEN을 만든다. **단, TDD가 통과해도 production 시연에서 다른 식으로 깨질 수 있음**. 실사용 검증이 unit 테스트보다 더 정직.

### 💡 8. 토큰 절약 = 비용 + 한도 + 사용자 신뢰

음악 플리에 Gemini 안 부르기:

- 비용 절약 (무료 한도 더 오래)
- 시간 단축 (5~15초 절약)
- 한도 도달 안 함 (다른 영상에 quota 보존)

→ **AI 시대엔 "API 호출 안 하는 게 더 좋은 솔루션"인 경우가 많다.**

### 💡 9. 보안 위생도 학습 곡선

봇 토큰 3번 노출 → 마침내 폐기. **개인 프로젝트도 토큰 노출은 진짜 위험.** 캡처·공유 시 항상 토큰 부분 가리기. 의심되면 즉시 폐기·재발급.

### 💡 10. 두 모델 분담의 효율

|작업|모델|이유|
|---|---|---|
|이미지 분석|Claude Sonnet|한국어 OCR + 맥락 우수|
|YouTube 영상|Gemini 2.5 Flash|YouTube URL 직접 입력 native|
|분류·요약|Claude|한국어 정확도|

→ **각 모델의 강점에 맞춰 분담.** 한 모델로 다 할 수도 있지만 분산이 비용·정확도 면에서 유리.
---

## 미션2: SNS 작성
https://www.instagram.com/p/DYbkAN5vkOK/?igsh=aWJxMzA4enBzejky
>오웬님 스킬로 못만들었는데 다음부터는 해당스킬 적용해서 sns후기 남기는것이 목표!

---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
