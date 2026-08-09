'use client';

import { usePathname } from 'next/navigation';
import { motion, useReducedMotion, HTMLMotionProps } from 'motion/react';
import React from 'react';
import { getHeadingAnimationForRoute } from '@/lib/theme';

export default function AnimatedHeading({ children, className, ...props }: HTMLMotionProps<"h1">) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const preset = getHeadingAnimationForRoute(pathname, prefersReducedMotion);

  if (!preset) {
    // Education: no independent motion. Inherits the container's rotateY
    // for free via normal CSS transform inheritance — it's a DOM child of
    // the rotating page wrapper in Shell.tsx.
    return (
      <h1 className={className} {...(props as React.HTMLAttributes<HTMLHeadingElement>)}>
        {children as React.ReactNode}
      </h1>
    );
  }

  return (
    <motion.h1
      initial={preset.initial}
      animate={preset.animate}
      transition={preset.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.h1>
  );
}
