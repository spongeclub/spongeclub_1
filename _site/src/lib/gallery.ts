import galleryData from '../data/gallery.json';
import fs from 'node:fs';
import path from 'node:path';

export type FeatureSimple = {
  emoji: string;
  text: string;
};

export type GalleryItem = {
  title: string;
  member: string;
  team: string;
  week?: number;
  category: string;
  description: string;
  descriptionShort?: string;
  url: string;
  notePath: string;
  thumbnail?: string;
  images?: string[];
  highlight?: string;
  before?: string;
  after?: string;
  techStack?: string[];
  features?: string[];
  featuresSimple?: FeatureSimple[];
  insights?: string[];
  mvp?: boolean;
  /** true면 사이트 전체(갤러리·회고 롤링·통계)에서 제외. 노트는 보존됨. */
  hidden?: boolean;
};

// 제출 노트(notePath)의 frontmatter에서 `mvp: true` 여부를 빌드 시 읽어
// 주차별 MVP로 선정된 산출물을 자동 판정한다. 새 데이터가 들어와도 동일하게 동작.
function isMvpFromNote(notePath: string): boolean {
  if (!notePath) return false;
  // notePath는 vault 루트(02_mission/...) 기준. _site의 상위 폴더에서 찾는다.
  const candidates = [
    path.resolve(process.cwd(), '..', notePath),
    path.resolve(process.cwd(), notePath),
  ];
  for (const full of candidates) {
    try {
      const content = fs.readFileSync(full, 'utf-8');
      const parts = content.split('---');
      const frontmatter = parts.length >= 3 ? parts[1] : content.slice(0, 800);
      return /^\s*mvp:\s*true\s*$/m.test(frontmatter);
    } catch {
      // 다음 후보 경로 시도
    }
  }
  return false;
}

export function loadGallery(): { curatedAt: string; items: GalleryItem[] } {
  const data = galleryData as any;
  const items: GalleryItem[] = data.items
    .filter((it: GalleryItem) => !it.hidden)
    .map((it: GalleryItem) => ({
    ...it,
    // gallery.json에 mvp가 명시돼 있으면 그 값 우선, 없으면 제출 노트에서 자동 판정
    mvp: typeof it.mvp === 'boolean' ? it.mvp : isMvpFromNote(it.notePath),
  }));
  return { curatedAt: data.curatedAt, items };
}
