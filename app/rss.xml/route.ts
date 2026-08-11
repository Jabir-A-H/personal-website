import data from '@/data.json';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const { whispers } = data;
  
  const siteUrl = 'https://jabirah.pages.dev';

  const rssItems = whispers.map((whisper) => {
    // Convert "YYYY.MM.DD" to "YYYY-MM-DD" for reliable Date parsing
    const dateStr = whisper.date.replace(/\./g, '-');
    const date = new Date(dateStr).toUTCString();
    const content = Array.isArray(whisper.content) ? whisper.content.join(' ') : whisper.content;
    
    return `
      <item>
        <title><![CDATA[${whisper.title}]]></title>
        <link>${siteUrl}/whispers</link>
        <description><![CDATA[${content}]]></description>
        <pubDate>${date}</pubDate>
        <guid isPermaLink="false">${siteUrl}/whispers#${whisper.title.replace(/\s+/g, '-').toLowerCase()}</guid>
      </item>
    `;
  }).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Jabir Abdullah Haian - Whispers</title>
        <link>${siteUrl}/whispers</link>
        <description>Fragments of thought &amp; reflection by Jabir Abdullah Haian.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${rssItems}
      </channel>
    </rss>
  `;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
