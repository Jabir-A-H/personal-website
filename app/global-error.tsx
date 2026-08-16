'use client';

import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-50 dark:bg-[#121212] text-neutral-900 dark:text-neutral-100">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Something went wrong</h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-serif italic mb-8">An unexpected error occurred.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#9f552d] text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
