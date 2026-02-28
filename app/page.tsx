import { Metadata } from 'next';
import ExperienceCard from '../components/ExperienceCard';
import SectionHeader from '../components/SectionHeader';
import data from '../data.json';

export const metadata: Metadata = {
  title: `${data.personal.name} | Portfolio`,
  description: data.personal.headline,
};

export default function Home() {
  const { personal, experience, education, certifications, skills } = data;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 md:py-24">
      {/* Hero */}
      <div className="mb-24 md:mb-32">
        <h1 className="text-[clamp(3rem,12vw,8rem)] md:text-[clamp(4rem,9vw,10rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-12">
          {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 font-mono text-xs uppercase tracking-widest text-neutral-500 space-y-2">
            <p>{personal.location}</p>
            <p>{personal.email}</p>
            {personal.shortTags.map((tag, idx) => (
              <p key={idx}>{tag}</p>
            ))}
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl font-serif italic text-neutral-700 leading-snug mb-8">
              {personal.headline}
            </p>
            <p className="text-lg text-neutral-600 max-w-3xl leading-relaxed">
              {personal.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-neutral-900 mb-24"></div>

      {/* Experience Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-4">
          <SectionHeader title={<>Leadership &<br/>Experience</>} />
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

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Education Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-4">
          <SectionHeader title="Education" />
        </div>
        <div className="md:col-span-8 space-y-16">
          {education.map((edu, idx) => (
            <ExperienceCard 
              key={idx}
              title={edu.title}
              date={edu.date}
              role={edu.role}
              description={edu.description}
            />
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Certifications & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <SectionHeader title="Credentials" />
        </div>
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8">Certifications</h3>
            <ul className="space-y-6 text-neutral-800">
              {certifications.map((cert, idx) => (
                <li key={idx}>
                  <strong className="block text-lg mb-1">{cert.title}</strong>
                  {(cert.issuer || cert.date) && (
                    <span className="text-sm text-neutral-500 font-mono">
                      {cert.issuer}{cert.issuer && cert.date ? ' • ' : ''}{cert.date}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8">Top Skills</h3>
            <div className="space-y-4">
              {skills.map(skill => (
                <div key={skill.name} className="flex items-center justify-between group">
                  <span className="text-sm font-mono text-neutral-800 group-hover:text-neutral-900 transition-colors">{skill.name}</span>
                  <div className="flex gap-1" aria-label={`Proficiency: ${skill.level} out of 5`} title={`Proficiency: ${skill.level} out of 5`}>
                    {[1, 2, 3, 4, 5].map(dot => (
                      <div 
                        key={dot} 
                        className={`w-1.5 h-1.5 rounded-full ${dot <= skill.level ? 'bg-neutral-800' : 'bg-neutral-200'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
