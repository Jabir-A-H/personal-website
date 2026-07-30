'use client';

import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';

interface AnimatedProjectRowProps extends HTMLMotionProps<"a"> {
  idx: number;
}

export default function AnimatedProjectRow({ children, className, idx, ...props }: AnimatedProjectRowProps) {
  return (
    <motion.a 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.4 }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}
