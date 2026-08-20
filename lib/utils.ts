import { StoryBlock } from './types';

export function calculateReadingTime(content: string | string[] | StoryBlock[]) {
  const text = Array.isArray(content) 
    ? (content.length > 0 && typeof content[0] === 'object' && 'type' in content[0]
        ? (content as StoryBlock[]).filter(b => b.type === 'paragraph').map(b => (b as Extract<StoryBlock, { type: 'paragraph' }>).text).join(' ')
        : (content as string[]).join(' '))
    : content;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
