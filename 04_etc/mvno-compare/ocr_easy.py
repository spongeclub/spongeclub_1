# EasyOCR 개선판 — 긴 이미지를 세로 청크로 잘라 정확도 향상
#
# 동기:
#   - 19,135px짜리 한 장 이미지를 통째로 OCR 하면 텍스트 검출 단계가 작은 글자를 놓침
#   - 2000px 청크로 자르면 상대 해상도가 올라가 인식률 개선
#   - 청크 경계에서 텍스트가 잘리지 않도록 200px overlap 적용
#
# 사용법: PYTHONIOENCODING=utf-8 python ocr_easy.py
import sys
import numpy as np
from pathlib import Path
from PIL import Image
import easyocr

IMG_PATH = r"C:\Users\conace001\Downloads\-알뜰폰-알뜰요금제-가정의-달-최대혜택-54만원으로-온가족-통신비-월-0원-.png"
OUT_PATH = Path(__file__).parent / "ocr_result_chunked.txt"

CHUNK_HEIGHT = 2000   # 청크 1개의 세로 길이(px)
OVERLAP      = 200    # 청크 경계 겹침(px) — 줄이 잘려서 사라지는 것 방지

def split_image(img: np.ndarray):
    """이미지를 세로 2000px씩 자르며, 각 청크는 다음 청크와 OVERLAP만큼 겹친다."""
    h = img.shape[0]
    chunks = []  # [(y_offset, sub_image), ...]
    y = 0
    while y < h:
        y_end = min(y + CHUNK_HEIGHT, h)
        chunks.append((y, img[y:y_end]))
        if y_end >= h:
            break
        y += CHUNK_HEIGHT - OVERLAP
    return chunks

def dedupe(blocks):
    """청크 overlap 때문에 같은 텍스트가 2번 인식될 수 있음 → 중복 제거.
    같은 텍스트가 인접 y좌표(50px 이내)에 두 번 나오면 첫 번째만 유지."""
    blocks_sorted = sorted(blocks, key=lambda b: (b[0], b[1]))  # (global_y, x, text)
    out = []
    for y, x, text in blocks_sorted:
        is_dup = False
        for prev_y, prev_x, prev_text in out[-10:]:  # 최근 10개만 비교
            if text == prev_text and abs(y - prev_y) < 50:
                is_dup = True
                break
        if not is_dup:
            out.append((y, x, text))
    return out

def main():
    if not Path(IMG_PATH).exists():
        print(f"[ERROR] 파일 없음: {IMG_PATH}", file=sys.stderr)
        sys.exit(1)

    # OpenCV imread는 Windows에서 한글 경로를 못 읽음 → PIL 사용
    print("[INFO] 이미지 로드", file=sys.stderr)
    img = np.array(Image.open(IMG_PATH).convert('RGB'))
    print(f"[INFO] 원본 크기: {img.shape}", file=sys.stderr)

    chunks = split_image(img)
    print(f"[INFO] {len(chunks)}개 청크로 분할 (chunk={CHUNK_HEIGHT}, overlap={OVERLAP})", file=sys.stderr)

    print("[INFO] EasyOCR 리더 초기화 (한글+영어)", file=sys.stderr)
    reader = easyocr.Reader(['ko', 'en'], gpu=False)

    all_blocks = []  # (global_y, x, text)
    for i, (y_offset, chunk) in enumerate(chunks, 1):
        print(f"[INFO] 청크 {i}/{len(chunks)} OCR 중 (y_offset={y_offset})", file=sys.stderr)
        results = reader.readtext(chunk, detail=1, paragraph=False)
        for bbox, text, conf in results:
            local_y = bbox[0][1]
            x       = bbox[0][0]
            global_y = y_offset + local_y
            all_blocks.append((global_y, x, text))

    print(f"[INFO] 전체 인식 블록: {len(all_blocks)}개 (중복 제거 전)", file=sys.stderr)
    deduped = dedupe(all_blocks)
    print(f"[INFO] 중복 제거 후: {len(deduped)}개", file=sys.stderr)

    # 위→아래 순으로 저장 (같은 줄은 좌→우)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        for y, x, text in deduped:
            f.write(f"{text}\n")

    print(f"[INFO] 저장 완료: {OUT_PATH}", file=sys.stderr)

if __name__ == "__main__":
    main()
