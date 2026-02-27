import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Jabir Abdullah Haian',
  description: 'Technical experiments, code, and live projects by Jabir Abdullah Haian.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
