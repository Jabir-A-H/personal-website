'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, FileText } from 'lucide-react';

interface ContactLinkProps {
  href: string;
  name: string;
  handle: string;
  preferred?: boolean;
  download?: boolean;
  idx: number;
}

export default function ContactLink({ href, name, handle, preferred, download, idx }: ContactLinkProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={download}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: 0.55 + idx * 0.09, ease: 'easeOut' }}
      className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 md:py-10 border-b border-neutral-300 hover:bg-neutral-100 transition-colors px-4 -mx-4 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <div className="flex items-center gap-6">
        <span className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 group-hover:translate-x-4 transition-transform duration-500 ease-out">
          {name}
        </span>
        {preferred && (
          <span className="font-mono text-[10px] uppercase tracking-widest bg-accent/5 text-accent-dark px-2 py-1 rounded-sm border border-accent/10 transition-opacity opacity-70 group-hover:opacity-100 hidden sm:block">
            Preferred
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 sm:mt-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <span className="font-mono text-xs md:text-sm tracking-widest text-muted">
          {handle}
        </span>
        <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300">
          {download ? <FileText className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />}
        </div>
      </div>
    </motion.a>
  );
}
