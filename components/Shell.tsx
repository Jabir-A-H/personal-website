'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Navigation from './Navigation';
import { getThemeForRoute, getAnimationForRoute } from '@/lib/theme';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const theme = getThemeForRoute(pathname);
  const animProps = getAnimationForRoute(pathname, prefersReducedMotion);

  return (
    <motion.div
      animate={{ backgroundColor: theme.bg }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeInOut' }}
      style={{
        '--theme-muted': theme.textMuted,
        '--theme-focus-ring': theme.focusRing,
      } as React.CSSProperties}
      className="min-h-screen w-full flex flex-col relative overflow-x-clip"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-neutral-900 text-white px-4 py-2 z-[100] font-mono text-xs uppercase tracking-widest rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        Skip to content
      </a>
      <Navigation />
      <main 
        id="main-content"
        className="flex-1 w-full py-8 flex flex-col relative z-10"
        style={pathname === '/education' ? { perspective: '1200px' } : undefined}
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
