---
team: 6조
member: 정하늘
role: 조원
week: 2
submitted: false
---

# 2주차 과제 — 정하늘

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

유튜브 영상을 캐러셀로 만드는 OS를 만들어보자.
클로드와 상의해서 마크다운 문서를 먼저 만들고 클로드코드로 구현함.

유튜브 영상 스크립트 넣으면 캐러셀 **자동 생성 + 텍스트 에디터까지 갖춘 실행 시스템**으로 만듬

### 최종 구현 결과물
**결과물**: 영상 스크립트 → 8장 PNG + 캡션 자동 생성, 웹에서 인라인 편집까지### 
리포지토리
[https://github.com/drconditionmaker-dot/carousel-os](https://github.com/drconditionmaker-dot/carousel-os) (private)

### 작동 방식

**v1.0 모드 (웹 앱)**

```
사용자 → http://localhost:5173 접속        → Generate 페이지: 영상 스크립트 텍스트 붙여넣기        → "캐러셀 생성" 클릭        → Anthropic API 호출 (5~15초, 실패 시 최대 3회 자동 재시도)        → Editor 페이지: 8장 thumbnail (540×675) + 인라인 텍스트 편집        → "PNG 8장 다운로드" → ZIP 파일 → Downloads로 떨어짐
```
![](attachments/Pasted%20image%2020260517002415.png)
### 과정 (타임라인별 + 삽질)
### Day 1 — v0 빌드 (Claude Code 기반)

**1. 셋업 (15분)**

- `carousel-os.zip` 풀어서 `carousel-os/` 폴더로
- 상위에 `CLAUDE.md` 작성 (Being vs Doing 게이트 + 핵심 파일 맵)
- 중복 파일(`README.md` 위쪽 + `.zip`) 정리

**2. 첫 브레인스토밍 (1시간)**

- 사용자: "기획·편집·다운로드를 하나의 시스템으로"
- 처음엔 풀 비주얼 에디터(텍스트·크기·색상·이미지 업로드·영상 업로드·멀티 플랫폼 캡션)를 요구
- 스코프 게이트로 짚음: 그건 OS의 `이미지 사용 안 함` 정책과 충돌, 큰 빌드
- → 결정: **OS 원안대로 / 완전 자동 / GUI 에디터 X / 주제 한 줄 → 1편**

**🪓 첫 삽질: Python 미설치 (Day 1 중반)**

- 플랜에 Python + Playwright + Pydantic + Jinja2로 다 짜둠
- Task 2에서 `python --version` 실행 → Windows Store Python stub만 있음
- 진짜 Python 미설치 상태
- → **Node.js로 피봇 결정** (Node 24는 이미 깔려있어서 사용자 액션 0)
- Spec + Plan + 코드 다 Node 버전으로 재작성: Zod, Nunjucks, js-yaml, node --test
- 결과: 1시간 추가 소모, 하지만 Playwright는 Node가 원본이라 오히려 더 잘 됨

**3. 빌드 (3시간)**

- 20개 태스크 인라인 실행
- TDD: schema 6/6 + render 3/3 통과
- 첫 PNG 생성 성공 (오후 3시 단 거 신호 캐러셀)

### Day 1 끝 — Day 2 시작

**🪓 두 번째 삽질: 진짜 의도 놓침**

- v0 끝낸 직후 사용자: "원래 유튜브 영상 넣어서 만들려고 한 건데요"
- 그제서야 OS 02.5에 명시된 "영상 1편 → 캐러셀 4~5편 자동 공급" 파이프라인이 진짜 의도였음을 인지
- v0 첫 명확화 질문에서 사용자가 "주제 한 줄 + 메모 → 1편 (Recommended)" 선택했었음 — 당시엔 정확한 결정, 하지만 진짜 의도와 다른 길
- → **v1 새 사이클 시작**

### Day 2 — v1.0 빌드 (웹 앱)

**4. v1 브레인스토밍 (전날 저녁 + 다음 날 이어서)**

- 3개 결정 빠르게: 1편 / 로컬만 / 완전 비주얼 에디터 (OS 룰 안에서)
- 다음 날 5개 결정 추가: Vite+React+Express / Anthropic API 직접 / AI 자동 + UI 수정 / 단계적 마일스톤

**5. v1.0 플랜 작성 (30분)**

- 15개 태스크
- 자체 검토에서 1건 발견 (dead fetch code) → 인라인 수정

**6. v1.0 빌드 (2시간, 인라인 실행)**

- engine 그대로 재사용
- server/ + web/ 풀스택 빌드
- 자동 테스트 21/21 통과
- 처음에는 **서브에이전트 dispatch** 시도 → timeout 자주 남 → **인라인 실행으로 전환**
- PR [#2](https://github.com/drconditionmaker-dot/carousel-os/issues/2) 머지


### 공유할만한 인사이트

1. 클로드와 채팅하면서 마크다운 문서를 만들 때 결정해야 할게 너무 많았다. 이게 다 필요한 것인지 판단할 수가 없어서 좀 힘들었다. 캐러셀을 처음 만들었기 때문인 듯 하다.
2. 소통 오류를 방지하자. 처음부터 웹앱으로 만든다고 안해서 소통 오류 (V0 버전으로 클로드 코드 내에서 만들어주는 것 - skill 형식으로 만들어줌), 유튜브 영상 바탕으로 만든다고 전달이 안되어 또 오류 - 마크다운 문서로 만든게 전달이 잘 안된 것인지? 마크다운 문서만 믿고 처음 코드와 계획단계에서 꼼꼼하게 체크하지 못한 탓이지 싶다.
3. 디자인 레퍼런스를 찾기가 좀 힘들었는데, 평상시 팔로우하던 인스타 계정을 보여주니 훨씬 더 감을 잘 잡는 듯 했다.
4. 해보면서 코딩이 무엇을 하는것인지 지켜보는 재미?,..도 있었다. 


## 미션2: SNS 작성

[https://www.threads.com/@conditionmaker/post/DYZ7BuZj0i_?xmt=AQG0QMEUAI73edJz0avaX_rX6DxV70v7C9Piy7Kn_yjRsrSudrFhcU-BMKzdrrqrzXQSLEFX&slof=1](https://www.threads.com/@conditionmaker/post/DYZ7BuZj0i_?xmt=AQG0QMEUAI73edJz0avaX_rX6DxV70v7C9Piy7Kn_yjRsrSudrFhcU-BMKzdrrqrzXQSLEFX&slof=1)

---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
