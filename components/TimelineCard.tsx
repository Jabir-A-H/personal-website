'use client';

import { motion, useReducedMotion } from 'motion/react';
import React, { useState } from 'react';

interface TimelineCardProps {
  title: string;
  date: string;
  role: string;
  description?: string;
  skills?: string[];
  idx: number;
  coAuthors?: string[];
  link?: string;
  linkLabel?: string;
}

export default function TimelineCard({ title, date, role, description, skills, idx, coAuthors, link, linkLabel }: TimelineCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const VISIBLE_COUNT = 4;
  const visibleSkills = skills && (expanded ? skills : skills.slice(0, VISIBLE_COUNT));
  const hiddenCount = skills ? Math.max(0, skills.length - VISIBLE_COUNT) : 0;

  return (
    <motion.div
      className="relative pl-8 sm:pl-10 group"
      style={{ transformOrigin: '0% 50%' }}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotateY: -15, x: -8 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotateY: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : 0.45,
        delay: 0.5 + idx * 0.12,
        ease: 'easeOut',
      }}
    >
      <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-accent transition-colors"></div>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between space-y-1 sm:space-y-0 mb-1">
        <div className="font-serif font-medium text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 group-hover:text-accent-dark transition-colors">{title}</div>
        <time className="font-mono text-xs text-muted">{date}</time>
      </div>
      <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{role}</div>
      {description && <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">{description}</div>}
      {coAuthors && coAuthors.length > 0 && (
        <div className="text-xs text-neutral-500 mb-2">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Co-authors:</span> {coAuthors.join(', ')}
        </div>
      )}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 mb-2 text-sm text-accent-dark hover:text-accent font-medium hover:underline underline-offset-4 transition-colors">
          {linkLabel || 'View'} &rarr;
        </a>
      )}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {visibleSkills!.map(skill => (
            <span key={skill} className="text-[10px] uppercase tracking-wider font-mono bg-accent/5 text-accent-dark px-2 py-1 rounded-sm border border-accent/10">
              {skill}
            </span>
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className="text-[10px] uppercase tracking-wider font-mono text-muted px-2 py-1 rounded-sm border border-neutral-300 hover:border-accent hover:text-accent-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {expanded ? 'Show less' : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
