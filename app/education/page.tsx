import React from 'react';

export default function AboutPage() {
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
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-neutral-300 group-hover:bg-neutral-800 text-neutral-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors"></div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-serif font-medium text-lg">University of Dhaka</div>
                  <time className="font-mono text-xs text-neutral-500">Sep 2022 - Present</time>
                </div>
                <div className="text-sm font-medium text-neutral-800 mb-2">BBA, Accounting & Information Systems</div>
                <div className="text-sm text-neutral-600">Exploring Forensic Accounting, Data Analytics, AI & Technology.</div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-neutral-300 group-hover:bg-neutral-800 text-neutral-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors"></div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-serif font-medium text-lg">Al Hikmah Society</div>
                  <time className="font-mono text-xs text-neutral-500">Jun 2024 - Present</time>
                </div>
                <div className="text-sm font-medium text-neutral-800 mb-2">Founding Member</div>
                <div className="text-sm text-neutral-600">Islamic Finance and IT Management.</div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-neutral-300 group-hover:bg-neutral-800 text-neutral-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors"></div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-serif font-medium text-lg">Notre Dame College</div>
                  <time className="font-mono text-xs text-neutral-500">Feb 2019 - Jun 2021</time>
                </div>
                <div className="text-sm font-medium text-neutral-800 mb-2">HSC, Business Studies</div>
                <div className="text-sm text-neutral-600">Ranked 35th out of 750 Students. 100% attendance. Member of Business Club and IT Club.</div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-neutral-300 group-hover:bg-neutral-800 text-neutral-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors"></div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-serif font-medium text-lg">BNMPC</div>
                  <time className="font-mono text-xs text-neutral-500">Jan 2017 - May 2019</time>
                </div>
                <div className="text-sm font-medium text-neutral-800 mb-2">SSC, Business Studies</div>
                <div className="text-sm text-neutral-600">Board scholarship for outstanding performance. Member of Business Club and Chess Club.</div>
              </div>
            </div>

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
