import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Shell from '@/components/Shell';
import { PersonSchema } from '@/components/JsonLd';
import { DarkModeProvider } from '@/components/DarkModeProvider';
import data from '@/data.json';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jabirah.pages.dev'),
  title: {
    default: 'Jabir Abdullah Haian',
    template: '%s | Jabir Abdullah Haian',
  },
  description: data.personal.seoDescription,
  openGraph: {
    title: 'Jabir Abdullah Haian',
    description: data.personal.seoDescription,
    url: 'https://jabirah.pages.dev',
    siteName: 'Jabir Abdullah Haian',
    images: [
      {
        url: '/og-image.jpg',
        width: 1376,
        height: 768,
        alt: 'Jabir Abdullah Haian — Portfolio',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jabir Abdullah Haian',
    description: data.personal.seoDescription,
    images: ['/og-image.jpg'],
    creator: '@JabirHaian',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://jabirah.pages.dev',
    types: {
      'application/rss+xml': 'https://jabirah.pages.dev/rss.xml',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#e8915a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let isDark = localStorage.getItem('darkMode') === 'true';
                if (localStorage.getItem('darkMode') === null) {
                  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log(
                "%cif you're reading this, hi.",
                "font-family: monospace; font-size: 14px; color: #e8915a;"
              );
              console.log(
                "%cthere are more than 10 games hidden somewhere on this site. good luck.",
                "font-family: monospace; font-size: 11px; color: #888;"
              );
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-neutral-50 dark:bg-[#121212] text-neutral-900 dark:text-neutral-100">
        <PersonSchema />
        <DarkModeProvider>
          <Shell>
            {children}
          </Shell>
        </DarkModeProvider>
      </body>
    </html>
  );
}
