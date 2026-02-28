'use client';

import React from 'react';
import { Github, ExternalLink, ArrowUpRight, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

const projects = [
  {
    title: 'Gallery',
    status: 'live',
    tech: ['React', 'Tailwind'],
    description: 'A media gallery web project designed for clean and immersive media presentation.',
    live: 'https://jabir-a-h.github.io/gallery/'
  },
  {
    title: 'Entropy Clock',
    status: 'live',
    tech: ['JavaScript', 'Canvas', 'Visuals'],
    description: 'An interactive clock and visual web project exploring the concept of entropy through time representation.',
    live: 'https://jabir-a-h.github.io/entropy-clock/'
  },
  {
    title: 'Report Submission System',
    status: 'live',
    tech: ['Python', 'Flask', 'PostgreSQL', 'Tailwind'],
    description: 'A comprehensive Bengali report submission and management system featuring role-based access control, zone-based organization, and analytics.',
    repo: 'https://github.com/Jabir-A-H/report-submission',
    live: 'https://jabir-a-h.github.io/report-submission/'
  },
  {
    title: 'Academic Resort',
    status: 'live',
    tech: ['Vanilla JS', 'Google Drive API', 'PWA'],
    description: 'An advanced, highly optimized academic resource platform featuring multi-dimensional filtering, real-time search, and a template-based architecture.',
    repo: 'https://github.com/Jabir-A-H/academic-resort',
    live: 'https://jabir-a-h.github.io/academic-resort/'
  },
  {
    title: 'Library Management System',
    status: 'active',
    tech: ['FastAPI', 'Next.js', 'JWT'],
    description: 'A complete library management system with authentication, backend API, and a modern frontend interface.',
    repo: 'https://github.com/Jabir-A-H/library-management'
  },
  {
    title: 'Soulbinders',
    status: 'in-progress',
    tech: ['Godot', 'GDScript'],
    description: 'A monster-battling game concept combining strategic combat mechanics with character progression systems.',
    repo: 'https://github.com/Jabir-A-H/soulbinders'
  },
  {
    title: 'Nightblade',
    status: 'prototype',
    tech: ['Godot', 'GDScript'],
    description: 'A Godot-based game prototype exploring mechanics, movement systems, and gameplay experimentation.',
    repo: 'https://github.com/Jabir-A-H/nightblade'
  },
  {
    title: 'Sidescroller',
    status: 'experimental',
    tech: ['Go'],
    description: 'A side-scrolling game project built to explore game mechanics and rendering logic using Go.',
    repo: 'https://github.com/Jabir-A-H/Sidescroller'
  }
];

export default function ProjectsPage() {
  const liveProjects = projects.filter(p => p.live);
  const repoProjects = projects.filter(p => !p.live);

  return (
    <div className="w-full flex flex-col text-neutral-300 py-8 min-h-screen relative">
      {/* Decorative Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>

      <div className="relative z-10">
        <header className="mb-20 flex flex-col items-start border-b border-neutral-800 pb-12 relative">
          <div className="absolute top-0 right-0 p-4 border border-neutral-800 font-mono text-[10px] text-neutral-500 hidden md:block bg-neutral-950/50 backdrop-blur-sm">
            <div>LAT: 23.8103° N</div>
            <div>LNG: 90.4125° E</div>
            <div className="text-emerald-500 mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-sans font-black tracking-tighter text-white mb-6 uppercase leading-none"
          >
            Projects
          </motion.h1>
          
          <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-6">
            <p className="text-sm font-mono text-neutral-400 uppercase tracking-[0.2em] max-w-md leading-relaxed">
              Technical experiments & live deployments
            </p>
            <a href="https://github.com/Jabir-A-H/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-xs font-mono text-white border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm px-6 py-3 hover:bg-white hover:text-black transition-all duration-300">
              <Terminal className="w-4 h-4" />
              <span className="uppercase tracking-widest font-bold">Access_GitHub</span>
            </a>
          </div>
        </header>

        {/* LIVE PROJECTS */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-sm font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-white"></span>
              Live_Deployments
            </h2>
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-600">[{liveProjects.length}]</span>
          </div>

          <div className="flex flex-col gap-16">
            {liveProjects.map((project, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                key={project.title}
                className="group flex flex-col lg:flex-row border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm relative"
              >
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-neutral-500 group-hover:bg-emerald-400 transition-colors z-20"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-neutral-500 group-hover:bg-emerald-400 transition-colors z-20"></div>

                {/* Content Side */}
                <div className="w-full p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-mono text-[10px] text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        Active
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
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 font-mono text-xs bg-white text-black px-6 py-4 hover:bg-emerald-400 transition-colors font-bold uppercase tracking-widest"
                      >
                        <span>Launch</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* REPOSITORY ARCHIVE */}
        <section>
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-sm font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-neutral-600"></span>
              Repository_Archive
            </h2>
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="font-mono text-xs text-neutral-600">[{repoProjects.length}]</span>
          </div>

          <div className="flex flex-col border-t-2 border-neutral-800">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b-2 border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest px-6">
              <div className="col-span-5">Designation</div>
              <div className="col-span-4">Tech_Stack</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Link</div>
            </div>

            {/* Data Rows */}
            {repoProjects.map((project, idx) => (
              <motion.a 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                key={project.title}
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-neutral-800 hover:bg-white hover:text-black transition-all duration-300 px-6 items-center cursor-pointer relative overflow-hidden"
              >
                <div className="col-span-5">
                  <h3 className="text-lg font-sans font-bold text-neutral-200 group-hover:text-black transition-colors">
                    {project.title}
                  </h3>
                  <p className="md:hidden text-sm text-neutral-500 group-hover:text-neutral-700 mt-1 font-serif italic transition-colors">
                    {project.description}
                  </p>
                </div>
                
                <div className="col-span-4 flex flex-wrap gap-2 mt-3 md:mt-0">
                  {project.tech.map(t => (
                    <span key={t} className="font-mono text-[10px] text-neutral-400 border border-neutral-700 group-hover:border-black group-hover:text-black px-2 py-1 transition-colors uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="col-span-2 mt-4 md:mt-0">
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${
                    project.status === 'active' ? 'text-emerald-500 group-hover:text-emerald-700' :
                    project.status === 'in-progress' ? 'text-blue-500 group-hover:text-blue-700' :
                    project.status === 'completed' ? 'text-purple-500 group-hover:text-purple-700' :
                    'text-amber-500 group-hover:text-amber-700'
                  } transition-colors`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="col-span-1 flex justify-start md:justify-end mt-4 md:mt-0">
                  <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
