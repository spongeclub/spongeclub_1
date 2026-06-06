#!/bin/bash
# Stop 훅: (1) 폴더 구조 변경 감지 (2) MEMORY.md 갱신 리마인드
# exit 0 = 통과, exit 1 = Claude에게 메시지 전달

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

MARKER=".claude/.memory-checked"
[ -f "$MARKER" ] && exit 0

MESSAGES=""

# --- 1단계: 폴더 구조 변경 감지 ---
SNAPSHOT="_meta/.folder-snapshot"
CURRENT=$(find . -maxdepth 2 -type d \
  ! -path './.git*' \
  ! -path './.claude*' \
  ! -path './.obsidian*' \
  ! -path './.trash*' \
  ! -path './.omc*' \
  | sort)

if [ -f "$SNAPSHOT" ]; then
  SAVED=$(cat "$SNAPSHOT")
  if [ "$CURRENT" != "$SAVED" ]; then
    ADDED=$(comm -13 <(echo "$SAVED") <(echo "$CURRENT"))
    REMOVED=$(comm -23 <(echo "$SAVED") <(echo "$CURRENT"))
    MESSAGES="[폴더 구조 변경 감지]\n"
    [ -n "$ADDED" ] && MESSAGES="${MESSAGES}추가된 폴더:\n${ADDED}\n"
    [ -n "$REMOVED" ] && MESSAGES="${MESSAGES}삭제된 폴더:\n${REMOVED}\n"
    MESSAGES="${MESSAGES}\nMEMORY.md '최근 변경 로그'에 구조 변경 사항을 기록하고, 스냅샷을 갱신해주세요: echo \"\$CURRENT\" > ${SNAPSHOT}\n"
  fi
fi

# 스냅샷이 아예 없으면 초기 생성 안내
if [ ! -f "$SNAPSHOT" ]; then
  MESSAGES="${MESSAGES}[폴더 스냅샷 미존재] 최초 스냅샷을 생성해주세요.\n"
fi

# --- 2단계: MEMORY.md 갱신 리마인드 ---
CHANGED=$(git diff --name-only 2>/dev/null; git diff --cached --name-only 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)

if [ -n "$CHANGED" ]; then
  echo "$CHANGED" | grep -q "^MEMORY.md$" || {
    MESSAGES="${MESSAGES}[MEMORY.md 미갱신] 이번 세션에서 파일 변경이 있었지만 MEMORY.md가 갱신되지 않았습니다. 기록할 내용이 있다면 '최근 변경 로그'에 추가해주세요. 없다면 'touch .claude/.memory-checked'를 실행해주세요."
  }
fi

# 메시지가 있으면 출력 후 차단
if [ -n "$MESSAGES" ]; then
  echo -e "$MESSAGES"
  exit 1
fi

exit 0
