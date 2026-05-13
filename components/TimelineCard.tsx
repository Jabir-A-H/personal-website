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
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-neutral-300 group-hover:bg-accent text-neutral-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors"></div>
      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="font-serif font-medium text-lg">{title}</div>
          <time className="font-mono text-xs text-neutral-500">{date}</time>
        </div>
        <div className="text-sm font-medium text-neutral-800 mb-2">{role}</div>
        {description && <div className="text-sm text-neutral-600">{description}</div>}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {skills.map(skill => (
              <span key={skill} className="text-[10px] uppercase tracking-wider font-mono bg-neutral-100 text-neutral-500 px-2 py-1 rounded-sm">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
