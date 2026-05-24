---
team: 6조
member: 히얌
role: 조원
week: 3
submitted: true
---

# 3주차 과제 — 히얌

---

## 미션1: 내 고객은 누구고 왜 쓰는가 — 클로드 코드로 프로덕트 구현하기

### Summary
광고대행사 마케팅팀(adef.co.kr, ~30명) 대상 **업무 투두 + 일정·휴가 관리 시스템**.
Chrome 익스텐션 popup + Next.js 웹 + Supabase. 스프레드시트 수기 관리의 7가지 페인을 해결.
**비개발자가 Claude Code 바이브코딩으로 직접 운영**.

### 최종 구현 결과물
![](attachments/Pasted%20image%2020260524195741.png)
![](attachments/Pasted%20image%2020260524195746.png)
![](attachments/Pasted%20image%2020260524195750.png)
![](attachments/Pasted%20image%2020260524195754.png)
![](attachments/Pasted%20image%2020260524195804.png)
![](attachments/Pasted%20image%2020260524195808.png)
![](attachments/Pasted%20image%2020260524195810.png)

### 과정 (타임라인별 + 삽질)
- **v3 → v4** (16결정): brainstorming 스킬, MVP 범위 / dimension 모델 / 입력 UX
- **v4.1** (8결정): vague 스킬, D-day / status 4-state(holding) / ADMIN_EMAILS / 다일 group_id / API 실패
- **v4.2** (4결정): 그룹메일 미매칭 / 분류축 의미 / 충돌 검사 / 익스텐션 권한
- **v4.3**: Multi-tenancy v2+ BYOS / 무료 한도 안전망 / 모노레포
- **v4.4** (8결정): 외근 타입 / 모바일 v1 읽기전용 / 오프라인 / 휴가 사유 / 단축키 매핑 / display_name / 알림 v1 ON / 캘린더 디폴트
- **v4.5-4.8**: 디자인 가이드(모노톤+빨강) → 색상 단순화 → 190색 Material 팔레트

### 공유할만한 인사이트

---

## 미션2: 내가 정의하고 적용해보고 싶은 하네스 + 오케스트레이션

### Summary
**하네스** = Claude 일관성 보장(지시·도구·환경·상태·피드백).
**오케스트레이션** = Main + 6 sub-agent.

### 최종 구현 결과물
![](attachments/Pasted%20image%2020260524200031.png)
![](attachments/Pasted%20image%2020260524200043.png)
![](attachments/Pasted%20image%2020260524200046.png)
![](attachments/Pasted%20image%2020260524200050.png)
![](attachments/Pasted%20image%2020260524200053.png)
![](attachments/Pasted%20image%2020260524200102.png)
![](attachments/Pasted%20image%2020260524200113.png)

### 과정 (타임라인별 + 삽질)
1. design-system 빠뜨림 (5 → 6 agent)
2. Spawn Task ≠ Claude Code 기본 Task 혼동
3. STATE.md 갱신 책임 3중복
4. verifier가 Write 권한 없는데 STATE.md 쓴다고 명세 — 모순
5. 디자인 변경 감지 메커니즘 부재 → git diff 기반 추가

### 공유할만한 인사이트
1. **MECE는 한 번에 안 된다.** cross-check 반복 필요
2. **Spawn Task ≠ Task 도구.** v1엔 Task만

---

## 미션3: 스폰지클럽을 하며 남기고 싶은 생각과 고민 SNS 글 작성

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
