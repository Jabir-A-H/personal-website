'use client';

import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import AnimatedProjectRow from './AnimatedProjectRow';

import { Project } from '@/lib/types';

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

const PER_PAGE = 6;

export default function AllProjectsList({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Step 1: filter by search first
  const searchLower = searchQuery.toLowerCase();
  const searchFiltered = projects.filter(p => {
    if (!searchQuery) return true;
    return p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tech.some(t => t.toLowerCase().includes(searchLower));
  });

  // Step 2: build category counts from search-filtered set
  const categories = Array.from(
    new Set(projects.map(p => p.category).filter((c): c is string => Boolean(c)))
  );
  const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = searchFiltered.filter(p => p.category === cat).length;
    return acc;
  }, {});

  // Step 3: apply category filter on top
  const filtered = activeCategory === 'all'
    ? searchFiltered
    : searchFiltered.filter(p => p.category === activeCategory);

  // Step 4: pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedProjects = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-widest">
          <button
            onClick={() => handleCategoryClick('all')}
            aria-pressed={activeCategory === 'all'}
            className={`px-4 py-2 border transition-colors ${
              activeCategory === 'all'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white'
                : 'border-neutral-300 dark:border-neutral-700 text-muted hover:border-neutral-500 dark:hover:border-white/50 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All [{searchFiltered.length}]
          </button>
          {categories.map(cat => {
            const count = categoryCounts[cat] ?? 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                aria-pressed={isActive}
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
        
        <div className="relative group max-w-sm w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400 group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 focus:border-accent dark:focus:border-accent text-sm font-sans placeholder:text-neutral-500 dark:placeholder:text-neutral-500 outline-none transition-all focus:ring-1 focus:ring-accent"
          />
        </div>
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
        {paginatedProjects.length === 0 ? (
          <p className="font-serif italic text-muted text-center py-16">No projects match your search.</p>
        ) : (
          paginatedProjects.map((project, idx) => (
            <AnimatedProjectRow
              idx={idx}
              key={project.title}
              href={`/projects/${project.slug}`}
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
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800 pt-6">
          {safePage > 1 ? (
            <button
              onClick={() => setCurrentPage(safePage - 1)}
              className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors"
            >
              &larr; Prev
            </button>
          ) : (
            <div />
          )}
          
          <span className="font-mono text-xs text-muted">
            Page {safePage} of {totalPages}
          </span>

          {safePage < totalPages ? (
            <button
              onClick={() => setCurrentPage(safePage + 1)}
              className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors"
            >
              Next &rarr;
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </>
  );
}
