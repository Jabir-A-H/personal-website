import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import AnimatedHeading from '@/components/AnimatedHeading';
import ExperienceCard from '@/components/ExperienceCard';
import data from '@/data.json';

export const metadata: Metadata = {
  title: 'Experience | Jabir Abdullah Haian',
  description: 'Professional experience, certifications, and skills progression.',
  openGraph: {
    images: [{ url: '/og-experience.png' }]
  }
};

export default function ExperiencePage() {
  const { experience, certifications, skills, achievements, references } = data;

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
        <AnimatedHeading className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase mb-4 text-neutral-900">
          Experience &<br />Credentials
        </AnimatedHeading>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Leadership · Community · Qualifications
        </p>
      </header>

      {/* Leadership & Community */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">Leadership &amp; Community</h2>
            <div className="w-8 h-[2px] bg-accent"></div>
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

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Certifications */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">Certifications</h2>
            <div className="w-8 h-[2px] bg-accent"></div>
          </div>
          <div className="md:col-span-8">
            <div className="space-y-8">
              {certifications.map((cert, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-8 border-b border-neutral-200 last:border-0">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{cert.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted font-mono">
                      {cert.issuer && <span>{cert.issuer}</span>}
                      {cert.issuer && cert.date && <span className="text-neutral-300">·</span>}
                      {cert.date && <span>{cert.date}</span>}
                    </div>
                  </div>
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors shrink-0 mt-2 sm:mt-0"
                    >
                      Verify
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <>
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">Achievements &amp;<br/>Competitions</h2>
                <div className="w-8 h-[2px] bg-accent"></div>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-8">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="pb-8 border-b border-neutral-200 last:border-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                        <h3 className="text-xl font-bold text-neutral-900">{ach.title}</h3>
                        <span className="font-mono text-xs text-muted mt-2 sm:mt-0">{ach.year}</span>
                      </div>
                      <p className="font-serif italic text-lg text-neutral-600 mb-1">{ach.role}</p>
                      <p className="text-sm text-muted font-mono">{ach.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-neutral-300 mb-24"></div>
        </>
      )}

      {/* Skills */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">Skills</h2>
            <div className="w-8 h-[2px] bg-accent"></div>
          </div>
          <div className="md:col-span-8 space-y-12">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {categorySkills.map(skill => (
                    <div key={skill.name} className="flex items-center justify-between group py-2">
                      <span className="text-sm font-mono text-neutral-800 group-hover:text-neutral-900 transition-colors">{skill.name}</span>
                      <div className="flex gap-1" aria-label={`Proficiency: ${skill.level} out of 5`} title={`Proficiency: ${skill.level} out of 5`}>
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full transition-colors ${dot <= skill.level ? 'bg-accent' : 'bg-neutral-200 group-hover:bg-neutral-300'}`}
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
      
      {/* References */}
      {references && references.length > 0 && (
        <>
          <div className="w-full h-px bg-neutral-300 mb-24"></div>
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">References</h2>
                <div className="w-8 h-[2px] bg-accent"></div>
              </div>
              <div className="md:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {references.map((ref, idx) => (
                    <div key={idx} className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                      <h3 className="text-lg font-bold text-neutral-900 mb-1">{ref.name}</h3>
                      <p className="font-serif italic text-neutral-600 mb-2">{ref.title}</p>
                      <p className="text-sm text-muted">{ref.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
