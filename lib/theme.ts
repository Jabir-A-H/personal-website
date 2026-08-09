import type { Transition } from 'motion/react';

export const ACCENT = {
  DEFAULT: '#e8915a',
  LIGHT: '#f4b88a',
  DARK: '#c97040',
  GLOW: 'rgba(232, 145, 90, 0.125)',
} as const;

export type NavTextTheme = 'light' | 'dark';

export interface PageTheme {
  bg: string;
  textMuted: string;
  navText: NavTextTheme;
  focusRing: string;
}

export const PAGE_THEMES: Record<string, PageTheme> = {
  '/': { bg: '#fafafa', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
  '/projects': { bg: '#0a0a0a', textMuted: '#a3a3a3', navText: 'dark', focusRing: '#ffffff' },
  '/education': { bg: '#f5f0e8', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
  '/whispers': { bg: '#f8f6f2', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
  '/contact': { bg: '#ffffff', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
  '/now': { bg: '#f4f7f5', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
  '/experience': { bg: '#faf8f5', textMuted: '#525252', navText: 'light', focusRing: 'var(--color-accent)' },
};

export interface AnimationProps {
  initial: Record<string, string | number>;
  animate: Record<string, string | number>;
  exit: Record<string, string | number>;
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
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  '/projects': {
    initial: { opacity: 0, clipPath: 'inset(50% 0 50% 0)', scale: 0.95 },
    animate: { opacity: 1, clipPath: 'inset(0% 0 0% 0)', scale: 1 },
    exit: { opacity: 0, clipPath: 'inset(50% 0 50% 0)', scale: 0.95 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
  // Left-hinged page turn: a normal book flips its right edge over to the
  // left, hinge stays on the spine (left). initial rotateY is NEGATIVE
  // (page rotated away/back, as if still turned over) and animates UP to 0
  // (flat, facing the reader). Exit continues the SAME rotational direction
  // past 0 into positive territory, so leaving the page reads as continuing
  // to turn forward rather than reversing on itself.
  '/education': {
    initial: { opacity: 0, rotateY: -65 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 45 },
    transition: { duration: 0.75, ease: [0.22, 0.61, 0.36, 1] as const },
    transformOrigin: '0% 50%',
  },
  // Camera rack-focus: NO positional slide. The page arrives already in
  // place but visually out of focus, then racks sharp. The old x:20→0 slide
  // is deliberately removed — it was fighting this concept, not supporting it.
  '/experience': {
    initial: { opacity: 0, filter: 'blur(10px)', scale: 1.03 },
    animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
    exit: { opacity: 0, filter: 'blur(6px)', scale: 0.98 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  '/whispers': {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(8px)' },
    transition: { duration: 1.0, ease: 'easeOut' },
  },
  // Gentle portal undertone. Kept subtle on purpose — the heading (VortexHeading)
  // carries the dramatic spin; if the container did the same magnitude of
  // rotation too, the whole page would feel nauseating rather than dramatic.
  '/now': {
    initial: { opacity: 0, scale: 0.85, rotate: 15, y: 10 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    exit: { opacity: 0, scale: 0.9, rotate: -8 },
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  // Unfold from the top, like a folded letter opening. No icon graphic —
  // the whole panel itself is the thing that unfolds. Deliberately the
  // quietest transition on the site, matching Contact's plain/no-CTA feel.
  '/contact': {
    initial: { opacity: 0, scaleY: 0.94 },
    animate: { opacity: 1, scaleY: 1 },
    exit: { opacity: 0, scaleY: 0.96 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    transformOrigin: '50% 0%',
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
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  '/projects': {
    initial: { opacity: 1, clipPath: 'inset(0 100% 0 0)' },
    animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
    exit: { opacity: 0, clipPath: 'inset(0 0 0 100%)' },
    transition: { duration: 0.5, delay: 0.15, ease: [0.65, 0, 0.35, 1] as const },
  },
  '/education': null,
  // Slightly tighter/faster blur than the container, and delayed ~0.15s
  // behind it — the headline is the thing the eye finds as focus lands.
  '/experience': {
    initial: { opacity: 0, filter: 'blur(6px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)' },
    transition: { duration: 0.45, delay: 0.15, ease: 'easeOut' },
  },
  // The "letter" sliding up after the panel unfolds.
  '/contact': {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.5, delay: 0.35, ease: 'easeOut' },
  },
};

const REDUCED_MOTION_PRESET: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: 'easeOut' },
};

export function getThemeForRoute(pathname: string) {
  return PAGE_THEMES[pathname] || PAGE_THEMES['/'];
}

export function getAnimationForRoute(pathname: string, reducedMotion = false): AnimationProps {
  if (reducedMotion) return REDUCED_MOTION_PRESET;
  return ANIMATION_PRESETS[pathname] || ANIMATION_PRESETS['default'];
}

/** Returns null for both "explicitly no independent motion" (Education) and
 * "route not in the map" cases are NOT the same — an unlisted route falls
 * back to the `default` heading preset, only Education explicitly maps to null. */
export function getHeadingAnimationForRoute(pathname: string, reducedMotion = false): AnimationProps | null {
  if (reducedMotion) return REDUCED_MOTION_PRESET;
  if (pathname in HEADING_PRESETS) return HEADING_PRESETS[pathname];
  return HEADING_PRESETS['default'];
}
