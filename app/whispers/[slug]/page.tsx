import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import data from '@/data.json';
import WhisperBody from '@/components/WhisperBody';
import { calculateReadingTime } from '@/lib/utils';

export async function generateStaticParams() {
  return data.whispers.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const whisper = data.whispers.find((w) => w.slug === slug);
  if (!whisper) return {};
  const description = Array.isArray(whisper.content) ? whisper.content.join(' ') : whisper.content;
  const trimmedDescription = description.slice(0, 160);
  const publishedTime = whisper.date.replace(/\./g, '-');
  return {
    title: whisper.title,
    description: trimmedDescription,
    alternates: { canonical: `https://jabirah.pages.dev/whispers/${whisper.slug}` },
    openGraph: {
      title: whisper.title,
      description: trimmedDescription,
      type: 'article',
      publishedTime,
      images: [{ url: '/og-whispers.jpg', width: 1376, height: 768, alt: 'Watercolor ink-bleed behind the word "Whispers"' }],
    },
  };
}

export default async function WhisperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const whisper = data.whispers.find((w) => w.slug === slug);
  if (!whisper) notFound();

  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto px-6 md:px-12">
      <Link href="/whispers" className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors">
        &larr; All Whispers
      </Link>
      <header className="my-10">
        <h1 className="font-serif font-light text-neutral-800 dark:text-neutral-200 text-3xl md:text-4xl mb-4">
          {whisper.title}
        </h1>
        <div className="flex items-center gap-3">
          <time className="font-mono text-[10px] tracking-widest text-muted uppercase">{whisper.date}</time>
          <span className="font-mono text-[10px] text-muted">•</span>
          <span className="font-mono text-[10px] tracking-widest text-muted uppercase">~{calculateReadingTime(whisper.content)} min read</span>
        </div>
      </header>
      <WhisperBody content={whisper.content} style={whisper.style as any} size="default" />
      <div className="flex flex-wrap gap-3 mt-8">
        {whisper.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-muted border border-neutral-200 dark:border-neutral-800 px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
