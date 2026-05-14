import React from 'react';

export default function AvatarPlaceholder({ size = 80, className = '' }: { size?: number, className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-mono font-bold tracking-tight select-none shrink-0 ${className}`}
      style={{ 
        width: className.includes('w-') ? undefined : size, 
        height: className.includes('h-') ? undefined : size, 
        fontSize: className.includes('w-full') ? '4rem' : size * 0.3 
      }}
      aria-hidden="true"
    >
      JAH
    </div>
  );
}
