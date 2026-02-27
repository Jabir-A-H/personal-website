import Link from 'next/link';

export const metadata = {
  title: '404 - Not Found | Jabir Abdullah Haian',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-neutral-900 text-center px-6">
      <h1 className="text-9xl font-sans font-bold tracking-tighter mb-4">404</h1>
      <p className="text-xl font-serif italic text-neutral-600 mb-8">
        The page you are looking for has vanished into the whispers.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-neutral-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
