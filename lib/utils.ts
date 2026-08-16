export function calculateReadingTime(content: string | string[]) {
  const text = Array.isArray(content) ? content.join(' ') : content;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
