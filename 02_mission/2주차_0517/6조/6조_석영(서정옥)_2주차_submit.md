---
team: 6조
member: 석영
role: 조원
week: 2
submitted: true
---

# 2주차 과제 — 석영

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary
https://note.seonbiz.com — "코칭 노트" 사이트 0에서 1까지

### 최종 구현 결과물 
- 도메인: `note.seonbiz.com` (서브도메인, 카페24 도메인 + Cloudflare DNS + Cloudflare Pages) - 기술 스택: Astro + MDX + Tailwind + Cloudflare Pages Functions - 디자인 시스템: 종이 질감·잉크 결, 카드/그림자 없음, Terra 컬러 단일 강조, 한글 워드마크 - 로고·파비콘·OG 이미지 SVG/PNG 확정 (딥 그린 + 살구색 마크) - 페이지 구성: 메인 / 블로그 목록(`/blog`) / 블로그 상세 / 상담신청 / About / Footer 링크 - 코칭 4종 카피 확정 (1:1 / 상세페이지 그룹 / 쇼핑몰 그룹 / SEO·AI SEO 그룹) - 상담신청 폼: 이름·연락처·문의 내용 수집 → Cloudflare Pages Functions → Resend(미국)로 메일 전송 - ProfilePage / Person JSON-LD 구조화 데이터

### 과정 (타임라인별 + 삽질
### ### 5/11 월 — 도메인 갈래 정리

`.co.kr` 신규 구매 vs 서브도메인 활용을 검토. `coachingnote.com`은 이미 사용 중이라 막힘.

`blog.seonbiz.com`이 후보로 올라왔지만 사이트 이름 "코칭 노트"와 정확히 맞물리는 `note.seonbiz.com`으로 최종 결정.

메인 도메인 권위를 일부 상속받고, 새 도메인 구매·네임서버 이전 비용도 0원이 되는 결정.

### 5/12 화 — 카페24 서브도메인 혼선

카페24에서 "서브도메인 만들기" 메뉴를 먼저 찾으려 한 자리.

서브도메인은 카페24에서 호스팅 공간을 따로 만드는 게 아니라 DNS에 CNAME 한 줄만 추가하면 된다는 것을 확인.

올바른 순서는 ① Cloudflare에서 등록 → ② 안내받은 CNAME 값을 카페24 DNS에 박기.

### 5/13 수 — 핸드오프 문서 v1.0 작성

빌드 지침을 `CLAUDE_CODE_PROMPT.md` 한 파일로 정리. Astro + Cloudflare Pages 조합 확정.

이미지 자동화는 1단계에서 빼고 frontmatter에 `image_prompt` 필드만 미리 예약(나중에 자동 생성을 붙일 수 있게).

### 5/14 목 — 디자인 토큰 재설계

AI가 추출해준 원본 토큰(회색 본문, 파란 링크, 검정 surface)이 코칭 사이트 톤과 안 맞음.

그대로 쓰지 않고 코칭 노트 정체성에 맞게 토큰 자체를 다시 짬.

### 5/15 금 — Claude Design으로 디자인 시스템 분리

처음엔 "claude.ai 채팅에서 디자인 시스템 md 만들어와서 Claude Code에 투입"하려 했으나, Claude Design(Anthropic Labs 캔버스)이 별도 도구라는 것을 확인.

프롬프트 구조를 캔버스 도구용으로 다시 짬.

핵심 발견은 Claude Design → Claude Code 핸드오프가 공식 기능으로 들어가 있어서 md 파일을 들고 이동할 필요가 없다는 점.

### 5/15~16 — 빌드 단계별 결정 3종

빌드 시작 전 결정을 한 번에 정리했더니 혼란스러워서, **한 번에 한 가지씩** 결정하는 방식으로 전환.

- 폼 처리: Formspree → 최종적으로 **Cloudflare Pages Functions + Resend**로 변경 (무료 한도가 50건 vs 3,000건)
- 블로그 목록 페이지: `/blog` 별도 경로로 확정 (헤더 메뉴 "블로그"가 가는 자리 필요)
- 더미 글 vs 실제 글: **실제 글 3편**으로 시작 (디자인 검증을 한 번에 끝내기 위해)

### 5/16 토 — Claude Code 빌드 시작

`CLAUDE_CODE_PROMPT.md`를 그대로 Claude Code에 투입. 모델은 Opus 4.7로 변경.

첫 권한 요청(`node --version` 같은 안전한 명령)부터 한 단계씩 진행.

도메인은 빌드 단계 6에서 결정하기로 보류하고 `coaching-note.pages.dev` 기본 도메인으로 먼저 배포.

### 5/16 저녁 — DNS·메일 인프라

- GitHub 푸시 → Cloudflare Pages 자동 배포
- `note.seonbiz.com` 커스텀 도메인 연결 (카페24 CNAME)
- Resend 가입 + 도메인 등록
- 카페24가 서브도메인의 MX 레코드를 지원하지 않는다는 문제 발견 → **DNS를 카페24에서 Cloudflare로 통째로 이전 결정**
- 네임서버 변경(rajeev/sharon.ns.cloudflare.com), DKIM/SPF/MX 레코드 추가
- Resend API 키 발급 → Cloudflare Pages 환경변수에 박음
- 상담신청 폼 작동 테스트 완료

### 5/16~17 — OG 이미지 + About 페이지

Claude Design에서 OG 이미지(1200×630px, 딥 그린 + 살구색) 받음.

About 페이지는 Footer에만 링크 노출하는 결정(메인 메뉴는 미니멀 톤 유지).

ProfilePage JSON-LD로 Person entity와 연결해서 entity 권위 보강.

### 주요 삽질 포인트

- 도메인 `.com` 선점되어 있는 것 뒤늦게 발견 → 서브도메인으로 우회
- 카페24에서 "서브도메인 만들기" 메뉴를 찾으려 한 자리. **호스팅 사고방식과 DNS 사고방식이 다르다**는 것을 한 번 정리하고 넘어감
- 첫 Claude Design 프롬프트가 일반 채팅용 구조여서 캔버스 도구에 안 맞았음. 도구를 정확히 파악하지 못한 채 프롬프트를 쓰면 한 번 더 돌아가야 함
- Formspree로 결정했다가, 카페24 MX 제약을 만난 김에 Cloudflare DNS로 통째로 이전하면서 **Resend로 전환**. 처음에 빨리 가려고 골랐던 선택지가, 인프라 전체를 한번 정리하는 과정에서 더 단단한 선택지로 교체됨
- 한 메시지에 여러 결정을 한꺼번에 묻자 진행이 멈춤. **"한 가지씩 묻기"** 룰을 적용한 뒤 흐름이 다시 살아남


### 공유할만한 인사이트

**1. AI 도구는 "역할 분담"이 핵심이다.**

Claude.ai(기획·결정), Claude Design(시각 검증), Claude Code(구현). 한 도구로 다 하려고 하면 어느 쪽도 잘 안 됨. 특히 시각 판단이 큰 작업에서 Claude Code 안에서만 작업하면 "코드는 잘 짜는데 디자인 감각은 제한적인" 자리에서 일하게 된다.

**2. 핸드오프 문서가 진실 공급원이 된다.**

한 번 확정된 `CLAUDE_CODE_PROMPT.md`를 프로젝트 루트에 두면, 빌드 중 "이 색이 뭐였죠?"를 매번 묻지 않아도 된다. AI에게 매번 다시 설명하는 비용이 사라진다. 결정 사항이 바뀔 때(예: 도메인 미정, Formspree → Resend)도 이 한 파일만 수정하면 된다.

**3. 도구의 정체를 정확히 모르면 프롬프트가 헛돈다.**

Claude Design이 일반 채팅창이 아니라 캔버스라는 걸 알자마자 프롬프트 구조 자체가 바뀌었다. "어떤 도구인가"를 먼저 검색·확인하고 들어가야 30분을 아낀다.

**4. 한 번에 한 가지씩 결정하는 게 더 빠르다.**

결정 3개를 한 번에 묻는 메시지보다, 한 번에 하나씩 묻고 답하는 흐름이 훨씬 빠르게 굴러갔다. 결정의 누적이 다음 결정의 맥락이 되기 때문에, 한 번에 다 던지면 오히려 답하기 더 어려워진다.

**5. 빠른 선택과 단단한 선택은 다르다.**

폼 처리를 Formspree로 빨리 가려 했다가, 인프라 사정으로 DNS를 통째로 옮기는 김에 Resend로 다시 정리한 자리. "지금 빠른 것"과 "나중까지 단단한 것"이 갈리는 순간을 일찍 알아채면, 한 번 더 갈아엎는 비용을 미리 절약할 수 있다.

**6. 서브도메인은 호스팅 자원이 아니라 DNS 레코드 한 줄이다.**

호스팅 사고방식(카페24 메뉴에서 "만들기")으로 접근하면 헤맨다. 어디서 호스팅되는지(이 경우 Cloudflare Pages)를 먼저 정하고, 거기로 보내는 신호(CNAME)를 DNS에 박는 게 본질.

---

## 미션2: SEO, AI SEO 편

### Summary
SEO 측면에서는 검색엔진이 사이트를 발견하고 인덱싱할 수 있는 기반(site URL, sitemap, robots.txt, 구조화 데이터)을 정비하고, AI 엔진이 사이트를 인용할 수 있는 신호(Person/WebSite/Article/ProfilePage JSON-LD, llms.txt)까지 확장. Google Search Console, 네이버 서치어드바이저, Bing Webmaster Tools 3사 등록 완료. 데이터 분석 측면에서는 GA4 + GTM 신규 셋업. 코칭 노트 전용 속성과 컨테이너를 분리해서 만들고, BaseLayout에 GTM 코드 설치. 분석 목표는 세 가지로 명확화 — 상담신청 폼 제출자의 소스/채널, 글별 체류 시간, 글별 상담신청 클릭. 이를 위한 CTA 박스 디자인까지 진행.

### 최종 구현 결과물

**기본 메타데이터** - astro.config.mjs site URL을 실제 도메인으로 정리 - OG 메타데이터 정리 (og:url 추가, og:image 절대 URL 변환) - og-default.png 브랜드 이미지 배치 **검색엔진 발견 인프라** - @astrojs/sitemap으로 sitemap.xml 자동 생성 - public/robots.txt (모든 크롤러 + AI 봇 허용, Yeti 명시) - trailingSlash 'never'로 사이트 전체 URL 신호 통일 **구조화 데이터 (JSON-LD)** - Person + WebSite (BaseLayout, 전 페이지 공통) - Article (블로그 글 페이지, frontmatter 기반 자동 생성) - ProfilePage (About 페이지) **시맨틱 마크업** - 사이트 내 모든 날짜 표시를 <time datetime> 태그로 교체 - formatISODate 헬퍼 함수로 변환 로직 단일화 
**페이지 추가** - About 페이지 신설 (코치 소개, 방법론, 도구 안내) - Footer에 About 링크 추가 **AI 엔진용 가이드** - llms.txt 자동 생성 (Astro endpoint) - 글 수에 따라 자동 분기 (≤10 모든 글 / >10 최근 10개) **검색엔진 등록** - Google Search Console — URL 접두어 속성, sitemap 제출 - 네이버 서치어드바이저 — 인증, sitemap 제출 - Bing Webmaster Tools — Google에서 import 방식

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션3: GTM, GA4를 이용한 데이터 분석

### Summary
**계정 구조** - GA4 속성 신규 생성 (G-1MJY8ZYZ2F) — 코칭 노트 전용 - GTM 컨테이너 신규 생성 (GTM-N5Z7VF4W) — 코칭 노트 전용 

**사이트 설치** - BaseLayout에 GTM 메인 스크립트(`<head>` 상단) + noscript fallback(`<body>` 시작) 설치 - Astro의 is:inline 디렉티브로 GTM 코드 원본 유지 

**GA4 연결** - GTM 안에 Google 태그 설정 (트리거: Initialization - All Pages) 
**측정 준비** - 블로그 글 페이지에 상담신청 CTA 박스 디자인 (outline 버튼, 사이트 미니멀 톤 유지) - 측정 시작 전 베이스라인 디자인 정비

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
### 1. "기능상 동작 ≠ 신호가 깨끗함" trailing slash 통일 작업에서 가장 크게 체감. sitemap이 `/blog/011/`을 가리키고 canonical이 `/blog/011`을 가리켜도 검색엔진은 동작한다. 하지만 신호가 일관되지 않으면 크롤러가 매번 정정 단계를 거쳐야 하고, AI 엔진은 두 URL을 별개로 인식할 가능성이 있음. 작아 보이는 정리가 SEO 토대를 결정한다. 

### 2. 작업 순서는 의존성으로 정해진다 처음에는 "Tier 1의 5개 항목"으로 평평하게 나열돼 있었지만 실제로는 의존성이 있음. site URL → sitemap → robots.txt → JSON-LD가 한 줄기. og-default.png와 JSON-LD는 독립 트랙. 의존성을 먼저 파악하고 순서를 짜면 한 번의 결정이 여러 단계에 영향을 줌 (예: site URL 교체 1줄이 canonical/og:url/sitemap 모두에 자동 반영). ### 3. 클로드 코드의 보수적 동작이 안전망 클로드 코드가 "명시적 요청 범위 밖"이라며 인접 정리를 미루는 동작이 처음엔 답답해 보였지만, 실제로는 안전 마진. TODO 주석 정리도, 푸시도, force push도 본인 명시 지시 없이는 진행 안 함. 1인 개발에서 실수를 막아주는 가드레일. 

### 4. 결정은 자주 바뀐다 — 그게 정상 한 세션 안에서 결정이 여러 번 바뀜: - 검색엔진 등록 방식: 도메인 속성 → URL 접두어 - Bing 등록: 메타 태그 → import - About 페이지 작업 방식: 골격 먼저 → 콘텐츠 먼저 - llms.txt 글 나열: 모든 글 → 글 수 분기 자동화 - CTA 위치: 본문 끝 + 사이드바 → 본문 끝만 결정 변경에 따라 작업 흐름이 재구성되는 게 자연스러운 진행. 새 정보(클로드 코드의 분석, 사이트 톤 검토 결과)를 받았을 때 결정을 바꾸는 게 합리적. 

### 5. GEO와 SEO는 다른 작업이다 전통 SEO가 "검색엔진이 사이트를 찾아오게 하는 작업"이라면, GEO는 "AI 엔진이 사이트를 인용하게 하는 작업". 똑같이 메타데이터를 다루지만 목적이 다름. - SEO 신호: sitemap.xml, robots.txt, canonical - GEO 신호: JSON-LD entity 그래프, llms.txt, 1인칭 경험 콘텐츠, 명명된 entity (도구명, 인물명) 코칭 노트는 SEO보다 GEO에 더 강점이 있는 사이트. 1인칭 코칭 경험, 8년 누적, 구체 도구명. 그래서 Person/Article schema + llms.txt 작업이 sitemap/robots만큼 중요했음. 

### 6. 표준 도구의 약점은 보완으로 메운다 GA4가 글로벌 표준이지만 한국 시장 데이터(네이버 검색어)와 AI 검색 referral 추적에는 사각지대가 있음. 표준만 쓰지 말고 네이버 서치어드바이저 병행, Bing 등록(ChatGPT가 Bing 인덱스 사용)으로 사각지대를 보완. 

### 7. 측정 시작 전 베이스라인 정비 CTA 박스 작업을 측정보다 먼저 하기로 결정. 이유: 측정과 디자인 변경이 섞이면 인과 분리가 어려워짐. 모든 글이 동일한 CTA 상태에서 데이터를 쌓아야 글 간 비교가 의미 있음. 클라이언트에게 코칭할 때도 동일한 원칙 — "디자인 바꾸기 전에 데이터부터 본다"는 측정 시점부터 정확하게. 

### 8. 자동화는 미래의 부담을 0으로 만든다 llms.txt와 Article JSON-LD 둘 다 frontmatter 기반 자동 생성. 새 글 발행 시 markdown 파일 하나만 추가하면 sitemap, llms.txt, Article schema가 모두 자동 갱신. 초기 셋업 비용을 한 번 치르면 미래 운영 부담이 0이 됨. 1인 운영 환경에서 가장 큰 자산.