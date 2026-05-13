'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <h2 className="text-4xl font-bold tracking-tighter mb-4">Something went wrong</h2>
          <p className="text-neutral-600 font-serif italic mb-8">An unexpected error occurred.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#e8915a] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#c97040] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
