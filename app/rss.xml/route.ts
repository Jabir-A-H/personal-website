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
    
    return `    <item>
      <title><![CDATA[${whisper.title}]]></title>
      <link>${siteUrl}/whispers/${whisper.slug}</link>
      <description><![CDATA[${content}]]></description>
      <pubDate>${date}</pubDate>
      <guid isPermaLink="true">${siteUrl}/whispers/${whisper.slug}</guid>
    </item>`;
  }).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jabir Abdullah Haian - Whispers</title>
    <link>${siteUrl}/whispers</link>
    <description>Fragments of thought &amp; reflection by Jabir Abdullah Haian.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(feed.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
