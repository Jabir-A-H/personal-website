import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import data from '@/data.json';
import { Whisper } from '@/lib/types';
import WhisperBody from '@/components/WhisperBody';
import { calculateReadingTime } from '@/lib/utils';

export async function generateStaticParams() {
  const whispers = data.whispers as Whisper[];
  return whispers.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const whispers = data.whispers as Whisper[];
  const whisper = whispers.find((w) => w.slug === slug);
  if (!whisper) return {};
  
  const textContent = whisper.story.filter(b => b.type === 'paragraph').map(b => (b as Extract<typeof b, {type: 'paragraph'}>).text).join(' ');
  const trimmedDescription = textContent.slice(0, 160);
  const publishedTime = whisper.date.replace(/\./g, '-');
  
  return {
    title: whisper.title,
    description: trimmedDescription,
    alternates: { canonical: 'https://jabirah.pages.dev/whispers' },
    openGraph: {
      title: whisper.title,
      description: trimmedDescription,
      type: 'article',
      publishedTime,
      images: [
        whisper.coverImage 
          ? { url: whisper.coverImage.src, width: 1376, height: 768, alt: whisper.coverImage.alt }
          : { url: '/og-whispers.jpg', width: 1376, height: 768, alt: 'Watercolor ink-bleed behind the word "Whispers"' }
      ],
    },
  };
}

export default async function WhisperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const whispers = data.whispers as Whisper[];
  const whisper = whispers.find((w) => w.slug === slug);
  if (!whisper) notFound();

  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto px-6 md:px-12">
      <Link href="/whispers" className="font-mono text-xs uppercase tracking-widest text-accent-dark dark:text-accent-light hover:text-accent transition-colors">
        &larr; All Whispers
      </Link>
      
      {whisper.coverImage && (
        <figure className="mt-10 mb-10">
          <img
            src={whisper.coverImage.src}
            srcSet={`${whisper.coverImage.src.replace('-1024w.webp', '-640w.webp')} 640w, ${whisper.coverImage.src} 1024w, ${whisper.coverImage.src.replace('-1024w.webp', '-1920w.webp')} 1920w`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1024px, 1920px"
            alt={whisper.coverImage.alt}
            className="w-full h-auto rounded-lg shadow-sm"
            loading="eager"
          />
        </figure>
      )}

      <header className={whisper.coverImage ? "mb-10" : "my-10"}>
        <h1 className="font-serif font-light text-neutral-800 dark:text-neutral-200 text-3xl md:text-4xl mb-4">
          {whisper.title}
        </h1>
        <div className="flex items-center gap-3">
          <time className="font-mono text-[10px] tracking-widest text-muted uppercase">{whisper.date}</time>
          <span className="font-mono text-[10px] text-muted">•</span>
          <span className="font-mono text-[10px] tracking-widest text-muted uppercase">~{calculateReadingTime(whisper.story)} min read</span>
        </div>
      </header>
      
      <WhisperBody story={whisper.story} style={whisper.style as any} size="default" />
      
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
