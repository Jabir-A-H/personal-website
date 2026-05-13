import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import SectionHeader from '../components/SectionHeader';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
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
      {/* Hero */}
      <div className="mb-24 md:mb-32">
        <h1 className="text-[clamp(3rem,12vw,8rem)] md:text-[clamp(4rem,9vw,10rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-12">
          {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 font-mono text-xs uppercase tracking-widest text-neutral-500 space-y-2">
            <div className="mb-4">
              <AvatarPlaceholder size={80} />
            </div>
            <p>{personal.location}</p>
            <p>{personal.email}</p>
            {personal.shortTags.map((tag, idx) => (
              <p key={idx}>{tag}</p>
            ))}
          </div>
          <div className="md:col-span-8">
            {/* TODO: Write your personal philosophy or tagline */}
            <p className="text-2xl md:text-4xl font-serif italic text-neutral-700 leading-snug mb-8">
              {personal.headline}
            </p>
            <p className="text-lg text-neutral-600 max-w-3xl leading-relaxed">
              {personal.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-accent mb-24"></div>

      {/* Education Section — Current Institution Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
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
                {currentEducation.skills.slice(0, 6).map(skill => (
                  <span key={skill} className="text-[10px] uppercase tracking-wider font-mono bg-neutral-100 text-neutral-500 px-2 py-1 rounded-sm">
                    {skill}
                  </span>
                ))}
                {currentEducation.skills.length > 6 && (
                  <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 px-2 py-1">
                    +{currentEducation.skills.length - 6} more
                  </span>
                )}
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
      </div>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Leadership & Experience — Curated */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
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
      </div>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Credentials — Compact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
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
              <span key={skill.name} className="text-xs font-mono uppercase tracking-wider bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-sm">
                {skill.name}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-3 py-1.5">
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
      </div>

      {/* Explore More — Subtle Footer */}
      <div className="w-full h-1 bg-accent mb-16"></div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
        <Link
          href="/projects"
          className="group flex items-center gap-3 font-mono text-sm text-neutral-500 hover:text-accent-dark transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          I also build things
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/whispers"
          className="group flex items-center gap-3 font-mono text-sm text-neutral-500 hover:text-accent-dark transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Fragments of thought
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
