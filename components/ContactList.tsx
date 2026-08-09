'use client';

import { motion } from 'motion/react';
import ContactLink from './ContactLink';

interface Endpoint {
  name: string;
  url: string;
  handle: string;
  preferred?: boolean;
  download?: boolean;
}

export default function ContactList({ endpoints }: { endpoints: Endpoint[] }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="h-px bg-neutral-300 dark:bg-neutral-800"
        style={{ transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
      />
      <div className="flex flex-col">
        {endpoints.map((endpoint, idx) => (
          <ContactLink
            key={endpoint.name}
            idx={idx}
            name={endpoint.name}
            href={endpoint.url}
            handle={endpoint.handle}
            preferred={endpoint.preferred}
            download={endpoint.download}
          />
        ))}
      </div>
    </>
  );
}
