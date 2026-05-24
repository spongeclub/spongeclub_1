---
team: 5조
member: 이안
role: 조원
week: 3
submitted: false
---

# 3주차 과제 — 이안

## 🤖 AI 초안 (개인 참고용)

> [!ai]+ `/draft MMDD-MMDD`로 채우거나, 이 블록을 지우고 직접 작성
> (이 콜아웃은 본인 참고용입니다. 아래 미션 섹션을 다 채우고 나면 통째로 지우거나 접어두세요.)

---

## 미션1: 내 고객은 누구고 왜 쓰는가 — 클로드 코드로 프로덕트 구현하기

### Summary

자기소개 영상용 컷 편집 도구(`img_gen` → `SSCUT`)를 클로드코드로 만들다가, 자체 렌더링이 병목이라는 걸 확인하고 최종 렌더는 외부 NLE(Final Cut)로 넘기는 방향으로 전환.

### 최종 구현 결과물

- `~/Sponge_test/img_gen/` — 이미지 생성(gpt-image-1) + TTS + 자막 burn-in mp4 파이프라인
- `~/Sponge_test/test_sscut/` — 25컷 자기소개 영상 프로젝트 (SSCUT manifest, PICKS/TIMELINE/BGM json)
- `~/Sponge_test/test_sscut/RENDERS/final.mp4` — 자체 렌더 결과물. 일부 구간이 깨지긴 했지만 end-to-end로 한 편이 나오긴 함
- 역할 분리 결정: SSCUT = 콘티·컷 구조·편집 의사결정 관리자 / Final Cut = 최종 렌더

### 과정 (타임라인별 + 삽질)

- 2026-05-24: 4분짜리 최종 영상 자체 렌더에 ~4분 소요 확인 → 20분 영상은 20분+ 걸릴 구조라고 판단
- 2026-05-24: SSCUT의 역할을 "최종 렌더러"에서 빼고, Final Cut(FCPXML) / CapCut(미디어+SRT) export로 외부 위임하는 방향 확정

### 공유할만한 인사이트

- 직접 만든 도구로 끝까지 가려 들지 말고, HW 인코더·GPU·partial render 같은 게 이미 잘 되어 있는 NLE에 최종 렌더는 위임하는 게 합리적. 내 도구는 그 앞단(컷 구조/편집 결정)에 집중.

---

## 미션2: 내가 정의하고 적용해보고 싶은 하네스 + 오케스트레이션

### Summary

- **하네스**: 에이전트가 작동하는 실행 환경 전체 — 프롬프트(규칙·목표), 도구, 권한, 훅, 컨텍스트·메모리 관리까지 포함. LLM을 에이전트로 만들어주는 주변 코드/설정 일체.
- **오케스트레이션**: 여러 에이전트(또는 한 에이전트의 여러 작업 단계)를 어떤 순서·구조·병렬성으로 묶어 돌릴지 설계하고 제어하는 것.

### 최종 구현 결과물

SSCUT(`~/Sponge_test/test_sscut`, `~/Sponge_test/img_gen`)에 실제로 적용된 하네스·오케스트레이션.

**하네스 (규칙·경계·도구)**

- 파일 schema가 모든 컴포넌트의 공유 인터페이스: `SSCUT.json` / `CONTI.md` 첫 표 / `CUTS/<cut_id>/` / `PICKS.json` / `TIMELINE.json` / `BGM.json` — 디스크 = single source of truth, DB 없음
- 컷 ID prefix 컨벤션(`01_`, `02_`) → 알파벳 정렬이 영상 순서. `CONTI.md`의 `컷 ID`와 폴더명 일치 강제
- `providers.py` 모델 fallback chain + `.env` 오버라이드 → 모델 교체 무중단 (gpt-image-2 미출시 등)
- 보안·격리: localhost(127.0.0.1) only, no auth, venv 안 ffmpeg/openai (시스템 brew 오염 X)
- `selections.json` 저장 시 `.selections_backup/` 10개 자동 rotate (실수 복구 경로)
- RESERVED 폴더명(`video/`) → 컷으로 잘못 인식되는 사고 방지

**오케스트레이션 (작업 흐름)**

End-to-end 흐름: `CONTI.md` → `CUTS/` 폴더 → 컷별 이미지 N장 → TTS → 픽 → 자막·모션 → 컷별 렌더 → concat → BGM 믹스 → 외부 NLE export.

각 단계의 핸드오프:

- **콘티 → CUTS 변환**: `CONTI.md` 첫 markdown 표 파싱 → `컷 ID`별 `CUTS/<cut_id>/PROMPT.md`로 기준 프롬프트 떨굼. 표가 곧 컷 구조 정의.
- **이미지 생성**: 기준 프롬프트로 컷당 N장 배치 생성(외부 스크립트) / 편집 중 +1장(앱 안 `+1장 생성`) / 1회성 커스텀 프롬프트 1장(픽커 입력). 결과는 `images/<provider>/<model>/`로 자동 분류.
- **TTS 생성**: 컷 내레이션 → `gpt-4o-mini-tts`(fallback `tts-1`) → `CACHE/video/<cut_id>_tts.mp3`로 캐시. 같은 텍스트는 재호출 X. TTS가 컷보다 길면 컷 길이를 자동 연장(말 잘림 방지).
- **픽 → 자동 저장 → 다음 단계 잠금 해제**: 픽커 클릭 즉시 `PICKS.json` 저장 → sync·motion 탭이 재로드. 미선택 컷은 상단 배너에 ID + 픽커 직링크로 누락 가시화.
- **컷별 렌더 → concat**: `for cut in cut_order` → 이미지(모션 + TTS mux + 자막 burn) / 영상(정규화 + 자막 burn) 분기 → `concat_demuxer` → `RENDERS/final.mp4`.
- **BGM 믹스 (타임라인 단위)**: `final.mp4`에 `BGM.json` 정의대로 입혀 `final_bgm.mp4`. 컷 단위가 아니라 영상 전체 타임라인 위에 클립 배치.
- **외부 위임**: Final Cut(`EXPORTS/finalcut/*.fcpxml` + `*.srt`) / CapCut(미디어 + `subtitles.srt` + `timeline.csv`) export. 최종 인코딩은 NLE 몫.

### 과정 (타임라인별 + 삽질)

- 초기 설계 시 "콘티 작성은 Claude Skill, 콘티 파싱은 Python" 책임 분리 → 사람·AI의 자유도와 기계 파싱 안정성 둘 다 확보
- TTS가 콘티 가정보다 길게 나오는 경우(한국어 발화 길이) → 컷 길이를 TTS 기준으로 자동 연장하도록 변경
- 컷 폴더 안 `video/` 산출물이 컷으로 잘못 잡힘 → **RESERVED 폴더명 규칙**으로 방어
- 외부 영상 컷 추가 후 오디오 포맷 충돌(외부 44100 stereo vs TTS 24000 mono) → 모든 컷을 AAC 44100 stereo로 정규화 (concat 안전성 확보)
- 2026-05-24: 자체 렌더 한계 확인 → SSCUT은 편집 의사결정만 담당하고, 최종 렌더는 외부 NLE로 위임하는 방향 확정

### 공유할만한 인사이트

- **하네스 = schema + 컨벤션.** JSON schema와 컷 ID 규칙이 곧 픽커·싱크·모션·렌더가 합의하는 인터페이스. 이게 없었으면 컴포넌트가 따로 놀았을 것.
- **오케스트레이션 = 단계 체이닝 + 자동화 경계 설계.** 콘티→이미지→TTS→픽→렌더→BGM→export 흐름 안에서 어느 단계를 자동(렌더), 사용자 트리거(픽·커스텀 프롬프트), 외부 위임(최종 인코딩)으로 둘지 결정하는 게 곧 오케스트레이션.
- **아직 매끄럽지 못해 수동 명령어로 메우는 단계가 다음 라운드 자동화 후보**: ① 콘티 → CUTS 폴더 자동 생성·매핑 없음 ② 이미지 대량 생성은 별도 스크립트(`scripts/gen_all.py` / `gen_rest.py` / `tts_and_render.py`) — 앱 안에서는 컷당 +1장만 ③ BGM 단계가 최종 렌더 이후 별도 흐름으로 끊겨 있음.

---

## 미션3: 스폰지클럽을 하며 남기고 싶은 생각과 고민 SNS 글 작성

### Summary

스폰지클럽에서 가장 좋았던 건 다른 분들의 AI 적용 사례를 짧은 시간 안에 폭넓게 훑어볼 수 있다는 점이다. 각자 맥락이 다른데도 다들 실행력이 엄청나서, 보고 있으면 자연스럽게 자극받아 나도 손을 더 부지런히 움직이게 된다.

따로 운영하는 SNS가 없어서 일단 이 노트에 메모로 남겨두고, 나중에 SNS를 시작하게 되면 정리해 옮길 예정이다.
