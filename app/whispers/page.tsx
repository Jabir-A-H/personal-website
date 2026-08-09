import data from '@/data.json';
import AnimatedWhisperCard from '@/components/AnimatedWhisperCard';
import FuzzyHeading from '@/components/FuzzyHeading';
import WhisperBody from '@/components/WhisperBody';

export default function WhispersPage() {
  const { whispers } = data;

  return (
    <div className="col-span-12 w-full py-12 max-w-3xl mx-auto px-6 md:px-12">
      <header className="mb-24 text-center">
        <FuzzyHeading className="text-5xl md:text-7xl font-serif italic tracking-tighter text-neutral-900 dark:text-neutral-100 mb-6">Whispers</FuzzyHeading>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Fragments of thought &amp; reflection</p>
      </header>

      <div className="space-y-32">
        {whispers.map((whisper, index) => (
          <AnimatedWhisperCard 
            key={index}
            className="group relative"
          >
            <div className="absolute -left-12 md:-left-24 top-0 h-full w-[1px] bg-neutral-200 hidden md:block">
              <div className="sticky top-1/2 w-2 h-2 -ml-[4px] rounded-full bg-neutral-300 group-hover:bg-accent transition-colors duration-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <time className="font-mono text-[10px] tracking-widest text-muted uppercase">{whisper.date}</time>
              <h2 className={`font-serif font-light text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:text-neutral-100 transition-colors ${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                {whisper.title}
              </h2>
            </div>

            <div className="pl-0 md:pl-4 border-l-2 border-neutral-100 dark:border-neutral-800 md:border-l-0">
              <WhisperBody
                content={whisper.content}
                style={(whisper as any).style}
                size={index === 0 ? 'lead' : 'default'}
              />
              
              <div className="flex flex-wrap gap-3">
                {whisper.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-muted border border-neutral-200 px-2 py-1 rounded-full hover:border-accent hover:text-accent-dark transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedWhisperCard>
        ))}
      </div>

      <footer className="mt-48 pt-12 border-t border-neutral-100 text-center">
        <p className="font-serif italic text-muted">More thoughts to come...</p>
      </footer>
    </div>
  );
}
