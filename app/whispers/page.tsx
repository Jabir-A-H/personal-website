'use client';

import React from 'react';
import { motion } from 'motion/react';
import data from '../../data.json';

export default function WhispersPage() {
  const { whispers } = data;

  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto">
      <header className="mb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-neutral-900 mb-6">Whispers</h1>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">Fragments of thought &amp; reflection</p>
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
              <div className="sticky top-1/2 w-2 h-2 -ml-[4px] rounded-full bg-neutral-300 group-hover:bg-accent transition-colors duration-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <time className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{whisper.date}</time>
              <h2 className={`font-serif font-light text-neutral-800 group-hover:text-neutral-900 transition-colors ${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                {whisper.title}
              </h2>
            </div>

            <div className="pl-0 md:pl-4 border-l-2 border-neutral-100 md:border-l-0">
              <p className={`text-neutral-600 leading-relaxed font-light mb-8 max-w-2xl
                ${index === 0 ? 'text-xl md:text-2xl' : 'text-lg'}
                first-letter:float-left first-letter:text-6xl first-letter:pr-3 first-letter:font-serif first-letter:text-accent first-letter:leading-[0.8] first-letter:mt-1
              `}>
                {whisper.content}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {whisper.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 border border-neutral-200 px-2 py-1 rounded-full hover:border-accent hover:text-accent-dark transition-colors cursor-default">
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
