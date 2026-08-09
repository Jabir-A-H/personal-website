import { Github, ExternalLink, ArrowUpRight, Terminal, Lock } from 'lucide-react';
import data from '@/data.json';
import AnimatedHeading from '@/components/AnimatedHeading';
import AnimatedProjectCard from '@/components/AnimatedProjectCard';
import AnimatedProjectRow from '@/components/AnimatedProjectRow';
import OtherProjectsList from '@/components/OtherProjectsList';

export default function ProjectsPage() {
  const { projects } = data;
  const liveProjects = projects.filter(p => p.status === 'featured');

  return (
    <div className="w-full flex flex-col text-neutral-300 py-8 min-h-screen relative">
      {/* Decorative Background Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] z-50 opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <header className="mb-20 flex flex-col items-start border-b border-neutral-800 pb-12 relative">
          <div className="absolute top-0 right-0 p-4 border border-neutral-800 font-mono text-[10px] text-muted hidden md:block bg-neutral-950/50 backdrop-blur-sm">
            <div>{data.personal.location}</div>
            <div className="text-accent-light mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>

          <AnimatedHeading 
            className="text-6xl md:text-8xl lg:text-[9rem] font-sans font-black tracking-tighter text-white mb-6 uppercase leading-none"
          >
            Projects
          </AnimatedHeading>
          
          <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-6">
            <p className="text-sm font-mono text-muted uppercase tracking-[0.2em] max-w-md leading-relaxed">
              Featured projects & development work
            </p>
            <a href="https://github.com/Jabir-A-H/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-xs font-mono text-white border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm px-6 py-3 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
              <Terminal className="w-4 h-4" />
              <span className="uppercase tracking-widest font-bold">Access_GitHub</span>
            </a>
          </div>
        </header>

        {/* FEATURED PROJECTS */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-sm font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-white"></span>
              Featured_Projects
            </h2>
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-600">[{liveProjects.length}]</span>
          </div>

          <div className="flex flex-col gap-16">
            {liveProjects.map((project) => (
              <AnimatedProjectCard 
                key={project.title}
                className="group flex flex-col lg:flex-row border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm relative"
              >
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-neutral-500 group-hover:bg-accent transition-colors z-20"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-neutral-500 group-hover:bg-accent transition-colors z-20"></div>

                {/* Content Side */}
                <div className="w-full p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-mono text-[10px] text-accent-light border border-accent/30 bg-accent/10 px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse"></span>
                        {project.status === 'featured' ? 'Featured' : project.status}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-sans font-bold text-white mb-6 tracking-tight">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted font-serif italic text-lg mb-8 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex flex-wrap gap-2 mb-10">
                      {project.tech.map(t => (
                        <span key={t} className="font-mono text-[10px] text-neutral-300 uppercase tracking-wider border border-neutral-700 px-3 py-1.5">
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
                          className="flex-1 flex items-center justify-center gap-2 font-mono text-xs bg-white text-black px-6 py-4 hover:bg-accent hover:text-white transition-colors font-bold uppercase tracking-widest"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.repo && (
                        project.visibility === 'PUBLIC' ? (
                          <a 
                            href={project.repo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 font-mono text-xs border border-neutral-700 text-white px-6 py-4 hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                          >
                            <span>Source</span>
                            <Github className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="flex-1 flex items-center justify-center gap-2 font-mono text-[10px] border border-neutral-700/50 text-muted px-6 py-4 uppercase tracking-widest cursor-default">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Private Repo</span>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedProjectCard>
            ))}
          </div>
        </section>

        {/* PROJECT ARCHIVE */}
        <section>
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-sm font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-neutral-600"></span>
              Project_Archive
            </h2>
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-600">[{projects.length}]</span>
          </div>

          <OtherProjectsList projects={projects} />
        </section>
      </div>
    </div>
  );
}
