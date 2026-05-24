export const WEEK2_MEMBER_NAMES_BY_TEAM = {
  "1조": [
    "Amy(임유영)",
    "나무",
    "모닥(김은영)",
    "민트",
    "배짱(박종배)",
    "비비안(박정은)",
    "샤인",
    "아가타(정재율)",
    "유스(김기태)",
    "이든(김다현)",
    "임솔",
    "잭(유재현)",
    "체스터",
  ],
  "2조": [
    "Iny",
    "띵크(이예성)",
    "마라",
    "박라엘",
    "봄(김연미)",
    "슬로우퀵",
    "에밀리",
    "에이미(박경선)",
    "오국봉",
    "제제(최지예)",
    "포노미터(김미라)",
    "피노",
    "히카리",
  ],
  "3조": [
    "Nina(이예지)",
    "개미(임종범)",
    "그린(이유경)",
    "린디",
    "뿌까(이세희)",
    "설록(권효선)",
    "솔라(손수정)",
    "신연수",
    "율리아(조유리)",
    "지니(민은진)",
    "치코",
    "코니(황초롱)",
    "흐민",
  ],
  "4조": [
    "yongs(전용규)",
    "거위의꿈(임정선)",
    "나로(박루아)",
    "다다(김다솔)",
    "달빛그린",
    "리보(이보경)",
    "린(이은지)",
    "먼지민(석지민)",
    "설민주",
    "에이스",
    "위시(김가연)",
    "정정민",
    "찌니(신진영)",
  ],
  "5조": [
    "artree",
    "Keno",
    "거북이의꿈(나병우)",
    "덕수(김효정)",
    "로이캉",
    "보미",
    "비키(서승리)",
    "써니(박수연)",
    "애니(박상임)",
    "오웬(이성현)",
    "이안(박민우)",
    "헤이즐(성윤재)",
  ],
  "6조": [
    "Galia(방경은)",
    "Hook2(이창환)",
    "J(허지은)",
    "다니",
    "라라(오현라)",
    "레이",
    "석영",
    "아이리스",
    "초보자",
    "하늘(정하늘)",
    "키니",
    "허니바른",
    "히얌",
  ],
} as const;

const MANUAL_MEMBER_ALIASES: Record<string, string> = {
  "1조|솔": "임솔",
  "2조|죠죠": "Iny",
  "2조|박경선": "에이미(박경선)",
  "3조|jinny": "지니(민은진)",
  "3조|이세희": "뿌까(이세희)",
  "4조|Rin": "린(이은지)",
  "4조|릴팍": "나로(박루아)",
  "4조|정민": "정정민",
  "5조|키노": "Keno",
  "5조|Sunny": "써니",
  "5조|성윤재": "헤이즐(성윤재)",
  "5조|박상임": "애니(박상임)",
  "6조|이창환": "Hook2(이창환)",
  "6조|이루다썬": "아이리스",
  "6조|정하늘": "하늘(정하늘)",
};

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
}

function aliasKey(team: string, value: string): string {
  return `${team}|${normalizeName(value)}`;
}

function buildAliasMap(): Map<string, string> {
  const aliases = new Map<string, string>();

  for (const [team, members] of Object.entries(WEEK2_MEMBER_NAMES_BY_TEAM)) {
    for (const canonical of members) {
      aliases.set(aliasKey(team, canonical), canonical);
      aliases.set(aliasKey(team, displayMemberName(canonical)), canonical);

      const realName = canonical.match(/\(([^)]+)\)/)?.[1];
      if (realName) aliases.set(aliasKey(team, realName), canonical);
    }
  }

  for (const [key, canonical] of Object.entries(MANUAL_MEMBER_ALIASES)) {
    const [team, rawName] = key.split("|");
    aliases.set(aliasKey(team, rawName), canonical);
  }

  return aliases;
}

const MEMBER_ALIASES = buildAliasMap();

export function canonicalMemberName(team: string, rawName: string): string {
  return MEMBER_ALIASES.get(aliasKey(team, rawName)) ?? rawName.trim();
}

export function isKnownMemberName(team: string, rawName: string): boolean {
  return MEMBER_ALIASES.has(aliasKey(team, rawName));
}

export function displayMemberName(memberName: string): string {
  const idx = memberName.indexOf("(");
  return (idx === -1 ? memberName : memberName.slice(0, idx)).trim();
}
