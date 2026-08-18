import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whispers',
  alternates: { canonical: 'https://jabirah.pages.dev/whispers' },
  description: 'Fragments of thought, reflection, and writing by Jabir Abdullah Haian.',
  openGraph: {
    images: [{ url: '/og-whispers.jpg', width: 1376, height: 768, alt: 'Watercolor ink-bleed behind the word "Whispers"' }]
  }
};

export default function WhispersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
