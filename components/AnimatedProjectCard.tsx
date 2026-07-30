'use client';

import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';

export default function AnimatedProjectCard({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
