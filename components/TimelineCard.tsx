import React from 'react';

interface TimelineCardProps {
  title: string;
  date: string;
  role: string;
  description?: string;
  skills?: string[];
}

export default function TimelineCard({ title, date, role, description, skills }: TimelineCardProps) {
  return (
    <div className="relative pl-8 sm:pl-10 group">
      {/* Accent dot on the left line */}
      <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-accent transition-colors"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between space-y-1 sm:space-y-0 mb-1">
        <div className="font-serif font-medium text-xl md:text-2xl text-neutral-900 group-hover:text-accent-dark transition-colors">{title}</div>
        <time className="font-mono text-xs text-muted">{date}</time>
      </div>
      <div className="text-sm font-medium text-neutral-700 mb-2">{role}</div>
      {description && <div className="text-sm text-neutral-600 leading-relaxed">{description}</div>}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map(skill => (
            <span key={skill} className="text-[10px] uppercase tracking-wider font-mono bg-accent/5 text-accent-dark px-2 py-1 rounded-sm border border-accent/10">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
