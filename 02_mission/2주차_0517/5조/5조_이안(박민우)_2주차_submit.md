---
team: 5조
member: 이안
role: 조원
week: 2
submitted: true
---

# 2주차 과제 — 이안

## 미션1: 각자만의 정의로 [운영체제]라고 정의내리는 OS 구현

### Summary

1주차 청사진(v0.1.2)의 부품 #1~#5를 직접 굴려보는 단계. 두 갈래로 시도 — (A) 5/10에 `~/Dropbox/Spongeclub/OS_try1/`를 신설해 **mflux + SVD + MusicGen 무료 로컬 파이프라인** 셋업, (B) 5/17에 `~/Sponge_test/img_gen/`에서 **OpenAI gpt-image-1 + 줌인 모션 + TTS + 자막 burn-in + 자막 싱크 HTML 도구** 트랙으로 pivot. (B) 트랙으로 콘티 1편 → **13.2초 고양이 영상 1편 사이클 첫 완주** (~$0.5). 원래는 캡컷·파이널컷 프로에서 후편집을 하려 했지만, HTML 픽커 + 자막 싱크 도구로 무거운 NLE 없이도 본인 수준에서 만족할 결과물이 나옴.

### 최종 구현 결과물

**무료 로컬 트랙 (M5 Air 16GB 가정)** — `~/Dropbox/Spongeclub/OS_try1/`

| 파일 | 역할 |
|---|---|
| `README.md` · `CONCEPT.md` · `PLAN.md` | try1 청사진 정리 + 5가지 핵심 원칙 + 부품 8개·의존성·마일스톤 |
| `pipeline/` | `conti_parser` · `image_gen` · `video_gen` · `music_gen` · `package` |
| `scripts/01~04` | smoke (이미지·음악·영상) + 풀 파이프라인 |
| `test_input/무협_정파_3분.storyboard.md` | 15호흡 검증 콘티 (무당·점창·남궁세가) |

**유료 OpenAI 트랙 (5/17 pivot)** — `~/Sponge_test/img_gen/`

| 파일 | 역할 |
|---|---|
| `img_gen/providers.py` | OpenAI `gpt-image-1` 호출 + fallback chain (`gpt-image-2` 미출시 대응) |
| `img_gen/cli.py` | `python -m img_gen.cli "..." --cut <id> --n 3` |
| `img_gen/storyboard.py` | 스토리보드 .md 첫 표 파서 |
| `img_gen/picker.py` + `picker.html` | HTML 픽커 (← → 키, 1~9 선택, 자동 저장) |
| `img_gen/video.py` | 모션 + TTS(`gpt-4o-mini-tts` nova) + 자막 burn-in mp4 |
| **`img_gen/sync.py` + `sync.html`** | **자막 싱크 조정 도구** — 영상 보며 시작 시각·텍스트 실시간 조절, `subtitle_timings.json`에 저장, base 영상 한 번 만들어두고 자막만 재렌더 |
| `run.sh` | venv · deps · .env 한 줄 런처 |

**검증 산출물** — `~/Sponge_test/test1_cat/`
- 콘티: `테스트_스크립트_고양이.storyboard.md` (3컷 — 러그돌·벵갈·시아미즈)
- 이미지 9장: `out_test/{01_ragdoll,02_bengal,03_siamese}/gpt_*.png`
- 선택 결과: `out_test/selections.json`
- 자막 타이밍: `out_test/subtitle_timings.json` (sync.html 결과)
- **최종 영상**: `out_test/video/final.mp4` (13.2s, 4.0MB, ~$0.5)

### 과정 (타임라인별 + 삽질)

**2026-05-10 — OS_try1 (무료 로컬 트랙) 신설**

- `~/Dropbox/Spongeclub/OS_try1/` 폴더 신설, README/CONCEPT/PLAN 3개 문서 작성.
- Genesis(Nicolas Neubert) 흐름의 무료 버전으로 mflux(Flux.1 schnell) + SVD + MusicGen-small 매핑.
- test_input에 무협 정파 3분 콘티(15호흡) 작성 — 9대문파 → 무당(부드러움·태극) · 점창(빠름·사일검법) · 남궁세가(패도·창궁대연검법) 셋으로 압축. 시각 차별화(카메라·색감·모션) 분리.

**2026-05-10~11 — pipeline 모듈**

- `pipeline/`(conti_parser·image_gen·video_gen·music_gen·package) + `scripts/01~04` smoke 작성.
- HF 토큰 발급 + SVD 라이선스 동의 흐름. `~/Sponge_test/OS_1st_try/.venv`에 mflux 설치(첫 다운로드 ~14GB).

**2026-05-15~16 — 추가 검증**

- Sponge_test/ch_test 세션에서 무료 로컬 트랙 추가 검증.

**2026-05-17 — 유료 gpt-image-1 트랙으로 pivot, 영상 1편 완주**

무료 로컬 트랙은 셋업 비용·품질 모두 무거움 → OpenAI gpt-image-1 + 자체 모션/TTS/자막으로 pivot. `~/Sponge_test/img_gen/` 신규 모듈 1차 완성.

| 이슈 | 원인 | 해결 |
|---|---|---|
| `gpt-image-2` 호출 실패 | 추측, 미출시 | providers.py fallback chain. `_meta.txt`에 실제 모델 기록 |
| research agent 600s stall | 외부 web search 흐름 끊김 | smoke 1번으로 30초 만에 결판 (추측 < 실측) |
| 9장 폴더 비교 비효율 | 컷별 후보 N장 노가다 | HTML 픽커 (← → 키, 1~9 선택, 자동 저장) |
| 시스템 ffmpeg 부재 | macOS 기본 미설치 | `imageio-ffmpeg` venv isolated (brew/시스템 오염 X) |
| 한국어 TTS가 컷 길이 초과 (3.3s → 4.4s) | 한국어 발화 길이 > 콘티 가정 | cut 자동 연장 (말 안 잘리게). 10s 목표 → 13.2s 결과 |
| NLE 후편집 무게 | 캡컷·파이널컷 학습/실행 비용 | **`sync.py` + `sync.html` 추가** — 영상 보며 자막 시각·텍스트 실시간 조절, base 영상 1회 + 자막만 재렌더 → NLE 없이 마무리 |

무협 정파 대신 **고양이 3마리(러그돌·벵갈·시아미즈)** 로 첫 검증: 3컷 × 3장 = 9장 → HTML 픽커로 선택 → 줌(1.0→1.10) + TTS + 자막 burn-in → `final.mp4`. 자막 싱크는 sync.html에서 시각 미세조정 후 재렌더. 실측 비용 **~$0.5/10초 영상**.

### 공유할만한 인사이트

1. **무료 로컬 → 유료 OpenAI pivot의 발견**: mflux/SVD 무료 트랙은 셋업 비용·품질 둘 다 무거움. gpt-image-1 + 자체 모션·TTS·자막으로 ~$0.5/10초가 더 빠른 검증 사이클. 1주차 청사진의 "M1.5 무료 우회" 가정이 깨짐 — 결국 가장 짧은 피드백 루프가 이김.

2. **이미지 트랙 ≠ 영상 모델 트랙**: Seedance 8~15초 클립 대신 정지 이미지 + 줌인 모션이 정보형 영상엔 충분. 콘텐츠 형식이 도구 선택을 강제함. 시네마틱 단편이 아닌 정보형 롱폼에선 굳이 영상 생성 모델까지 갈 필요 없음.

3. **"콘티 = Claude 스킬 / 파싱 = Python" 책임 분리**가 워크플로우를 깔끔하게 함. `storyboard.py`는 첫 표만 파싱 — 책임 경계가 명확하면 둘 다 단순.

4. **HTML 도구 두 개(픽커 + 싱크)가 NLE를 대체**: 원래는 캡컷·파이널컷에서 후편집할 계획이었는데, HTML 픽커(이미지 선택)와 `sync.html`(자막 시각·텍스트 실시간 조절)로 무거운 NLE 없이도 본인 수준에서 만족할 결과물이 나옴. 워크플로우의 가장 큰 마찰은 **의사결정 비용** — 그걸 1/N로 줄이는 작은 HTML 도구 두 개면 NLE는 굳이 필요 없음.

5. **추측 < 실측, smoke 1번이 30초로 결판**: `gpt-image-2` 추측 호출 실패도, research agent 600s stall도, 실제로 1번 돌려보는 게 모든 추측·검색·계획보다 빠름. "5분 검증 루프" 원칙(1주차 인사이트)이 실전에서 다시 확인됨.

6. **"바퀴를 재발명하지 말라"의 시대가 바뀜**: 옛날엔 바퀴를 재발명하지 말라가 통하는 시대였지만, 지금은 **AI로 필요한 맞춤 도구를 만드는 것도 괜찮은 선택**. 캡컷·파이널컷이라는 "이미 있는 바퀴" 대신 30분 만에 픽커·싱크 HTML을 짜는 게 본인 워크플로우엔 더 적합. AI가 도구 제작의 진입 비용을 낮추면서 **"기존 도구 학습 비용 vs 맞춤 도구 제작 비용"** 의 균형점이 이동. 모든 사람에게 적용되는 일반화는 아니지만, 본인 워크플로우의 특이성이 큰 경우엔 맞춤 도구가 더 빠른 ROI.

---

## 미션2: SNS 작성

이번 주 안에 별도 작성 예정 — 일단 패스.

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트

---

## 미션3: (이번 주 미사용)

### Summary

### 최종 구현 결과물

### 과정 (타임라인별 + 삽질)

### 공유할만한 인사이트
