---
team: 5조
member: 이안(박민우)
role: 조원
mvp: false
OS: true
배포사이트: true
기타: false
---

> [!tip] 작성 안내
> - 이 노트 1개 = 산출물 1개입니다.
> - 위 속성에서 **카테고리(OS / 배포사이트 / 기타) 중 해당하는 것 하나만 체크**하세요.
> - **추가 산출물 노트는 옵시디언 터미널에서 Claude Code 실행 후 `/gallery` 로 생성**하세요.
> - 다 채우면 같은 터미널에서 `/submit` 으로 제출합니다.

# Weft

- **배포 링크**: https://github.com/MinwooPark2026/Weft

## 📸 캡처 이미지
> 스크린샷을 여기에 붙여넣기

## 💬 WHY — 왜 만들었나
긴 설명형 영상을 만들 때 '문장마다 이미지 한 장' 붙이는 반복 편집이 너무 고됐다. 그 노동을 줄이고, 편집 결정을 AI가 만들어 CapCut까지 넘기게 하고 싶었다.

## 📝 한 줄 소개
대본또는 문서만 주면 나레이션·자막·이미지·CapCut 드래프트까지 만들어 주는 워크플로우 CLI

## 😣 Before → ✨ After
- **Before**: 컷마다 이미지·자막을 손으로 붙이고, 웹 편집 앱은 영상이 길어지면 렉이 심했다.
- **After**: 대본 → 콘티 → TTS → 이미지 → CapCut 드래프트를 `weft` CLI로. picker만 선택적으로 사람이 보고 나머지는 AI가 구동.

## 🎯 주요 기능 (3~5개)
- 이중 트랙 모델 — 나레이션 비트와 비주얼 샷을 분리(한 비주얼이 여러 비트 커버 가능)
- `CONTI.md` → 검증·컴파일 → 자막(SRT)·트랙 JSON·render plan 생성
- TTS(Typecast) + 이미지(OpenAI gpt-image-1) 자동 생성
- 로컬 브라우저 picker로 후보 이미지를 단축키로 빠르게 선택
- CapCut 드래프트로 내보내 바로 편집 (최종 렌더는 NLE에 위임)

## 🔧 이렇게 만들었어요 (기술 스택)
Python CLI(pyproject, 전역 `weft` 명령), Typecast TTS API, OpenAI gpt-image-1, CapCut 드래프트 포맷, 로컬 HTTP picker. 런타임 의존성 최소(openai, Pillow).

## 💡 삽질 & 인사이트
- **"렌더를 버리니 GUI도 버릴 수 있었다."** 자체 렌더를 NLE에 넘기자 무거운 웹 GUI가 필요 없어졌고, picker만 남기고 CLI로 내리니 사람이 조작하던 도구가 AI가 호출하는 도구가 됐다.
- 아무리 자동화가 잘 되어도 CLI로 단계별로 개입할 여지를 두면 AI로 컨트롤 할 때 생각지도 못한 좋은 결과를 AI가 만들 수 있다.