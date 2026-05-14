import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import SectionHeader from '../components/SectionHeader';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
import FadeIn from '../components/FadeIn';
import data from '../data.json';

export const metadata: Metadata = {
  title: `${data.personal.name} | Portfolio`,
  description: data.personal.headline,
};

import Image from 'next/image';

// ... (Metadata and imports handled correctly below)

export default function Home() {
  const { personal, experience, certifications, skills } = data;
  const currentEducation = data.education[0]; // University of Dhaka

  // Curated: show only profession-relevant experiences on home
  const featuredExperience = experience.filter(
    exp => exp.title === 'Morning Riders' || exp.title === 'আলোকিত লাইব্রেরী'
  );

  return (
    <main className="w-full overflow-hidden">
      {/* Immersive Hero */}
      <FadeIn className="relative w-full h-[90vh] md:h-screen flex flex-col items-center justify-end md:justify-center mb-16 md:mb-24 px-4 overflow-hidden">
        
        {/* Full Width Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/profile.jpg" 
            alt="Jabir Abdullah Haian" 
            fill
            className="object-cover object-top"
            priority
          />
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-neutral-900/30 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent"></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-end pb-12 md:pb-0 h-full">
          <div className="text-center w-full">
            <h1 className="text-[clamp(3rem,12vw,9rem)] leading-[0.85] font-sans font-black tracking-tighter text-white uppercase mb-6 drop-shadow-2xl">
              {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
            </h1>
            
            <p className="text-xl md:text-3xl font-serif italic text-neutral-200 mb-8 leading-relaxed max-w-2xl mx-auto px-4 drop-shadow-md">
              {personal.headline}
            </p>
            
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-300 flex items-center justify-center gap-4">
              <span>{personal.location}</span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              <span>{personal.email}</span>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="w-full h-1 bg-accent mb-16"></div>

      {/* Education Section — Current Institution Summary */}
      <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4">
          <SectionHeader title="Education" />
        </div>
        <div className="md:col-span-8">
          <div className="group mb-8">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">{currentEducation.title}</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">{currentEducation.date}</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600 mb-4">{currentEducation.role}</p>
            {currentEducation.description && (
              <p className="text-neutral-700 mb-6">{currentEducation.description}</p>
            )}
            {currentEducation.skills && currentEducation.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentEducation.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="text-[10px] uppercase tracking-wider font-mono bg-accent/5 text-accent-dark px-2 py-1 rounded-sm border border-accent/10">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/education"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors group/link"
          >
            Full academic timeline
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </FadeIn>

      <div className="w-full h-px bg-neutral-300 mb-16"></div>

      {/* Leadership & Experience — Curated */}
      <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4">
          <SectionHeader title={<>Leadership &<br/>Experience</>} />
        </div>
        <div className="md:col-span-8 space-y-16">
          {featuredExperience.map((exp, idx) => (
            <ExperienceCard 
              key={idx}
              title={exp.title}
              date={exp.date}
              role={exp.role}
              description={exp.description}
            />
          ))}
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors group/link"
          >
            All experience &amp; credentials
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </FadeIn>

      <div className="w-full h-px bg-neutral-300 mb-16"></div>

      {/* Credentials — Compact Summary */}
      <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4">
          <SectionHeader title="Credentials" />
        </div>
        <div className="md:col-span-8">
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-neutral-800">
                <span className="text-base font-medium">{cert.title}</span>
                {cert.issuer && (
                  <span className="text-sm text-neutral-500 font-mono ml-2">{cert.issuer}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {skills.slice(0, 5).map(skill => (
              <span key={skill.name} className="text-[10px] uppercase tracking-wider font-mono bg-accent/5 text-accent-dark px-2 py-1 rounded-sm border border-accent/10">
                {skill.name}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 px-2 py-1">
                +{skills.length - 5} more
              </span>
            )}
          </div>
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-dark hover:text-accent transition-colors group/link"
          >
            Full credentials &amp; certifications
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </FadeIn>

      {/* Footer — Personal Sign-Off */}
      <FadeIn className="mt-24">
        <div className="w-full h-1 bg-accent mb-8"></div>
        <div>
          <p className="font-serif italic text-2xl text-neutral-800 mb-2">
            &quot;Still learning. Always building.&quot;
          </p>
          <a href={`mailto:${personal.email}`} className="font-mono text-sm text-neutral-500 hover:text-accent-dark transition-colors">
            {personal.email}
          </a>
        </div>
      </FadeIn>
    </div>
    </main>
  );
}
