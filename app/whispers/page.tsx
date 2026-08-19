'use client';

import React, { Suspense, useState, useRef } from 'react';
import data from '@/data.json';
import AnimatedWhisperCard from '@/components/AnimatedWhisperCard';
import FuzzyHeading from '@/components/FuzzyHeading';
import WhisperBody from '@/components/WhisperBody';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import { calculateReadingTime } from '@/lib/utils';

function WhispersContent() {
  const { whispers } = data;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search-filtered whispers (before tag filter) — used for dynamic tag counts
  const query = searchQuery.trim().toLowerCase();
  const searchFiltered = whispers.filter((w) => {
    if (!query) return true;
    return w.title.toLowerCase().includes(query) ||
      (Array.isArray(w.content) ? w.content.join(' ') : w.content).toLowerCase().includes(query);
  });

  // Build tag frequency map from search-filtered set, sort by count desc then alphabetically
  const tagCounts = searchFiltered.reduce<Record<string, number>>((acc, w) => {
    (w.tags as string[]).forEach((t) => { acc[t] = (acc[t] ?? 0) + 1; });
    return acc;
  }, {});
  const allTags = Object.entries(tagCounts)
    .sort(([a, ca], [b, cb]) => cb - ca || a.localeCompare(b))
    .map(([tag, count]) => ({ tag, count }));

  // Apply tag filter on top of search results
  const tagFiltered = activeTag ? searchFiltered.filter((w) => (w.tags as string[]).includes(activeTag)) : searchFiltered;

  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(tagFiltered.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  
  const currentWhispers = tagFiltered.slice((safePage - 1) * perPage, safePage * perPage);

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    router.push('/whispers');
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    router.push('/whispers');
  };

  return (
    <>
      {/* Search bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search whispers…"
          className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-2 pr-12 pl-0 font-serif italic text-neutral-700 dark:text-neutral-300 placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-base"
          aria-label="Search whispers"
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); router.push('/whispers'); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors font-serif italic text-sm"
            aria-label="Clear search"
          >
            clear
          </button>
        )}
      </div>

      {/* Tag filter bar */}
      <div ref={resultsRef} className="flex flex-wrap gap-2 mb-8 font-mono text-[10px] uppercase tracking-widest justify-center">
        <button 
          onClick={() => handleTagClick(null)} 
          aria-pressed={activeTag === null}
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            activeTag === null 
              ? 'border-accent bg-accent/10 text-accent-dark dark:text-accent-light' 
              : 'border-neutral-200 dark:border-neutral-800 text-muted hover:border-accent hover:text-accent-dark dark:hover:text-accent-light'
          }`}
        >
          All <span className="opacity-50">({searchFiltered.length})</span>
        </button>
        {allTags.map(({ tag, count }) => (
          <button 
            key={tag} 
            onClick={() => handleTagClick(tag)} 
            aria-pressed={activeTag === tag}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              activeTag === tag 
                ? 'border-accent bg-accent/10 text-accent-dark dark:text-accent-light' 
                : 'border-neutral-200 dark:border-neutral-800 text-muted hover:border-accent hover:text-accent-dark dark:hover:text-accent-light'
            }`}
          >
            #{tag} <span className="opacity-50">({count})</span>
          </button>
        ))}
      </div>

      {/* Whisper list */}
      {currentWhispers.length === 0 ? (
        <p className="font-serif italic text-muted text-center py-16">No whispers match your search.</p>
      ) : (
        <div className="space-y-20">
          {currentWhispers.map((whisper, index) => {
            return (
              <AnimatedWhisperCard 
                key={index}
                id={whisper.slug}
                className="group relative"
              >
                <div className="absolute -left-12 md:-left-24 top-0 h-full w-[1px] bg-neutral-200 dark:bg-neutral-700 hidden md:block">
                  <div className="sticky top-1/2 w-2 h-2 -ml-[4px] rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-accent transition-colors duration-500" />
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <Link href={`/whispers/${whisper.slug}`}>
                    <h2 className="font-serif font-light text-neutral-800 dark:text-neutral-200 hover:text-accent-dark dark:hover:text-accent-light transition-colors text-2xl md:text-3xl">
                      {whisper.title}
                    </h2>
                  </Link>
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
                      <button 
                        key={tag} 
                        onClick={() => handleTagClick(tag)}
                        aria-pressed={activeTag === tag}
                        className={`text-[10px] font-mono uppercase tracking-widest border px-2 py-1 rounded-full transition-colors cursor-pointer ${
                          activeTag === tag
                            ? 'border-accent bg-accent/10 text-accent-dark dark:text-accent-light'
                            : 'border-neutral-200 dark:border-neutral-800 text-muted hover:border-accent hover:text-accent-dark dark:hover:text-accent-light'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedWhisperCard>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-between items-center border-t border-neutral-200 dark:border-neutral-700 pt-8">
          {safePage > 1 ? (
            <Link href={`/whispers?page=${safePage - 1}`} className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors">
              &larr; Newer
            </Link>
          ) : (
            <div />
          )}
          
          <span className="font-mono text-xs text-muted">
            Page {safePage} of {totalPages}
          </span>

          {safePage < totalPages ? (
            <Link href={`/whispers?page=${safePage + 1}`} className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors">
              Older &rarr;
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </>
  );
}

export default function WhispersPage() {
  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto px-6 md:px-12">
      <header className="mb-12 text-center">
        <FuzzyHeading className="text-5xl md:text-7xl font-serif italic tracking-tighter text-neutral-900 dark:text-neutral-100 mb-4">Whispers</FuzzyHeading>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Fragments of thought &amp; reflection</p>
      </header>

      <Suspense fallback={<div className="h-96" />}>
        <WhispersContent />
      </Suspense>

      <footer className="mt-16 text-center">
        <p className="font-serif italic text-muted">
          More thoughts to come… subscribe via{' '}
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors border-b border-neutral-200 dark:border-neutral-800 hover:border-accent pb-0.5"
          >
            RSS
          </a>{' '}
          to follow along.
        </p>
      </footer>
    </div>
  );
}
