---
team: 3조
member: 설록
role: 조원
week: 2
submitted: true
mvp: false
mvp_reason: ""
---

# 2주차 과제 — 설록

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary
**카드뉴스 자동제작 도구** — 이미지 에셋이나 파일을 전달하면 카드뉴스 콘텐츠가 자동으로 생성되는 워크플로우 대시보드
### 최종 구현 결과물
카드뉴스 자동제작 대시보드

### 과정 (타임라인별 + 삽질)
**1. 스킬 세팅**

- `https://github.com/emily-mkt/skillers-finder.git` 스킬을 글로벌에 설치

**2. 대시보드 기본 구현 요청**

- "이미지 에셋/파일을 전달하면 카드뉴스 콘텐츠가 .dev에서 바로 보이는 자동 워크플로우 대시보드를 만들어줘"
![](attachments/Pasted%20image%2020260517012629.png)


**3. 디자인 개선 1차 시도 — shadcn (실패)**

- `/skillers-finder`로 디자인 스킬 탐색 → shadcn 추천받음
- `cardnews-dashboard`에 shadcn 비대화형 init + button/card/input/select 컴포넌트 추가
- **결과**: 눈에 띄는 변화 없음 😶
- **원인**: shadcn은 _컴포넌트 라이브러리_지 _디자인 스킬_이 아님. `design.md` 같은 디자인 가이드 없이 "예쁘게 해줘"만으로는 변화가 안 생김

**4. API 키 연결

**5. 디자인 개선 2차 시도 — interface-design**

- `Dammyjay93/interface-design` 스킬로 "캔바 느낌"으로 수정 요청
- 좌측 패널은 만족, 우측 결과물(카드뉴스 영역)이 아쉬움

![](attachments/Pasted%20image%2020260517013222.png)

**6. 디자인 개선 3차 시도 — claude-design + playwright-skill 조합 (성공)**

- `/skillers-finder`로 캐러셀 제작 스킬 재탐색
- `claude-design`(디자인 적용) + `playwright-skill`(렌더링 검증) 조합으로 결과물 품질 확보

![](attachments/Pasted%20image%2020260517013545.png)

![](attachments/Pasted%20image%2020260517021050.png)

### 공유할만한 인사이트

**1. 가장 강력한 도구는 `skillers-finder`였다** "도구를 찾아주는 도구"라는 개념 자체가 신선했음. 모든 스킬을 외울 필요 없이, 필요할 때 적합한 스킬을 찾는 능력이 더 중요하다는 걸 체감.

**2. "좋은 스킬 = 좋은 결과"가 아니다** shadcn을 깔아도 _사용법_과 _디자인 방향성_이 없으면 의미 없음. 컴포넌트 라이브러리(재료)만으로는 부족하고, 디자인 가이드(레시피)가 함께 있어야 결과물이 달라진다.

**3. 스킬은 조합할 수 있다** 단일 스킬에 매달리지 말 것. `claude-design`(만들기) + `playwright-skill`(검증) 조합처럼, 역할이 다른 스킬을 묶었을 때 비로소 만족스러운 결과가 나옴.

**4. 같은 도구라도 환경에 따라 결과가 달라진다** Warp 터미널과 Claude 데스크탑 앱은 둘 다 Claude Code를 띄우지만, **데스크탑 앱은 기본적으로 Git worktree를 분리**해 안전하게 작업하려는 경향이 있다. 안전장치이긴 하지만, 모르고 쓰면 "내가 한 작업이 사라진 것 같은" 혼란이 생긴다. 환경을 바꿀 때는 commit/push로 동기화 상태를 명확히 하는 습관이 필요.

**5. dev 서버는 여러 개 띄울 수 있다** 포트만 다르게 하면 동시 실행 가능. 비교·검증 작업에 유용함.


---

## 미션2: SNS 작성
https://www.instagram.com/p/DYUrG_fkal8/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==

스폰지클럽 스킬기초 공유회 참여 후기  
  
[@emily.selfishclub](https://www.instagram.com/emily.selfishclub/) 님이 알려주신 스킬 사용법을 그대로 따라  
/skillers-finder 스킬을 켜고 클로드에게 물었어요.  
“카드뉴스 자동제작 대시보드 만들고 싶어, 어떤 스킬 필요해?”  
  
👉 추천받은 스킬들을 모아  
  
- 대시보드 UI 디자인  
- 카드 여러 장 자동 생성 기능  
  
한 화면에 전부 구현 완료! 🎉
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
