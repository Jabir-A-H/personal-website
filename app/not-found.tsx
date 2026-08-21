import Link from 'next/link';
import NotFoundMessage from '@/components/NotFoundMessage';

export const metadata = {
  title: '404 - Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-7xl mx-auto px-6 md:px-12 text-neutral-900 dark:text-neutral-100 text-center">
      <h1 className="text-9xl font-sans font-bold tracking-tighter mb-4">404</h1>
      <NotFoundMessage />
      <Link 
        href="/" 
        className="px-6 py-3 bg-accent-dark text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
