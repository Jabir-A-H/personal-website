import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whispers | Jabir Abdullah Haian',
  description: 'Fragments of thought, reflection, and writing by Jabir Abdullah Haian.',
  openGraph: {
    images: [{ url: '/og-whispers.jpg' }]
  }
};

export default function WhispersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
