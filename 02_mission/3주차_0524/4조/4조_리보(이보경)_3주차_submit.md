---
team: 4조
member: 리보
role: 조원
week: 3
submitted: true
mvp: false
mvp_reason: ""
---

# 3주차 과제 — 리보

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 내 고객은 누구고 왜 쓰는가 — 클로드 코드로 프로덕트 구현하기<스크랩어데이>

### Summary
다꾸 스크랩어데이 하는 것처럼, 월캘린더에 사진을 우표모양처럼 붙이고, 감정+짧은메모를 남길 수 있게해서 한달 기록용 웹앱(소중한 하루를 대표사진으로 기록하되 글을 너무 길고, 영상 찍을 자신 없고, 사진으로 간단하게 기록)

### 내 고객은 누구인가?
- 나의 일상을 기록하고 싶은 사람
- 일기쓰는것은 귀찮지만, 사진과 메모로 간단하게 기록하길 원하는 사람
- 다꾸 좋아하는 사람
- 하루하루 지나가서 시간이 지나면 내가 뭐했을까?라고 추억을 더듬지만 기억이 안나는 사람


### 최종 구현 결과물

![](attachments/Pasted%20image%2020260524192329.png)
![](attachments/Pasted%20image%2020260524192344.png)


![](attachments/Pasted%20image%2020260524192407.png)
![](attachments/Pasted%20image%2020260524192423.png)
![](attachments/Pasted%20image%2020260524192455.png)

![](attachments/Pasted%20image%2020260524192514.png)



### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
### 🧱 아키텍처 > 하네스, 오케스트레이션 스킬 사용해서 PRD를 분할하는 등 효율적으로 초기 세팅해서 클로드 코드 시작하게 됨

1. **`Result<T>` everywhere** — `lib/*` 함수가 throw 안 하고 `{ok, value} | {ok:false, error}` 반환. 호출자에서 `if (!result.ok)` 패턴. TS narrowing + 모든 에러 케이스 강제 인지 → silent failure 0건
2. **Type-level 정책 가드** — PRD §06 §3.4 "사진 변경 금지"를 코드 주석이 아니라 **`updateStamp` 시그니처에 `Partial<Pick<Stamp, 'memo'|'mood'|'moodVisible'|'style'|'crop'>>`로 박아** photoBlob을 컴파일 타임에 차단. 정책 위반이 type error로 잡힘. 다음 사이클의 agent도 우회 못함
3. **SSR-safe Dexie Proxy** — 모듈 레벨에 lazy Proxy 두면 server import는 무공해, 클라이언트에서 첫 property 접근 시에만 `new Dexie()`. Next.js App Router의 RSC/static prerender 안전
4. **PRD를 router로** — CLAUDE.md를 470줄 → 200줄 얇은 라우터로, PRD 15개 모듈로 분할, Phase별 필독 매핑. **컨텍스트 윈도우 사용량 ↓ + 매 세션 시작 시 일관된 신호**

### 🎨 시각

5. **CSS mask는 작은 사이즈에서 안 보인다** — 50px 셀에서 1-2px 노치는 안티에일리어싱에 묻힘. **Painted-teeth SVG overlay** (cropper-style: stamp-paper fill, no stroke)로 전환하니 모든 사이즈에서 가시. 실루엣은 사각형이지만 시각적으론 우표
6. **Padding 색 = teeth 색 = 시각적 0** — `inset-[3%]` paper background 위에 stamp-paper teeth를 칠해서 안 보였던 버그. 두 번 같은 실수 = **fill color와 padding color 일치 여부 항상 확인**
7. **Cropper: cover + restrictPosition false** — `contain`은 letterbox 발생, `cover`는 1축만 pan. 자유 2D pan 위해선 `restrictPosition={false}`
8. **Canvas 크롭 추출 > CSS transform 재현** — 원본 blob + transform 메타는 좌표계 미스매치로 깨짐. Canvas로 저장 시점에 cropped blob 추출하면 표시 사이즈 무관

### 📱 모바일 > 모바일 중심으로 사용예정인데 해당 부분을 이야기하니깐 모바일 이슈에 대해 보충하게 됨 (IOS Safari IndexedDB 7일 이슈 (꼭 알아야 해요 *이게 진짜 중요한데 PRD에 빠져있어요:
**iOS Safari는 사용자가 7일 동안 사이트를 방문 안 하면 IndexedDB를 자동으로 삭제해버려요.** (Apple의 ITP 정책) )

9. **iOS Safari `capture` quirk** — `accept`를 narrow MIME으로 설정하면 `capture="environment"` 무시되고 갤러리로 fallback. `accept="image/*"`로 완화 + 클라이언트 측 validatePhotoFile로 포맷 보장
10. **input/textarea `font-size ≥ 16px` (= `text-base`)** — iOS Safari는 16px 미만이면 강제 zoom-in. PRD §15 정착
11. **iOS Safari ITP 7일 IndexedDB 자동 삭제** — 매일 쓰는 일기 앱에 치명적. 4단계 완화 (PWA 설치 권유 / 자동 백업 알림 / 1탭 백업 / v1.1 클라우드 백업)
12. **flex column + `items-center` + `w-full` 자식 = 0px 순환 사이징** — `items-center`는 자식을 콘텐츠 크기에 맞추는데, 자식이 `w-full`이면 부모-자식 서로 참조. 기본 `align-items: stretch` 쓸 것

### 🤖 에이전트 운용 (갑자기 에이전트가 나타나서 일을 하게 됨됨)

13. **Trust-but-verify** — 에이전트가 "build passed, 8 files created" 했어도 ls + grep + 핵심 파일 spot-check. 한 번은 mood label이 PRD와 다른 한글 ("고요/울적")로 들어가 있었음
14. **자세한 브리프 = 좋은 출력** — agent 디스패치 시 PRD 발췌 인라인 포함, 시그니처 명시, 파일 목록 명시, 출력 포맷 강제 → 한 번에 완성도 ↑. 짧은 "Phase 4 해줘"는 망함
15. **API 끊김 회복** — 디스패치가 중간에 fail해도 브리프가 self-contained면 main agent가 인라인 완성 가능 (Phase 2.3 사례)
16. **PRD-실제 불일치는 PRD를 먼저 갱신** — 코드 작업 전에 PRD를 진실로 맞춰야 prd-guardian 검증이 의미 있음. 직접 코드 수정으로 PRD 위반 누적 X
---

## 미션2: 내가 정의하고 적용해보고 싶은 하네스 + 오케스트레이션

### Summary
- 하네스 엔지니어링 :  하네스 엔지니어링은 전체 관점에서 일관된 규칙을 부여하여 메커니즘을 정리하는 것
- 오케스트레이션 ;  여러 에이전트와 도구들이 잘 진행되도록 깔끔하게 역할 분담과 실행 흐름을 정리하는 것
- 스킬유닛하면서 하네스, 오케스트레이션 점검하는 스킬 생성함
### 최종 구현 결과물
![](attachments/Pasted%20image%2020260524191528.png)


![](attachments/Pasted%20image%2020260524191850.png)

![](attachments/Pasted%20image%2020260524191907.png)

![](attachments/Pasted%20image%2020260524191923.png)


### 과정(타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션3: 스폰지클럽을 하며 남기고 싶은 생각과 고민 SNS 글 작성

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
