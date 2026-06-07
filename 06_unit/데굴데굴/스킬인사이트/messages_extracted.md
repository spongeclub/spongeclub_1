# 스킬&인사이트 메시지 추출표

> 2026-05-25 기준. raw_data.md(357개 메시지)에서 /써본스킬 · /써보고싶은스킬 · /공유 메시지 전체 추출.
> 이 파일은 Claude Code가 1차 자동 매칭한 결과임. **Step B에서 코니가 직접 검증 + 인용 픽.**

---

## 검증 가이드

코니가 각 행을 보면서:
- [ ] 스킬 슬러그가 맞는지 확인 (본문 다시 읽고 싶으면 슬랙 URL 클릭)
- [ ] 한 줄 요약이 핵심을 잘 담았는지 보정
- [ ] 인용으로 쓸 만한 문장 메모 (슬랙 원문 참고)
- [ ] 신규 스킬이면 슬러그 새로 정해주기

비고 컬럼의 ⚠️ 표시는 코니 확인이 특히 필요한 항목.

---

## /공유 (14개 접수 + 1개 미접수)

> 스킬을 직접 써보지 않고 발견·공유하는 게시 유형. 접수 시 +1 셸.

| # | 작성일 | 작성자 | 스킬 슬러그 | 한 줄 요약 | 이모지 반응 수 | 쓰레드 답글 수 | 슬랙 원본 URL | 비고 | discovered_skills |
|---|--------|--------|------------|-----------|:---:|:---:|------|------|------|
| G1 | 5/10 PM 2:45 | 비비안 | supabase-agent-skills | Supabase AI 에이전트 공식 스킬 모음 | 2 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778391908868909 | 테스트 등록 건. G2 채택으로 제외 | - |
| G2 | 5/10 PM 3:06 | 다니(송다은) | supabase-agent-skills | Supabase AI 에이전트 공식 스킬 모음 | 0 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778393191102419 | 다니 본인 직접 등록. 채택본 | - |
| G3 | 5/10 PM 7:04 | 젬마(신주혜) | (미상) | 인스타그램 URL만 있음 — 스킬 본문 없음 | 0 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778407448985349 | 내용 없음 (인스타그램 URL만). 포맷 테스트로 추정. 제외 | - |
| G4 | 5/11 AM 11:44 | 먼지민(석지민) | claude-hud | 터미널 입력창 아래 컨텍스트·모델·브랜치 상시 표시 플러그인 | 1 | 3 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778467459173629 | "사용 후기 겸 조건부 추천"이라고 직접 표현 | - |
| G5 | 5/11 PM 7:03 | Galia(방경은) | superpowers | brainstorming 스킬 활용해 텔레그램 OS 규칙 설계한 후기 | 4 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778493796854089 | | - |
| G6 | 5/12 PM 8:52 | 먼지민(석지민) | context7 | AI가 답하기 전 공식 문서 먼저 확인 — "use context7" 한 마디 | 3 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778586767072939 | "야근 덕분에 늦은 퇴근이지만 오늘 실험한 스킬 공유해요" | - |
| G7 | 5/12 PM 11:10 | 민트(최서진) | skillers-finder | 깃허브 못 다뤄도 말만 걸면 원하는 스킬 자동 설치 (진입장벽 0) | 7 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595027541129 | /공유 + /써본후기템플릿 복합 사용. 실질적 써본후기로 재분류 / 발견 결과 미명시 | - |
| G8 | 5/12 PM 11:20 | 달빛그린(윤지윤) | skillers-finder | 캐러셀 제작 목적으로 관련 스킬 10개 추천받아 자동 설치 | 1 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595605045249 | | threads-carousel, open-carrusel, brand-design, instagram-automation 등 |
| G9 | 5/12 PM 11:20 | 신연수 | claude-blog | 블로그 초안 작성~SEO최적화 풀사이클 스킬 패키지 | 3 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595654200289 | | - |
| G10 | 5/12 PM 11:23 | 달빛그린(윤지윤) | threads-carousel | 주제 입력 → 슬라이드 자동 생성 + PNG/PDF 내보내기 | 4 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778595817803409 | | - |
| G11 | 5/12 PM 11:32 | 민트(최서진) | open-carrusel | Chat → HTML/CSS 슬라이드 → PNG export, 대시보드 응용도 가능 | 2 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778596329241979 | | - |
| G12 | 5/12 PM 11:43 | 슬로우퀵(박은아) | claude-design-skill | AI 슬롭 없이 실제 디자인 시스템 기반 결과물 (10가지 스타일) | 3 | 2 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778596990512049 | | - |
| G13 | 5/13 AM 12:04 | 슬로우퀵(박은아) | skillers-finder | "직함 기준 아닌 지금 하고 있는 작업" 기준으로 스킬 탐색 | 4 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778598287559999 | | claude-design |
| G14 | 5/13 AM 12:29 | 애니(박상임) | skillers-finder | 한국 특화 키워드도 WebSearch 5회 이상 돌려서 깃헙·레딧 검색 | 4 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778599757406459 | ⚠️ 봇이 등록한 링크가 skillers-finder가 아닌 다른 레포 — 원문 확인 | cpa-naver-seo |

**미접수 (첫 줄에 /공유 없어서 봇 처리 안 됨 — 내용은 있음):**

| # | 작성일 | 작성자 | 스킬 슬러그 | 한 줄 요약 | 이모지 반응 수 | 쓰레드 답글 수 | 슬랙 원본 URL |
|---|--------|--------|------------|-----------|:---:|:---:|------|
| G-U1 | 5/11 PM 6:29 | 먼지민(석지민) | claude-md-management | CLAUDE.md를 6개 기준 점수 + 개선 diff로 감사해주는 스킬 | 4 | 6 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778491790933989 |
| G-U2 | 5/7 PM 1:02 | 지니(민은진) | toprank | SEO 및 광고 관리용 — 퍼포먼스 마케터 리소스 절감 오픈소스 자동화 도구 | 3 | 3 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778126542472039 |

---

## /써보고싶은스킬 (3개 실질 + 1개 테스트)

> 아직 써보진 않았지만 써보고 싶은 스킬 공유. 접수 시 +1 셸.

| # | 작성일 | 작성자 | 스킬 슬러그 | 한 줄 요약 | 이모지 반응 수 | 쓰레드 답글 수 | 슬랙 원본 URL | 비고 | discovered_skills |
|---|--------|--------|------------|-----------|:---:|:---:|------|------|------|
| W1 | 5/13 AM 11:56 | Galia(방경은) | gstack | CEO·디자이너·엔지니어·QA 역할을 AI에게 맡겨 기획~배포 전체 사이클 운영 | 1 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778640983471469 | | - |
| W2 | 5/14 AM 10:53 | 에밀리 | instagram-claude-skill | 기획→이미지→영상→Instagram 직접 발행까지 자동 | 3 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778723613593079 | | - |
| W3 | 5/14 PM 4:35 | 먼지민(석지민) | claude-mem | 세션 끝나도 이전 작업 기억 — 맥락 재설명 마찰 제거 | 12 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778744105931809 | 반응 12개로 가장 높음 — "저도 꼭 써보고 싶어요" 쓰레드 달림 | - |

---

## /써본스킬 (15개 실질 + 특이사항 2건)

> 직접 써본 후기. 접수 시 +3 셸. 스크린샷 필수(5/14 이후 기준).

| #   | 작성일           | 작성자       | 스킬 슬러그                                                                  | 한 줄 요약                                         | 이모지 반응 수 | 쓰레드 답글 수 | 슬랙 원본 URL                                                                      | 비고                                      | discovered_skills |
| --- | ------------- | --------- | ----------------------------------------------------------------------- | ---------------------------------------------- | :------: | :------: | ------------------------------------------------------------------------------ | --------------------------------------- | ------- |
| S1  | 5/13 AM 2:00  | 슬로우퀵(박은아) | social-media-skills, remotion-ads                                       | 인스타 캐러셀 훅 카피 → 캐릭터 애니메이션 → MP4 영상 출력 파이프라인     |    1     |    2     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778605229551699 | ⚠️ 스킬 2개 조합 후기                          | - |
| S2  | 5/13 PM 12:10 | 하늘(정하늘)   | skillers-finder                                                         | 유튜브 이미지 스킬 찾았는데 설치 에러 — 과정 자체는 유익              |    0     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778641805324849 | ⚠️ "/써본 스킬"(공백 있음)로 입력해서 봇 미접수 / 발견 스킬 슬러그 미명시 | - |
| S3  | 5/13 PM 8:49  | 설록(권효선)   | skillers-finder, interface-design, claude-design, playwright-skill | 대시보드 디자인 + 카드뉴스, 스킬 2번 받아 결과물까지 완성             |    6     |    2     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778672959103529 | ⚠️ 복수 스킬 후기 (설록 케이스)                    | interface-design, claude-design-skill, playwright-skill |
| S4  | 5/17 PM 4:16  | 신연수       | obsidian-cardnews-skill                                                 | 옵시디언 md파일 → 인스타 캐러셀 HTML 8장(1080×1080px) 자동 변환 |    9     |    5     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779002187847939 |                                         | - |
| S5  | 5/17 PM 6:35  | 그린(이유경)   | claude-mem                                                              | 키워드 던지면 이전 세션 기록 정리해주는 메모리 플러그인                |    6     |    5     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779010543580379 | W3(먼지민 써보고싶은스킬) → S5(그린 써본스킬) 연결        | - |
| S6  | 5/18 AM 1:13  | 마라        | skillers-finder                                                         | 스킬의 홍수에서 나에게 맞는 스킬 찾아주는 도구                     |    1     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779034431123459 | 발견 스킬 슬러그 미명시                            | - |
| S7  | 5/18 PM 12:55 | 마라        | project-instruction-optimizer                                           | 프로젝트 지침 진단 → 피드백 반복 → 최종 지침 생성 3단계 메타 스킬       |    2     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779076537316659 |                                         | - |
| S8  | 5/18 PM 3:50  | 키노(강은주)   | skillers-finder                                                         | 1인 사업자 컨텍스트로 WebSearch 8회, 스킬 8개 추천 + 자동 설치    |    0     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779087041530669 | 본문 있음. 키노가 본문 먼저 올리고 /써본스킬 링크를 별도 메시지로 분리한 구조. 원문 확인 완료 | cowork-plugins, ai-social-media-content, kr-gov-grant |
| S9  | 5/19 PM 3:35  | 애니(박상임)   | claude-content-writer                                                   | 원고를 5개 항목 채점 + 필수수정/추천보완/유지강점 피드백              |    7     |    3     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779172558914319 |                                         | - |
| S10 | 5/19 PM 11:34 | 키노(강은주)   | cowork-plugins                                                          | 16플러그인 64스킬, 1인 사장님 한국 특화 비즈니스 마켓플레이스          |    5     |    5     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779201274305039 |                                         | - |
| S11 | 5/20 PM 3:02  | 애니(박상임)   | travel-daily-brief                                                      | 매일 아침 주요 여행 사이트 7곳 프로모션 자동 점검                  |    5     |    4     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779256952666699 | 애니가 직접 제작한 자체 스킬 (슬랙 스레드에서 본인 확인). type 필드에 자체제작 추가 필요 | - |
| S12 | 5/20 PM 3:53  | 하늘(정하늘)   | visualize                                                               | 텍스트/문서 → 단일 HTML, 슬라이드·대시보드·인포그래픽에 강함          |    10    |    1     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779260003285539 |                                         | - |
| S13 | 5/21 PM 2:47  | 먼지민(석지민)  | claude-mermaid                                                          | "그려줘" 한 마디면 mermaid 다이어그램 생성 (문법 몰라도 됨)        |    5     |    2     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779342454650859 |                                         | - |
| S14 | 5/23 AM 6:01  | 키노(강은주)   | web-design-analyzer                                                     | 웹사이트·이미지·스크린샷 → 색·폰트·레이아웃 구조적 분석               |    6     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779483670905089 | S8과 동일 패턴. 본문 먼저 올리고 /써본스킬 링크를 별도 메시지로 분리한 구조. 원문 확인 완료 | - |
| S15 | 5/25 PM 1:12  | 리보(이보경)   | claude-content-writer                                                   | 소스URL+지시 → 페르소나+글 작성+SEO/GEO 채점+이미지 프롬프트       |    0     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779682351783839 |                                         | - |
| S16 | 5/25 PM 11:18 | 신연수       | create-closing                                                          | 인터뷰로 나만의 /closing 워크로그 커맨드를 맞춤 제작하는 생성기 스킬     |    3     |    1     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779718739261449 | 신규 스킬                                | - |
| S17 | 5/26 PM 5:38  | 하늘(정하늘)   | create-closing                                                          | 같은 스킬, 옵시디언 워크로그+git push+마무리 액션 일괄 실행 후기        |    4     |    2     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779784739583829 | 신규 스킬                                | - |
| S18 | 6/1 PM 11:03  | 아가타(정재율)  | create-closing                                                          | 같은 스킬, 일 유형에 맞춰 기록 항목을 추천받아 커스텀한 후기            |    3     |    0     | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780322594888259 | 신규 스킬                                | - |
| S19 | 6/1 | 애니(박상임) | project-starter-kit | 프로젝트 시작 전 CLAUDE.md·AGENTS.md·DESIGN.md 3종 세트를 대화형 인터뷰로 자동 생성 | 3 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780308071047789 | 비비안 스킬 / 신규(6/6 스크레이프) | - |
| S20 | 5/26 | 코니(황초롱) | ai-marketing-campaign-analytics | 광고비 데이터만 있으면 ROAS·CVR·퍼널 분석까지 한 번에 뽑는 월간 리포트 스킬 조합 | 4 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779853414063499 | 코니 본인 후기 / 신규 | - |
| S21 | 5/28 | 마라 | anydesign | 이미지·URL·Figma → 디자인 시스템 design.md 자동 생성 | 5 | 2 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779950544576159 | 솔직한 시행착오 후기 / 신규 | - |
| S22 | 6/6 | 이안(박민우) | automation-level-advisor | 손 떼도 되는 자동화 레벨(oversight)을 판정해주는 스킬 | 0 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780720438221149 | 신규 | - |
| S23 | 5/26 | Galia(방경은) | designing-surveys | Lenny's Podcast 86개 프로덕트 스킬 중 효과적 설문 설계 스킬 | 4 | 3 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779799657541279 | 신규 | - |
| S24 | 5/27 | 아가타(정재율) | diagram-design | 14가지 다이어그램을 자기완결 HTML 한 장으로 (스타일 가이드 게이트) | 2 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779874532486089 | 신규 | - |
| S25 | 5/26 | Galia(방경은) | form-cro | 폼·설문 완료율을 높이는 전환 최적화 스킬 | 2 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779800197185099 | 신규 | - |
| S26 | 5/27 | 아가타(정재율) | os-interview | 40~60분 6단계 인터뷰로 OS 청사진 + 첫 부품 1개까지 산출 | 1 | 3 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779871718218579 | 신규 | - |
| S27 | 5/27 | 아가타(정재율) | telegram-plugin | 휴대폰 텔레그램 메시지를 컴퓨터 Claude가 받아 처리하는 공식 플러그인 | 1 | 4 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779873060011499 | 신규 | - |
| S28 | 5/26 | 찌니(신진영) | pr-marketing-skill | 보도자료 구조·톤 잡아주는 표준 5단 구조 스킬 | 2 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779800712006569 | 신규 | - |
| S29 | 5/27 | 아가타(정재율) | remotion | React 코드로 영상 만드는 Remotion의 함정·핵심 패턴 주입 도메인 스킬 | 1 | 1 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1779874283666739 | 신규 | - |
| S30 | 5/31 | 마라 | web-debug-verify | 단일 HTML/JS 웹앱 버그를 근본 원인→최소 수정→실제 검증 순서로 | 0 | 0 | https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780214579194659 | 신규 | - |

---

## 테스트 메시지 (코니 검증 불필요)

| # | 작성일 | 작성자 | 유형 |
|---|--------|--------|------|
| TEST-1 | 5/13 AM 1:20 | 비비안 | /써보고싶은스킬 (시스템 테스트) |
| TEST-2 | 5/13 AM 1:20 | 비비안 | /써본스킬 (시스템 테스트) |

---

## 스킬별 등장 횟수 집계 (참고용)

> 같은 스킬이 여러 메시지에 걸쳐 등장한 경우 합산. 코니 검증 전 잠정 수치.

| 스킬 슬러그 | /공유 | /써보고싶은스킬 | /써본스킬 | 합계 |
|------------|:---:|:---:|:---:|:---:|
| skillers-finder | G7, G8, G13, G14 (4) | — | S2, S3, S6, S8 (4) | 8 |
| claude-mem | — | W3 (1) | S5 (1) | 2 |
| interface-design | — | — | S3 (1) | 1 |
| claude-design-skill | G12 (1) | — | — | 1 |
| claude-content-writer | — | — | S9, S15 (2) | 2 |
| supabase-agent-skills | G1, G2 (2) | — | — | 2 |
| claude-mermaid | — | — | S13 (1) | 1 |
| claude-blog | G9 (1) | — | — | 1 |
| claude-hud | G4 (1) | — | — | 1 |
| claude-md-management | G-U1 (1, 미접수) | — | — | 1 |
| context7 | G6 (1) | — | — | 1 |
| cowork-plugins | — | — | S10 (1) | 1 |
| gstack | — | W1 (1) | — | 1 |
| instagram-claude-skill | — | W2 (1) | — | 1 |
| obsidian-cardnews-skill | — | — | S4 (1) | 1 |
| open-carrusel | G11 (1) | — | — | 1 |
| project-instruction-optimizer | — | — | S7 (1) | 1 |
| remotion-ads | — | — | S1 (1) | 1 |
| social-media-skills | — | — | S1 (1) | 1 |
| superpowers | G5 (1) | — | — | 1 |
| threads-carousel | G10 (1) | — | — | 1 |
| toprank | G-U2 (1, 미접수) | — | — | 1 |
| travel-daily-brief | — | — | S11 (1, 자체 제작) | 1 |
| visualize | — | — | S12 (1) | 1 |
| web-design-analyzer | — | — | S14 (1) | 1 |
