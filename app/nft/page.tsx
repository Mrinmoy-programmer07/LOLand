"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MintNFTForm } from "@/components/mint-nft-form";
import { NFTGallery } from "@/components/nft-gallery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NFTPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">NFT Marketplace</h1>
        <p className="text-muted-foreground mt-2">Mint and view your NFT collection</p>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">My Collection</TabsTrigger>
          <TabsTrigger value="mint">Mint NFT</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My NFT Collection</CardTitle>
              <CardDescription>
                View all the NFTs you currently own
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NFTGallery />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mint" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mint a New NFT</CardTitle>
              <CardDescription>
                Create your own unique NFT on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MintNFTForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 