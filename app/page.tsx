import { Metadata } from 'next';
import ExperienceCard from '../components/ExperienceCard';
import SectionHeader from '../components/SectionHeader';

export const metadata: Metadata = {
  title: 'Jabir Abdullah Haian | Portfolio',
  description: 'BBA in Accounting & Information Systems at University of Dhaka. Exploring Forensic Accounting, Data Analytics & AI.',
};

export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 md:py-24">
      {/* Hero */}
      <div className="mb-24 md:mb-32">
        <h1 className="text-[clamp(3rem,12vw,8rem)] md:text-[clamp(4rem,9vw,10rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-12">
          Jabir Abdullah<br/>Haian
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 font-mono text-xs uppercase tracking-widest text-neutral-500 space-y-2">
            <p>Dhaka, Bangladesh</p>
            <p>jabirahaian@gmail.com</p>
            <p>CA, ICAB (5%)</p>
            <p>Aspire 25 Alumni</p>
          </div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl font-serif italic text-neutral-700 leading-snug mb-8">
              BBA in Accounting & Information Systems at University of Dhaka. Exploring Forensic Accounting, Data Analytics & AI.
            </p>
            <p className="text-lg text-neutral-600 max-w-3xl leading-relaxed">
              I apply data-driven insights to enhance processes and solve problems. My core interests include accounting, financial analysis, and my ambition to become a Chartered Accountant. I am committed to collaboration, continuous learning, and teamwork.
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
          <ExperienceCard 
            title="Al Hikmah Society"
            date="Jun 2024 — Present"
            role="Founding Member"
            description="Islamic Finance and IT Management."
          />
          <ExperienceCard 
            title="Morning Riders"
            date="Apr 2024 — Sep 2025"
            role="President"
            description="Inspired and engaged the youth in our community through regular morning cycling sessions. &quot;Riding for Future&quot;."
          />
          <ExperienceCard 
            title="Team J"
            date="Jul 2021 — Present"
            role="Founding President"
            description="A youth organization focused on skill development, community service, and fostering leadership among students."
          />
          <ExperienceCard 
            title="আলোকিত লাইব্রেরী"
            date="Dec 2018 — Present"
            role="Secretariat Member"
          />
        </div>
      </div>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Education Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-4">
          <SectionHeader title="Education" />
        </div>
        <div className="md:col-span-8 space-y-16">
          <ExperienceCard 
            title="University of Dhaka"
            date="Sep 2022 — Present"
            role="BBA, Accounting & Information Systems"
          />
          <ExperienceCard 
            title="Notre Dame College"
            date="Feb 2019 — Jun 2021"
            role="HSC, Business Studies"
            description="Ranked 35th out of 750 Students. 100% attendance. Member of Business Club and IT Club."
          />
          <ExperienceCard 
            title="Birshreshtha Noor Mohammad Public College"
            date="Jan 2017 — May 2019"
            role="SSC, Business Studies"
            description="Board scholarship for outstanding performance. Member of Business Club and Chess Club."
          />
          <ExperienceCard 
            title="Birshreshtha Munshi Abdur Rouf Public College"
            date="Dec 2013 — Dec 2016"
            role="JSC"
          />
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
              <li>
                <strong className="block text-lg mb-1">Aspire Leaders Program</strong>
                <span className="text-sm text-neutral-500 font-mono">Aspire Institute • Oct 2025</span>
              </li>
              <li>
                <strong className="block text-lg mb-1">Fundamentals of Digital Marketing</strong>
                <span className="text-sm text-neutral-500 font-mono">Google • May 2024</span>
              </li>
              <li>
                <strong className="block text-lg mb-1">Big Data Foundations - Level 1</strong>
              </li>
              <li>
                <strong className="block text-lg mb-1">Microsoft Excel - Beginner to Expert</strong>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8">Top Skills</h3>
            <div className="space-y-4">
              {[
                { name: 'Accounting', level: 5 },
                { name: 'Financial Analysis', level: 5 },
                { name: 'Data Analytics', level: 4 },
                { name: 'Problem Solving', level: 5 },
                { name: 'Microsoft Excel', level: 5 },
                { name: 'IT Operations', level: 4 },
                { name: 'Big Data', level: 3 },
                { name: 'Communication', level: 5 }
              ].map(skill => (
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
