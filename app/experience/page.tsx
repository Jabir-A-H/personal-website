import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import AnimatedHeading from '@/components/AnimatedHeading';
import ExperienceCard from '@/components/ExperienceCard';
import SectionHeader from '@/components/SectionHeader';
import data from '@/data.json';

export const metadata: Metadata = {
  title: 'Experience',
  alternates: { canonical: 'https://jabirah.pages.dev/experience' },
  description: 'Professional experience, certifications, and skills progression.',
  openGraph: {
    images: [{ url: '/og-experience.jpg', width: 1376, height: 768, alt: 'A briefcase or professional setting denoting experience' }]
  }
};

export default function ExperiencePage() {
  const { experience, certifications, skills, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
      {/* Header */}
      <header className="mb-24">
        <AnimatedHeading className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase mb-4 text-neutral-900 dark:text-neutral-100">
          Experience &<br />Credentials
        </AnimatedHeading>
        <nav className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted" aria-label="Jump to section">
          <a href="#leadership" className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors">Leadership</a>
          <span aria-hidden="true">·</span>
          <a href="#certifications" className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors">Certifications</a>
          {achievements && achievements.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <a href="#achievements" className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors">Achievements</a>
            </>
          )}
          <span aria-hidden="true">·</span>
          <a href="#skills" className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors">Skills</a>
        </nav>
      </header>

      {/* Leadership & Community */}
      <section id="leadership" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <SectionHeader title="Leadership & Community" />
          </div>
          <div className="md:col-span-8 space-y-16">
            {experience.map((exp, idx) => (
              <ExperienceCard
                key={idx}
                title={exp.title}
                date={exp.date}
                role={exp.role}
                description={exp.description}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-neutral-300 dark:bg-neutral-700 mb-24"></div>

      {/* Certifications */}
      <section id="certifications" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <SectionHeader title="Certifications" />
          </div>
          <div className="md:col-span-8">
            <div className="space-y-8">
              {certifications.map((cert, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">{cert.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted font-mono">
                      {cert.issuer && <span>{cert.issuer}</span>}
                      {cert.issuer && cert.date && <span className="text-neutral-300 dark:text-neutral-700">·</span>}
                      {cert.date && <span>{cert.date}</span>}
                    </div>
                  </div>
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors shrink-0 mt-2 sm:mt-0"
                    >
                      {cert.hosted ? 'View Certificate' : 'Verify'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-neutral-300 dark:bg-neutral-700 mb-24"></div>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <>
          <section id="achievements" className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <SectionHeader title={<>Achievements &<br/>Competitions</>} />
              </div>
              <div className="md:col-span-8">
                <div className="space-y-8">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="pb-8 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{ach.title}</h3>
                        <span className="font-mono text-xs text-muted mt-2 sm:mt-0">{ach.year}</span>
                      </div>
                      <p className="font-serif italic text-lg text-neutral-600 dark:text-neutral-400 mb-1">{ach.role}</p>
                      <p className="text-sm text-muted font-mono">{ach.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-neutral-300 dark:bg-neutral-700 mb-24"></div>
        </>
      )}

      {/* Skills */}
      <section id="skills" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <SectionHeader title="Skills" />
          </div>
          <div className="md:col-span-8 space-y-12">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {categorySkills.map(skill => (
                    <div key={skill.name} className="flex items-center justify-between group py-2">
                      <span className="text-sm font-mono text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:text-neutral-100 transition-colors">{skill.name}</span>
                      <div className="flex gap-1" aria-label={`Proficiency: ${skill.level} out of 5`} title={`Proficiency: ${skill.level} out of 5`}>
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full transition-colors ${dot <= skill.level ? 'bg-accent' : 'bg-neutral-200 dark:bg-neutral-700 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
