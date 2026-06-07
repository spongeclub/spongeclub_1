import { parseMemberList, getTeamTopic } from './data';
import galleryData from '../data/gallery.json';
import extraData from '../data/members-extra.json';
import unitsData from '../data/units.json';

export type MemberSns = {
  instagram?: string;
  linkedin?: string;
  threads?: string;
  brunch?: string;
};

export type MemberGalleryItem = {
  title: string;
  url: string;
};

export type MemberProfile = {
  team: string;
  nickname: string;
  fullName: string;
  isCrew: boolean;
  isLeader: boolean;
  sns: MemberSns;
  oneliner: string;
  image: string;
  gallery: MemberGalleryItem[];
};

type ExtraEntry = { sns?: MemberSns; oneliner?: string; image?: string };

// 닉네임 추출: "에이미(박경선)" → "에이미"
function toNick(name: string): string {
  return name.split(/[(（]/)[0].trim();
}

const TEAM_ORDER = ['1조', '2조', '3조', '4조', '5조', '6조'];

export function loadMembers(): MemberProfile[] {
  const members = parseMemberList();
  const extra = extraData as Record<string, ExtraEntry>;
  const galleryItems = (galleryData as any).items as Array<{ title: string; url: string; member: string }>;

  const list = members.map((m): MemberProfile => {
    const e = extra[m.nickname] ?? {};
    const gallery = galleryItems
      .filter((g) => toNick(g.member) === m.nickname && g.url)
      .map((g) => ({ title: g.title, url: g.url }));
    const lead = getTeamTopic(m.team)?.lead;
    const isLeader = lead ? toNick(lead) === m.nickname : false;
    return {
      team: m.team,
      nickname: m.nickname,
      fullName: m.fullName,
      isCrew: m.isCrew,
      isLeader,
      sns: e.sns ?? {},
      oneliner: e.oneliner ?? '',
      image: e.image ?? '',
      gallery,
    };
  });

  // 정렬: 조 순서 → 같은 조 안에서는 조장 먼저 → 나머지는 가나다순
  list.sort((a, b) => {
    const t = TEAM_ORDER.indexOf(a.team) - TEAM_ORDER.indexOf(b.team);
    if (t !== 0) return t;
    if (a.isLeader !== b.isLeader) return a.isLeader ? -1 : 1;
    return a.nickname.localeCompare(b.nickname, 'ko');
  });
  return list;
}

export type UnitGroup = {
  name: string;
  tag: string;
  desc: string;
  leader: string;
  members: MemberProfile[];
};

// 유닛(조와 별개 그룹)별로 멤버를 묶는다. 멤버는 여러 유닛에 중복될 수 있고,
// 유닛에 속하지 않은 멤버는 어느 유닛에도 안 나온다.
export function loadUnitGroups(): UnitGroup[] {
  const all = loadMembers();
  const byNick = new Map(all.map((m) => [m.nickname, m]));
  return (unitsData as { units: Array<{ name: string; tag?: string; leader: string; desc?: string; members: string[] }> }).units.map((u) => {
    const members = u.members
      .map((n) => byNick.get(n))
      .filter((m): m is MemberProfile => Boolean(m));
    // 리더 먼저 → 나머지 가나다순
    members.sort((a, b) => {
      const al = a.nickname === u.leader;
      const bl = b.nickname === u.leader;
      if (al !== bl) return al ? -1 : 1;
      return a.nickname.localeCompare(b.nickname, 'ko');
    });
    return { name: u.name, tag: u.tag ?? '', desc: u.desc ?? '', leader: u.leader, members };
  });
}

export { getTeamTopic };
