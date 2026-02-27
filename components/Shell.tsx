'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let bgColor = '#fafafa'; // neutral-50
  if (pathname === '/projects') bgColor = '#0a0a0a'; // neutral-950
  if (pathname === '/visual') bgColor = '#000000'; // black
  if (pathname === '/about') bgColor = '#f5f5f0'; // paper
  if (pathname === '/whispers') bgColor = '#f8fafc'; // slate-50
  if (pathname === '/contact') bgColor = '#ffffff'; // white

  return (
    <motion.div
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="min-h-screen w-full flex flex-col relative selection:bg-neutral-300 selection:text-black"
    >
      <Navigation />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </motion.div>
  );
}
