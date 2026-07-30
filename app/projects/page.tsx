import { Github, ExternalLink, ArrowUpRight, Terminal } from 'lucide-react';
import data from '../../data.json';
import AnimatedHeading from '../../components/AnimatedHeading';
import AnimatedProjectCard from '../../components/AnimatedProjectCard';
import AnimatedProjectRow from '../../components/AnimatedProjectRow';

export default function ProjectsPage() {
  const { projects } = data;
  const liveProjects = projects.filter(p => p.status === 'featured');
  const repoProjects = projects.filter(p => p.status !== 'featured');

  return (
    <div className="w-full flex flex-col text-neutral-300 py-8 min-h-screen relative">
      {/* Decorative Background Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] z-50 opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10">
        <header className="mb-20 flex flex-col items-start border-b border-neutral-800 pb-12 relative">
          <div className="absolute top-0 right-0 p-4 border border-neutral-800 font-mono text-[10px] text-neutral-500 hidden md:block bg-neutral-950/50 backdrop-blur-sm">
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
            <p className="text-sm font-mono text-neutral-400 uppercase tracking-[0.2em] max-w-md leading-relaxed">
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
                    
                    <p className="text-neutral-400 font-serif italic text-lg mb-8 leading-relaxed max-w-3xl">
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
                        <a 
                          href={project.repo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 font-mono text-xs border border-neutral-700 text-white px-6 py-4 hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                        >
                          <span>Source</span>
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedProjectCard>
            ))}
          </div>
        </section>

        {/* OTHER PROJECTS */}
        <section>
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-sm font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-neutral-600"></span>
              Other_Projects
            </h2>
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-600">[{repoProjects.length}]</span>
          </div>

          <div className="flex flex-col border-t-2 border-neutral-800">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b-2 border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest px-6">
              <div className="col-span-4">Designation</div>
              <div className="col-span-3">Tech_Stack</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Last_Updated</div>
              <div className="col-span-1 text-right">Link</div>
            </div>

            {/* Data Rows */}
            {repoProjects.map((project, idx) => (
              <AnimatedProjectRow 
                idx={idx}
                key={project.title}
                href={project.live || project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-neutral-800 hover:bg-accent hover:text-white transition-all duration-300 px-6 items-center cursor-pointer relative overflow-hidden"
              >
                <div className="col-span-4">
                  <h3 className="text-lg font-sans font-bold text-neutral-200 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="md:hidden text-sm text-neutral-500 group-hover:text-white/70 mt-1 font-serif italic transition-colors">
                    {project.description}
                  </p>
                </div>
                
                <div className="col-span-3 flex flex-wrap gap-2 mt-3 md:mt-0">
                  {project.tech.map(t => (
                    <span key={t} className="font-mono text-[10px] text-neutral-400 border border-neutral-700 group-hover:border-white/30 group-hover:text-white/80 px-2 py-1 transition-colors uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="col-span-2 mt-4 md:mt-0">
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${
                    project.status === 'development' ? 'text-accent-light group-hover:text-white' :
                    project.status === 'legacy' ? 'text-amber-400 group-hover:text-white' :
                    'text-neutral-400 group-hover:text-white'
                  } transition-colors`}>
                    {project.status}
                  </span>
                </div>

                <div className="col-span-2 mt-2 md:mt-0">
                  <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white/70 transition-colors">
                    {project.pushedAt ? new Date(project.pushedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
                
                <div className="col-span-1 flex justify-start md:justify-end mt-4 md:mt-0">
                  <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-white group-hover:text-accent transition-all duration-300 transform group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </AnimatedProjectRow>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
