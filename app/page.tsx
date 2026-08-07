import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import ExperienceCard from '@/components/ExperienceCard';
import SectionHeader from '@/components/SectionHeader';
import FadeIn from '@/components/FadeIn';
import AnimatedHeading from '@/components/AnimatedHeading';
import data from '@/data.json';

export const metadata: Metadata = {
  title: `${data.personal.name} | Portfolio`,
  description: data.personal.headline,
};

export default function Home() {
  const { personal, experience, certifications, skills } = data;
  const currentEducations = data.education.filter(e => e.title.includes('ICAB') || e.title.includes('University of Dhaka'));
  // Curated: show only profession-relevant experiences on home
  const featuredExperience = experience.filter(
    (exp: any) => exp.homepage === true
  );

  return (
    <div className="w-full py-12 md:py-24">
      {/* Master Wrapper for Sticky Desktop Hero */}
      <div className="relative w-full flex flex-col mt-[-3rem] md:mt-[-6rem]">
        
        {/* Photo Background (Natural flow on Mobile, Sticky on Desktop) */}
        <FadeIn className="order-1 md:absolute md:inset-0 z-0 pointer-events-none flex justify-center w-full">
          <div className="relative h-[50vh] w-full md:h-screen md:sticky md:top-0 overflow-hidden flex justify-center">
            <div className="w-full max-w-[2560px] h-full relative">
              <img 
                src="/images/hero-bg.webp" 
                srcSet="/images/hero-bg-640w.webp 640w, /images/hero-bg-1024w.webp 1024w, /images/hero-bg-1920w.webp 1920w"
                sizes="100vw"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-[76.5%_50%] opacity-90"
                fetchPriority="high"
              />
              {/* Top fade — always visible */}
              <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/70 to-transparent"></div>
              {/* Bottom fade — always visible */}
              <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent"></div>
              {/* Left fade — desktop only */}
              <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/90 to-transparent"></div>
              {/* Right fade — desktop only */}
              <div className="hidden md:block absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent"></div>
            </div>
          </div>
        </FadeIn>

        {/* Content Container (Scrolls naturally over the sticky background on desktop) */}
        <div className="order-2 relative z-10 w-full flex flex-col">
          
          {/* Name Block — explicitly heighted on desktop to push Bio down */}
          <FadeIn className="w-full flex flex-col md:h-[calc(100vh-6rem)] md:min-h-[500px] md:justify-end md:pb-12 pt-0 pb-8 md:pb-0 -mt-6 md:mt-0">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
              <div className="max-w-3xl">
                <AnimatedHeading className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-0">
                  {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
                </AnimatedHeading>
              </div>
            </div>
          </FadeIn>

          {/* Bio Block — flows after the Name block, scrolls over background */}
          <FadeIn delay={0.2} className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 mt-8 md:mt-0">
            <div className="max-w-3xl md:max-w-2xl">
              <p className="text-2xl md:text-4xl font-serif italic text-neutral-800 leading-snug mb-6 md:mb-8 max-w-2xl">
                {personal.headline}
              </p>
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-600 space-y-1 mb-6 md:mb-8">
                <p>{personal.location}</p>
                <p>{personal.email}</p>
              </div>
              <p className="text-lg text-neutral-700 max-w-xl leading-relaxed font-medium">
                {personal.bio}
              </p>
            </div>
          </FadeIn>

        </div>
      </div>

      {/* Constrained content wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="w-full h-1 bg-accent mb-16"></div>

      {/* Education Section — Current Institution Summary */}
      <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4">
          <SectionHeader title="Education" />
        </div>
        <div className="md:col-span-8">
          {currentEducations.map((edu, idx) => (
            <div key={idx} className="group mb-12 last:mb-8">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">{edu.title}</h3>
                <span className="font-mono text-xs text-muted mt-2 md:mt-0">{edu.date}</span>
              </div>
              <p className="font-serif italic text-xl text-neutral-600 mb-4">{edu.role}</p>
              {edu.description && (
                <p className="text-neutral-700 mb-6">{edu.description}</p>
              )}
              {edu.skills && edu.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {edu.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="text-[10px] uppercase tracking-wider font-mono bg-accent/5 text-accent-dark px-2 py-1 rounded-sm border border-accent/10">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
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
                  <span className="text-sm text-muted font-mono ml-2">{cert.issuer}</span>
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
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted px-2 py-1">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <p className="font-serif italic text-2xl text-neutral-800 mb-2">
              &quot;Still learning. Always building.&quot;
            </p>
            <a href={`mailto:${personal.email}`} className="font-mono text-sm text-muted hover:text-accent-dark transition-colors">
              {personal.email}
            </a>
          </div>
          
          <a
            href="/Jabir_Abdullah_Haian_Resume.pdf"
            download
            className="group flex items-center gap-3 px-6 py-4 bg-neutral-900 text-white hover:bg-accent transition-colors"
          >
            <span className="font-mono text-xs uppercase tracking-widest">Download Resume</span>
            <FileText className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </FadeIn>
      </div>
    </div>
  );
}
