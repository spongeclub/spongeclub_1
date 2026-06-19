#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
take-mine.py — 스폰지클럽 공용 레포에서 '내 작업물'만 이미지까지 한 번에 추출한다.

사용법:
    python3 take-mine.py <조> <닉네임> [--flat]
    예) python3 take-mine.py 3조 흐민
        python3 take-mine.py 3 흐민 --flat   # '조'는 생략 가능

모드:
    (기본)  원본 폴더구조(02_mission/...) 그대로 복사. 옵시디언 볼트에 합칠 때 적합.
    --flat  주차별 폴더로 평탄화 + 이미지 경로 재조정. 개인 레포로 독립시킬 때 적합.

결과:
    _export/<조>_<닉네임>/ 아래에 내 노트 + 참조 이미지가 복사된다 (이미지 링크 유지).
"""
import os
import re
import sys
import shutil
import urllib.parse

# 검색에서 제외할 폴더
SKIP_DIRS = {".git", ".claude", ".omc", "_site", "node_modules", "_export", ".vercel"}

MD_IMG = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")              # ![](path)  -> 경로
MD_IMG_SUB = re.compile(r"(!\[[^\]]*\]\()([^)]+)(\))")      # 치환용(3그룹)
WIKI_IMG = re.compile(r"!\[\[([^\]\|]+?)(?:\|[^\]]*)?\]\]")  # ![[name]] / ![[name|alias]]


def norm_team(t):
    t = t.strip()
    return t if t.endswith("조") else t + "조"


def build_index(root):
    """basename(lower) -> 첫 매칭 절대경로. 위키링크(파일명만) 해석용."""
    idx = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            idx.setdefault(fn.lower(), os.path.join(dirpath, fn))
    return idx


def find_my_notes(root, prefix):
    """basename이 '<조>_<닉>' 로 시작하고 다음 글자가 _ ( . 인 .md 파일."""
    hits = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not fn.lower().endswith(".md"):
                continue
            if fn.startswith(prefix):
                rest = fn[len(prefix):]
                if rest[:1] in ("_", "(", "."):
                    hits.append(os.path.join(dirpath, fn))
    return hits


def resolve_image(ref, note_dir, root, index):
    """이미지 참조 문자열 -> 실제 절대경로(없으면 None)."""
    ref = ref.strip()
    if ref.startswith(("http://", "https://")):
        return None
    decoded = urllib.parse.unquote(ref)
    cand = [
        os.path.normpath(os.path.join(note_dir, decoded)),
        os.path.normpath(os.path.join(note_dir, "attachments", os.path.basename(decoded))),
    ]
    for c in cand:
        if os.path.isfile(c):
            return c
    return index.get(os.path.basename(decoded).lower())


def category_of(rel):
    """레포 상대경로 -> 평탄화 폴더명 (주차/gallery/profile/draft)."""
    parts = rel.split(os.sep)
    if "draft_archive" in parts:
        return "draft"
    if parts[0] == "02_mission" and len(parts) >= 2:
        wk = parts[1]
        if wk.startswith("gallery"):
            return "gallery"
        if wk.startswith("profile"):
            return "profile"
        return re.sub(r"_\d{4,8}$", "", wk)   # 1주차_0510 -> 1주차, 0주차_OT_0503 -> 0주차_OT
    return "기타"


def extract(notes, root, out, index, flat, missing):
    """노트 + 참조 이미지를 out 으로 복사. (copied_notes, copied_imgs) 반환."""
    cn = ci = 0
    seen_imgs = set()

    def copy_img(src, dst):
        nonlocal ci
        if dst in seen_imgs:
            return
        seen_imgs.add(dst)
        if not os.path.exists(dst):
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
            ci += 1

    for note in notes:
        rel = os.path.relpath(note, root)
        note_dir = os.path.dirname(note)
        with open(note, encoding="utf-8", errors="ignore") as fh:
            text = fh.read()

        if not flat:
            # 구조 보존: 경로 그대로
            dst = os.path.join(out, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            for ref in MD_IMG.findall(text) + WIKI_IMG.findall(text):
                src = resolve_image(ref, note_dir, root, index)
                if not src:
                    missing.append((rel, ref.strip()))
                    continue
                copy_img(src, os.path.join(out, os.path.relpath(src, root)))
            shutil.copy2(note, dst)
            cn += 1
            continue

        # 평탄화: 주차 폴더로 모으고 이미지는 <주차>/attachments/ 로, md 링크 재작성
        cat = category_of(rel)
        cat_dir = os.path.join(out, cat)
        att_dir = os.path.join(cat_dir, "attachments")

        def md_sub(m):
            ref = m.group(2)
            src = resolve_image(ref, note_dir, root, index)
            if not src:
                missing.append((rel, ref.strip()))
                return m.group(0)
            base = os.path.basename(src)
            copy_img(src, os.path.join(att_dir, base))
            return m.group(1) + "attachments/" + urllib.parse.quote(base) + m.group(3)

        new_text = MD_IMG_SUB.sub(md_sub, text)
        # 위키링크: 파일명 그대로 두고 이미지만 동봉 (옵시디언이 이름으로 해석)
        for ref in WIKI_IMG.findall(new_text):
            src = resolve_image(ref, note_dir, root, index)
            if not src:
                missing.append((rel, ref.strip()))
                continue
            copy_img(src, os.path.join(att_dir, os.path.basename(src)))

        os.makedirs(cat_dir, exist_ok=True)
        with open(os.path.join(cat_dir, os.path.basename(note)), "w", encoding="utf-8") as fh:
            fh.write(new_text)
        cn += 1

    return cn, ci


def main():
    args = [a for a in sys.argv[1:] if a != "--flat"]
    flat = "--flat" in sys.argv
    if len(args) != 2:
        print(__doc__)
        sys.exit(1)

    root = os.path.dirname(os.path.abspath(__file__))
    team = norm_team(args[0])
    nick = args[1].strip()
    prefix = f"{team}_{nick}"
    out = os.path.join(root, "_export", f"{team}_{nick}")

    mode = "평탄화" if flat else "구조보존"
    print(f"🔍 '{prefix}' 작업물 검색 중... (모드: {mode})")
    index = build_index(root)
    notes = find_my_notes(root, prefix)
    if not notes:
        print(f"❌ '{prefix}*' 로 시작하는 노트를 못 찾았습니다. 조/닉네임을 확인하세요.")
        sys.exit(1)

    if os.path.isdir(out):
        shutil.rmtree(out)
    missing = []
    cn, ci = extract(notes, root, out, index, flat, missing)

    print(f"\n✅ 완료 → {os.path.relpath(out, root)}/")
    print(f"   노트 {cn}개 · 이미지 {ci}개 복사")
    if missing:
        uniq = sorted(set(missing))
        print(f"\n⚠️  못 찾은 이미지 {len(uniq)}개 (템플릿 자리표시자·외부링크일 수 있음):")
        for rel, ref in uniq[:15]:
            print(f"   - {ref}  ({rel})")
        if len(uniq) > 15:
            print(f"   ... 외 {len(uniq) - 15}개")
    nxt = "개인 레포로 독립" if flat else "옵시디언 볼트에 병합"
    print(f"\n📦 이 폴더를 {nxt}하면 됩니다.")


if __name__ == "__main__":
    main()
