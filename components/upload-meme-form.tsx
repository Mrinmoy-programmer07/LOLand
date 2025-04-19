'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { isImageFile, getImagePreviewUrl, uploadMemeToThirdweb } from '@/lib/thirdweb-service';
import { useNFTContract } from '@/hooks/use-contract';
import { useWallet } from '@/hooks/use-wallet';

export function UploadMemeForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useWallet();
  const { mintNFT, isLoading: isMinting } = useNFTContract();
  
  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (!selectedFile) {
      return;
    }
    
    if (!isImageFile(selectedFile)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, GIF, etc.)',
        variant: 'destructive',
      });
      return;
    }
    
    setFile(selectedFile);
    setPreviewUrl(getImagePreviewUrl(selectedFile));
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an image to upload',
        variant: 'destructive',
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your meme',
        variant: 'destructive',
      });
      return;
    }
    
    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to mint an NFT',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      toast({
        title: 'Uploading to Thirdweb',
        description: 'Your meme is being uploaded to IPFS via Thirdweb...'
      });
      
      // Upload to Thirdweb IPFS
      const metadataUri = await uploadMemeToThirdweb(
        file,
        name,
        description,
        address
      );
      
      if (!metadataUri) {
        throw new Error('Failed to upload to Thirdweb IPFS');
      }
      
      toast({
        title: 'Upload successful',
        description: 'Your meme has been uploaded to IPFS. Now minting the NFT...'
      });
      
      // Mint the NFT
      await mintNFT(metadataUri);
      
      // Reset form on success
      setFile(null);
      setPreviewUrl(null);
      setName('');
      setDescription('');
      
      toast({
        title: 'Success!',
        description: 'Your meme has been uploaded and minted as an NFT',
      });
    } catch (error) {
      console.error('Error uploading meme:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload and mint your meme',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Trigger file input click
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const isSubmitting = isUploading || isMinting;
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Meme NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File upload area */}
          <div className="space-y-2">
            <Label htmlFor="meme-file">Meme Image</Label>
            <div 
              onClick={handleSelectFile}
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              {previewUrl ? (
                <div className="relative w-full">
                  <img 
                    src={previewUrl} 
                    alt="Meme preview" 
                    className="mx-auto max-h-[300px] rounded-lg object-contain" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Click to select an image</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP (Max 10MB)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                id="meme-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="meme-name">Name</Label>
            <Input
              id="meme-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give your meme a catchy name"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Description field */}
          <div className="space-y-2">
            <Label htmlFor="meme-description">Description</Label>
            <Textarea
              id="meme-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description (optional)"
              disabled={isSubmitting}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!file || !name.trim() || isSubmitting || !address}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading 
              ? 'Uploading to Thirdweb...' 
              : isMinting 
                ? 'Minting NFT...' 
                : 'Create NFT'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Your NFT will be minted on the blockchain after upload
        </p>
      </CardFooter>
    </Card>
  );
} 