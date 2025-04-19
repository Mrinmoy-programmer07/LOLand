import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

// Simple ID generator function
function generateId(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const timestamp = Date.now().toString(36);
  result = timestamp + '_';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { image, topText, bottomText } = data;

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // Create necessary directories
    const publicDir = join(process.cwd(), 'public');
    const memesDir = join(publicDir, 'memes');
    
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }
    if (!existsSync(memesDir)) {
      await mkdir(memesDir, { recursive: true });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const filename = `meme_${generateId()}.png`;
    const outputPath = join(memesDir, filename);

    try {
      // Get image dimensions
      const metadata = await sharp(imageBuffer).metadata();
      const { width, height } = metadata;

      if (!width || !height) {
        throw new Error('Could not determine image dimensions');
      }

      // Configure text settings
      const fontSize = Math.max(Math.floor(width / 10), 40);
      const strokeWidth = Math.max(Math.floor(fontSize / 8), 2);
      
      // Escape special characters in text
      const escapeXml = (text: string) => {
        if (!text) return '';
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };
      
      const safeTopText = escapeXml(topText || '');
      const safeBottomText = escapeXml(bottomText || '');
      
      // Create SVG with text
      const svgText = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <style>
            text {
              fill: white;
              font-size: ${fontSize}px;
              font-weight: bold;
              font-family: sans-serif;
              stroke: black;
              stroke-width: ${strokeWidth}px;
              text-anchor: middle;
              text-transform: uppercase;
            }
          </style>
          ${safeTopText ? `<text x="${width/2}" y="${fontSize * 1.2}">${safeTopText}</text>` : ''}
          ${safeBottomText ? `<text x="${width/2}" y="${height - fontSize}">${safeBottomText}</text>` : ''}
        </svg>
      `;

      // Create the SVG buffer
      const svgBuffer = Buffer.from(svgText);
      
      // Overlay the SVG text on the image
      await sharp(imageBuffer)
        .composite([
          {
            input: svgBuffer,
            gravity: 'center',
          },
        ])
        .png()
        .toFile(outputPath);

      // Return the URL to the generated meme
      const memeUrl = `/memes/${filename}`;
      
      return NextResponse.json({ success: true, memeUrl });
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to process image. The image may be corrupted or unsupported.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating meme:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate meme. Please try again later.'
    }, { status: 500 });
  }
} 