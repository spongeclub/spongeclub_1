---
team: 5조
member: 거북이의꿈(나병우)
role: 조원
mvp: false
OS: true
배포사이트: false
기타: false
---

> [!tip] 작성 안내
> - 이 노트 1개 = 산출물 1개입니다.
> - 위 속성에서 **카테고리(OS / 배포사이트 / 기타) 중 해당하는 것 하나만 체크**하세요.
> - **추가 산출물 노트는 옵시디언 터미널에서 Claude Code 실행 후 `/gallery` 로 생성**하세요.
> - 다 채우면 같은 터미널에서 `/submit` 으로 제출합니다.

# 콘텐츠제작OS

- **배포 링크**: Local PC

## 📸 캡처 이미지
![](attachments/Pasted%20image%2020260614183949.png)

## 💬 WHY — 왜 만들었나
> 컨텐츠 생성 작업을 할 때마다 계속 똑같은 프로세스가 반복되는 소모성 업무
> 이 과정을 자동화 하고, 그 과정과 결과물을 자산화하고 싶었음


## 📝 한 줄 소개
> 내가 판매하고 있는 상품의 컨텐츠(SNS컨텐츠&광고소재) 기획 및 제작을 지원하는 OS


## 😣 Before → ✨ After
- **Before**: 작업할 때마다 각 AI에 내 제품 정보를 프롬프팅해야만하는 무한반복
- **After**: 이 과정을 "한 번 쌓으면 재사용되는 자산"으로 바꿀 수 있다

## 🎯 주요 기능 (3~5개)
- 내 제품 정보를 LLM Wiki로 만들고 이것을 MCP서버로 세팅 : 어떤 AI(LLM)에도 연결해서 활용 가능
- 컨텐츠 제작과 관련된 skill, tool들을 모아 자산화
- 리소스, 레퍼런스, 템플릿들을 모아 자산화(라이브러리)
- 클로드코드(with VSCode), 헤르메스+슬랙 등 다양한 환경에서 컨텐츠 자동 생성-

## 🔧 이렇게 만들었어요 (기술 스택)
- 데이터 : LLM Wiki (Markdown+Git) · MCP 서버
- 연결 : Cloudflare Tunnel · 자체 OAuth(PIN)
- 두뇌 : Claude Code · Claude for Chrome · Claude Web · Hermes+Slack
- 생성 : SUNO(음악) · ElevenLabs(음성) · chatGPT(이미지) · google(이미지)· higgsfield(이미지/영상)
- 렌더링 : Remotion · HyperFrames

## 💡 삽질 & 인사이트
- 절대로 1번에 되지 않는다 : 점검→복구→재점검 반복하면 비전문가도 완성도를 올린다· 
- 모른다고 포기하지 말자. 목적만 알면 AI가 어떻게든 방법을 찾는다.
- 본질은 '도구'가 아니라 '시스템(자산)'이다
