import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = 'https://jabirah.pages.dev';

const routes: { path: string; priority: number }[] = [
  { path: '/', priority: 1.0 },
  { path: '/education', priority: 0.9 },
  { path: '/experience', priority: 0.9 },
  { path: '/projects', priority: 0.9 },
  { path: '/whispers', priority: 0.7 },
  { path: '/contact', priority: 0.7 },
  { path: '/now', priority: 0.5 },
  { path: '/journey', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    priority,
  }));
}
