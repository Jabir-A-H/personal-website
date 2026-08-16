import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jabir Abdullah Haian',
    short_name: 'Jabir Haian',
    description: 'BBA in Accounting & Information Systems at University of Dhaka.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#e8915a',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
