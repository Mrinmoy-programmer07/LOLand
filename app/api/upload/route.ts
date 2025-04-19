import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
    
    // Parse form data with error handling
    let formData;
    try {
      formData = await clonedRequest.formData();
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to parse form data. Please try again.' 
      }, { status: 400 });
    }

    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, 'uploads');
    
    // Create public directory if it doesn't exist
    if (!existsSync(publicDir)) {
      try {
        await mkdir(publicDir, { recursive: true });
      } catch (error) {
        console.error('Error creating public directory:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Server error: Failed to create upload directory' 
        }, { status: 500 });
      }
    }
    
    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Error creating uploads directory:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Server error: Failed to create upload directory' 
        }, { status: 500 });
      }
    }

    const imageUrls: string[] = [];
    const errors: string[] = [];

    // Process all files and collect any errors
    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`File ${file.name} exceeds the size limit of 5MB`);
        continue;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        errors.push(`File ${file.name} has an invalid type. Only JPG, PNG, GIF, and WebP are allowed`);
        continue;
      }

      try {
        // Generate unique filename
        const extension = file.type.split('/')[1];
        const filename = `${generateId()}.${extension}`;
        const filepath = join(uploadDir, filename);

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filepath, buffer);

        // Add to URLs
        const imageUrl = `/uploads/${filename}`;
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error('Error saving file:', error);
        errors.push(`Failed to save file ${file.name}`);
      }
    }

    // Check if any images were successfully uploaded
    if (imageUrls.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: errors.length > 0 ? errors.join(', ') : 'Failed to upload any files' 
      }, { status: 400 });
    }

    // Return success with any images that were uploaded
    return NextResponse.json({ 
      success: true, 
      imageUrls,
      warnings: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload files. Please try again later.' 
    }, { status: 500 });
  }
} 