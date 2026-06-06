# OCR 실행 스크립트 — rapidocr-onnxruntime (한글+영어 동시 인식)
# 사용법: python ocr_run.py
import sys
from pathlib import Path
from rapidocr_onnxruntime import RapidOCR

IMG_PATH = r"C:\Users\conace001\Downloads\-알뜰폰-알뜰요금제-가정의-달-최대혜택-54만원으로-온가족-통신비-월-0원-.png"

def main():
    if not Path(IMG_PATH).exists():
        print(f"[ERROR] 파일을 찾을 수 없습니다: {IMG_PATH}", file=sys.stderr)
        sys.exit(1)

    print(f"[INFO] OCR 시작: {IMG_PATH}", file=sys.stderr)
    engine = RapidOCR()  # 기본 모델에 한글 포함
    result, elapse = engine(IMG_PATH)
    print(f"[INFO] 완료 (소요: {elapse}초, 인식 블록: {len(result) if result else 0}개)", file=sys.stderr)
    print("=" * 60, file=sys.stderr)

    if not result:
        print("[결과 없음]")
        return

    # 인식 결과를 위→아래 순으로 정렬 (bbox y좌표 기준)
    # 각 result item: [bbox(4점), text, confidence]
    sorted_result = sorted(result, key=lambda r: r[0][0][1])

    # UTF-8 파일로 저장 (Windows 콘솔 cp949 인코딩 회피)
    out_path = Path(__file__).parent / "ocr_result.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        for bbox, text, score in sorted_result:
            f.write(text + "\n")
    print(f"[INFO] 결과 저장 완료: {out_path}", file=sys.stderr)

if __name__ == "__main__":
    main()
