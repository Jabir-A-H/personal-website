import React from 'react';

interface AnimatedProjectRowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  idx: number;
}

export default function AnimatedProjectRow({ children, className, idx, ...props }: AnimatedProjectRowProps) {
  return (
    <a
      className={`reveal-on-scroll-row ${className ?? ''}`}
      style={{ '--reveal-delay': `${idx * 0.05}s` } as React.CSSProperties}
      {...props}
    >
      {children}
    </a>
  );
}
