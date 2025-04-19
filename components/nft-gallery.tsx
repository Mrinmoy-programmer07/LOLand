"use client";

import { useState, useEffect } from "react";
import { useNFTContract } from "@/hooks/use-contract";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { fetchMetadataFromThirdweb } from "@/lib/thirdweb-service";
import { NFTMetadata } from "@/lib/contracts";
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NFTWithMetadata {
  tokenId: string;
  owner: string;
  name?: string;
  description?: string;
  image?: string;
}

export function NFTGallery() {
  const { address, isConnected } = useWallet();
  const { ownedNFTs, totalSupply, isLoading } = useNFTContract();
  const [nftsWithMetadata, setNftsWithMetadata] = useState<NFTWithMetadata[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // Load metadata for NFTs
  useEffect(() => {
    const loadMetadata = async () => {
      if (!ownedNFTs.length) return;
      
      setIsLoadingMetadata(true);
      const nftsWithData: NFTWithMetadata[] = [];
      
      try {
        for (const nft of ownedNFTs) {
          try {
            const metadata = await fetchMetadataFromThirdweb(nft.tokenURI);
            nftsWithData.push({
              tokenId: nft.id,
              owner: nft.owner,
              name: metadata?.name || `NFT #${nft.id}`,
              description: metadata?.description,
              image: metadata?.image,
            });
          } catch (error) {
            console.error(`Error fetching metadata for NFT ${nft.id}:`, error);
            nftsWithData.push({
              tokenId: nft.id,
              owner: nft.owner,
            });
          }
        }
        
        setNftsWithMetadata(nftsWithData);
      } catch (error) {
        console.error('Error loading NFT metadata:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    
    loadMetadata();
  }, [ownedNFTs]);

  if (!isConnected) {
    return (
      <div className="text-center p-8 space-y-4">
        <h3 className="text-xl font-bold">Your NFT Collection</h3>
        <p className="text-muted-foreground">Connect your wallet to view your NFTs</p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          After connecting, your NFTs will appear here automatically
        </p>
      </div>
    );
  }

  if (isLoading || isLoadingMetadata) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (nftsWithMetadata.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">You don't own any NFTs yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your NFTs</h2>
        <p className="text-sm text-muted-foreground">
          {typeof totalSupply === 'number' && totalSupply > 0 && !isNaN(totalSupply) 
            ? `Total Supply: ${totalSupply}` 
            : ""}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nftsWithMetadata.map((nft) => (
          <Card key={nft.tokenId} className="overflow-hidden">
            <div className="relative h-48 w-full">
              {nft.image ? (
                <div className="h-full w-full relative">
                  <img
                    src={nft.image}
                    alt={nft.name || `NFT #${nft.tokenId}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle>{nft.name || `NFT #${nft.tokenId}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-3">
                {nft.description || "No description available"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-xs">Token ID: {nft.tokenId}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 