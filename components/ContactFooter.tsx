'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useDarkMode } from './DarkModeProvider';
import { Moon, Sun } from 'lucide-react';

const sitemapLinks = [
  { name: 'Home', path: '/' },
  { name: 'Now', path: '/now' },
  { name: 'Education', path: '/education' },
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
  { name: 'Whispers', path: '/whispers' },
  { name: 'Journey', path: '/journey' },
];

export default function ContactFooter({ socials }: { socials: { name: string; url: string }[] }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 mt-16 border-t border-neutral-200 text-neutral-600 dark:text-neutral-400">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-serif italic mb-4">Still learning. Always building.</p>
          <a
            href="/Jabir_Abdullah_Haian_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-accent-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <FileText className="w-3 h-3" /> Resume
          </a>
        </div>

        <nav aria-label="Sitemap" className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
          {sitemapLinks.map(link => (
            <Link key={link.path} href={link.path} className="hover:text-accent-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-4">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 font-mono text-xs">
            {socials.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-4">
                {s.name}
              </a>
            ))}
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:border-accent hover:text-accent-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </footer>
  );
}
