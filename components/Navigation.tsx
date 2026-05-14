'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'EDUCATION', path: '/education' },
  { name: 'EXPERIENCE', path: '/experience' },
  { name: 'PROJECTS', path: '/projects' },
  { name: 'WHISPERS', path: '/whispers' },
  { name: 'CONTACT', path: '/contact' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isDarkTheme = pathname === '/projects';
  const textColor = isDarkTheme ? 'text-white' : 'text-neutral-900';

  return (
    <header className={`w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center z-50 relative ${textColor}`}>
      <Link href="/" className="flex items-center text-xl font-sans font-extrabold tracking-tight mb-6 md:mb-0 focus:outline-none focus:ring-2 focus:ring-accent rounded-sm hover:opacity-80 transition-opacity">
        J<span className="text-accent ml-[1px] leading-none">.</span>
      </Link>
      
      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono tracking-widest" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`relative py-1 hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-accent rounded-sm ${isActive ? 'opacity-100 font-bold' : 'opacity-60'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
