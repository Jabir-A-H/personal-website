import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import ExperienceCard from '../../components/ExperienceCard';
import data from '../../data.json';

export const metadata = {
  title: 'Experience & Credentials',
  description: 'Leadership, community involvement, certifications, and professional skills.',
};

export default function ExperiencePage() {
  const { experience, certifications, skills } = data;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 md:py-24">
      {/* Header */}
      <header className="mb-24">
        <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase mb-4 text-neutral-900">
          Experience &<br />Credentials
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Leadership · Community · Qualifications
        </p>
      </header>

      {/* Leadership & Community */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Leadership &amp; Community</h2>
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
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Certifications</h2>
            <div className="w-8 h-[2px] bg-accent"></div>
          </div>
          <div className="md:col-span-8">
            <div className="space-y-8">
              {certifications.map((cert, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-8 border-b border-neutral-200 last:border-0">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{cert.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 font-mono">
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

      {/* Skills */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Skills</h2>
            <div className="w-8 h-[2px] bg-accent"></div>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map(skill => (
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
        </div>
      </section>
    </div>
  );
}
