'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Github, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const projects = [
  {
    id: '01',
    title: 'Entropy Clock',
    status: 'live',
    tech: ['JavaScript', 'Canvas', 'Visuals'],
    description: 'An interactive clock and visual web project exploring the concept of entropy through time representation.',
    repo: 'https://github.com/Jabir-A-H/entropy-clock',
    live: 'https://jabir-a-h.github.io/entropy-clock/',
    image: 'https://picsum.photos/seed/entropy/800/450'
  },
  {
    id: '02',
    title: 'Library Management System',
    status: 'active',
    tech: ['FastAPI', 'Next.js', 'JWT'],
    description: 'A complete library management system with authentication, backend API, and a modern frontend interface.',
    repo: 'https://github.com/Jabir-A-H/library-management',
    image: 'https://picsum.photos/seed/library/800/450'
  },
  {
    id: '03',
    title: 'Academic Resort',
    status: 'completed',
    tech: ['HTML', 'CSS'],
    description: 'A redesigned and improved academic resort website project focusing on layout structure, UI clarity, and clean presentation.',
    repo: 'https://github.com/Jabir-A-H/academic-resort',
    image: 'https://picsum.photos/seed/academic/800/450'
  },
  {
    id: '04',
    title: 'Soulbinders',
    status: 'in-progress',
    tech: ['Godot', 'GDScript'],
    description: 'A monster-battling game concept combining strategic combat mechanics with character progression systems.',
    repo: 'https://github.com/Jabir-A-H/soulbinders',
    image: 'https://picsum.photos/seed/soulbinders/800/450'
  },
  {
    id: '05',
    title: 'Report Submission System',
    status: 'active',
    tech: ['Web Stack', 'Backend'],
    description: 'A structured report management system that processes and organizes user-submitted reports.',
    repo: 'https://github.com/Jabir-A-H/report-submission',
    image: 'https://picsum.photos/seed/report/800/450'
  },
  {
    id: '06',
    title: 'Gallery',
    status: 'live',
    tech: ['React', 'Tailwind'],
    description: 'A media gallery web project designed for clean and immersive media presentation.',
    repo: 'https://github.com/Jabir-A-H/gallery',
    live: 'https://jabir-a-h.github.io/gallery/',
    image: 'https://picsum.photos/seed/gallery/800/450'
  },
  {
    id: '07',
    title: 'Nightblade',
    status: 'prototype',
    tech: ['Godot', 'GDScript'],
    description: 'A Godot-based game prototype exploring mechanics, movement systems, and gameplay experimentation.',
    repo: 'https://github.com/Jabir-A-H/nightblade',
    image: 'https://picsum.photos/seed/nightblade/800/450'
  },
  {
    id: '08',
    title: 'Sidescroller',
    status: 'experimental',
    tech: ['Go'],
    description: 'A side-scrolling game project built to explore game mechanics and rendering logic using Go.',
    repo: 'https://github.com/Jabir-A-H/Sidescroller',
    image: 'https://picsum.photos/seed/sidescroller/800/450'
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedProject(project);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`View details for ${project.title}`}
          className="col-span-12 md:col-span-6 lg:col-span-4 group border border-neutral-800 bg-neutral-900/50 p-6 cursor-pointer hover:border-neutral-500 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-300 flex flex-col"
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
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 rounded-sm"
                aria-label="Close project details"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <span className="text-xs text-neutral-500 mb-2 block">{selectedProject.id} {'//'} {selectedProject.status.toUpperCase()}</span>
                <h2 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                {selectedProject.image && (
                  <div className="relative w-full h-48 md:h-64 mb-6 border border-neutral-800 overflow-hidden">
                    <Image 
                      src={selectedProject.image} 
                      alt={`Screenshot of ${selectedProject.title}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
              
              <p className="text-neutral-400 mb-8 leading-relaxed font-sans">
                {selectedProject.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.tech.map(t => (
                  <span key={t} className="text-xs text-neutral-300 bg-neutral-800 px-3 py-1 rounded-sm">{t}</span>
                ))}
              </div>
              
              <div className="border-t border-neutral-800 pt-6 flex justify-end gap-4">
                {selectedProject.live && (
                  <a 
                    href={selectedProject.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm border border-white text-white px-4 py-2 hover:bg-white hover:text-black transition-colors font-bold"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <a 
                  href={selectedProject.repo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 hover:bg-neutral-200 transition-colors font-bold"
                >
                  <span>View Repository</span>
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
