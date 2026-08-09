'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedProjectRow from './AnimatedProjectRow';

interface Project {
  title: string;
  description: string;
  tech: string[];
  status: string;
  category?: string;
  repo?: string;
  live?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  fullstack: 'Full-Stack',
  tools: 'Tools',
  portfolio: 'Portfolio',
  experimental: 'Experimental',
  games: 'Games',
};

function categoryLabel(key: string) {
  return CATEGORY_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

export default function OtherProjectsList({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = Array.from(
    new Set(projects.map(p => p.category).filter((c): c is string => Boolean(c)))
  );

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 font-mono text-xs uppercase tracking-widest">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 border transition-colors ${
            activeCategory === 'all'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white'
              : 'border-neutral-300 dark:border-neutral-700 text-muted hover:border-neutral-500 dark:hover:border-white/50 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          All [{projects.length}]
        </button>
        {categories.map(cat => {
          const count = projects.filter(p => p.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 border transition-colors ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white'
                  : 'border-neutral-300 dark:border-neutral-700 text-muted hover:border-neutral-500 dark:hover:border-white/50 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {categoryLabel(cat)} [{count}]
            </button>
          );
        })}
      </div>

      <div className="flex flex-col border-t-2 border-neutral-200 dark:border-neutral-800">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b-2 border-neutral-200 dark:border-neutral-800 font-mono text-[10px] text-muted uppercase tracking-widest px-6">
          <div className="col-span-5">Designation</div>
          <div className="col-span-3">Tech_Stack</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Link</div>
        </div>

        {/* Data Rows */}
        {filtered.map((project, idx) => (
          <AnimatedProjectRow
            idx={idx}
            key={project.title}
            href={project.live || project.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-neutral-200 dark:border-neutral-800 hover:bg-accent hover:text-white transition-all duration-300 px-6 items-center cursor-pointer relative overflow-hidden"
          >
            <div className="col-span-5">
              <h3 className="text-lg font-sans font-bold text-neutral-900 dark:text-neutral-200 group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted group-hover:text-white/90 mt-1 font-serif italic transition-colors">
                {project.description}
              </p>
            </div>

            <div className="col-span-3 flex flex-wrap gap-2 mt-3 md:mt-0">
              {project.tech.map(t => (
                <span key={t} className="font-mono text-[10px] text-muted border border-neutral-300 dark:border-neutral-700 group-hover:border-white/50 group-hover:text-white px-2 py-1 transition-colors uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>

            <div className="col-span-2 mt-4 md:mt-0">
              <span className={`font-mono text-[10px] uppercase tracking-widest ${
                project.status === 'development' ? 'text-accent-dark dark:text-accent-light group-hover:text-white' :
                project.status === 'archived' ? 'text-neutral-500 group-hover:text-white' :
                'text-muted group-hover:text-white'
              } transition-colors`}>
                {project.status}
              </span>
            </div>

            <div className="col-span-2 flex justify-start md:justify-end mt-4 md:mt-0">
              <div className="w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:text-accent transition-all duration-300 transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </AnimatedProjectRow>
        ))}
      </div>
    </>
  );
}
