import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Shell from '@/components/Shell';
import { PersonSchema } from '@/components/JsonLd';

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
  description: 'BBA in Accounting & Information Systems at University of Dhaka. Exploring Forensic Accounting, Data Analytics & AI.',
  openGraph: {
    title: 'Jabir Abdullah Haian',
    description: 'BBA in Accounting & Information Systems at University of Dhaka. Exploring Forensic Accounting, Data Analytics & AI.',
    url: 'https://jabirah.pages.dev',
    siteName: 'Jabir Abdullah Haian',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jabir Abdullah Haian — Portfolio',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jabir Abdullah Haian',
    description: 'BBA in Accounting & Information Systems at University of Dhaka.',
    images: ['/og-image.png'],
    creator: '@JabirHaian',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900" suppressHydrationWarning>
        <PersonSchema />
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
