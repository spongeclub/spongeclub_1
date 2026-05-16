---
team: 3조
member: 율리아
role: 조원
week: 1
submitted: true
---

# 1주차 과제 — 율리아

## 미션 1: claude code 로 인터뷰스킬 사용해서 인터뷰 까지 진행

### Summary
`os-interview` 스킬(6단계)을 통해 OS 인터뷰 완료. OS 선언문 "나는 생각, 설계만 하고, 나머지는 시스템이 한다" 도출. 첫 부품으로 schema-extract 스킬(BQ/GCS/Sheets 스키마 자동 수집)을 선택하고 실행까지 완료.

### 최종 구현 결과물
   - `SKILL.md` — BQ/GCS/Sheets 스키마 수집 스킬
   - `os-blueprint.md` — OS 청사진 (6단계 인터뷰 결과)
   - `bq-mart-blueprint.md` — BQ 마트 설계 초안
   - `data-catalog/bigquery/` — 39 datasets, 785 tables/views 카탈로그
   - `data-catalog/gcs/catalog.{json,md}` — 16 데이터 버킷 카탈로그
   - `data-catalog/sheets/catalog.{json,md}` — 3개 Sheets 카탈로그

### 과정 (타임라인별 + 삽질)
   - 2026-05-08: `os-interview` 스킬 발동 → Step 1(풍경) → Step 2(통점) → Step 3(이상향·OS 선언문) → Step 4(부품 매핑) → Step 5(첫 부품 결정) → Step 6(결과물 파일) 순으로 완료
   - 2026-05-08: 첫 부품 실행 (`schema-extract`)
     - BQ 수집: `google-cloud-bigquery` Python 라이브러리로 39 datasets, 785 tables/views 덤프 성공
     - GCS 수집: `extracted/` 디렉토리 내 코드 파일 grep으로 `gs://` (GCS 경로) 참조하여 12개 버킷 발견 → `gcloud storage buckets list`로 실제 21개 확인 → 누락 9개 카탈로그에 추가
     - Sheets 수집: Sheet ID가 소스코드에 하드코딩 없이 `os.getenv()`로 관리됨 발견 → `gcloud run services describe`로 Cloud Run env var에서 실제 ID 6개 추출 → Sheets API로 3개 수집 성공, 2개는 403 권한 없음

### 공유할만한 인사이트
   - Google Sheets ID는 소스코드에 하드코딩하지 않고 `os.getenv()`로 관리하는 경우가 많음 → 코드 grep만으로는 못 찾고 `gcloud run services describe`로 실제 env var 값을 가져와야 함.
   - ETL 파이프라인 파악에 코드 분석만으론 한계가 있고 GCP 콘솔/CLI 직접 조회를 병행해야 함.
   - os-interview Step 3에서 "나는 ___만 하고, 나머지는 시스템이 한다" 한 문장을 뽑으면 이후 어떤 작업을 자동화할지 결정 기준이 생김. 추상적인 목표가 아니라 "이 작업이 내 문장에 해당하는가?"로 바로 판단 가능 → 구체적이고 상세한 질문을 통해 목표를 명확하게 해야 함.

---

## 미션 2: 따라해보고 싶은 개인/업무/삶 OS 따라서 만들어보기 - SNS(유튜브 등) 에서 찾아 벤치마킹 해오기

### Summary
   YouTube 영상 "71.5배 토큰 절감, Graphify가 LLM 토큰 비용은 낮추고 답변 정확도는 높이는 방법"(https://www.youtube.com/watch?v=Ma8e25AOtao)을 보고 벤치마킹. 인수인계 없이 넘겨받은 기존 데이터 파이프라인 OS를 `graphify` 스킬로 지식 그래프화해 구조 파악. 문서 + 1,862개 Python 소스(AST) + BQ 테이블 lineage를 통합해 785 nodes / 1,321 edges / 90 communities 그래프 생성.

### 최종 구현 결과물
   - `graph.html` — 인터랙티브 그래프 (브라우저에서 탐색 가능)
   - `graph.json` — 전체 그래프 데이터
   - `GRAPH_REPORT.md` — 커뮤니티·God nodes 리포트

### 과정 (타임라인별 + 삽질)
   - 2026-05-09 06:13: graphify 스킬 첫 실행 시도 → 중단
   - 2026-05-09 08:06: `monorepo/docs/` 그래프 생성 (초기: 197 nodes, 187 edges)
   - 2026-05-09 08:20: `docs/superpowers/specs/`, `os-blueprint-youlee.md` 추가 → 48개 파일 병합 → 245 nodes, 242 edges
   - 2026-05-09 08:28: `extracted/` 1,862개 Python 파일 AST 분석 추가 → 40,376 nodes 생성 → HTML 생성 불가(너무 큼) → `graph.json` + `GRAPH_REPORT.md`로만 저장
   - 2026-05-09 08:50: BQ lineage(코드에서 GCS→BQ 테이블 writes_to 관계) 추가 → 최종 785 nodes, 1,321 edges, 90 communities

### 공유할만한 인사이트
- 기존에 업무 데이터들이 잘 정리되어야 유의미한 인사이트를 뽑아낼 수 있다는 것을 다시 한번 느꼈음.
- Graph의 정확성을 높이기 위해 업무 영역을 더 잘게 쪼개서 각 업무 데이터를 정확하게 정리한 후 각 영역별로 관계를 정확하게 다시 정리하는 작업이 필요함.

---

## 미션 3: AI 도움 없이 1주차 SNS 글 작성 - 링크드인/인스타그램

### 링크
https://www.threads.com/@data.yulia/post/DYFMCygGlWx?xmt=AQG0EAnUgFizbViE5N-uiY7uSluv0k8fFD3OOxSBmNwAMA
