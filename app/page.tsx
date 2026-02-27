import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-6 w-full flex-1 items-center py-12">
      <div className="col-span-12 lg:col-span-8">
        <h1 className="text-4xl md:text-6xl font-sans font-medium tracking-tight text-neutral-900 mb-4">
          Jabir Abdullah Haian
        </h1>
        <p className="text-xl md:text-2xl font-serif italic text-neutral-600 mb-8">
          BBA in Accounting & Information Systems | Exploring Forensic Accounting, Data Analytics & AI
        </p>
        <p className="text-neutral-600 leading-relaxed mb-16 max-w-2xl">
          Welcome to my digital space. This site is structured around a single shell, presenting different facets of my work, studies, and creative pursuits through distinct visual languages.
        </p>
      </div>

      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/about" className="group block p-6 border border-neutral-200 hover:border-neutral-900 transition-colors bg-white">
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4 text-neutral-500 group-hover:text-neutral-900 transition-colors">01. About / Career</h2>
          <p className="text-sm text-neutral-600 mb-6">Academic focus, professional identity, and timeline.</p>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors transform group-hover:translate-x-1" />
        </Link>
        
        <Link href="/projects" className="group block p-6 bg-neutral-900 text-neutral-400 hover:bg-black transition-colors">
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4 text-neutral-500 group-hover:text-neutral-300 transition-colors">02. Projects</h2>
          <p className="text-sm mb-6">Technical experiments, systems, and code repositories.</p>
          <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
        </Link>

        <Link href="/visual" className="group block p-6 bg-neutral-100 hover:bg-neutral-200 transition-colors">
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4 text-neutral-500 group-hover:text-neutral-900 transition-colors">03. Visual</h2>
          <p className="text-sm text-neutral-600 mb-6">Photography, gallery, and visual creativity.</p>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors transform group-hover:translate-x-1" />
        </Link>

        <Link href="/notes" className="group block p-6 border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors bg-white">
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4 text-neutral-500 group-hover:text-neutral-900 transition-colors">04. Notes</h2>
          <p className="text-sm text-neutral-600 mb-6">Reflections, learning notes, and knowledge maps.</p>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
