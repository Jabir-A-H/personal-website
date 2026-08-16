import type { Transition } from 'motion/react';

export type NavTextTheme = 'light' | 'dark';

export interface ThemeTokens {
  bg: string;
  textMuted: string;
  navText: NavTextTheme;
  focusRing: string;
}

export interface PageTheme {
  light: ThemeTokens;
  dark: ThemeTokens;
}

export const PAGE_THEMES: Record<string, PageTheme> = {
  '/': {
    light: { bg: '#fafafa', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#121212', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
  '/projects': {
    light: { bg: '#fdf6e3', textMuted: '#657b83', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#0a0a0a', textMuted: '#a3a3a3', navText: 'dark', focusRing: '#ffffff' },
  },
  '/education': {
    light: { bg: '#f5f0e8', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#1a1714', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
  '/whispers': {
    light: { bg: '#f8f6f2', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#1c1a18', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
  '/contact': {
    light: { bg: '#ffffff', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#0a0a0a', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
  '/now': {
    light: { bg: '#f4f7f5', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#131816', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
  '/experience': {
    light: { bg: '#faf8f5', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#181715', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
  '/journey': {
    light: { bg: '#f7f4ef', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
    dark: { bg: '#1c1916', textMuted: '#a3a3a3', navText: 'dark', focusRing: 'var(--color-accent)' },
  },
};

// Enter-only animation props. There is deliberately no `exit` field —
// Shell.tsx does not wrap route content in AnimatePresence (removed to fix
// a Next.js App Router blank-page bug on navigation). If exit transitions
// are ever revisited, check git history on this file and on Shell.tsx for
// the previous AnimatePresence-based version rather than reconstructing
// from scratch.
export interface AnimationProps {
  initial: Record<string, string | number>;
  animate: Record<string, string | number>;
  transition: Transition;
  /** CSS transform-origin for the route's container motion.div. Defaults to '50% 50%' when absent. */
  transformOrigin?: string;
}

// ---------------------------------------------------------------------------
// CONTAINER presets — drive Shell.tsx's per-route page wrapper transition.
// ---------------------------------------------------------------------------
const ANIMATION_PRESETS: Record<string, AnimationProps> = {
  default: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  '/projects': {
    initial: { opacity: 0, clipPath: 'inset(50% 0 50% 0)', scale: 0.95 },
    animate: { opacity: 1, clipPath: 'inset(0% 0 0% 0)', scale: 1 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
  // Left-hinged page turn: a normal book flips its right edge over to the
  // left, hinge stays on the spine (left). initial rotateY is NEGATIVE
  // (page rotated away/back, as if still turned over) and animates UP to 0
  // (flat, facing the reader).
  '/education': {
    initial: { opacity: 0, rotateY: -65 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.75, ease: [0.22, 0.61, 0.36, 1] as const },
    transformOrigin: '0% 50%',
  },
  // Camera rack-focus: NO positional slide. The page arrives already in
  // place but visually out of focus, then racks sharp.
  '/experience': {
    initial: { opacity: 0, filter: 'blur(10px)', scale: 1.03 },
    animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  '/whispers': {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 1.0, ease: 'easeOut' },
  },
  // Gentle portal undertone. Kept subtle on purpose — the heading (VortexHeading)
  // carries the dramatic spin; if the container did the same magnitude of
  // rotation too, the whole page would feel nauseating rather than dramatic.
  '/now': {
    initial: { opacity: 0, scale: 0.85, rotate: 15, y: 10 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  // Unfold from the top, like a folded letter opening. No icon graphic —
  // the whole panel itself is the thing that unfolds. Deliberately the
  // quietest transition on the site, matching Contact's plain/no-CTA feel.
  '/contact': {
    initial: { opacity: 0, scaleY: 0.94 },
    animate: { opacity: 1, scaleY: 1 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    transformOrigin: '50% 0%',
  },
  '/journey': {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// HEADING presets — consumed by AnimatedHeading.tsx.
// `null` = no independent motion; heading inherits the container's CSS
// transform for free because it's a DOM descendant of it (Education only).
// Routes not listed here (/, /whispers, /now) use bespoke heading components
// instead of AnimatedHeading — see TypewriterHeading / FuzzyHeading / VortexHeading.
// ---------------------------------------------------------------------------
export const HEADING_PRESETS: Record<string, AnimationProps | null> = {
  default: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  '/projects': {
    initial: { opacity: 1, clipPath: 'inset(0 100% 0 0)' },
    animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
    transition: { duration: 0.5, delay: 0.15, ease: [0.65, 0, 0.35, 1] as const },
  },
  '/education': null,
  // Slightly tighter/faster blur than the container, and delayed ~0.15s
  // behind it — the headline is the thing the eye finds as focus lands.
  '/experience': {
    initial: { opacity: 0, filter: 'blur(6px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.45, delay: 0.15, ease: 'easeOut' },
  },
  // The "letter" sliding up after the panel unfolds.
  '/contact': {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.35, ease: 'easeOut' },
  },
};

const REDUCED_MOTION_PRESET: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.15, ease: 'easeOut' },
};

function matchRoute<T>(map: Record<string, T>, pathname: string, fallback: T): T {
  if (pathname in map) return map[pathname];
  const prefixMatch = Object.keys(map)
    .filter(key => key !== '/' && pathname.startsWith(key + '/'))
    .sort((a, b) => b.length - a.length)[0];
  return prefixMatch ? map[prefixMatch] : fallback;
}

export function getThemeForRoute(pathname: string) {
  return matchRoute(PAGE_THEMES, pathname, PAGE_THEMES['/']);
}

export function getAnimationForRoute(pathname: string, reducedMotion = false): AnimationProps {
  if (reducedMotion) return REDUCED_MOTION_PRESET;
  return matchRoute(ANIMATION_PRESETS, pathname, ANIMATION_PRESETS['default']);
}

/** Returns null for both "explicitly no independent motion" (Education) and
 * "route not in the map" cases are NOT the same — an unlisted route falls
 * back to the `default` heading preset, only Education explicitly maps to null. */
export function getHeadingAnimationForRoute(pathname: string, reducedMotion = false): AnimationProps | null {
  if (reducedMotion) return REDUCED_MOTION_PRESET;
  return matchRoute(HEADING_PRESETS, pathname, HEADING_PRESETS['default']);
}
