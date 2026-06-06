#!/bin/bash

VAULT="$HOME/spongeclub_1"
BRANCH="jack-sync"
DEBOUNCE=10  # 마지막 변경 후 10초 대기

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Auto-sync 시작: $VAULT"

last_change=0

/opt/homebrew/bin/fswatch -r \
  --exclude "\.git/" \
  --exclude "\.obsidian/workspace" \
  --exclude "\.DS_Store" \
  "$VAULT" | while read -r event; do

  now=$(date +%s)
  last_change=$now

  sleep $DEBOUNCE

  current=$(date +%s)
  if [ "$current" -lt "$((last_change + DEBOUNCE))" ]; then
    continue
  fi

  cd "$VAULT" || continue

  if git diff --quiet && git diff --cached --quiet; then
    # 추적되지 않은 파일 확인
    untracked=$(git ls-files --others --exclude-standard | wc -l)
    if [ "$untracked" -eq 0 ]; then
      continue
    fi
  fi

  log "변경 감지 → 커밋 & push"
  git add -A
  git commit -m "sync: $(date '+%Y-%m-%d %H:%M:%S')" 2>&1 | tail -2
  git push origin "$BRANCH" 2>&1 | tail -2
  log "Push 완료"

done
