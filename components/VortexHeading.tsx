'use client';

import { motion, useReducedMotion } from 'motion/react';
import React from 'react';

interface VortexHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function VortexHeading({ children, className }: VortexHeadingProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <h1 className={className}>{children}</h1>;
  }

  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        className="now-spiral absolute -inset-6 md:-inset-10 rounded-full pointer-events-none"
      />
      <motion.h1
        className={`relative ${className ?? ''}`}
        initial={{ opacity: 0, scale: 0.3, rotate: 240 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {children}
      </motion.h1>
    </span>
  );
}
