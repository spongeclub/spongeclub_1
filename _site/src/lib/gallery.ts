import galleryData from '../data/gallery.json';

export type FeatureSimple = {
  emoji: string;
  text: string;
};

export type GalleryItem = {
  title: string;
  member: string;
  team: string;
  week: number;
  category: string;
  description: string;
  descriptionShort?: string;
  url: string;
  notePath: string;
  thumbnail?: string;
  highlight?: string;
  before?: string;
  after?: string;
  techStack?: string[];
  features?: string[];
  featuresSimple?: FeatureSimple[];
};

export function loadGallery(): { curatedAt: string; items: GalleryItem[] } {
  return galleryData as any;
}
