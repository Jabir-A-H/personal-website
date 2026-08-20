export type StoryBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export type CoverImage = { src: string; alt: string };

export interface Whisper {
  date: string;
  title: string;
  slug: string;
  story: StoryBlock[];
  tags: string[];
  style: string;
  coverImage?: CoverImage;
}

export interface Project {
  title: string;
  slug: string;
  status: string;
  category: string;
  description: string;
  story: StoryBlock[];
  tech: string[];
  repo?: string;
  live?: string;
  coverImage?: CoverImage;
}
