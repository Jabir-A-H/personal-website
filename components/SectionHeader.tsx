import React from 'react';

export default function SectionHeader({ title }: { title: React.ReactNode }) {
  return (
    <div className="sticky top-8 pb-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        {title}
      </h2>
      <div className="mt-2 w-12 h-px bg-accent"></div>
    </div>
  );
}
