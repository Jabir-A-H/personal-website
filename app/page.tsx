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
      {/* Full Bleed Hero */}
      <FadeIn className="w-full mb-16 md:mb-24 min-h-[70vh] flex flex-col justify-center pt-16 md:pt-24 pb-24 md:pb-32 mt-[-3rem] md:mt-[-6rem]">
        {/* Background Image Wrapper */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/hero-bg.webp" 
            srcSet="/images/hero-bg-640w.webp 640w, /images/hero-bg-1024w.webp 1024w, /images/hero-bg-1920w.webp 1920w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-[80%_90%] opacity-90"
            fetchPriority="high"
          />
          {/* Seamless Edge Fades */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/80 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/90 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <AnimatedHeading className="text-[clamp(3rem,11vw,8rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-8">
              {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
            </AnimatedHeading>
            
            <p className="text-2xl md:text-4xl font-serif italic text-neutral-800 leading-snug mb-8 max-w-2xl drop-shadow-sm">
              {personal.headline}
            </p>
            
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-600 space-y-1 mb-8">
              <p>{personal.location}</p>
              <p>{personal.email}</p>
            </div>
            
            <p className="text-lg text-neutral-700 max-w-xl leading-relaxed font-medium">
              {personal.bio}
            </p>
          </div>
        </div>
      </FadeIn>

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
