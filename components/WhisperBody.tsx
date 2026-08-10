'use client';

interface WhisperBodyProps {
  content: string[];
  style?: 'dropcap' | 'boldFirstLine' | 'pullQuote' | 'plain' | 'leadParagraph' | 'decorativeRule' | 'indentedBlock';
  size: 'lead' | 'default';
}

function RestParagraphs({ paragraphs, baseClasses }: { paragraphs: string[]; baseClasses: string }) {
  if (paragraphs.length === 0) return null;
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={baseClasses}>{p}</p>
      ))}
    </>
  );
}

export default function WhisperBody({ content, style = 'plain', size }: WhisperBodyProps) {
  const baseSize = size === 'lead' ? 'text-xl md:text-2xl' : 'text-lg';
  const baseClasses = `prose prose-neutral max-w-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mb-8 ${baseSize}`;

  const [first, ...rest] = content;

  switch (style) {
    case 'dropcap':
      return (
        <>
          <p className={`${baseClasses} first-letter:float-left first-letter:text-6xl first-letter:pr-3 first-letter:font-serif first-letter:text-accent first-letter:leading-[0.8] first-letter:mt-1`}>
            {first}
          </p>
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </>
      );
    case 'boldFirstLine': {
      const [firstLine, ...restOfFirst] = first.split(/(?<=[.!?])\s+/);
      return (
        <>
          <p className={baseClasses}>
            <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{firstLine}</strong>{' '}
            {restOfFirst.join(' ')}
          </p>
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </>
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
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </div>
      );
    }
    case 'leadParagraph': {
      const words = first.split(' ');
      const lead = words.slice(0, 4).join(' ');
      const restOfFirst = words.slice(4).join(' ');
      return (
        <>
          <p className={baseClasses}>
            <span className="font-serif italic text-xl md:text-2xl text-neutral-800 dark:text-neutral-200">{lead}</span> {restOfFirst}
          </p>
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </>
      );
    }
    case 'decorativeRule':
      return (
        <>
          <div className="w-12 h-[2px] bg-accent mb-6" aria-hidden="true" />
          <p className={baseClasses}>{first}</p>
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </>
      );
    case 'indentedBlock':
      return (
        <>
          <blockquote className={`${baseClasses} pl-6 border-l-2 border-neutral-200 italic`}>
            {first}
          </blockquote>
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </>
      );
    case 'plain':
    default:
      return (
        <>
          <p className={baseClasses}>{first}</p>
          <RestParagraphs paragraphs={rest} baseClasses={baseClasses} />
        </>
      );
  }
}
