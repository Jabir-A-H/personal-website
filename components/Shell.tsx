'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from './Navigation';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let bgColor = '#fafafa'; // neutral-50
  if (pathname === '/projects') bgColor = '#0a0a0a'; // neutral-950
  if (pathname === '/education') bgColor = '#f5f5f0'; // paper
  if (pathname === '/whispers') bgColor = '#f8fafc'; // slate-50
  if (pathname === '/contact') bgColor = '#ffffff'; // white

  // Default animation
  let animProps: any = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: 'easeOut' }
  };

  // Custom animations based on route
  if (pathname === '/projects') {
    // Mechanical door opening effect (Sci-fi blast door)
    animProps = {
      initial: { opacity: 0, clipPath: 'inset(50% 0 50% 0)', scale: 0.95 },
      animate: { opacity: 1, clipPath: 'inset(0% 0 0% 0)', scale: 1 },
      exit: { opacity: 0, clipPath: 'inset(50% 0 50% 0)', scale: 0.95 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Snappy mechanical ease
    };
  } else if (pathname === '/education') {
    // Academic unfold / Book opening effect
    animProps = {
      initial: { opacity: 0, rotateX: 15, y: 40, filter: 'blur(10px)' },
      animate: { opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, rotateX: -15, y: -40, filter: 'blur(10px)' },
      transition: { duration: 0.7, ease: 'easeOut' }
    };
  }

  return (
    <motion.div
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="min-h-screen w-full flex flex-col relative selection:bg-neutral-300 selection:text-black"
    >
      <Navigation />
      <main 
        className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col relative z-10"
        style={{ perspective: '1200px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={animProps.initial}
            animate={animProps.animate}
            exit={animProps.exit}
            transition={animProps.transition}
            className="flex-1 flex flex-col w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
