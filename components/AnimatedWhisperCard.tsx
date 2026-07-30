'use client';

import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';

export default function AnimatedWhisperCard({ children, className, ...props }: HTMLMotionProps<"article">) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.article>
  );
}
