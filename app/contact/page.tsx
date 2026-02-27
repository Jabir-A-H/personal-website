import React from 'react';
import { Mail, Github, Linkedin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const metadata = {
  title: 'Contact | Jabir Abdullah Haian',
  description: 'Connect with Jabir Abdullah Haian via email, LinkedIn, GitHub, and other social platforms.',
};

const links = [
  { name: 'Email', url: 'mailto:jabirahaian@gmail.com', icon: Mail },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jabir-abdullah-haian/', icon: Linkedin },
  { name: 'GitHub', url: 'https://github.com/Jabir-A-H/', icon: Github },
  { name: 'Facebook', url: 'https://facebook.com/jabir.abdullah.haian', icon: Facebook },
  { name: 'Twitter', url: 'https://twitter.com/JabirHaian', icon: Twitter },
  { name: 'Instagram', url: 'https://www.instagram.com/jabir_a_haian', icon: Instagram },
  { name: 'YouTube', url: 'https://www.youtube.com/jabirabdullahhaian', icon: Youtube },
];

export default function ContactPage() {
  return (
    <div className="grid grid-cols-12 gap-6 w-full flex-1 items-center py-12">
      <div className="col-span-12 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 bg-white border border-neutral-200 p-8 md:p-12 shadow-sm rounded-2xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-sans font-medium tracking-tight text-neutral-900 mb-2">Reach Out</h1>
          <p className="text-sm text-neutral-500">Minimal utility connection points.</p>
        </header>

        <div className="space-y-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Icon className="w-4 h-4 text-neutral-600 group-hover:text-neutral-900" />
                  </div>
                  <span className="font-medium text-neutral-700 group-hover:text-neutral-900">{link.name}</span>
                </div>
                <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors font-mono text-xs">
                  &#8599;
                </span>
              </a>
            );
          })}
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-400 font-mono">
            Based in Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
}
