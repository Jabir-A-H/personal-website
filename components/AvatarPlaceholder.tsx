import React from 'react';

export default function AvatarPlaceholder({ size = 80 }: { size?: number }) {
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-mono font-bold tracking-tight select-none shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.3 }}
      aria-hidden="true"
    >
      JAH
    </div>
  );
}
