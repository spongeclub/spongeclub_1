---
team: 2조
member: 마라
role: 부조장
week: 2
submitted: true
---

# 2주차 과제 — 마라

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: <ETF Screener OS 만들기>

### Summary
  프로젝트명: 글로벌 ETF 자동화 스크리닝 시스템
  개발 기간: 2026년 5월 14일 ~ 현재
  최종 상태: ✅ 완전 자동화 시스템 운영 중 (PID: 19147)규모: 80개 → 8,408개 ETF로 확장

  핵심 성과
  - 🇰🇷 한국 ETF + 🇺🇸 미국 ETF 통합 분석
  - ⚡ A~E급 5단계 신호 시스템 구축
  - 🤖 텔레그램 봇 11개 명령어로 완전 자동화
  - ⏰ 30분 간격 자동 스크리닝 (장중 09:30-15:30)
  - 📱 실시간 골든크로스 알림 시스템
### 최종 구현 결과물
![[Screen Shot 2026-05-17 at 6.45.39 PM.png|340]]
### 과정 (타임라인별 + 삽질)
  Phase 1: 기본 한국 ETF 스크리너

  파일: working_screener.py, auto_main.py
  - KIS API 연동으로 한국 ETF 10개 분석
  - 기본 골든크로스 패턴 감지
  - SQLite 데이터베이스 구축
  - 텔레그램 기본 알림

  Phase 2: 미국 ETF 확장

  파일: us_etf_screener.py, global_auto_main.py
  - Yahoo Finance API 추가
  - 한국+미국 통합 분석 시스템
  - 스케줄러 통합 (scheduler.py)
  - 중복 알림 방지 시스템

  Phase 3: 대규모 ETF 데이터베이스 구축

  파일: massive_etf_collector.py, comprehensive_etf_collector.py
  - 80개 → 8,408개 ETF로 폭발적 확장
  - massive_etf_universe.db 구축
  - 데이터 검증 시스템 (data_validator.py)

  Phase 4: 다층 신호 시스템

  파일: ultimate_etf_screener.py, enhanced_signals.py
  - A급~E급 5단계 신호 분류
  - 우선순위 기반 ETF 선별
  - 향상된 기술적 분석 (indicators.py)

  Phase 5: 텔레그램 봇 고도화

  파일: fixed_ultimate_bot.py, enhanced_telegram_bot.py
  - 11개 명령어 시스템 (/kr, /us, /ultimate, /massive 등)
  - /levels 명령어로 신호 등급 설명
  - 실시간 상호작용 가능

  Phase 6: 완전 자동화 시스템

  파일: ultimate_auto_system.py, start_ultimate_system.py
  - 백그라운드 연속 실행
  - 프로세스 관리 및 복구
  - 종합 모니터링 (monitoring.py)

  주요 삽질 & 해결

  1. yfinance 호환성 지옥

  # 문제: 'type' object is not subscriptable 
  # 원인: yfinance 0.1.63 버전 이슈
  # 해결: Yahoo Finance 직접 API 호출로 우회

  2. 텔레그램 봇 멀티스레딩 오류

  # 에러: "set_wakeup_fd only works in main thread"
  # 해결: 백그라운드 프로세스 분리, 별도 실행

  3. KIS API 1분당 1회 제한

  # 문제: "접근토큰 발급 잠시 후 다시 시도하세요"
  # 해결: time.sleep(60) + 토큰 재발급 로직

  4. SQLite 데이터베이스 락

  # 문제: 동시 접근으로 database locked
  # 해결: 연결 관리 개선 + 트랜잭션 분리

  5. 8,000개 ETF 스크리닝 성능

  # 문제: 8시간 소요 → 실용성 제로
  # 해결: 우선순위 분류 + 배치 처리 + 캐싱
### 공유할만한 인사이트
오라클 클라우드 가입하실 때 꼭 리전 잘 선택하세요

---

## 미션2: <블로그 글 작성>

https://blog.naver.com/septmoon/224288277642