import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const memesDir = join(process.cwd(), 'public/memes');
    
    // Check if directory exists
    if (!existsSync(memesDir)) {
      // If directory doesn't exist, return empty array
      return NextResponse.json({ success: true, memes: [] });
    }

    // Read directory contents with error handling
    let files;
    try {
      files = await readdir(memesDir);
    } catch (error) {
      console.error('Error reading memes directory:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to read memes directory' 
      }, { status: 500 });
    }
    
    // Filter for image files and create URLs
    const memeExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const memes = files
      .filter(file => memeExtensions.some(ext => file.toLowerCase().endsWith(ext)))
      .map(file => `/memes/${file}`);

    return NextResponse.json({ success: true, memes });
  } catch (error) {
    console.error('Error listing memes:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to list memes'
    }, { status: 500 });
  }
} 