import React from 'react';

export default function AnimatedProjectCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`reveal-on-scroll ${className ?? ''}`} {...props}>
      {children}
    </div>
  );
}
