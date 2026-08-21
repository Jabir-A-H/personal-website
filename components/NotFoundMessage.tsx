'use client';

import { useState, useEffect } from 'react';

const LINES = [
  'The page you are looking for has vanished into the whispers.',
  'This route does not exist. It never did.',
  'You have wandered off the map.',
  'Nothing lives at this address.',
  'A page-shaped absence.',
  'Gone the way of unfinished projects.',
];

export default function NotFoundMessage() {
  const [line, setLine] = useState(LINES[0]);

  useEffect(() => {
    setLine(LINES[Math.floor(Math.random() * LINES.length)]);
  }, []);

  return (
    <p
      suppressHydrationWarning
      className="text-xl font-serif italic text-neutral-600 dark:text-neutral-400 mb-8"
    >
      {line}
    </p>
  );
}
