import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import data from '../../data.json';

export const metadata = {
  title: 'Contact | Jabir Abdullah Haian',
  description: 'Digital coordinates and communication channels.',
};

export default function ContactPage() {
  const { endpoints } = data;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left Column: Context */}
        <div className="md:col-span-4">
          <div className="sticky top-8">
            <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter uppercase mb-6 text-neutral-900">
              Endpoints
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-6">
              Dhaka, Bangladesh
            </p>
            <p className="font-serif italic text-xl text-neutral-600 leading-relaxed">
              Digital coordinates and communication channels.
            </p>
          </div>
        </div>

        {/* Right Column: Typographic List */}
        <div className="md:col-span-8">
          <div className="flex flex-col border-t border-neutral-300">
            {endpoints.map((endpoint) => (
              <a
                key={endpoint.name}
                href={endpoint.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 md:py-10 border-b border-neutral-300 hover:bg-neutral-100 transition-colors px-4 -mx-4 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                <span className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 group-hover:translate-x-4 transition-transform duration-500 ease-out">
                  {endpoint.name}
                </span>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-mono text-xs md:text-sm tracking-widest text-neutral-500">
                    {endpoint.handle}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
