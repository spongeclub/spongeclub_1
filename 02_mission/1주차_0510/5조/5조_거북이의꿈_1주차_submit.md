---
team: 5조
member: 거북이의꿈
role: 조원
week: 1
submitted: false
---

# 1주차 과제 — 거북이의꿈

## 미션 1: claude code 로 인터뷰스킬 사용해서 인터뷰 까지 진행

### Summary
- `selfishclub/os-interview-skill` git clone 후 Claude Code에서 6단계 인터뷰(Phase 1~3 / Step 1~6) 진행
- 결과물: **OS 청사진(`os-blueprint.md`) + 첫 부품(`sogood-writer.skill.md`)** 동시 출력
- project-level Junction 설치로 이 볼트에서 자동 발동 가능
### 최종 구현 결과물
- **OS 선언문**: _"나는 상품 발굴과 기획·영업 판단만 하고, 나머지는 시스템이 한다."_
- OS 청사진 : [os-blueprint.md](5조_거북이의꿈_1주차_os-blueprint.md) (선언문·풍경·통점·이상향·부품 후보 5개·첫 부품·다음 부품)
- 첫 부품 : [sogood-writer.skill.md](5조_거북이의꿈_1주차_SKILL.md)
    - 4단계 인터뷰 (명세 → 자료 픽업 → 출력 → 변형)
    - 5개 harness 룰 (위키 부재 / 앵글 부재 / 식약처 표시 규정 점검 / "다 만들어줘" 차단 / 추상 단어 차단)
- `.claude/skills/sogood-writer` — project-level Junction 링크 (이 볼트에서 자동 발동)

### 과정 (타임라인별 + 삽질)
- 1차 시도
	- LLM Wiki 세팅
		- 옵시디언에 LLM Wiki 세팅 위한 인터뷰 진행
		- 옵시디언에 LLM Wiki 세팅
		- 업무 전반에 대한 Wiki 구조 완성
	-  스폰지클럽 OS 세팅
		- LLM Wiki와 다른 폴더에서 스폰지클럽 OS스킬로 인터뷰 진행
		- os-blueprint.md 1차 완성
	- 문제점 
		- OS스킬 인터뷰 과정에서 LLM Wiki가 너무 광범위한 업무 범위로 세팅된 것 파악
		- OS스킬이 만들어준 부품과 LLM Wiki의 연결 고리 없음
- 2차 시도
	- **Wiki 업무 범위를 좁힘** : 업무 전체 LLM Wiki → 컨텐츠 제작 OS로 초점 조정
	- **영역 분리·연결 구조 정립** : 같은 볼트 안에서 LLM Wiki(데이터) / OS 부품(연산) / Output(결과)이 섞이지 않도록 `0~3` 폴더 + 절대 원칙 명문화

### 공유할만한 인사이트
- **한번에 시간 들여서 잘하기 쉽지 않음. 냅다 한번 해보고, 문제점 고민해본 뒤 다시 하면 훨씬 좋음 
- 기존 맥락이 풍부하면 인터뷰 압축 가능 : 6단계를 정직하게 다 묻기보다, AI가 가설을 던지고 사용자가 검증·보완하는 방식이 시간 1/4 수준으로 단축 + 더 정확한 결과

---

## 미션 2: 따라해보고 싶은 개인/업무/삶 OS 따라서 만들어보기 - SNS(유튜브 등) 에서 찾아 벤치마킹 해오기

### Summary
- 목표 : 내가 판매하고 있는 상품의 컨텐츠(SNS컨텐츠&광고소재) 기획 및 제작을 지원하는 OS 구축
- 배경 
	- 1인기업 이커머스 유통의 한계 : 혼자 A to Z를 다 감당해야 함
	- 업의 본질에 더 가까운 "상품"과 "판매(영업)"에 더 집중하기 위해 컨텐츠 제작에 대한 부담을 줄이고자 함 cf) 컨텐츠 제작은 내가 가장 못하는 영역
- OS 구조
	- 플랫폼 : 옵시디언 LLM Wiki + Claude Code 
	- 데이터베이스 (6종 — 마케팅 5C + Reference 프레임워크)
	    - 자사 (Company) : 자사 브랜드 제품·브랜드 자산·자사 발화
	    - 경쟁사 (Competitor) : 경쟁사 제품·가격·컨텐츠
	    - 고객 보이스 (Customer/VOC) : 후기·검색어·커뮤니티·Q&A
	    - 시장·환경 (Context) : 트렌드·시장 분석·법규·표시 규정
	    - 채널 (Channel) : 쿠팡·네이버·SNS 정책·알고리즘·자사 퍼포먼스
	    - 레퍼런스 (Reference) : 벤치마킹 컨텐츠·마케팅 노하우
	- 컨텐츠 유형
		- 블로그 (글+이미지)
		- 카드뉴스 (이미지) 
		- 숏폼 (영상)
	- 컨텐츠 제작 에이전트
		- 기획자 (Planner) : 위키+트렌드+분석 → 주제·앵글·컨텐츠 캘린더
		- 큐레이터 (Curator) : raw → wiki (ingest·lint·query)
		- 작가 (Writer) : 위키+기획 → 카피·대본·비주얼 프롬프트
		- 비주얼 (Visual) : 작가 프롬프트 → 이미지·영상·합성물 (Gemini API, Higgsfield MCP, 리모션, FFmpeg 통합)
		- 분석가 (Analyst) : 채널 데이터 → 인사이트 → 위키 환류 (복리 구조의 핵심 고리)
- 벤치마킹
	- LLM Wiki 구축 :  [카파시의 LLM Wiki로 나만의 AI 세컨드 브레인 만들기 - 브레인 트리니티](https://www.youtube.com/watch?v=cNlvrU-KcRg&t=1678s)
	- 에이전트 세팅 : [코딩1도 모르는 직장인을 위한 Claude Code 시작 가이드 - 일잘러 장피엠](https://www.youtube.com/watch?v=C6xlOsQFyOQ&t=2396s) / [나의 AI 에이전트 전환기 - 일잘러 장피엠](https://www.youtube.com/watch?v=c-a4GBOxhXQ)
	- 영상자동화를 위한 에이전트 세팅 : [클로드 코드로 긴 영상을 100% 자동으로 만들어보았습니다 - 빌더조쉬](https://www.youtube.com/watch?v=JQRr7xhr4OM)
	- 

### 최종 구현 결과물
- 옵시디언 LLM Wiki 볼트 세팅 완료
    - 폴더 구조 : `0. Inbox` / `1. raw` (6종 DB 하위) / `2. wiki` / `3. Output`
    - 다층 CLAUDE.md 가이드 (루트 + 폴더별 4개) — 절대 원칙·파일 번들 규칙·수정 트리거 규칙·8단계 Ingest 정립
- 첫 데이터 ingest : 아르밍 9개 제품 (raw 9 + wiki 14페이지 = 브랜드 1 / 제조사 1 / 라인업 3 / 상품 9)
- 루트 메타 문서 5종 정립 : `README.md` / `OS 청사진.md` / `OS 개발 로그.md` / `CLAUDE.md` / `나의 핵심 맥락.md`
- 첫 부품 `sogood-writer` 설치 완료 (project-level Junction)
![[Pasted image 20260510125554.png]]
### 과정 (타임라인별 + 삽질)
- LLM Wiki 정련 : frontmatter·파일명 규칙 정립 + raw 9개 lint
- CLAUDE.md 룰 강화 : **볼트 운용 절대 원칙(4개)** / **파일 번들 규칙(5개)** / **수정 트리거 규칙(4단계)** / **Ingest 8단계** 신설
- 에이전트 5종 MECE 재설계 : 총괄·Wiki·작가·이미지·영상 → 기획자·큐레이터·작가·비주얼·분석가 (CE 누락 = 기획·분석 / ME 모호 = 이미지 vs 영상)
- DB 5종 → 6종 재설계 : 마케팅 5C 프레임워크 적용으로 **고객 VOC·채널·법규 누락** 발견 → 6종으로 재구성
- raw 폴더 재편 : `brands/products/market/meetings/media` → `company/competitors/voc/context/channels/references`
- 메타 문서 5종 정립 (README + OS 청사진 + OS 개발 로그 + CLAUDE.md + 나의 핵심 맥락) — 루트에 평면 배치
- 첫 부품 `sogood-writer` 인터뷰·생성·project-level 설치

### 공유할만한 인사이트
- **Wiki와 OS 영역 분리 + 연결**: 한 볼트 안에서 데이터 레이어(LLM Wiki) / 연산 레이어(OS 부품) / 결과 레이어(Output)가 섞이지 않도록 0~3 폴더 + 절대 원칙 명문화 → 1차 시도의 가장 큰 고민이었던 영역 혼재 해결
- **MECE는 도구가 아니라 책임 기준으로**: 도구별 분리(이미지/영상 에이전트)는 회색지대(썸네일·카드뉴스 등) 발생 → 책임 기준(텍스트/비주얼) 통합이 깔끔
- **5C 프레임워크로 DB 검증**: 데이터 쌓기 전에 마케팅 프레임워크에 매핑하면 누락 자동 발견 (고객 VOC·채널·법규). 5C가 안 맞으면 마케터 OS로 부족
- **데이터 쌓기 전에 설계 잘 하기**: 6종 폴더가 거의 빈 상태지만 분류가 명확하면 향후 ingest 시 망설임 X. 빠른 ingest보다 사전 설계가 복리
- **메타 문서는 루트에 평면으로**: README / OS 청사진 / OS 개발 로그 / CLAUDE.md / 나의 핵심 맥락 — 깊은 폴더보다 한눈에 보이게
- **"기록 → 품질 → 실행력"의 복리 구조는 분석가 부품이 핵심 고리**: 결과물이 위키로 환류 안 되면 사이클이 끊김. 첫 인터뷰 결과 분석가가 다음 부품 후보 중 우선순위 높음

---

## 미션 3: AI 도움 없이 1주차 SNS 글 작성 - 링크드인/인스타그램

### 링크
- [인스타그램](https://www.instagram.com/p/DYJUS1OiZ0d/)
- [링크드인](https://www.linkedin.com/posts/%EB%B3%91%EC%9A%B0-%EB%82%98-6a4299ba_swmudutfmtmmrvp-srarxguikreeqnc-sqsqwhregtfx-activity-7459106253831811072-AHg5?utm_source=share&utm_medium=member_desktop&rcm=ACoAABlQkZwBRkgfpdzT7SvLC8CMy68fZNbn1NE)
<!-- 작성한 SNS 글 URL -->
