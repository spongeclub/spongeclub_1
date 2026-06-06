import { parseMemberList, getTeamTopic } from './data';
import galleryData from '../data/gallery.json';
import extraData from '../data/members-extra.json';

export type MemberSns = {
  instagram?: string;
  linkedin?: string;
  threads?: string;
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
    return {
      team: m.team,
      nickname: m.nickname,
      fullName: m.fullName,
      isCrew: m.isCrew,
      sns: e.sns ?? {},
      oneliner: e.oneliner ?? '',
      image: e.image ?? '',
      gallery,
    };
  });

  // 조 순서대로 정렬 (조별로 묶임)
  list.sort((a, b) => TEAM_ORDER.indexOf(a.team) - TEAM_ORDER.indexOf(b.team));
  return list;
}

export { getTeamTopic };
