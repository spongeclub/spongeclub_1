---
team: 4조
member: 찌니
role: 부조장
week: 5
submitted: true
---

# 5주차 과제 — 찌니

## 🤖 AI 초안 (개인 참고용)



---

## 미션1: <새로운 마음으로 다시>

### Summary
 기존 weeve(라이브)는 그대로 두고, 데이터·파이프라인을 새로 설계하는 별도 레포 `weeve-next`로 전면 재설계 착수. 4주차의 "과한 기획 → 꼬임" 반성을 반영해 구조부터 정리하고 하네스를 새로 깔았다.
 
### 최종 구현 결과물
- weeve-next 신규 레포: 설계 `docs/DESIGN.md`·`docs/STATUS.md`, 기획구조 `docs/기획구조_정리.md`
- 하네스 6종: `lib/harness/` — factGraph / outline / narrative / photoAnalysis / layout / guard (+ 대응 프롬프트 `prompts/*.md`)
- 오케스트레이션: `lib/orchestrator.ts`, 레이아웃 분배 `lib/layout/distribute.ts`·`picker.ts`
- 데이터: `lib/schema.ts`·`lib/sections.ts`, Supabase 연동 `lib/supabase.ts`·`lib/storage.ts`·`supabase/schema.sql`
- Next.js 앱/라우트: `app/layout.tsx`·`app/page.tsx`·`app/start/page.tsx`, API `api/memorials`·`[id]/recall`·`[id]/generate`·`[id]/portrait`, 공유 페이지 `m/[slug]/page.tsx`·`ShareBar.tsx`
- 기획 자동화: `scripts/gen-plan-xlsx.mjs` (기획 엑셀 ↔ md 변환 검토)

### 과정 (타임라인별 + 삽질)
- 2026-06-04: 기존 weeve 폴더/PRD 분석, "글로벌 반영 부분 우선 제거" 확인 → 기존 구조 정리
- 2026-06-06: `weeve-next` 별도 레포로 새 세션 시작(기존 라이브 유지). 조문보 수집 방식 재기획 — "사진 먼저 등록·편집(첫 우아 포인트) → 남기고 싶은 이야기 위주로 자연스럽게 질문". 사진 보정은 기존 개발 완료분 그대로 이식. 하네스·오케스트레이터·스키마·프롬프트·UI 라우트 일괄 구축 후 로컬 테스트
- 2026-06-07: 위브 리뉴얼 기획을 엑셀(`Siyeon_기획구조_정리.xlsx`) 기반으로 정리 — 클로드 코드로 기획 진행 가능한지 검토, `docs/기획구조_정리.md` + 변환 스크립트 작성

### 공유할만한 
 - 4주차 "과한 기획으로 꼬임" → 5주차엔 별도 레포(`weeve-next`)에서 구조부터 새로 깔고 가는 전략으로 전환
> - 기존 자산(사진 보정)은 재개발하지 않고 그대로 이식 — 버릴 것과 살릴 것을 구분
> - 미션3(SNS 링크)는 AI가 만들지 않습니다. 본인이 작성한 글 URL을 직접 채워주세요. *(세션에서 발견된 링크 단서 없음)*

기획용 스킬 제작 배포
[https://github.com/msjinnyshin-del/service-blueprint](https://github.com/msjinnyshin-del/service-blueprint)

---

## 미션2: <제목>

### Summary


### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션3: <제목>

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
