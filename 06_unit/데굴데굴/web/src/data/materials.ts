import type { LearningMaterial } from "@/lib/types";

/**
 * 스폰지클럽 1기 학습 자료 — 회차별
 * 출처: Google Sheets · gid=1107259301
 *
 * - 고정: 모든 주차에 항상 노출 (사전 안내·툴 등)
 * - 0회차 ~ 6회차: 해당 주차 자료
 * - URL이 아닌 텍스트(프롬프트·명령어)는 contentType: "text"로 구분
 */
/**
 * 학습 자료 (회차별).
 *
 * 고정 항목 + 가이드 분류 항목은 공지사항(announcements.ts)으로 이동됨.
 * 여기엔 회차별 실습·꿀팁·예제·툴·플러그인·미션 등이 남음.
 */
export const learningMaterials: LearningMaterial[] = [
  // ─── 0회차 (5/3 셋업) ───────────────────────────────────
  {
    id: "m-0-1",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 1,
    category: "슬랙 실습",
    title: "본인 닉네임 들어간 이모티콘 만들기",
    content: "https://emoji-gen.ninja/ko/",
    contentType: "url",
    note: "슬랙 이모티콘",
  },
  {
    id: "m-0-2",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 2,
    category: "슬랙 실습",
    title: "프로필 사진 만들기 (chatGPT 덕테이프)",
    content: "https://chatgpt.com/share/69f45eec-e948-8323-8547-f96c85c461c6",
    contentType: "url",
    note: "ChatGPT 활용",
  },
  {
    id: "m-0-3",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 3,
    category: "참고자료",
    title: "노트북LM - 스킬/플러그인/마켓플레이스 자료",
    content:
      "https://notebooklm.google.com/notebook/28e27fa6-0d8c-4a37-945b-7491e377c94e",
    contentType: "url",
    note: "젬마 정리 자료",
  },
  {
    id: "m-0-5",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 5,
    category: "꿀팁",
    title: "숨겨진 폴더/파일들 보이게 하기",
    content: "https://claude.ai/share/0f44e1d1-53d8-46b4-92eb-ff44a7da9a7b",
    contentType: "url",
    note: "옵시디언 설정",
  },
  {
    id: "m-0-6",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 6,
    category: "참고자료",
    title: "스킬 모음 사이트",
    content: "https://skills.sh/",
    contentType: "url",
  },
  {
    id: "m-0-7",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 7,
    category: "명령어",
    title: "옵시디언에서 Claude Code 실행 명령어",
    content: "claude --model opus --permission-mode bypassPermissions",
    contentType: "text",
    note: "터미널 입력",
  },
  {
    id: "m-0-9",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 9,
    category: "툴",
    title: "옵시디언 다운로드 링크",
    content: "https://obsidian.md/ko/download",
    contentType: "url",
  },
  {
    id: "m-0-10",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 10,
    category: "플러그인",
    title: "슈퍼파워 (superpowers)",
    content: "https://github.com/obra/superpowers",
    contentType: "url",
  },
  {
    id: "m-0-11",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 11,
    category: "플러그인",
    title: "claude-natives",
    content: "https://github.com/team-attention/plugins-for-claude-natives",
    contentType: "url",
  },
  {
    id: "m-0-12",
    weekLabel: "0회차",
    weekOrder: 0,
    no: 12,
    category: "미션",
    title: "스킬 활용해서 나만의 OS 인터뷰 진행하기",
    content: "https://github.com/selfishclub/os-interview-skill",
    contentType: "url",
    note: "1주차 과제",
  },

  // ─── 1회차 (5/10 · 현재) ────────────────────────────────
  {
    id: "m-1-1",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 1,
    category: "텔레그램 실습",
    title: "클로드 코드 채널 기능을 위한 가이드",
    content:
      "https://github.com/spongeclub/spongeclub_1/blob/main/04_etc/0510_%ED%81%B4%EB%A1%9C%EB%93%9C%EC%BD%94%EB%93%9C_%EC%B1%84%EB%84%90_%EA%B0%80%EC%9D%B4%EB%93%9C/claude-code-telegram-setup-guide.md",
    contentType: "url",
  },
  {
    id: "m-1-2",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 2,
    category: "텔레그램 실습",
    title: "클로드코드 텔레그램 채널 연동 시작 프롬프트",
    content: `나는 '클로드 코드 채널' 기능을 활용하여, 클로드 코드 세션과 텔레그램 채널을 연동하려고 해.
클로드 코드 채널 기능에 대한 공식 가이드 문서를 리서치 해
어떤 식으로 연동할지 작업 계획을 구체적으로 세우고 브리핑 해
내게 확인 요청한 후, 작업을 실행하되 내가 해야할 가이드를 구체적으로 명시해줘
가이드 진행할 때, 비개발자도 이해하기 쉽게 설명해줘`,
    contentType: "text",
  },
  {
    id: "m-1-3",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 3,
    category: "캐러셀 OS",
    title: "클로드로 캐러셀에 필요한 항목 md파일로 만들기",
    content: "https://claude.ai/share/c5f03a47-8dc4-499a-9b4a-ce9ac5b1d101",
    contentType: "url",
  },
  {
    id: "m-1-4",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 4,
    category: "캐러셀 OS",
    title: "behance > 캐러셀 레퍼런스 찾는 링크",
    content:
      "https://www.behance.net/search/projects/%EC%B9%B4%EB%93%9C%EB%89%B4%EC%8A%A4?tracking_source=typeahead_search_direct",
    contentType: "url",
  },
  {
    id: "m-1-5",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 5,
    category: "캐러셀 OS",
    title: "스니핏 - 콘텐츠 레퍼런스 찾는 사이트 (가입 시 무료)",
    content: "http://reference.snipit.im/?promo=ZEMMA",
    contentType: "url",
  },
  {
    id: "m-1-6",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 6,
    category: "캐러셀 OS",
    title: "디자인 md 모음 관련 깃허브",
    content: "https://github.com/VoltAgent/awesome-claude-design",
    contentType: "url",
  },
  {
    id: "m-1-7",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 7,
    category: "캐러셀 OS",
    title: "디자인 md 모음 사이트",
    content: "https://getdesign.md/",
    contentType: "url",
  },
  {
    id: "m-1-8",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 8,
    category: "캐러셀 OS",
    title: "만든 서비스 배포 가능한 사이트",
    content: "https://vercel.com/signup",
    contentType: "url",
  },
  {
    id: "m-1-9",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 9,
    category: "흐민",
    title: "흐민 OS : Selforge 콘텐츠 웹사이트",
    content: "https://hminn.xyz/selforge",
    contentType: "url",
  },
  {
    id: "m-1-10",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 10,
    category: "다니",
    title: "다니 라이브 세션 발표 자료",
    content: "https://canva.link/pkw3o20ltgnf4w3",
    contentType: "url",
  },
  {
    id: "m-1-11",
    weekLabel: "1회차",
    weekOrder: 1,
    no: 11,
    category: "흐민",
    title: "흐민 라이브 세션 발표 자료",
    content: "https://canva.link/8ovp0ha4m9svz21",
    contentType: "url",
  },
];

// ─── Helpers ──────────────────────────────────────────────
export interface MaterialGroup {
  weekLabel: string;
  weekOrder: number;
  items: LearningMaterial[];
}

/**
 * 주차별 그룹.
 * - 고정 항상 노출 (최상단)
 * - 현재 주차 강조 (페이지에서 highlight)
 * - 과거 주차 함께 노출 (역순: 최신 먼저)
 */
export function materialsByWeek(): MaterialGroup[] {
  const groups = new Map<number, MaterialGroup>();
  for (const m of learningMaterials) {
    if (!groups.has(m.weekOrder)) {
      groups.set(m.weekOrder, {
        weekLabel: m.weekLabel,
        weekOrder: m.weekOrder,
        items: [],
      });
    }
    groups.get(m.weekOrder)!.items.push(m);
  }
  // 정렬: 고정(-1) → 현재(높은 순 = 최신부터) → 과거
  return Array.from(groups.values()).sort((a, b) => {
    if (a.weekOrder === -1) return -1;
    if (b.weekOrder === -1) return 1;
    return b.weekOrder - a.weekOrder;
  });
}
