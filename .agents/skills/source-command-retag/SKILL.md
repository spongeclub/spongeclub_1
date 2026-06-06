---
name: "source-command-retag"
description: "인사이트 파일 keywords frontmatter 재정리 (중복 제거 + 구체화)"
---

# source-command-retag

Use this skill when the user asks to run the migrated source command `retag`.

## Command Template

인사이트 키워드를 재정리해줘.

## 실행 절차

### 1. 기존 키워드 현황 파악
- `02_skill&insight/` 의 모든 .md 파일을 읽는다
- 각 파일의 `keywords` frontmatter를 수집한다
- 키워드별 사용 빈도를 집계한다
- 3회 이상 사용된 키워드를 "과다 사용 키워드"로 표시한다

### 2. 키워드 재생성 기준
- 키워드는 파일당 **3~5개**로 제한
- **구체적인 키워드 우선** — 도구명, 프레임워크명, 구체적 기법명
  - ❌ "AI", "자동화", "Codex" → 거의 모든 글에 붙을 수 있는 범용 키워드
  - ✅ "DESIGN.md", "n8n 알림톡", "토큰 절감", "Playwright" → 해당 글만의 고유 주제
- **기존 키워드와 중복 최소화** — 다른 파일에서 이미 많이 쓴 키워드는 피한다
- **본문 내용 기반** — 본문을 다시 읽고, 핵심 주제를 추출한다

### 3. 각 파일 업데이트
- 본문을 읽고, 위 기준에 맞는 새 키워드를 생성한다
- `summary`가 없거나 부실하면 한 줄 요약도 함께 갱신한다
- frontmatter의 `keywords`와 `summary`를 업데이트한다
- **본문은 절대 수정하지 않는다**

### 4. 결과 보고
변경 내용을 표로 보여준다:

| 파일명 | 기존 키워드 | 새 키워드 | 변경 여부 |
|--------|-----------|---------|---------|
| ... | ... | ... | ✅/➖ |

사용자가 확인한 후에만 파일에 반영한다.
