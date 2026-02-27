import React from 'react';

export default function SectionHeader({ title }: { title: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tighter uppercase sticky top-8">
      {title}
    </h2>
  );
}
