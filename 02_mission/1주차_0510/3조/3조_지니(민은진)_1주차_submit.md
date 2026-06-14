---
team: 3조
member: jinny
role: 조원
week: 1
submitted: true
mvp: false
mvp_reason: ""
---

# 1주차 과제 — jinny

## 미션 1: claude code 로 인터뷰스킬 사용해서 인터뷰 까지 진행

### Summary
[selfishclub/os-interview-skill](https://github.com/selfishclub/os-interview-skill) 을 Claude Code에 설치하고,
40분짜리 6단계 OS 인터뷰를 완주했다. 인터뷰 후 새 세션에서 스킬을 직접 수정해 최종 부품이 완성됐다.
결과물: OS 청사진 1장 + C레벨 주간 보고서 자동 생성 스킬
- [os-blueprint.md](../../../../interview-skill/os-blueprint.md)
- [clevel-mkt-report.skill.md](../../../../interview-skill/clevel-mkt-report.skill.md)
### 최종 구현 결과물
1) **`os-blueprint.md`** — 지니의 OS 청사진
- OS 선언문: *"나는 마케팅 액션에 대한 승인만 하고, 나머지는 시스템이 한다."*
- 부품 후보 9개 (입력 처리 / 결정 보조 / 출력 생성 / 소통·관계 4개 묶음)

첫번째 삽질 : 처음부터 ai 마케팅 에이전시 팀 구조 설계 하다가 다시 미시적 접근으로 우회![[Pasted image 20260509031521.png]]
1) **`clevel-mkt-report` Claude 스킬** — 첫 부품 (인터뷰 → 수정 → 완성)
- 트리거: "C레벨 MKT 주간보고", "대표 보고 준비", "주간 보고서" 등
- 4단계: 데이터 수집 → 핵심 이슈 해석 → 비즈니스 언어 번역 → 보고서 확정
- **출력**: PNG 차트 + HTML 보고서 자동 저장
- 저장 위치: `Desktop/mkt_weekly_report/{N월M주차}/`
- `mkt_weekly_{N월M주차}.png` — 차트 6개 합본 이미지
- `mkt_weekly_{N월M주차}.html` — 인터랙티브 보고서 (단일 파일, 인터넷 불필요)
- 색상 컨벤션: 증가(긍정) = 초록, 감소(부정) = 빨강, 역지표(CPA 등) 반전 자동 적용
![[Pasted image 20260509005655.png]]![[Pasted image 20260509005710.png]]
### 과정 (타임라인별 + 삽질)
**스킬 설치**
- GitHub 레포 발견 → README 확인 → 현재 디렉토리에 `git clone` 시도
- **삽질 1**: `interview-skill` 폴더가 이미 spongeclub_1 git repo 안에 있어서 clone 실패
- 해결: `/tmp`에 클론 후 파일만 `~/.claude/skills/os-interview/`로 복사

**OS 인터뷰 진행 (6단계)**
- Step 1 풍경: 솔루션/SaaS 마케팅 리더, 디깅·실무·가족시간 3개 축 파악
- Step 2 통점: C레벨 보고 번역 비용 + 영상 제작 멀티툴 밤샘 → 핵심은 **(a) 시작 전 결정 비용**
- Step 3 이상향: "모니터링·검토가 끝나고 보고서가 나와있어서 나는 결정만 하면 됨"
- Step 4 부품 매핑: 9개 부품을 4개 묶음으로 분류
- Step 5 첫 부품: C레벨 보고 (결정 보조 묶음) + A 스킬 형태 선택
- Step 6 스킬 설계: 트리거·4단계·출력 형식 확정

**스킬 직접 수정 (새 세션)**
- 인터뷰에서 나온 초안 스킬을 새 세션에서 직접 열어 보강
- 출력 방식 업그레이드: 노션 붙여넣기 → **파일 자동 저장** (PNG + HTML)
- 저장 경로·주차 기준·색상 컨벤션 등 운영 규칙 고정

**결과물 파일 저장 이슈**
- **삽질 2**: 한글 경로(`C:\Users\지니\...`)에 Claude Code 쓰기 권한 없음
- 미션 파일은 수동으로 직접 편집
### 공유할만한 인사이트
**"인터뷰가 끝이 아니다 — 수정이 진짜 시작이다"**
OS 인터뷰로 뼈대(스킬 초안)가 나왔고, 실제로 쓸 형태로 만드는 건 그 다음 세션에서 직접 수정하면서 완성됐다. 인터뷰 = 방향 확정, 수정 = 실제 부품 완성.

**"회사 노트북 환경에서는 폴더 전략부터 점검해야 한다"**
스터디에서는 `C:\Users\계정명\` 아래에 폴더를 만들어서 결과물을 체계적으로 관리하라고 했는데, 회사 노트북이라 관리자 권한이 없어서 해당 경로에 쓰기가 막혔다. 결과적으로 스킬 결과물들이 바탕화면에 이리저리 쌓이는 상황이 됐다. 개인 노트북이 아닌 환경에서는 Claude Code 시작 전에 쓰기 가능한 경로부터 확인하고 저장 경로를 미리 고정해두는 게 필요하다.

---

## 미션 2: 따라해보고 싶은 개인/업무/삶 OS 따라서 만들어보기 - SNS(유튜브 등) 에서 찾아 벤치마킹 해오기

### Summary

### 최종 구현 결과물
| 항목                      | 상태          |
| ----------------------- | ----------- |
| Claude Code v2.1.133 설치 | ✅           |
| 프로젝트 폴더 구조 (8개)         | ✅           |
| CLAUDE.md 작업 지침서 (한국어)  | ✅           |
| Figma MCP 연결 · 18 tools | ✅           |
| 디자인 토큰 추출 4개 파일         | ✅           |
| kie.ai API 키 등록         | ✅           |
| kie-ai MCP 전역 등록        | 🔄 다음 세션 확인 |
| Slack MCP 인증            | ⬜ 대기        |

```
src/tokens/
├── colors.js       브랜드 퍼플 8종 + 텍스트 + 배경
├── typography.js   Bai Jamjuree 폰트 3종
├── spacing.js      4px 베이스 14단계
└── variables.css   전체 CSS 변수 통합
```
### 과정 (타임라인별 + 삽질)

✅ Claude Code 설치 → 폴더 생성 → CLAUDE.md 작성 → Figma MCP 연결 → 디자인 토큰 추출 → kie.ai 가입 + API 키 등록

중간 결과)
자사 디자인 GuideSystem, StyleGuide 자동 생성 
![[Pasted image 20260510214701.png]]


⚠️ **삽질 구간** — /logout 대신 /init 실행 / Anthropic 콘솔 그룹 계정 접근 불가 / Figma 토큰 기본값 1day 함정 / kie-ai MCP 경로 3번 변경 (３.5시간 소요)
![[Pasted image 20260509031135.png]]
두번째 삽질중。。。
**총 ５시간 | 실제 작업 1.5h + 삽질 ３.5h**

### 공유할만한 인사이트
**잘 된 것**

- claude.ai 계정 MCP가 Claude Code에 자동 연동 — 별도 설치 없이 Figma 18 tools 즉시 사용
- 토큰 미정리 Figma 파일에서도 역추출로 4개 토큰 파일 자동 생성
- CLAUDE.md 한번 작성하면 이후 모든 요청에 팀 규칙 자동 참조

**교훈**

- Figma 토큰 발급 시 **반드시 90 days로 변경** (기본값 1 day)
- 로컬 MCP는 claude.ai 계정에 없는 서비스만 추가 가능
- Claude Code 구독자는 Anthropic API 키 없이도 파이프라인 구성 가능
**다음 세션:** kie-ai MCP 확인 → Slack 인증 → 첫 콘텐츠 생성 테스트 🚀
---

## 미션 3: AI 도움 없이 1주차 SNS 글 작성 - 링크드인/인스타그램

### 링크
[https://www.instagram.com/p/DYFgpUvE7tk/?igsh=Z3ZjazA0c3VkZzU5](https://www.instagram.com/p/DYFgpUvE7tk/?igsh=Z3ZjazA0c3VkZzU5)
