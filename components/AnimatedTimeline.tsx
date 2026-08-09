'use client';

import { motion } from 'motion/react';
import TimelineCard from './TimelineCard';

interface EducationEntry {
  title: string;
  date: string;
  role: string;
  description?: string;
  skills?: string[];
}

export default function AnimatedTimeline({ education }: { education: EducationEntry[] }) {
  return (
    <div className="space-y-12 relative" style={{ perspective: '800px' }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 ml-1 h-full w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent"
        style={{ transformOrigin: 'top' }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
      />
      {education.map((edu, idx) => (
        <TimelineCard
          key={idx}
          idx={idx}
          title={edu.title}
          date={edu.date}
          role={edu.role}
          description={edu.description}
          skills={edu.skills}
        />
      ))}
    </div>
  );
}
