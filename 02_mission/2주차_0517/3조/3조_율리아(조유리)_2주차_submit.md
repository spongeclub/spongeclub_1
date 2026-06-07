---
team: 3조
member: 율리아
role: 조원
week: 2
submitted: true
mvp: false
mvp_reason: ""
---

# 2주차 과제 — 율리아

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

> [!info] 내가 정의한 운영체제
> 내가 이번 주에 정의한 운영체제는 "나는 사고와 결정만 하고, 담당자들은 직접 실행하는 시스템"이다. 앱 하나를 만드는 것보다, 어떤 입력은 어디로 들어가고, 어떤 일은 누가 처리하고, 어떤 기억은 어디에 남길지를 정하는 일이 더 중요하다고 느꼈다.

### Summary
이번 주에는 Yulia를 단순한 웹사이트나 텔레그램 봇이 아니라, 내 개인/업무 흐름을 굴리는 로컬 우선 OS로 재정의했다. 핵심 구조를 `Paperclip = control plane`, `Hermes Agent + Gemini CLI = execution plane`, `Markdown = memory plane`, `Telegram/Discord/CLI = interface plane`으로 나누고, 각 층이 맡아야 할 역할을 문서와 코드로 정리했다.

처음에는 LLM Wiki와 텔레그램을 연결해서 세컨 브레인을 만드는 데 집중했다. 내가 던진 생각과 자료를 잘 기억하고 다시 찾아주는 시스템이 목표였다. 그런데 Paperclip을 보면서 방향이 바뀌었다. Paperclip이 Jira처럼 일과 상태를 관리할 수 있어 보였고, 여기에 담당자 페르소나를 붙이면 단순히 기억하는 비서가 아니라 실제로 일을 나눠 맡기는 팀 운영체제가 될 수 있겠다고 생각했다.

그래서 Yulia 안에 비서팀, 주식 리서치팀, 회사 업무팀 같은 구조를 상상하고 만들기 시작했다. 요즘 관심 있는 주식 리서치도 맡기고, 회사 업무도 company와 팀 단위로 나누고, 각 담당자 페르소나를 Discord에 연결해서 일을 시키고 보고받는 체계를 목표로 잡았다. 아직 완성형은 아니지만, 여기서 "한 명의 비서"가 아니라 "여러 담당자로 확장되는 운영체제"라는 감각이 생겼다. Discord 연결은 아직 삽질 중이지만, 이 삽질 자체가 세컨 브레인에서 팀 운영 OS로 넘어가는 과정이었다.

또 하나의 현실적인 결정은 모델 비용이었다. Claude는 품질은 좋지만 계속 실행 plane에 붙이기에는 비용 부담이 컸다. 그래서 반복 실행과 담당자 작업에는 더 저렴하게 돌릴 수 있는 Gemini CLI를 붙이는 방향으로 잡았다. 내 OS에서는 "똑똑한 모델 하나"보다, 역할에 맞는 모델을 비용까지 고려해서 배치하는 게 더 중요했다.

### 최종 구현 결과물
- `docs/OS_ARCHITECTURE.md`: Selforge/Yulia OS의 전체 구조와 단계별 방향 정리
- `docs/OS_IMPLEMENTATION_GUIDE.md`: 다른 사람이 따라 구현할 수 있는 가이드와 시각 자료
- [YULIA_WEEK2_FLOW.html](attachments/YULIA_WEEK2_FLOW.html): 2주차 작업 흐름을 한눈에 볼 수 있게 정리한 HTML 첨부 파일
- Telegram local daemon, Paperclip/Hermes worker, Discord operations alert, Markdown wiki pipeline 관련 스크립트와 라이브러리
- Paperclip company/team 구조: 개인 비서팀, 주식 리서치팀, 회사 업무팀처럼 역할별 담당자를 둘 수 있는 운영 방식
- 담당자 페르소나와 Discord 연결 구상: Discord에서 일을 시키고 결과를 보고받는 구조
- KakaoTalk, Calendar, YouTube, Telegram link를 raw/source/distilled markdown으로 연결하는 작업 흐름
- `package.json`에 `telegram:daemon`, `wiki:batch:source`, `wiki:batch:distill`, `paperclip:hermes-worker`, `discord:test`, calendar/wiki 테스트 명령 정리
- Claude 대신 반복 실행에 Gemini CLI를 붙이는 model routing 방향 정리

### 과정 (타임라인별 + 삽질)
- 2026-05-12: Selforge V1 방향을 정하기 위해 `input -> store -> reflect` 중심의 성찰 OS와 `todo/calendar/slack briefing` 중심의 action OS 사이의 갈림길을 인터뷰 방식으로 정리했다.
- 2026-05-12~17: 처음에는 LLM Wiki와 텔레그램을 붙인 세컨 브레인에 집중했다. 그런데 Paperclip을 보면서 기억 저장소만으로는 부족하고, 일을 쪼개고 담당자에게 맡기고 상태를 보는 control plane이 필요하다고 판단했다.
- 2026-05-17: `OS_ARCHITECTURE.md`에서 구조를 다시 잡았다. Paperclip은 기억 저장소가 아니라 작업 상태와 조율을 맡고, 실제 실행은 Hermes/Gemini CLI가 맡으며, 기억은 Markdown/Obsidian에 남기는 방향으로 정리했다.
- 2026-05-17: 비서팀, 주식 리서치팀, 회사 업무팀처럼 담당자 페르소나를 나누는 방향을 잡았다. Discord로 일을 시키고 보고받는 구조를 붙이려고 했지만, 연결은 아직 삽질 중이다.
- 2026-05-17: Claude를 계속 실행 plane에 쓰기에는 비용 부담이 커서, 반복 실행과 worker 작업에는 Gemini CLI를 붙이는 쪽으로 model routing을 정리했다.
- 2026-05-17: Calendar는 Google OAuth를 우선하고 bridge를 fallback으로 두는 식으로 정리했다. Calendar intent/resolver, Google calendar helper, Paperclip client, relay routing, wiki memory 쪽 코드가 함께 수정됐다.
- 2026-05-17: Windows에서 npm 실행 방식, Paperclip API 응답 shape, 한국어 payload 인코딩처럼 실제 운영 중 걸리는 문제를 구현 가이드에 기록했다.

### 공유할만한 인사이트
- OS를 만든다는 건 화면을 하나 만드는 일이 아니라, interface/control/execution/memory plane을 분리해서 내 일의 흐름을 설명 가능하게 만드는 일에 가깝다.
- Paperclip 같은 task board를 "brain"으로 쓰려고 하면 기억이 너무 흐려진다. 작업 상태는 Paperclip, 장기 기억은 Markdown/Obsidian, 실행은 Gemini CLI처럼 역할을 나누는 편이 더 오래 간다.
- raw data를 바로 graphify하지 않고 `raw -> source -> distilled -> graphify`로 한 번 정제해야 관계가 덜 지저분해진다.
- 로컬 OS에서는 "배포 가능한가"보다 "내가 매일 돌릴 수 있는가"가 더 중요한 성공 기준이 된다.
- 세컨 브레인과 팀 운영체제는 다르다. 세컨 브레인은 기억을 잘 찾아주는 시스템이고, 팀 운영체제는 내가 사고와 결정만 하면 담당자들이 실행하고 보고하는 시스템이다. 이번 주에 Yulia가 그 방향으로 한 단계 확장되면서, 만들고 싶은 OS의 스케일이 더 선명해졌다.
- 모델 비용도 OS 설계의 일부였다. Claude처럼 좋은 모델을 모든 실행에 쓰는 것보다, 반복 작업에는 Gemini CLI처럼 더 싸게 돌릴 수 있는 실행자를 붙이는 게 오래 굴러가는 구조에 더 맞았다.
- Discord 연결이 아직 매끄럽지는 않지만, 삽질하면서 오히려 내가 만들고 싶은 게 단순 챗봇이 아니라 "일을 맡기고 보고받는 운영실"이라는 점이 더 분명해졌다.
- 다음 기능을 붙일 때도 "멋있는가?"보다 "반복 결정을 줄이는가?", "나중에 다시 찾을 수 있는가?", "사람이 읽고 고칠 수 있는 흔적을 남기는가?"를 먼저 봐야겠다고 느꼈다.

## 미션2: SNS 작성

https://www.threads.com/@data.yulia/post/DYXPP73mq_6?xmt=AQF0b_ZslbfW7Ck-PuBPO4qrKzQ32JZdsCZdnxTf9l0-gqQ
