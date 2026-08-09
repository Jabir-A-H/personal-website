import React from 'react';
import TimelineCard from '@/components/TimelineCard';
import AnimatedHeading from '@/components/AnimatedHeading';
import data from '@/data.json';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Education | Jabir Abdullah Haian',
  description: 'Academic background and continuous learning journey.',
  openGraph: {
    images: [{ url: '/og-education.png' }]
  }
};

export default function AboutPage() {
  const { education, publications } = data;

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-12 w-full max-w-7xl mx-auto px-6 md:px-12 text-neutral-800 py-8">
      <header className="col-span-12 border-b border-neutral-300 pb-8">
        <AnimatedHeading className="font-serif text-5xl md:text-7xl font-light tracking-tight mb-4">Education</AnimatedHeading>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Core Professional Identity</p>
      </header>

      <div className="col-span-12 md:col-span-4">
        <div className="sticky top-8">
          <h2 className="font-serif italic text-2xl mb-6">Direction</h2>
          <p className="text-sm leading-relaxed mb-6">
            Assalamualaikum. I am a BBA student at the University of Dhaka, majoring in Accounting and Information Systems. This field perfectly aligns with my passion for data analysis, problem-solving, and innovation.
          </p>
          <p className="text-sm leading-relaxed mb-6">
            As an aspiring Chartered Accountant, I am driven to integrate robust financial management, audit standards, and cost accounting with modern technological solutions.
          </p>
          <div className="h-[1px] w-12 bg-accent mb-6"></div>
          <ul className="space-y-2 font-mono text-xs text-muted">
            <li><a href="https://www.linkedin.com/in/jabir-abdullah-haian/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-dark underline underline-offset-4 transition-colors">LinkedIn Profile &#8599;</a></li>
            <li><a href="https://facebook.com/jabir.abdullah.haian" target="_blank" rel="noopener noreferrer" className="hover:text-accent-dark underline underline-offset-4 transition-colors">Facebook Profile &#8599;</a></li>
          </ul>
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 space-y-12">
        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Timeline</h3>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
            
            {education.map((edu, idx) => (
              <TimelineCard 
                key={idx}
                title={edu.title}
                date={edu.date}
                role={edu.role}
                description={edu.description}
                skills={edu.skills ? edu.skills.slice(0, 4) : []}
              />
            ))}

          </div>
        </section>

        {publications && publications.length > 0 && (
          <section className="pt-8 md:pt-12 border-t border-neutral-300/30">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Research &amp; Publications</h3>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
              {publications.map((pub, idx) => (
                <TimelineCard
                  key={idx}
                  title={pub.title}
                  date={pub.date}
                  role={pub.context}
                  description={pub.description}
                  skills={pub.tags ? pub.tags.slice(0, 4) : []}
                  coAuthors={pub.coAuthors}
                  link={(pub as any).link}
                  linkLabel="Read Paper"
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
