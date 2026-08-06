import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Book, Briefcase, Globe, Code, ArrowUpRight, Clock } from 'lucide-react';
import data from '@/data.json';
import FadeIn from '@/components/FadeIn';
import AnimatedHeading from '@/components/AnimatedHeading';

export const metadata: Metadata = {
  title: 'Now',
  description: 'What Jabir Abdullah Haian is focused on right now.',
  openGraph: {
    images: [{ url: '/og-image.png' }]
  }
};

const iconMap: Record<string, React.ReactNode> = {
  book: <Book className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  code: <Code className="w-5 h-5" />,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function NowPage() {
  const { now, personal } = data;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-24">

      {/* Header */}
      <FadeIn>
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Currently
            </span>
          </div>

          <AnimatedHeading className="text-5xl md:text-7xl font-serif font-light tracking-tight text-neutral-900 mb-6">
            Now
          </AnimatedHeading>

          <p className="text-xl md:text-2xl font-light text-neutral-600 leading-relaxed max-w-xl">
            {now.status}
          </p>
        </header>
      </FadeIn>

      {/* Now Items */}
      <div className="space-y-0">
        {now.items.map((item, index) => {
          const isExternal = item.link && item.link.startsWith('http');

          return (
            <FadeIn key={index} delay={index * 0.1}>
              <article className="group relative py-10 border-b border-neutral-200 first:border-t">

                {/* Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-accent opacity-80 group-hover:opacity-100 transition-opacity">
                    {iconMap[item.icon] || <Clock className="w-5 h-5" />}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                    {item.label}
                  </span>
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-3 group-hover:text-neutral-800 transition-colors">
                  {item.title}
                </h2>

                <p className="text-base md:text-lg font-light text-neutral-600 leading-relaxed max-w-xl mb-4">
                  {item.description}
                </p>

                {/* Link */}
                {item.link && (
                  isExternal ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors"
                    >
                      View project
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors"
                    >
                      View project
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  )
                )}

              </article>
            </FadeIn>
          );
        })}
      </div>

      {/* Footer */}
      <FadeIn delay={0.4}>
        <footer className="mt-20 pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
              Last updated
            </p>
            <time className="text-sm font-mono text-neutral-600">
              {formatDate(now.lastUpdated)}
            </time>
          </div>

          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
              Inspired by
            </p>
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-accent-dark hover:text-accent transition-colors"
            >
              nownownow.com
            </a>
          </div>
        </footer>
      </FadeIn>

    </div>
  );
}
