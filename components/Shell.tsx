'use client';

import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import Navigation from './Navigation';
import { getThemeForRoute, getAnimationForRoute } from '@/lib/theme';
import { useDarkMode } from '@/components/DarkModeProvider';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { isDark } = useDarkMode();

  if (pathname.startsWith('/rift')) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  const theme = getThemeForRoute(pathname);
  const activeTheme = isDark ? theme.dark : theme.light;
  const animProps = getAnimationForRoute(pathname, prefersReducedMotion);

  return (
    <motion.div
      animate={{ backgroundColor: activeTheme.bg }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeInOut' }}
      style={{
        '--theme-muted': activeTheme.textMuted,
        '--theme-focus-ring': activeTheme.focusRing,
      } as React.CSSProperties}
      className="min-h-screen w-full flex flex-col relative overflow-x-clip"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white px-4 py-2 z-[100] font-mono text-xs uppercase tracking-widest rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        Skip to content
      </a>
      <Navigation />
      <main
        id="main-content"
        className="flex-1 w-full py-8 flex flex-col relative z-10"
        style={pathname === '/education' ? { perspective: '1200px' } : undefined}
      >
        <motion.div
          key={pathname}
          initial={animProps.initial}
          animate={animProps.animate}
          transition={animProps.transition}
          style={{ transformOrigin: animProps.transformOrigin ?? '50% 50%', position: 'relative' }}
          className="flex-1 flex flex-col w-full h-full"
        >
          {pathname === '/education' && !prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20"
              style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.35), transparent 45%)' }}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            />
          )}
          {children}
        </motion.div>
      </main>
    </motion.div>
  );
}
