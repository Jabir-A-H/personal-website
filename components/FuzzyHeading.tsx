'use client';

import { motion, useReducedMotion } from 'motion/react';
import React from 'react';

const LAYERS = [
  { blur: 14, dx: -10, dy: 6, delay: 0 },
  { blur: 9, dx: 8, dy: -5, delay: 0.08 },
  { blur: 5, dx: -4, dy: 3, delay: 0.16 },
];

interface FuzzyHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function FuzzyHeading({ children, className }: FuzzyHeadingProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <h1 className={className}>{children}</h1>;
  }

  return (
    <span className="relative inline-block">
      {LAYERS.map((l, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none select-none ${className ?? ''}`}
          initial={{ opacity: 0.5, x: l.dx, y: l.dy, filter: `blur(${l.blur}px)` }}
          animate={{ opacity: 0, x: 0, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: l.delay, ease: 'easeOut' }}
        >
          {children}
        </motion.span>
      ))}
      <motion.h1
        className={className}
        initial={{ opacity: 0, filter: 'blur(6px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
      >
        {children}
      </motion.h1>
    </span>
  );
}
