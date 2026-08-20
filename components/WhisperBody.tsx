'use client';

import { StoryBlock } from '@/lib/types';

interface WhisperBodyProps {
  story: StoryBlock[];
  style?: 'dropcap' | 'boldFirstLine' | 'pullQuote' | 'plain' | 'leadParagraph' | 'decorativeRule' | 'indentedBlock';
  size: 'lead' | 'default';
}

function RestBlocks({ blocks, baseClasses }: { blocks: StoryBlock[]; baseClasses: string }) {
  if (blocks.length === 0) return null;
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          return <p key={i} className={baseClasses}>{block.text}</p>;
        } else if (block.type === 'image') {
          return (
            <figure key={i} className="my-10 max-w-4xl mx-auto">
              <img
                src={block.src}
                srcSet={`${block.src.replace('-1024w.webp', '-640w.webp')} 640w, ${block.src} 1024w, ${block.src.replace('-1024w.webp', '-1920w.webp')} 1920w`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1024px, 1920px"
                alt={block.alt}
                className="w-full h-auto rounded-lg shadow-sm"
                loading="lazy"
              />
              {block.caption && (
                <figcaption className="text-center font-mono text-[10px] uppercase tracking-widest text-muted mt-4">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        return null;
      })}
    </>
  );
}

export default function WhisperBody({ story, style = 'plain', size }: WhisperBodyProps) {
  const blocks = story || [];
  const baseSize = size === 'lead' ? 'text-xl md:text-2xl' : 'text-lg';
  const baseClasses = `prose prose-neutral max-w-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mb-8 ${baseSize}`;

  // Find the first paragraph block to apply style
  const firstParagraphIndex = blocks.findIndex(b => b.type === 'paragraph');
  
  if (firstParagraphIndex === -1) {
    // If no paragraphs, just render blocks normally
    return <RestBlocks blocks={blocks} baseClasses={baseClasses} />;
  }

  const firstBlock = blocks[firstParagraphIndex] as Extract<StoryBlock, { type: 'paragraph' }>;
  const first = firstBlock.text;
  
  const beforeFirst = blocks.slice(0, firstParagraphIndex);
  const rest = blocks.slice(firstParagraphIndex + 1);

  const renderStyledFirst = () => {
    switch (style) {
      case 'dropcap':
        return (
          <p className={`${baseClasses} first-letter:float-left first-letter:text-6xl first-letter:pr-3 first-letter:font-serif first-letter:text-accent first-letter:leading-[0.8] first-letter:mt-1`}>
            {first}
          </p>
        );
      case 'boldFirstLine': {
        const [firstLine, ...restOfFirst] = first.split(/(?<=[.!?])\s+/);
        return (
          <p className={baseClasses}>
            <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{firstLine}</strong>{' '}
            {restOfFirst.join(' ')}
          </p>
        );
      }
      case 'pullQuote': {
        const [excerpt, ...restOfFirst] = first.split(/(?<=[.!?])\s+/);
        return (
          <div className={baseClasses}>
            <p className="font-serif italic text-2xl md:text-3xl text-neutral-800 dark:text-neutral-200 mb-4 pl-4 border-l-2 border-accent">
              {excerpt}
            </p>
            <p>{restOfFirst.join(' ')}</p>
          </div>
        );
      }
      case 'leadParagraph': {
        const words = first.split(' ');
        const lead = words.slice(0, 4).join(' ');
        const restOfFirst = words.slice(4).join(' ');
        return (
          <p className={baseClasses}>
            <span className="font-serif italic text-xl md:text-2xl text-neutral-800 dark:text-neutral-200">{lead}</span> {restOfFirst}
          </p>
        );
      }
      case 'decorativeRule':
        return (
          <>
            <div className="w-12 h-[2px] bg-accent mb-6" aria-hidden="true" />
            <p className={baseClasses}>{first}</p>
          </>
        );
      case 'indentedBlock':
        return (
          <blockquote className={`${baseClasses} pl-6 border-l-2 border-neutral-200 dark:border-neutral-700 italic`}>
            {first}
          </blockquote>
        );
      case 'plain':
      default:
        return <p className={baseClasses}>{first}</p>;
    }
  };

  return (
    <>
      <RestBlocks blocks={beforeFirst} baseClasses={baseClasses} />
      {renderStyledFirst()}
      <RestBlocks blocks={rest} baseClasses={baseClasses} />
    </>
  );
}
