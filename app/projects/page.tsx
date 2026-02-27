'use client';

import React, { useState } from 'react';
import { Github, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const projects = [
  {
    id: '01',
    title: 'Redefining the Role of Management Accountants',
    status: 'research',
    tech: ['MS Excel', 'Power BI', 'Python'],
    description: 'A comprehensive research project exploring how data analytics is transforming management accounting in Bangladesh. Conducted mixed-method research using surveys and case studies.',
    repo: 'https://www.linkedin.com/in/jabir-abdullah-haian/'
  },
  {
    id: '02',
    title: 'Experimental System A',
    status: 'learning',
    tech: ['TypeScript', 'React'],
    description: 'A sandbox for testing new frontend architectures and state management patterns.',
    repo: 'https://github.com/Jabir-A-H/'
  },
  {
    id: '03',
    title: 'Utility Scripts',
    status: 'active',
    tech: ['Bash', 'Node.js'],
    description: 'Collection of automation scripts for daily workflow optimization.',
    repo: 'https://github.com/Jabir-A-H/'
  }
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="grid grid-cols-12 gap-6 w-full text-neutral-300 font-mono py-8">
      <header className="col-span-12 mb-8 flex justify-between items-end border-b border-neutral-800 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">SYSTEM.PROJECTS</h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest">Technical experiments & code</p>
        </div>
        <a href="https://github.com/Jabir-A-H/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs hover:text-white transition-colors">
          <Github className="w-4 h-4" />
          <span>GITHUB_PROFILE</span>
        </a>
      </header>

      {projects.map((project) => (
        <div 
          key={project.id}
          onClick={() => setSelectedProject(project)}
          className="col-span-12 md:col-span-6 lg:col-span-4 group border border-neutral-800 bg-neutral-900/50 p-6 cursor-pointer hover:border-neutral-500 hover:bg-neutral-900 transition-all duration-300 flex flex-col"
        >
          <div className="flex justify-between items-start mb-8">
            <span className="text-xs text-neutral-600">{project.id}</span>
            <span className={`text-[10px] uppercase px-2 py-1 rounded-sm ${
              project.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
              project.status === 'learning' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
              'bg-amber-900/30 text-amber-400 border border-amber-800/50'
            }`}>
              {project.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4 group-hover:text-neutral-200">{project.title}</h2>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.map(t => (
              <span key={t} className="text-xs text-neutral-500 bg-neutral-950 px-2 py-1 border border-neutral-800">{t}</span>
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <span className="text-xs text-neutral-500 mb-2 block">{selectedProject.id} {'//'} {selectedProject.status.toUpperCase()}</span>
                <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
              </div>
              
              <p className="text-neutral-400 mb-8 leading-relaxed font-sans">
                {selectedProject.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.tech.map(t => (
                  <span key={t} className="text-xs text-neutral-300 bg-neutral-800 px-3 py-1 rounded-sm">{t}</span>
                ))}
              </div>
              
              <div className="border-t border-neutral-800 pt-6 flex justify-end">
                <a 
                  href={selectedProject.repo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 hover:bg-neutral-200 transition-colors font-bold"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
