---
team: 6조
member: Galia(방경은)
role: 조원
week: 6
submitted: true
---

# 6주차 과제 — Galia(방경은)

---

## 미션1: <온라인 커피챗>

아직 신청만 하고 진행은 못했습니다 ㅠㅠ

---

## 미션2: <갤러리에 내 최종 산출물 올리기>

![](attachments/스크린샷%202026-06-14%20오후%205.05.35.png)

### 최종 구현 결과물
* https://ploplan.vercel.app/
	* https://www.threads.com/@norlgia/post/DZXkhJ-Er8l?xmt=AQG0mgSsxOB1x2-ljtS9jnYmepPNU14qOyd_ucvylnh6Y3ALM2JjPx-NSZxB39zijuspMPU
### 과정 (타임라인별 + 삽질)

**6/11 — 피드백 반영 + 지도 기능 복구**

- 장소 삭제 UX 개선, AI 장소 지도링크 정확도 개선, 개별 장소 자동완성
- 삽질: 지도가 먹통 → 원인은 `.env.local`의 **만료된 옛 키** → Vercel 유효 키로 교체해 복구
- 삽질: 키 교체하다 Gemini 키를 지도 키 자리에 잘못 붙임 → 분리

**6/12 — 보안 (가장 큰 날)**

- 회원정보 차단(Phase 1) → 여행 데이터 본인만(Phase 2 RLS) → PIN 5회 제한 + 이메일 인증
- 삽질: RLS 켜자마자 프로덕션 "여행 목록 실패" → 세션 의심하고 롤백 → Node로 검증하니 진짜 원인은 **보안 규칙 무한 재귀**(여행↔협업자 상호 참조) → 우회 함수로 수정 후 재적용 성공
- 삽질: 브라우저 자동입력이 폼에 안 들어가 로그인 테스트 실패 → 값을 코드로 직접 주입

**6/13 — 비용 방어 + 설문/DM**

- AI 일정·체크리스트 호출 제한, 사용량 상한·예산 알림·자동 결제중지 함수
- 삽질: **AI 준비물 추천이 인증·제한 없이 무한 호출 가능**한 구멍 발견 → 차단
- 삽질: Apps Script 폼 생성 "Invalid data updating form" → 보기 일부만 이동규칙 줘서 → 전 보기에 명시

### 공유할만한 인사이트

- **브라우저에 들어가는 키는 못 숨긴다** → 도메인 제한·사용량 상한으로 막아야 함
- **로그인 화면 ≠ 보안.** DB가 "누구"인지 알아야(진짜 세션) 잠금이 의미 생김
- **API 비용은 층층이 방어**: 서버 호출 제한 → 일일 상한 → 예산 알림 → 자동 결제중지 (알림만으론 안 막힘)
- **구글폼 대량 제작은 Apps Script 한 방**, 스킵로직은 섹션 단위라 조건부 질문은 별도 섹션으로

---

## 미션3: <일주일 미니유닛 진행>

### Summary
https://www.linkedin.com/posts/gyeong-eun-bang-a56533274_swmudutfmtmmrvp-swmudutfmtmmrvp-swmudutfmtmmrvp1qzc-share-7469772462101065729-CyyO/?utm_source=social_share_send&utm_medium=ios_app&rcm=ACoAAEL_iSIBe7mc46C2NzvDRsT39IUKp9Zb164&utm_campaign=copy_link

https://www.threads.com/@norlgia/post/DZXkhJ-Er8l?xmt=AQG06PybxX3y4uBw6iEDYJ5gDI7A9Pn06lVE1dt48RciToXlktIUlJ0nGMrMGaXHNbOJ3vhc&slof=1

https://www.linkedin.com/posts/gyeong-eun-bang-a56533274_swmudutfmtmmrvp-ploplan-swmudutfmtmmrvp-activity-7470848759040593921-UziD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEL_iSIBe7mc46C2NzvDRsT39IUKp9Zb164