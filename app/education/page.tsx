import React from 'react';
import TimelineCard from '../../components/TimelineCard';
import data from '../../data.json';

export const metadata = {
  title: 'Education & Career | Jabir Abdullah Haian',
  description: 'Academic background, timeline, and professional direction of Jabir Abdullah Haian.',
};

export default function AboutPage() {
  const { education } = data;

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-12 w-full text-neutral-800 py-8">
      <header className="col-span-12 border-b border-neutral-300 pb-8">
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight mb-4">Education</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">Core Professional Identity</p>
      </header>

      <div className="col-span-12 md:col-span-4">
        <div className="sticky top-8">
          <h2 className="font-serif italic text-2xl mb-6">Direction</h2>
          <p className="text-sm leading-relaxed mb-6">
            Assalamualaikum. I am a BBA student at the University of Dhaka, majoring in Accounting and Information Systems. This field perfectly aligns with my passion for data analysis, problem-solving, and innovation.
          </p>
          <p className="text-sm leading-relaxed mb-6">
            My core interests include accounting, financial analysis, and my ambition to become a Chartered Accountant. I&apos;m committed to collaboration, continuous learning, and teamwork.
          </p>
          <div className="h-[1px] w-12 bg-neutral-300 mb-6"></div>
          <ul className="space-y-2 font-mono text-xs text-neutral-500">
            <li><a href="https://www.linkedin.com/in/jabir-abdullah-haian/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 underline underline-offset-4">LinkedIn Profile &#8599;</a></li>
            <li><a href="https://facebook.com/jabir.abdullah.haian" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 underline underline-offset-4">Facebook Profile &#8599;</a></li>
          </ul>
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 space-y-12">
        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">Timeline</h3>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-300 before:to-transparent">
            
            {education.map((edu, idx) => (
              <TimelineCard 
                key={idx}
                title={edu.title}
                date={edu.date}
                role={edu.role}
                description={edu.description}
                skills={edu.skills}
              />
            ))}

          </div>
        </section>

        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">Footnotes & Certifications</h3>
          <div className="text-xs text-neutral-500 space-y-2 border-t border-neutral-200 pt-4">
            <p>[1] <strong>Aspire 25 Alumni</strong>: Aspire Leaders Program (Aspire Institute, Oct 2025).</p>
            <p>[2] <strong>CA, ICAB (5%)</strong>: Pursuing Chartered Accountancy.</p>
            <p>[3] <strong>Certifications</strong>: Fundamentals of Digital Marketing (Google), Big Data Foundations, Excel Beginner to Expert.</p>
            <p>[4] <strong>Leadership</strong>: Founding President of Team J (Jul 2021 - Present), President of Morning Riders (Apr 2024 - Sep 2025).</p>
          </div>
        </section>
      </div>
    </div>
  );
}
