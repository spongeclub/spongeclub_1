---
team: 5조
member: 거북이의꿈
role: 조원
week: 2
submitted: true
---

# 2주차 과제 — 거북이의꿈

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary
- 옵시디언을 컨텐츠 생성 자동화 OS로 세팅하는 과정
	- 옵시디언 볼트 구조 세팅
	- 옵시디언 LLM Wiki에 skills 및 agents 세팅
### 최종 구현 결과물
![](attachments/Pasted%20image%2020260517151113.png)

### 과정 (타임라인별 + 삽질)
1. 옵시디언 LLM Wiki : 1주차_0510 작업
  -> 삽질 : `skills` vs `agents` 개념 공부
2. 폴더 구조 설계 with 클로드코드
	- 전체 폴더(볼트) 안에 1)skills/agents 및 2)컨텐츠 만들기 위한 소스, 3)결과물 까지 모두 보관할 수 있는 구조
	- 단, 1)과 3)은 옵시디언에서 인덱싱 제외
	- 이 구조를 claude.md 파일에 명문화하고, skills에도 명문화
3. Remotion Skill 설치
4. Remotion 영상 제작 Agents 세팅
	- `wiki-researcher` : wiki를 읽고 영상용 기획 자료 발췌 
	- `scenario-writer` : 제품정보 → 영상 시나리오 (장면·타이밍·카피·비주얼 노트)
	- `remotion-coder` : 시나리오 → Remotion 컴포지션 코드
	- `render-reviewer` : lint + 렌더 + 시나리오-영상 일치 검수
  -> 삽질 : `Remotion` vs `Hyperframes` 
5. Hyperframes Skill 추가 설치
6. 이후 삽질 예정
	- Remotion Agents와 Hyperframs Agents 분리? 통합?
	- Remotion과 Hyperframes를 포괄하는 통합 영상제작 Skill 작성 필요
	- 영상제작 Skill은 대화형으로 작업 방식 변경 cf) 현재는 일괄 작업

### 공유할만한 인사이트
- `skills` vs `agents`

- `Remotion` vs `Hyperframe`



---

## 미션2: SNS 작성

### Summary
- 오웬이 작업해준 스킬 활용해 뚝딱~! 작업
  -> WoW~ 신기하네~~ ^____^
### 최종 구현 결과물
![](attachments/Pasted%20image%2020260517155616.png)
### 과정 (타임라인별 + 삽질)
- 오웬이 지침준대로 잘 설치해서 뚝딱~! 작업 완료
- html파일과 md파일은 있는데 이미지파일은 보이지 않아서 찾아서 한참 찾아 헤맸음 @.@
- 이미지파일을 base64인코딩 방식으로 텍스트문서에 저장할 수 있다는 것 처음 알게됨~!
- 이미지 우클릭 저장은 되지 않아서, 클로드코드 시켜서 디코딩해 이미지 추출 완료
### 공유할만한 인사이트

---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
