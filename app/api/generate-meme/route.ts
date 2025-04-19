import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import path from 'path';

// Simple ID generator function as replacement for uuid
function generateId(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const timestamp = Date.now().toString(36);
  
  // Add timestamp prefix for uniqueness
  result = timestamp + '_';
  
  // Add random characters
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export async function POST(request: Request) {
  try {
    // Clone the request to prevent "Already read" errors if parsing fails
    const clonedRequest = request.clone();
    
    // Parse JSON with error handling
    let data;
    try {
      data = await clonedRequest.json();
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON data' 
      }, { status: 400 });
    }

    const { imageUrl, topText, bottomText } = data;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'No image URL provided' }, { status: 400 });
    }

    // Create memes directory structure if it doesn't exist
    const publicDir = join(process.cwd(), 'public');
    const memesDir = join(publicDir, 'memes');
    
    // Create public directory if it doesn't exist
    if (!existsSync(publicDir)) {
      try {
        await mkdir(publicDir, { recursive: true });
      } catch (error) {
        console.error('Error creating public directory:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Server error: Failed to create memes directory' 
        }, { status: 500 });
      }
    }
    
    // Create memes directory if it doesn't exist
    if (!existsSync(memesDir)) {
      try {
        await mkdir(memesDir, { recursive: true });
      } catch (error) {
        console.error('Error creating memes directory:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Server error: Failed to create memes directory' 
        }, { status: 500 });
      }
    }

    // Get the actual image file path
    const imageFilePath = join(process.cwd(), 'public', imageUrl);
    
    // Check if source image exists
    if (!existsSync(imageFilePath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Source image not found' 
      }, { status: 404 });
    }

    // Generate a unique filename for the meme
    const filename = `meme_${generateId()}.png`;
    const outputPath = join(memesDir, filename);

    try {
      // Get image dimensions
      const metadata = await sharp(imageFilePath).metadata();
      const { width, height } = metadata;

      if (!width || !height) {
        throw new Error('Could not determine image dimensions');
      }

      // Configure text settings
      const fontSize = Math.max(Math.floor(width / 10), 40); // Adaptive font size
      const strokeWidth = Math.max(Math.floor(fontSize / 8), 2);
      
      // Escape special characters in text to prevent XML parsing issues
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
      
      // Create a simpler SVG with fewer filters and styles
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

      // Load the source image
      const sourceImage = sharp(imageFilePath);
      
      // Create the SVG buffer
      const svgBuffer = Buffer.from(svgText);
      
      // Overlay the SVG text on the image
      await sourceImage
        .composite([
          {
            input: svgBuffer,
            gravity: 'center',
          },
        ])
        .png() // Output as PNG
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