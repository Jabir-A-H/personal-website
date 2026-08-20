import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [, , sourceFile, contentType, slug, role] = process.argv;

if (!sourceFile || !contentType || !slug || !role) {
  console.error('Usage: node process-content-image.mjs <sourceFile> <whispers|projects> <slug> <role>');
  console.error('Example: node process-content-image.mjs myphoto.jpg whispers the-entropy-of-time cover');
  process.exit(1);
}

if (contentType !== 'whispers' && contentType !== 'projects') {
  console.error('Content type must be "whispers" or "projects".');
  process.exit(1);
}

const WIDTHS = [640, 1024, 1920];

const outputDir = path.join(process.cwd(), 'public', 'images', contentType, slug);

async function processImage() {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const width of WIDTHS) {
      const filename = `${role}-${width}w.webp`;
      const outputPath = path.join(outputDir, filename);

      await sharp(sourceFile)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`Generated: ${outputPath}`);
    }

    console.log(`\nDone! Add the following block to your data.json:`);
    if (role === 'cover') {
      console.log(`"coverImage": { "src": "/images/${contentType}/${slug}/cover-1024w.webp", "alt": "..." }`);
    } else {
      console.log(`{ "type": "image", "src": "/images/${contentType}/${slug}/${role}-1024w.webp", "alt": "...", "caption": "Optional caption" }`);
    }
  } catch (err) {
    console.error('Error processing image:', err);
    process.exit(1);
  }
}

processImage();
