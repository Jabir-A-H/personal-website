'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT / CAREER', path: '/about' },
  { name: 'PROJECTS', path: '/projects' },
  { name: 'VISUAL', path: '/visual' },
  { name: 'NOTES', path: '/notes' },
  { name: 'CONTACT', path: '/contact' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center z-50 relative mix-blend-difference text-white">
      <Link href="/" className="font-mono font-bold text-sm tracking-tighter uppercase mb-6 md:mb-0">
        Jabir A. Haian
      </Link>
      
      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono tracking-widest">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`relative py-1 hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-60'}`}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
