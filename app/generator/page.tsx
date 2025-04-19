"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, RefreshCw, Check, Trash, Download } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

// Random funny captions for memes
const TOP_CAPTIONS = [
  "WHEN YOU FINALLY",
  "THAT MOMENT WHEN",
  "ME TRYING TO",
  "NOBODY:",
  "MY FACE WHEN",
  "WHEN YOUR CODE WORKS",
  "EXPECTATION:",
  "BEFORE COFFEE:",
  "WHEN THE BOSS SAYS",
  "CRYPTO INVESTORS"
];

const BOTTOM_CAPTIONS = [
  "AND IT ACTUALLY WORKS",
  "BUT IT STILL DOESN'T WORK",
  "AND EVERYONE STARES AT YOU",
  "RUNS ON FIRST TRY",
  "REALITY:",
  "AFTER COFFEE:",
  "DURING A PANDEMIC",
  "ON A MONDAY MORNING",
  "IN PRODUCTION",
  "WHEN ETH MOONS"
];

export default function MemeGenerator() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [generatedMemes, setGeneratedMemes] = useState<string[]>([]);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Load existing memes on component mount
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('/api/memes', {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch memes');
        }
        
        const data = await response.json();
        if (data.success && data.memes) {
          setGeneratedMemes(data.memes);
        } else if (!data.success) {
          console.error('Error fetching memes:', data.error);
        }
      } catch (error) {
        console.error('Error fetching memes:', error);
        toast.error('Failed to fetch memes');
      }
    };
    
    fetchMemes();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      // Add a timeout to the fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      console.log('Uploading files...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Upload response status:', response.status);
      
      // Get response text for debugging
      const responseText = await response.text();
      console.log('Upload response text:', responseText);
      
      // Parse the JSON manually since we already read the text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error('Error parsing response JSON:', err);
        throw new Error('Invalid response format from server');
      }

      if (data.success) {
        console.log('Upload successful, image URLs:', data.imageUrls);
        setUploadedImages(prev => [...prev, ...data.imageUrls]);
      } else {
        console.error('Upload failed:', data.error);
        alert(`Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      // Display a user-friendly error message
      alert(error instanceof Error 
        ? `Failed to upload images: ${error.message}` 
        : 'Failed to upload images. Please try again later.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const generateRandomCaptions = () => {
    const randomTop = TOP_CAPTIONS[Math.floor(Math.random() * TOP_CAPTIONS.length)];
    const randomBottom = BOTTOM_CAPTIONS[Math.floor(Math.random() * BOTTOM_CAPTIONS.length)];
    setTopText(randomTop);
    setBottomText(randomBottom);
  };

  const generateMeme = async (imageUrl: string) => {
    setIsGenerating(true);
    
    try {
      // Add a timeout to the fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      console.log('Generating meme for image:', imageUrl);
      
      const payload = {
        imageUrl,
        topText: topText || TOP_CAPTIONS[Math.floor(Math.random() * TOP_CAPTIONS.length)],
        bottomText: bottomText || BOTTOM_CAPTIONS[Math.floor(Math.random() * BOTTOM_CAPTIONS.length)],
      };
      
      console.log('Meme payload:', payload);

      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Meme generation response status:', response.status);
      
      // Get response text for debugging
      const responseText = await response.text();
      console.log('Meme generation response text:', responseText);
      
      // Parse the JSON manually since we already read the text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error('Error parsing response JSON:', err);
        throw new Error('Invalid response format from server');
      }
      
      if (data.success) {
        console.log('Meme generated successfully:', data.memeUrl);
        setGeneratedMemes(prev => [...prev, data.memeUrl]);
        // Remove from uploaded images
        setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      } else {
        console.error('Meme generation failed:', data.error);
        alert(`Meme generation failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating meme:', error);
      // Display a user-friendly error message
      alert(error instanceof Error 
        ? `Failed to generate meme: ${error.message}` 
        : 'Failed to generate meme. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllMemes = async () => {
    setIsGenerating(true);
    
    try {
      for (const imageUrl of uploadedImages) {
        await generateMeme(imageUrl);
      }
    } catch (error) {
      console.error('Error generating all memes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteUploadedImage = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl));
  };

  // Function to handle direct download of meme image
  const handleDownloadMeme = async (memeUrl: string, index: number) => {
    try {
      // Reset error state
      setDownloadError(null);
      
      // Fetch the image as a blob
      const response = await fetch(memeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create a blob URL for downloading
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `meme_${index + 1}.png`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Release the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading meme:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to download meme');
      alert('Failed to download meme. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">LOLand Meme Generator</h1>
        <p className="text-muted-foreground">Upload an image, add funny captions, and create your memes!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Upload Images</h2>
          
          <div className="mb-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mb-2"
            />
            <p className="text-sm text-muted-foreground">Upload JPG, PNG, or GIF files (max 5MB)</p>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8">2. Add Captions</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Top Text</label>
              <Textarea
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="WHEN YOU FINALLY..."
                className="resize-none"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bottom Text</label>
              <Textarea
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="AND IT ACTUALLY WORKS"
                className="resize-none"
                rows={2}
              />
            </div>
            
            <Button 
              onClick={generateRandomCaptions}
              variant="outline" 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Random Captions
            </Button>
          </div>

          <div className="mt-6">
            <Button
              onClick={generateAllMemes}
              disabled={uploadedImages.length === 0 || isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate All Memes
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Uploaded Images</h2>
          
          {uploadedImages.length === 0 ? (
            <div className="border border-dashed rounded-lg p-8 text-center">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No images uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <Card key={`upload-${index}`} className="overflow-hidden p-2 relative group">
                  <div className="relative aspect-square">
                    <Image
                      src={imageUrl}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      onClick={() => generateMeme(imageUrl)}
                      size="sm"
                      className="mr-2"
                    >
                      Generate
                    </Button>
                    <Button
                      onClick={() => deleteUploadedImage(imageUrl)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Generated Memes</h2>
        
        {downloadError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            Error: {downloadError}
          </div>
        )}
        
        {generatedMemes.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-xl text-muted-foreground">No memes generated yet</p>
            <p className="text-muted-foreground mt-2">Upload images and add captions to create memes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {generatedMemes.map((memeUrl, index) => (
              <Card key={`meme-${index}`} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={memeUrl}
                    alt={`Generated meme ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 bg-muted/50">
                  <Button 
                    onClick={() => handleDownloadMeme(memeUrl, index)} 
                    variant="ghost"
                    className="text-sm text-blue-500 hover:text-blue-700 w-full flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download Meme
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 