"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNFTContract } from "@/hooks/use-contract";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createAndUploadMetadata } from "@/lib/thirdweb-service";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL"),
});

type FormValues = z.infer<typeof formSchema>;

export function MintNFTForm() {
  const { isConnected, address } = useWallet();
  const { mintNFT, isLoading } = useNFTContract();
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [isUploadingMetadata, setIsUploadingMetadata] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsUploadingMetadata(true);
      
      // Create and upload metadata to Thirdweb
      const metadataUri = await createAndUploadMetadata(
        data.name,
        data.description,
        data.imageUrl,
        [
          { trait_type: "Creator", value: address },
          { trait_type: "Type", value: "Custom NFT" }
        ]
      );
      
      setIsUploadingMetadata(false);
      
      if (!metadataUri) {
        toast.error("Failed to create metadata");
        return;
      }
      
      // Call the mint function
      const tokenId = await mintNFT(metadataUri);
      
      if (tokenId) {
        setMintedTokenId(tokenId);
        toast.success(`NFT minted successfully with ID: ${tokenId}`);
        form.reset();
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setIsUploadingMetadata(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint a New NFT</CardTitle>
        <CardDescription>Fill out the form to mint your NFT</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="NFT Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="NFT Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isUploadingMetadata || !isConnected}
            >
              {isUploadingMetadata ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Metadata...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {mintedTokenId && (
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-green-600">Success! NFT minted with ID: {mintedTokenId}</p>
        </CardFooter>
      )}
    </Card>
  );
} 