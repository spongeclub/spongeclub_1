# 따뜻한 미니멀 — 디자인 시스템 (Design Navigator 자동 생성)
> 모바일앱 디자인 시스템. design-system/ 폴더에 넣고 tailwind.config·globals.css에 반영하세요.

## 1. 타이포그래피
- **메인/타이틀 폰트: Gowun Dodum** — 헤드라인·제목
- **본문 폰트: Pretendard** — 본문·설명

```js
fontFamily: {
  display: ['Gowun Dodum', 'sans-serif'], // 제목·타이틀
  sans: ['Pretendard', 'sans-serif'],       // 본문
}
```

## 2. Brand Color System

**Core / Accent**
- **Primary** (`#F9A8A8`)
    - **역할:** 메인 액센트, 브랜드 아이덴티티
    - **사용처:** CTA 버튼, 링크, 강조 텍스트, 호버 이펙트
- **Accent** (`#E9A23B`)
    - **역할:** 보조 포인트
    - **사용처:** 배지, 보조 강조, 아이콘 포인트

**Background & Surface**
- **Background** (`#FAF8F5`)
    - **역할:** 메인 배경
    - **사용처:** 페이지 전체 배경, 섹션 배경

**Typography & Elements**
- **Text** (`#3C2E26`)
    - **역할:** 메인 텍스트
    - **사용처:** 헤드라인, 본문 주요 내용
- **Muted** (`#8a8178`)
    - **역할:** 보조 텍스트 & 경계선
    - **사용처:** 서브 타이틀, 설명 문구, 비활성 요소

```js
colors: {
  brand: {
    bg: '#FAF8F5',      // 메인 배경
    primary: '#F9A8A8',    // 핵심 액센트/CTA
    accent: '#E9A23B',      // 보조 포인트
    text: '#3C2E26',    // 메인 텍스트
    muted: '#8a8178',        // 보조 텍스트/경계
  }
}
```

## 3. 모양 (Shape)
- 모서리 radius: **20px** (카드·버튼·입력창 공통)

## 🚫 이 스타일에서 피할 것
포인트 컬러를 너무 많이 쓰지 마세요. 베이지+브라운+한 가지 포인트만으로 충분해요.

> Cursor·Claude Code가 이 파일을 참조해 일관된 디자인으로 만듭니다.
> AGENTS.md / CLAUDE.md에서 이 파일을 가리키게 하면 화면 만들 때마다 자동 적용됩니다.
