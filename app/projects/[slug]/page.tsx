import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import data from '@/data.json';
import { Github, ExternalLink } from 'lucide-react';
import { calculateReadingTime } from '@/lib/utils';

export async function generateStaticParams() {
  return data.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) return {};
  
  return {
    title: project.title,
    description: project.description.slice(0, 160),
    openGraph: { images: [{ url: '/og-projects.jpg', width: 1376, height: 768, alt: 'Terminal-styled title card for Projects' }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const hasCaseStudy = project.caseStudy && project.caseStudy.length > 0;

  return (
    <div className="col-span-12 w-full py-12 max-w-4xl mx-auto px-6 md:px-12 relative z-10">
      <Link href="/projects" className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors">
        &larr; All Projects
      </Link>
      
      <header className="my-10">
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-[10px] text-accent-light border border-accent/30 bg-accent/10 px-3 py-1 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse"></span>
            {project.status === 'featured' ? 'Featured' : project.status}
          </span>
          {hasCaseStudy && (
            <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
              ~{calculateReadingTime(project.caseStudy)} min read
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
          {project.title}
        </h1>
        
        <p className="text-muted font-serif italic text-xl md:text-2xl mb-10 leading-relaxed max-w-3xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tech.map(t => (
            <span key={t} className="font-mono text-[10px] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 px-3 py-1.5">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
          {project.live && (
            <a 
              href={project.live} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 font-mono text-xs bg-neutral-900 dark:bg-white text-white dark:text-black px-6 py-4 hover:bg-accent hover:text-white transition-colors font-bold uppercase tracking-widest"
            >
              <span>Launch</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.repo && (
            <a 
              href={project.repo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 font-mono text-xs border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white px-6 py-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors uppercase tracking-widest"
            >
              <span>Source</span>
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </header>

      {hasCaseStudy && (
        <article className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-6 font-serif font-light text-lg md:text-xl text-neutral-800 dark:text-neutral-200 leading-relaxed">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted uppercase tracking-widest">
            <span>Case Study</span>
            <span>~{calculateReadingTime(project.caseStudy)} min read</span>
          </div>
          {project.caseStudy.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </article>
      )}
    </div>
  );
}
