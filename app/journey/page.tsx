import React from 'react';
import AnimatedHeading from '@/components/AnimatedHeading';
import { Metadata } from 'next';
import TimelineCard from '@/components/TimelineCard';
import data from '@/data.json';

export const metadata: Metadata = {
  title: 'Journey | Jabir Abdullah Haian',
  description: 'How education, experience, and projects connect.',
  openGraph: { images: [{ url: '/og-journey.png' }] },
};

// Re-framing existing data chronologically to show the narrative thread
const journeyData = [
  {
    title: 'International Education Expo 2026',
    date: 'Jun 2026',
    role: 'Seminar & Volunteer Coordinator',
    description: 'Coordinated volunteer teams for international seminars and managed attendee flow.',
    category: 'Experience',
    link: '/experience'
  },
  {
    title: 'Institute of Chartered Accountants of Bangladesh (ICAB)',
    date: 'Present',
    role: 'Certificate Level: Passed',
    description: 'Pursuing the Chartered Accountancy professional qualification alongside undergraduate studies.',
    category: 'Education',
    link: '/education'
  },
  {
    title: 'Report Submission System & LazyLedger',
    date: '2025 — 2026',
    role: 'Full-stack Developer',
    description: 'Started building complex web applications, bridging the gap between accounting needs and technological solutions.',
    category: 'Projects',
    link: '/projects'
  },
  {
    title: 'University of Dhaka',
    date: 'Sep 2022 — Present',
    role: 'BBA, Accounting & Information Systems',
    description: 'Exploring Accounting, Data Analytics, AI & Technology.',
    category: 'Education',
    link: '/education'
  },
  {
    title: 'Morning Riders',
    date: 'Apr 2024 — Sep 2025',
    role: 'President',
    description: 'Organized community cycling initiatives and coordinated university-wide tournaments.',
    category: 'Experience',
    link: '/experience'
  },
  {
    title: 'Notre Dame College',
    date: 'Feb 2019 — Jun 2021',
    role: 'HSC, Business Studies',
    description: 'Ranked 35th out of 750 students. Foundational years in business and IT.',
    category: 'Education',
    link: '/education'
  },
  {
    title: 'Alokito Library',
    date: 'Dec 2018 — Present',
    role: 'Secretariat Member to President',
    description: 'Led community programs on spiritual and value-based youth development.',
    category: 'Experience',
    link: '/experience'
  },
  {
    title: 'Birshreshtha Noor Mohammad Public College',
    date: 'Jan 2017 — May 2019',
    role: 'SSC, Business Studies',
    description: 'Government Board Scholarship Recipient. Early steps into business studies.',
    category: 'Education',
    link: '/education'
  }
];

export default function JourneyPage() {
  return (
    <div className="col-span-12 w-full max-w-4xl mx-auto px-6 md:px-12 py-12 text-neutral-800 dark:text-neutral-200">
      <header className="mb-16">
        <AnimatedHeading className="font-serif text-5xl md:text-7xl font-light tracking-tight mb-4">
          Journey
        </AnimatedHeading>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          How education, experience, and projects connect
        </p>
      </header>
      
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
        {journeyData.map((node, idx) => (
          <TimelineCard
            key={idx}
            idx={idx}
            title={node.title}
            date={node.date}
            role={node.role}
            description={node.description}
            link={node.link}
            linkLabel={`See ${node.category}`}
          />
        ))}
      </div>
    </div>
  );
}
