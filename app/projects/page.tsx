import { ExternalLink, Terminal } from 'lucide-react';
import data from '@/data.json';
import Link from 'next/link';
import AnimatedHeading from '@/components/AnimatedHeading';
import AnimatedProjectCard from '@/components/AnimatedProjectCard';
import AnimatedProjectRow from '@/components/AnimatedProjectRow';
import AllProjectsList from '@/components/AllProjectsList';
import { calculateReadingTime } from '@/lib/utils';

export default function ProjectsPage() {
  const { projects } = data;
  const liveProjects = projects.filter(p => p.status === 'featured');

  return (
    <div className="w-full flex flex-col text-neutral-700 dark:text-neutral-300 py-8 min-h-screen relative">
      {/* Decorative Background Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>
      <div className="fixed inset-0 pointer-events-none hidden dark:block bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] z-50 opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <header className="mb-12 flex flex-col items-start border-b border-neutral-200 dark:border-neutral-800 pb-8 relative">
          <div className="absolute top-0 right-0 p-4 border border-neutral-200 dark:border-neutral-800 font-mono text-[10px] text-muted hidden md:block bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm">
            <div>{data.personal.location}</div>
            <div className="text-accent-light mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>

          <AnimatedHeading 
            className="text-6xl md:text-8xl lg:text-[7rem] font-sans font-black tracking-tighter text-neutral-900 dark:text-white mb-6 uppercase leading-none"
          >
            Projects
          </AnimatedHeading>
          
          <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-6">
            <nav className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest" aria-label="Jump to section">
              <a href="#featured" className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors">Featured</a>
              <span aria-hidden="true" className="text-muted">·</span>
              <a href="#all-projects" className="text-accent-dark dark:text-accent-light hover:text-accent transition-colors">All Projects</a>
            </nav>
            <a href="https://github.com/Jabir-A-H/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-xs font-mono text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm px-6 py-3 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
              <Terminal className="w-4 h-4" />
              <span className="uppercase tracking-widest font-bold">Access_GitHub</span>
            </a>
          </div>
        </header>

        {/* FEATURED PROJECTS */}
        <section id="featured" className="mb-24">
          <div className="flex items-center gap-6 mb-8 pt-4">
            <h2 className="text-sm font-mono text-neutral-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-neutral-900 dark:bg-white"></span>
              Featured_Projects
            </h2>
            <div className="h-px bg-neutral-300 dark:bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-600">[{liveProjects.length}]</span>
          </div>

          <div className="flex flex-col gap-16">
            {liveProjects.map((project) => (
              <AnimatedProjectCard 
                key={project.title}
                className="group flex flex-col lg:flex-row border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/50 backdrop-blur-sm relative shadow-sm dark:shadow-none"
              >
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-neutral-500 group-hover:bg-accent transition-colors z-20"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-neutral-500 group-hover:bg-accent transition-colors z-20"></div>

                {/* Content Side */}
                <div className="w-full p-6 md:p-8 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-mono text-[10px] text-accent-light border border-accent/30 bg-accent/10 px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse"></span>
                        {project.status === 'featured' ? 'Featured' : project.status}
                      </span>
                      {project.caseStudy && project.caseStudy.length > 0 && (
                        <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                          ~{calculateReadingTime(project.caseStudy)} min read
                        </span>
                      )}
                    </div>
                    
                    <Link href={`/projects/${project.slug}`} className="block w-fit">
                      <h3 className="text-2xl md:text-3xl font-sans font-bold text-neutral-900 dark:text-white mb-4 tracking-tight hover:text-accent-dark dark:hover:text-accent-light transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    
                    <p className="text-muted font-serif italic text-base md:text-lg mb-6 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map(t => (
                        <span key={t} className="font-mono text-[10px] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 px-3 py-1.5">
                          {t}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 max-w-sm">
                      {project.live && (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 font-mono text-xs bg-neutral-900 dark:bg-white text-white dark:text-black px-6 py-3 hover:bg-accent hover:text-white transition-colors font-bold uppercase tracking-widest"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedProjectCard>
            ))}
          </div>
        </section>

        {/* PROJECT ARCHIVE */}
        <section id="all-projects" className="pt-4">
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-sm font-mono text-neutral-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600"></span>
              All_Projects
            </h2>
            <div className="h-px bg-neutral-300 dark:bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-600">[{projects.length}]</span>
          </div>

          <AllProjectsList projects={projects} />
        </section>
      </div>
    </div>
  );
}
