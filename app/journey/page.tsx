import React from 'react';
import AnimatedHeading from '@/components/AnimatedHeading';
import { Metadata } from 'next';
import TimelineCard from '@/components/TimelineCard';
import data from '@/data.json';

export const metadata: Metadata = {
  title: 'Journey | Jabir Abdullah Haian',
  description: 'How education, experience, and projects connect.',
  openGraph: { images: [{ url: '/og-journey.png' }] },
};

type JourneyRef = 
  | { type: 'education' | 'experience' | 'project'; title: string }
  | { type: 'custom'; category: string; title: string; date?: string; role?: string; description?: string; link?: string; images?: string[] };

const CATEGORY_META: Record<Exclude<JourneyRef['type'], 'custom'>, { label: string; link: string }> = {
  education: { label: 'Education', link: '/education' },
  experience: { label: 'Experience', link: '/experience' },
  project: { label: 'Projects', link: '/projects' },
};

function resolveNode(ref: JourneyRef) {
  if (ref.type === 'custom') {
    return {
      title: ref.title,
      date: ref.date || '',
      role: ref.role || '',
      description: ref.description || '',
      category: ref.category,
      link: ref.link || '',
      images: ref.images,
    };
  }

  const source = ref.type === 'education' ? data.education
    : ref.type === 'experience' ? data.experience
    : data.projects;

  const entry: any = source.find((item: any) => item.title === ref.title);
  if (!entry) return null;

  const meta = CATEGORY_META[ref.type];

  return {
    title: entry.title,
    date: ref.type === 'project' ? '' : entry.date,
    role: ref.type === 'project' ? entry.category : entry.role,
    description: entry.description,
    category: meta.label,
    link: meta.link,
    images: entry.images,
  };
}

export default function JourneyPage() {
  const nodes = ((data as any).journey as JourneyRef[]).map(resolveNode).filter((n): n is NonNullable<typeof n> => n !== null);

  return (
    <div className="col-span-12 w-full max-w-4xl mx-auto px-6 md:px-12 py-12 text-neutral-800 dark:text-neutral-200">
      <header className="mb-16">
        <AnimatedHeading className="font-serif text-5xl md:text-7xl font-light tracking-tight mb-4">
          Journey
        </AnimatedHeading>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          How education, experience, and projects connect
        </p>
      </header>
      
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
        {nodes.map((node, idx) => (
          <TimelineCard
            key={idx}
            idx={idx}
            title={node.title}
            date={node.date}
            role={node.role}
            description={node.description}
            link={node.link}
            linkLabel={`See ${node.category}`}
            images={node.images}
          />
        ))}
      </div>
    </div>
  );
}
