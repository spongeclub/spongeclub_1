# 03_insights — 인사이트 라이브러리

스폰지클럽 슬랙 `#이기적인스킬러스` 채널의 `/스킬공유` 글이 매주 일요일 자동으로 카테고리별 폴더에 적재되는 곳.

## 구조

```
03_insights/
├── AI 도구/
│   └── YYYY-MM-DD_<작성자>_<슬러그>.md
├── 프롬프트/
├── 자동화/
├── 시장 동향/
├── 워크플로우/
├── 학습 자료/
└── 기타/
```

## 노트 한 장 = 슬랙 메시지 한 개

각 노트의 frontmatter에 메타가 들어있고 (`category`, `author`, `posted_at_kst`, `slack_permalink`, `summary`), 본문은 4섹션 템플릿(📌🔍💼🔗) 그대로 보존된다.

## 흐름·운영

자동화 파이프라인 자체에 대한 가이드는 [insights-automation-spec.md](../99_meta/insights-automation-spec.md), 카테고리 정의는 [insights-taxonomy.md](../99_meta/insights-taxonomy.md) 참고.
