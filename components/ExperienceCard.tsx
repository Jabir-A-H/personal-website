import React from 'react';

interface ExperienceCardProps {
  title: string;
  date: string;
  role: string;
  description?: string;
}

export default function ExperienceCard({ title, date, role, description }: ExperienceCardProps) {
  return (
    <div className="group">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
        <span className="font-mono text-xs text-muted mt-2 md:mt-0">{date}</span>
      </div>
      <p className={`font-serif italic text-xl text-neutral-600 dark:text-neutral-400 ${description ? 'mb-4' : ''}`}>{role}</p>
      {description && <p className="text-neutral-700 dark:text-neutral-300">{description}</p>}
    </div>
  );
}
