import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';

const RSS_URL = 'https://jabir.leaflet.pub/rss';
const DATA_FILE = path.join(process.cwd(), 'data.json');

function slugify(text) {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return slug;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=');
}

function processContent(html) {
  if (!html) return [];
  const paragraphs = [];
  const pRegex = /<p>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(html)) !== null) {
    let pContent = match[1];
    pContent = pContent.replace(/<img[^>]*>/gi, '');
    pContent = pContent.replace(/<[^>]+>/g, '');
    pContent = decodeHtmlEntities(pContent);
    pContent = pContent.trim();
    if (pContent.length > 0) {
      paragraphs.push(pContent);
    }
  }
  return paragraphs;
}

function generateHash(title, rawContent) {
  return crypto.createHash('sha1').update(`${title}${rawContent}`).digest('hex');
}

function formatDate(pubDateStr) {
  const date = new Date(pubDateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

async function main() {
  console.log(`Fetching RSS from ${RSS_URL}...`);
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.status} ${res.statusText}`);
  }
  const xmlData = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: true,
    cdataPropName: false,
    parseTagValue: false, // Prevents parsing numeric strings into numbers which can mess up IDs
  });
  
  const parsed = parser.parse(xmlData);
  let items = parsed?.rss?.channel?.item;
  if (!items) {
    console.log('No items found in RSS.');
    return;
  }
  if (!Array.isArray(items)) {
    items = [items];
  }

  const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
  const data = JSON.parse(dataRaw);
  let whispers = data.whispers || [];
  let changed = false;

  for (const item of items) {
    const guid = String(item.guid || item.link);
    if (!guid) continue;
    
    // Extract last segment
    const parts = guid.split('/').filter(Boolean);
    const leafletId = parts[parts.length - 1];
    
    let title = typeof item.title === 'string' ? item.title : '';
    title = decodeHtmlEntities(title);
    
    const dateStr = item.pubDate;
    const date = formatDate(dateStr);
    
    const rawContent = String(item['content:encoded'] || '');
    const content = processContent(rawContent);
    
    const hash = generateHash(title, rawContent);
    
    const existingIndex = whispers.findIndex((w) => w.leafletId === leafletId);
    
    if (existingIndex !== -1) {
      const existing = whispers[existingIndex];
      if (existing.leafletHash !== hash) {
        existing.date = date;
        existing.title = title;
        existing.content = content;
        existing.leafletHash = hash;
        changed = true;
        console.log(`Updated whisper: ${leafletId}`);
      } else {
        console.log(`Skipped (unchanged): ${leafletId}`);
      }
    } else {
      let slug = slugify(title);
      // Fallback for empty or very short slugs (e.g. emoji only titles)
      if (!slug || slug.length < 3) {
        if (content.length > 0) {
          const firstWords = content[0].split(/\s+/).slice(0, 5).join(' ');
          slug = slugify(firstWords);
        }
        
        // Final fallback if content is also empty/un-slugifiable
        if (!slug || slug.length < 3) {
          slug = `whisper-${leafletId}`;
        }
      }
      
      const newWhisper = {
        date,
        title,
        slug,
        content,
        tags: [],
        style: "plain",
        leafletId,
        leafletHash: hash,
      };
      
      whispers.push(newWhisper);
      
      // Re-sort descending by date
      whispers.sort((a, b) => b.date.localeCompare(a.date));
      changed = true;
      console.log(`Added new whisper: ${leafletId}`);
    }
  }

  if (changed) {
    data.whispers = whispers;
    // ensure trailing newline to match standard data.json formatting
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log('Wrote updates to data.json');
  } else {
    console.log('No updates required.');
  }
}

main().catch((err) => {
  console.error('Error syncing whispers:', err);
  process.exit(1);
});
