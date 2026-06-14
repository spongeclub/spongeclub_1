---
# 식별
title: "claude-video 써본 후기"
skill_name: claude-video
summary: "긴 영상을 구간별로 나눠 정밀 요약, 한국어 고유명사는 더블체크 필요"

# 작성자
author: [개미]
team:

# 분류
type: 스킬
post_type: 써본후기
category: 생산성
audience: []
difficulty: 설정좀필요

# 순환 연결
inspired_by:

# 참조
href: https://github.com/bradautomates/claude-video
keywords: []
links:
  - https://w1777265456-oc0196728.slack.com/archives/C0B25TW69MW/p1780851994152639

# 운영
created: 2026-06-11
updated: 2026-06-11
published: true
featured: false
---

## 한 줄 요약
• Youtube 영상의 URL을 주면 자막 전사 + 화면 프레임 추출로 영상을 직접 확인한 후에 요약 및 질의 응답이 가능한 스킬

## 주요 내용
• 기능: yt-dlp로 영상 다운로드 → ffmpeg로 프레임(JPEG) 추출 → 자막(우선) 또는 Whisper API로 타임스탬프 전사 → 클로드가 화면+음성을 결합해 답변.
• 지원: 유튜브·TikTok·Vimeo·X·로컬 파일 등 공개 영상.
• 전사 2단계: ① 네이티브 자막(무료, 우선) ② 없으면 Whisper(Groq/OpenAI) 폴백 — 단, 오디오 25MB 제한.
• 프레임 예산: 영상 길이에 반비례(짧을수록 촘촘). 하드캡 100프레임·2fps.10분 이하에서 정확도 최고.
• 유용 옵션:`--start/--end`(구간 집중),`--max-frames`,`--resolution`(텍스트 판독 시 1024).
• 비용: 토큰의 대부분은 프레임(이미지). 자막은 저렴.

## 써본 상황 + 결과
• 매주 쏟아지는 들어야 하는 VOD가 늘어나는 것에 따라 기본적인 요약본을 얻기 위해서 사용했습니다.
• 기본적으로 공유회는 1시간 전후지만, 매주 일요일 강의는 3시간이 넘어가다 보니 구간 별로 나누어서 정밀 요약
• 자동 자막 기반으로 내용을 요약해서 토큰 소모가 없지만, 한국어다 보니 고유명사 오류가 있어서 정확하게 파악하기 위해선 더블체크 필요

## 결과·인사이트
> "3시간 넘는 일요일 강의를 구간별로 나눠 정밀 요약했어요. 한국어 고유명사는 더블체크가 필요하고요" — 개미
