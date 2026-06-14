---
team: 3조
member: 개미
role: 조원
week: 5
submitted: true
---

# 5주차 과제 — 개미

---

## 즐거운 개미집

PC view Link : https://joyful-ant-house.vercel.app/
mobile view Link : http://localhost:3000/dev/mobile-preview
## 1) 신청(참여) 도메인 — 기능·정책 정비 (6/1~6/2)

사용자 신청 흐름의 상태·노출 규칙을 다듬은 작업.

- **거절 사유 신청자 노출** (`3b02418`): 신청자에게 `reject_reason`(거절 사유)만 보이도록 공개. 운영 전용 필드는 계속 숨김.
- **거절 사유 fallback 문구 + /my UX 메모 정비** (`eb58e16`)
- **본인 신청 취소(대기 상태)** (`4548bab`, Reason-C-2): 사용자가 `applied` 상태 신청을 스스로 취소 가능.
- **취소·확정 후 재신청 허용** (`65623b8`, Reason-C-3) → **재신청 게이트를 "가장 최근 상태(latest)" 기준으로 정렬** (`667cd6e`, fix): latest가 `canceled`/이력없음이면 허용, `applied`/`confirmed`/`rejected`면 차단.
- **개발용 모바일 뷰포트 프리뷰 추가** (`d565479`, `/dev/mobile-preview`).

## 2) 작업 표준·운영 체계 구축 (6/3~6/4)

"어떻게 일할지"를 코드화한 메타 작업.

- **CLAUDE.md 표준 + 참여 플로우 정책 문서 신설** (`52ff7bf`).
- **reviewer subagent를 push 게이트에 연결** (`2f5a3b4`, §4): commit·push 전 6항목 독립 점검.
- **§1.5 코드 작성 원칙** (`b84d5b2`): 단순성·최소변경·변경경계·가정명시.
- **§4 배포 규칙 정비** (`19ab548`): push는 항상 승인, 저위험만 자동 commit 허용.
- **§7 세션 재시작 안내 의무** (`06a624a`): CLAUDE.md·.claude 설정 변경 시 보고에 명시.
- **.claude 설정 버전관리** (`5de8fe7`): `settings.json`·`agents/reviewer.md`만 추적 허용(나머지 .claude는 금지 유지).

## 3) UX v2 개편 — 작업지시서 기반 단계적 리뉴얼 (6/4~6/7)

브랜드/디자인 시스템·정보구조 확정 문서(v2)에 맞춘 화면 개편. **Phase 단위로 검증→reviewer→승인→배포**.

- **Phase A — 디자인 시스템** (`2e27f1a`): 색 토큰(베이스 `#FBF7EF`·먹색 `#262019` 등) 전역 교체 + 명조 도입.
- **Phase C(기초) — `/moim` 탐색 페이지 신설** (`2c9aae8`): 전용 모임 목록 페이지 + 글로벌 nav 연결.
- **Phase B — 메인 미리보기 전환** (`a97a18c`): 메인 우측을 `MoimPreview`(모집중·일회성 먼저·최대 6개, "전체 보기 → /moim")로 축소, `/moim` 카드 3~4열·일회성 먼저 정렬, 히어로 문구 확정값화.
- **Phase D — 모임 카드 정비** (`43591a6`, `8b7460a`, `1baccef`): 카드 골격 재구성, 신청 버튼 하단 고정(행 정렬), 부제는 상세 페이지에서만 노출.
- **Phase E-1 — 햄버거 전체화면 메뉴** (`5ce2b67`): 전체 화면 오버레이 + 그룹형 내비.
- **폰트 결정 변경** (`6462c7f`): 명조 로딩 제거, **Pretendard로 사이트 폰트 통일**.
- **Phase F — 확정 문구 적용** (`5a0c4ba`): 추천 CTA "내게 맞는 모임 찾기"로 정합.




---

