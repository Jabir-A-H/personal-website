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
        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">{title}</h3>
        <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">{date}</span>
      </div>
      <p className={`font-serif italic text-xl text-neutral-600 ${description ? 'mb-4' : ''}`}>{role}</p>
      {description && <p className="text-neutral-700">{description}</p>}
    </div>
  );
}
