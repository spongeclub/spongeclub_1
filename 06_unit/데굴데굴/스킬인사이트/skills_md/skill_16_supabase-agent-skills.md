---
# 식별
title: "supabase-agent-skills 써본 후기"
skill_name: supabase-agent-skills
summary: "Supabase AI 에이전트 공식 스킬 모음"

# 작성자
author: [비비안, 다니]
team:

# 분류
type: 스킬
post_type: 공유
category: 개발도구
audience: []
difficulty: 설정좀필요

# 순환 연결
inspired_by:

# 참조
href: https://github.com/supabase/agent-skills
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778391908868909
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1778393191102419

# 운영
created: 2026-05-27
updated: 2026-06-04
published: false
featured: false
---

## 주요 내용
스킬은 **2개**가 들어있어요.
1️⃣ **`supabase` — Supabase 전반 가이드** Supabase의 모든 기능을 다룹니다.
• DB, Auth(로그인), Edge Functions, Realtime, Storage, 벡터 검색, Cron, 큐
• Next.js·React·SvelteKit 같은 프레임워크 연동법
• 자주 헤매는 Auth 이슈 (세션/쿠키/JWT/권한)
• CLI, 마이그레이션, 보안 점검
2️⃣ **`supabase-postgres-best-practices` — DB 성능 최적화 가이드** DB 관련 작업할 때 자동으로 참고하는 모범사례 모음. 중요도 순으로 정리되어 있어요.
• 🔴 **Critical**: 쿼리 성능, 커넥션 관리, 보안/RLS
• 🟡 **High**: 스키마 설계
• 🟢 **Medium 이하**: 동시성, 데이터 접근 패턴, 모니터링, 고급 기능

## 써본 상황 + 결과
**왜 필요하냐면**
 AI 에이전트는 Supabase 최신 문법이나 베스트 프랙티스를 모르거나 헷갈려해서 종종 잘못된 코드를 뱉습니다. 특히 Auth(로그인/세션), RLS(권한), 쿼리 최적화 쪽에서 자주 삽질해요.
**이 스킬을 깔면** — 에이전트가 작업 시작 전에 Supabase 공식 가이드를 자동으로 참고하면서 코드를 짭니다. 마치 옆에 Supabase 시니어 개발자가 붙어서 "그건 이렇게 하는 거야"라고 알려주는 느낌.
**언제 쓰면 좋냐면**
• Supabase로 뭐든 만들 때 (필수)
• "왜 자꾸 로그인이 풀리지?" 같은 Auth 디버깅
• Postgres 쿼리가 느려서 인덱스 손볼 때
• DB 스키마 새로 짤 때

## 결과·인사이트
> "마치 옆에 Supabase 시니어 개발자가 붙어서 '그건 이렇게 하는 거야'라고 알려주는 느낌" — 다니
