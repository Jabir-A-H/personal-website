'use client';

import React, { Suspense } from 'react';
import data from '@/data.json';
import AnimatedWhisperCard from '@/components/AnimatedWhisperCard';
import FuzzyHeading from '@/components/FuzzyHeading';
import WhisperBody from '@/components/WhisperBody';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function calculateReadingTime(content: string | string[]) {
  const text = Array.isArray(content) ? content.join(' ') : content;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function WhispersContent() {
  const { whispers } = data;
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(whispers.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  
  const currentWhispers = whispers.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <>
      <div className="space-y-32">
        {currentWhispers.map((whisper, index) => {
          return (
            <AnimatedWhisperCard 
              key={index}
              className="group relative"
            >
              <div className="absolute -left-12 md:-left-24 top-0 h-full w-[1px] bg-neutral-200 hidden md:block">
                <div className="sticky top-1/2 w-2 h-2 -ml-[4px] rounded-full bg-neutral-300 group-hover:bg-accent transition-colors duration-500" />
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <h2 className="font-serif font-light text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:text-neutral-100 transition-colors text-2xl md:text-3xl">
                  {whisper.title}
                </h2>
                <div className="flex items-center gap-3">
                  <time className="font-mono text-[10px] tracking-widest text-muted uppercase">{whisper.date}</time>
                  <span className="font-mono text-[10px] text-muted">•</span>
                  <span className="font-mono text-[10px] tracking-widest text-muted uppercase">~{calculateReadingTime(whisper.content)} min read</span>
                </div>
              </div>

              <div className="pl-0 md:pl-4 border-l-2 border-neutral-100 dark:border-neutral-800 md:border-l-0">
                <WhisperBody
                  content={whisper.content}
                  style={(whisper as any).style}
                  size="default"
                />
                
                <div className="flex flex-wrap gap-3">
                  {whisper.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-muted border border-neutral-200 px-2 py-1 rounded-full hover:border-accent hover:text-accent-dark transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedWhisperCard>
          );
        })}
      </div>

      <div className="mt-32 flex justify-between items-center border-t border-neutral-200 pt-8">
        {safePage > 1 ? (
          <Link href={`/whispers?page=${safePage - 1}`} className="font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors">
            &larr; Newer
          </Link>
        ) : (
          <div />
        )}
        
        <span className="font-mono text-xs text-muted">
          Page {safePage} of {totalPages}
        </span>

        {safePage < totalPages ? (
          <Link href={`/whispers?page=${safePage + 1}`} className="font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors">
            Older &rarr;
          </Link>
        ) : (
          <div />
        )}
      </div>
    </>
  );
}

export default function WhispersPage() {
  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto px-6 md:px-12">
      <header className="mb-24 text-center">
        <FuzzyHeading className="text-5xl md:text-7xl font-serif italic tracking-tighter text-neutral-900 dark:text-neutral-100 mb-6">Whispers</FuzzyHeading>
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Fragments of thought &amp; reflection</p>
        </div>
      </header>

      <Suspense fallback={<div className="h-96" />}>
        <WhispersContent />
      </Suspense>

      <footer className="mt-24 text-center flex flex-col items-center gap-4">
        <p className="font-serif italic text-muted">More thoughts to come...</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          In the meantime, subscribe to the{' '}
          <a 
            href="/rss.xml" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-accent-dark hover:text-accent transition-colors border-b border-neutral-200 dark:border-neutral-800 hover:border-accent pb-0.5"
          >
            RSS feed
          </a>
        </p>
      </footer>
    </div>
  );
}
