import React from 'react';
import AnimatedHeading from '@/components/AnimatedHeading';
import ContactList from '@/components/ContactList';
import data from '@/data.json';

export const metadata = {
  title: 'Contact | Jabir Abdullah Haian',
  description: 'Connect with Jabir Abdullah Haian.',
  openGraph: {
    images: [{ url: '/og-contact.png' }]
  }
};

export default function ContactPage() {
  const { endpoints } = data;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left Column: Context */}
        <div className="md:col-span-4">
          <div className="sticky top-8">
            <AnimatedHeading className="text-4xl md:text-5xl font-sans font-bold tracking-tighter uppercase mb-6 text-neutral-900">
              Endpoints
            </AnimatedHeading>
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
              Dhaka, Bangladesh
            </p>
            <p className="font-serif italic text-xl text-neutral-600 leading-relaxed">
              Digital coordinates and communication channels.
            </p>
          </div>
        </div>

        {/* Right Column: Typographic List */}
        <div className="md:col-span-8">
          <ContactList endpoints={endpoints} />
        </div>

      </div>
    </div>
  );
}
