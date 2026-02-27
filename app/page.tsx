export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 md:py-24">
      {/* Hero */}
      <div className="mb-24 md:mb-32">
        <h1 className="text-[12vw] md:text-[9vw] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-12">
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
          <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tighter uppercase sticky top-8">Leadership &<br/>Experience</h2>
        </div>
        <div className="md:col-span-8 space-y-16">
          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">Al Hikmah Society</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Jun 2024 — Present</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600 mb-4">Founding Member</p>
            <p className="text-neutral-700">Islamic Finance and IT Management.</p>
          </div>

          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">Morning Riders</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Apr 2024 — Sep 2025</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600 mb-4">President</p>
            <p className="text-neutral-700">Inspiring and engaging the youth in our community through regular morning cycling sessions. &quot;Riding for Future&quot;.</p>
          </div>

          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">Team J</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Jul 2021 — Present</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600">Founding President</p>
          </div>

          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">আলোকিত লাইব্রেরী</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Dec 2018 — Present</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600">Secretariat Member</p>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Education Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-4">
          <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tighter uppercase sticky top-8">Education</h2>
        </div>
        <div className="md:col-span-8 space-y-16">
          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">University of Dhaka</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Sep 2022 — Present</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600 mb-4">BBA, Accounting & Information Systems</p>
          </div>

          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">Notre Dame College</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Feb 2019 — Jun 2021</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600 mb-4">HSC, Business Studies</p>
            <p className="text-neutral-700">Ranked 35th out of 750 Students. 100% attendance. Member of Business Club and IT Club.</p>
          </div>

          <div className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">BNMPC</h3>
              <span className="font-mono text-xs text-neutral-500 mt-2 md:mt-0">Jan 2017 — May 2019</span>
            </div>
            <p className="font-serif italic text-xl text-neutral-600 mb-4">SSC, Business Studies</p>
            <p className="text-neutral-700">Board scholarship for outstanding performance. Member of Business Club and Chess Club.</p>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-300 mb-24"></div>

      {/* Certifications & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tighter uppercase sticky top-8">Credentials</h2>
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
            <div className="flex flex-wrap gap-2">
              {['Accounting', 'Financial Analysis', 'Data Analytics', 'IT Operations', 'Problem Solving', 'Microsoft Excel', 'Big Data', 'Communication'].map(skill => (
                <span key={skill} className="text-xs font-mono bg-neutral-900 text-white px-3 py-2 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
