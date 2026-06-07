---
team: 5조
member: 써니
role: 조원
week: 5
submitted: true
---

# 5주차 과제 — 써니

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

**과제 1 — 프로덕트 마무리**

**9살 아이 맞춤 독서 판별 시스템**

개인 필터가 적용된 맞춤형 앱이라 링크 공개 대신 인스타 사용 영상으로 대체합니다. 👉 [https://www.instagram.com/reel/DZRVbjUNmTf/?igsh=MTVjZGlod3gyd2F5Nw==](https://www.instagram.com/reel/DZRVbjUNmTf/?igsh=MTVjZGlod3gyd2F5Nw==)

**만든 것**

카메라로 책 표지 찍으면 Claude AI가 자동으로 판별 → 아이가 직접 고르고 → 반응을 기록하면 → 데이터가 쌓여서 다음 선택이 더 정확해지는 구조.

- 탭 1 — 책 평가 (표지 촬영 → 자동 인식 → 제공/보류/제외 판정)
- 탭 2 — 반응 기록 (읽은 속도, 몰입도, 좋아한/싫어한 요소)
- 탭 3 — 라이브러리 (전체 책 목록 점수순 정렬)

사용 기술: React + Vite / Claude API / Google Sheets / Vercel

---

**만든 과정과 인사이트**

한글 게임 때는 Claude Code가 통으로 만들어줬다. 빠르게 결과물이 나왔지만 과정이 와닿지 않았다. 그리고 그때는 데이터가 쌓이는 구조가 없었다. 그냥 게임 하나로 끝이었다.

독서 판별기는 Claude가 대화로 하나씩 세팅하는 방식으로 진행됐다. (Claude가 권장한 건지는 지금도 의문이다.) 계속 실패했다. 근데 그 과정에서 각 기능이 어떻게 연결되는지 어렴풋이 그림이 그려지기 시작했다. 전체는 아니지만.

이번엔 달랐다. 책 평가 → 아이 반응 기록 → Google Sheets에 데이터 누적 → 다음 선택 개선. 단순한 앱이 아니라 쓸수록 정확해지는 구조를 만든 것. 각각의 기능이 연결되어 하나의 흐름이 됐다.

그래서 결국 Claude Code로 완성했을 때 이전과는 달랐다.

나만의 OS를 만든다는 게 처음엔 대단한 앱을 만들어야 한다고 생각했다. 근데 아니었다. 한글 받침 게임도 만들고 독서 판별기도 만들면서 깨달은 것 —

생활 속 반복되는 것들을 어떤 도구로 연결할지 고민하는 것, 그게 나만의 OS였다. 이 툴 저 툴 써보는 게 중요한 게 아니라 내 삶에 맞는 문제를 직접 만들어보는 것. 완벽하게 따라가지 못해도 그렇게 도전하는 것 자체가 중요했다.

---

**과제 2 — SNS 글쓰기**

[https://www.instagram.com/reel/DZJv4RntgQc/?igsh=MXV3dDcydzM4amJibg==](https://www.instagram.com/reel/DZJv4RntgQc/?igsh=MXV3dDcydzM4amJibg==)