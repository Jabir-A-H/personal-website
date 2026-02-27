'use client';

import React from 'react';
import { motion } from 'motion/react';

const whispers = [
  {
    date: '2026.02.27',
    title: 'The Entropy of Time',
    content: 'Time doesn\'t just pass; it disperses. My Entropy Clock project was an attempt to visualize this—how order slowly yields to chaos, yet remains measurable.',
    tags: ['reflection', 'physics', 'code']
  },
  {
    date: '2026.02.15',
    title: 'Accounting as a Language',
    content: 'We often think of accounting as math, but it\'s actually a grammar for value. It defines the relationships between entities through a strict, logical syntax.',
    tags: ['accounting', 'theory']
  },
  {
    date: '2026.01.20',
    title: 'The Silent Gallery',
    content: 'Photography is about what you leave out of the frame. The most powerful images are often the ones that whisper rather than shout.',
    tags: ['photography', 'art']
  },
  {
    date: '2025.12.10',
    title: 'Systems vs. Goals',
    content: 'Building a library management system taught me that the goal (organizing books) is secondary to the system (managing state). If the system is robust, the goal is inevitable.',
    tags: ['tech', 'systems']
  },
  {
    date: '2025.11.05',
    title: 'Learning in Public',
    content: 'My GitHub is a messy record of my curiosity. Not everything is a "project," but everything is a step. The "Nightblade" prototype was a failure in mechanics but a triumph in learning Godot.',
    tags: ['meta', 'learning']
  }
];

export default function WhispersPage() {
  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto">
      <header className="mb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-neutral-900 mb-6">Whispers</h1>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">Fragments of thought & reflection</p>
      </header>

      <div className="space-y-32">
        {whispers.map((whisper, index) => (
          <motion.article 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="group relative"
          >
            <div className="absolute -left-12 md:-left-24 top-0 h-full w-[1px] bg-neutral-200 hidden md:block">
              <div className="sticky top-1/2 w-2 h-2 -ml-[4px] rounded-full bg-neutral-300 group-hover:bg-neutral-900 transition-colors duration-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <time className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{whisper.date}</time>
              <h2 className="text-2xl md:text-3xl font-serif font-light text-neutral-800 group-hover:text-neutral-900 transition-colors">
                {whisper.title}
              </h2>
            </div>

            <div className="pl-0 md:pl-4 border-l-2 border-neutral-100 md:border-l-0">
              <p className="text-neutral-600 leading-relaxed text-lg font-light mb-8 max-w-2xl">
                {whisper.content}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {whisper.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 border border-neutral-200 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <footer className="mt-48 pt-12 border-t border-neutral-100 text-center">
        <p className="font-serif italic text-neutral-400">More thoughts to come...</p>
      </footer>
    </div>
  );
}
