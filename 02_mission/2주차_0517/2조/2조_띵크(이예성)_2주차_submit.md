---
team: 2조
member: 띵크(이예성)
role: 조장
week: 2
submitted: true
---

# 2주차 과제 — 띵크(이예성)

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary
![](attachments/Pasted%20image%2020260517182141.png)

**나의 OS 정의**: 나는 **일정 체크와 판단**만 하고, 나머지(흩어진 일정 수집 · 우선순위 매기기 · 미리 알려주기 · 다른 채널로 전달)는 OS가 진행해 준다.

진짜 통점은 "캘린더 켜는 5초"가 아니라 **구글·노션·네이버 3곳을 머릿속에서 합치는 인지 비용**이었다. 그래서 OS의 1차 산물을 **데스크탑에 항상 떠 있는 통합 캘린더 위젯 + 매일 아침 자동 브리핑 봇**으로 정의하고, 두 부품을 동시에 구현했다.

- **그릇**: `think_cd` — Flutter 데스크탑 오버레이 캘린더 (Windows 11)
- **첫 부품**: `brief-bot` — Claude 스킬 형태의 아침 브리핑 봇

### 최종 구현 결과물

**1. `think_cd` (데스크탑 오버레이 캘린더)**
- 위치: `C:\Users\yesun\think-CD`
- 스택: Flutter Desktop + Riverpod + sqflite_common_ffi
- 360×460 프레임리스 윈도우, 다크 테마, Always-on-top 기본
- **입력 어댑터 (5종)**: Google Calendar (OAuth 루프백) · Notion DB (REST + 속성 자동 탐지) · Local SQLite · iCal (애플 등) · Naver · 한국 공휴일
- **출력 레이어**: 4뷰(월/주/일/Agenda), 글로벌 핫키 `Ctrl+Shift+C`, **Wallpaper-pin (베타)** — Win32 `Progman`/`WorkerW` 트릭으로 바탕화면 아이콘 레이어에 고정
- **편의 기능**: 자연어 일정 입력 파서, 한국 음력 표시, 알림 스케줄러, 자동 시작, 테마 프리셋 4종(Light/Dark/Glass/Solarized)

**2. `brief-bot` (Claude 스킬)**
- 위치: `~/.claude/skills/brief-bot/SKILL.md`
- 트리거: "오늘 브리핑" / "아침 브리핑" / "지금 브리핑해줘"
- 입력: think_cd export(또는 자유 형식 일정) + 컨텍스트 한 줄
- 출력: **30초 안에 읽히는 한 화면 브리핑 카드** — 우선순위 TOP 3 · 시간순 일정 · 충돌/여백 · 컨텍스트

**3. OS 청사진 문서**
- `C:\Users\yesun\think-CD\os-blueprint.md` — 풍경/통점/이상향/부품 후보 7종/첫 부품 결정 근거까지 정리

### 과정 (타임라인별 + 삽질)

**① OS 인터뷰 (6단계)**
- 6단계 인터뷰 스킬을 돌려 "그릇 90%는 이미 있는데(`think_cd`), 정작 매일 쓰는 의식(ritual)이 없다"는 진단을 받음
- 부품 7개 후보 중 **브리핑 봇**을 첫 부품으로 결정. 이유: (1) OS 선언문 "체크와 판단"의 1차 산물, (2) 1~3일이면 동작, (3) think_cd에 데이터가 이미 흐름

**② 첫 부품 형태 결정 — A(Claude 스킬) vs C(앱 임베드)**
- 처음엔 think_cd 안에 Anthropic API를 직접 박는 C안을 검토 → 매번 빌드/실행이 무거워서 프롬프트 튜닝 사이클이 1.5배 느려짐
- → **A안(Claude 스킬)으로 선회**. 프롬프트 안정화 후 think_cd로 이식하는 2단 전략. 두 번 일하지 않음.

**③ think_cd 입력 어댑터 확장**
- Google OAuth — 데스크탑 앱 클라이언트 + 루프백 HTTP 서버로 토큰 수령. `--dart-define`으로 시크릿 주입(커밋 금지)
- Notion — DB ID 받자마자 `date`/`title` 프로퍼티 자동 탐지하도록 introspect 단계 추가. 사용자가 속성 이름을 안 맞춰도 동작
- Naver/iCal — 별도 어댑터 모듈로 추가. `domain/calendar_source.dart` 인터페이스 덕에 추가 비용 적음

**④ 삽질**
- **Wallpaper-pin 모드**: Win32 `Progman` 메시지를 보내 `WorkerW` 핸들을 추출하는 비공식 트릭. Windows 메이저 업데이트마다 깨질 수 있어서 실패 시 "뒤로 보내기"로 fallback 처리
- **플러그인 심볼릭 링크 에러**: Windows Developer Mode를 안 켜서 `flutter pub get` 중 권한 에러 → Developer Mode ON 후 해결
- **Secret 저장**: 현재 SharedPreferences 평문. 프로덕션 전엔 DPAPI/Keychain 래핑 필수 — TODO로 명시

**⑤ 검증**
- ✅ `flutter build windows --debug` 통과
- ✅ 월 그리드 렌더링 (스크린샷 확인)
- ☐ Local 이벤트 영속성 / Google·Notion 실데이터 연결 / Wallpaper-pin 토글 / 자동 시작 — 사용하며 체크 중

### 공유할만한 인사이트

1. **"그릇 먼저, 의식 나중"이 거꾸로였다.** 나는 think_cd라는 통합 캘린더 그릇을 90% 만들어 놓고도 매일 안 썼다. 이유는 "켜서 본다"는 의식(ritual)이 없어서. **OS는 도구가 아니라 매일 발동되는 트리거 + 결과물의 묶음**이다. 그릇만 만들면 안 쓴다.

2. **첫 부품은 가장 가벼운 형태로 시작해라.** Claude 스킬은 1분이면 프롬프트를 고친다. Flutter 앱에 박으면 매번 빌드. 같은 로직이라도 **튜닝 사이클이 빠른 곳에 먼저 심고**, 안정화되면 무거운 곳으로 이식. 두 번 일하는 게 아니라 1.5배 빨라진다.

3. **AI가 어디까지 하고 어디서 멈추는지를 선언으로 박아둬라.** 내 OS 선언문은 "AI는 정리·해석·전달까지만. 결정·판단은 내가." 이게 있으니 brief-bot이 "이거 해드릴까요?"라고 물으면 안 된다는 게 자동으로 결정된다. **선언문이 없으면 부품마다 매번 결정해야 한다.**

4. **인터페이스 하나만 잘 그어두면 어댑터는 복붙 비용**. `domain/calendar_source.dart` 추상화 덕에 Google → Notion → Naver → iCal까지 같은 모양으로 붙였다. 첫 어댑터를 만들 때 인터페이스에 시간을 쓰는 게 두 번째 어댑터부터 본전을 뽑는다.

5. **비공식 OS API는 "되면 좋고 안 되면 fallback" 으로 설계.** Wallpaper-pin은 Win32 비공식 트릭이라 언제든 깨질 수 있다. → 실패 감지 후 "always-on-top 해제"로 자동 폴백. **취약한 의존은 격리하고 폴백 경로를 미리 박아두면** 깨져도 앱 전체가 죽지 않는다.

---

## 미션2: SNS 작성

https://www.linkedin.com/posts/thinkys_swmudutfmtmmrvp-spuujosvitmmrvp-2syoupistwtyt-share-7461707125069873152-nnAX?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEkUG7EBWf-aSRdClqvoqLnb72Q5PnusCoY
---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
