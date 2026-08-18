import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  alternates: { canonical: 'https://jabirah.pages.dev/projects' },
  description: 'Technical experiments, code, and live projects by Jabir Abdullah Haian.',
  openGraph: {
    images: [{ url: '/og-projects.jpg', width: 1376, height: 768, alt: 'Monospace typography on a dark background for projects' }]
  }
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
