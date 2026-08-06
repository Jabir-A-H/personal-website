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
}

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
  '/education': {
    initial: { opacity: 0, rotateX: 15, y: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, rotateX: -15, y: -40, filter: 'blur(10px)' },
    transition: { duration: 0.7, ease: 'easeOut' },
  },
  '/experience': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  '/whispers': {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(8px)' },
    transition: { duration: 1.0, ease: 'easeOut' },
  },
  '/now': {
    initial: { opacity: 0, scale: 0.98, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -15 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
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
