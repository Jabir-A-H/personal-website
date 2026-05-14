import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import SectionHeader from '../components/SectionHeader';
import FadeIn from '../components/FadeIn';
import data from '../data.json';

export const metadata: Metadata = {
  title: `${data.personal.name} | Portfolio`,
  description: data.personal.headline,
};

export default function Home() {
  const { personal, experience, certifications, skills } = data;
  const currentEducation = data.education[0]; // University of Dhaka

  // Curated: show only profession-relevant experiences on home
  const featuredExperience = experience.filter(
    exp => exp.title === 'Morning Riders' || exp.title === 'আলোকিত লাইব্রেরী'
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-12 md:py-24">
      {/* Full Bleed Hero */}
      <FadeIn className="w-screen relative left-1/2 -translate-x-1/2 mb-24 md:mb-32 min-h-[80vh] flex flex-col justify-center py-32 md:py-48 mt-[-32px]">
        {/* Background Image Wrapper */}
        <div className="absolute inset-0 z-0 bg-[#fafafa] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-[70%_30%] opacity-90"
            style={{ 
              WebkitMaskImage: 'radial-gradient(ellipse at 70% 50%, black 20%, transparent 80%)',
              maskImage: 'radial-gradient(ellipse at 70% 50%, black 20%, transparent 80%)' 
            }}
          />
          {/* Linear gradient overlay for left side text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/80 to-transparent w-full md:w-2/3"></div>
          {/* Bottom fade into the page */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fafafa] to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(3rem,11vw,8rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-8">
              {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
            </h1>
            
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
  );
}
