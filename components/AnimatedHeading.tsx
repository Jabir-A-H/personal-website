'use client';

import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';

export default function AnimatedHeading({ children, className, ...props }: HTMLMotionProps<"h1">) {
  return (
    <motion.h1 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={className}
      {...props}
    >
      {children}
    </motion.h1>
  );
}
