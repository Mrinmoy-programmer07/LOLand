"use client"

import { useState, useEffect, createContext } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MemeNftCard from "@/components/meme-nft-card"
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contracts"
import { useWallet } from "@/hooks/use-wallet"
import { ethers } from "ethers"
import { toast } from "sonner"
import { ShoppingBag } from "lucide-react"

// Cart context export
export const CartContext = createContext({
  cartItems: 0,
  addToCart: () => {},
});

// Sample NFT data as fallback
const SAMPLE_NFTS = [
  {
    id: 1,
    title: "Wojak's First Million",
    image: "/placeholder.svg?height=400&width=400",
    creator: "MemeKing",
    price: "0.42 ETH",
    badge: "hot",
    likes: 1243,
  },
  {
    id: 2,
    title: "Diamond Hands Pepe",
    image: "/placeholder.svg?height=400&width=400",
    creator: "CryptoArtist",
    price: "1.2 ETH",
    badge: "rare",
    likes: 3567,
  },
  {
    id: 3,
    title: "When Moon Lambo",
    image: "/placeholder.svg?height=400&width=400",
    creator: "BlockchainBandit",
    price: "0.35 ETH",
    badge: "new",
    likes: 876,
  },
  {
    id: 4,
    title: "NGMI Feels",
    image: "/placeholder.svg?height=400&width=400",
    creator: "TokenTroll",
    price: "0.5 ETH",
    badge: "hot",
    likes: 2134,
  },
  {
    id: 5,
    title: "Rug Pull Survivor",
    image: "/placeholder.svg?height=400&width=400",
    creator: "DegenDreamer",
    price: "0.75 ETH",
    badge: "rare",
    likes: 1876,
  },
  {
    id: 6,
    title: "Vitalik's Vision",
    image: "/placeholder.svg?height=400&width=400",
    creator: "EthMaximalist",
    price: "2.5 ETH",
    badge: "rare",
    likes: 4532,
  },
  {
    id: 7,
    title: "Gas Fee Nightmare",
    image: "/placeholder.svg?height=400&width=400",
    creator: "GweiGuru",
    price: "0.3 ETH",
    badge: "new",
    likes: 987,
  },
  {
    id: 8,
    title: "Degen APE",
    image: "/placeholder.svg?height=400&width=400",
    creator: "YieldFarmer",
    price: "1.8 ETH",
    badge: "hot",
    likes: 3210,
  },
  {
    id: 9,
    title: "Free Meme: Testing Web3",
    image: "/placeholder.svg?height=400&width=400&text=FREE",
    creator: "LOLand",
    price: "0 ETH",
    badge: "hot",
    likes: 9999,
  },
]

export default function Marketplace() {
  const [sortBy, setSortBy] = useState("popularity")
  const [nfts, setNfts] = useState(SAMPLE_NFTS)
  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState(0)
  const { provider, address, isConnected } = useWallet()

  // Function to add to cart
  const addToCart = () => {
    setCartItems(prev => prev + 1);
    // Here you would also update a persistent cart state (localStorage, database, etc.)
  };

  // Fetch NFTs from the contract when provider/address changes
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider) return;
      
      setIsLoading(true);
      try {
        // Create a read-only contract instance
        const contract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          NFT_CONTRACT_ABI,
          provider
        );
        
        // Get total number of NFTs using low-level call to avoid decode errors
        let totalSupply;
        try {
          // Create the calldata for totalSupply() function: 0x18160ddd
          const totalSupplyFunction = "0x18160ddd";
          
          // Make a direct call to the contract
          const result = await provider.call({
            to: NFT_CONTRACT_ADDRESS,
            data: totalSupplyFunction
          });
          
          // If we got a valid result
          if (result && result !== "0x") {
            // Parse the result (uint256)
            totalSupply = Number(ethers.toBigInt(result));
          } else {
            console.log("Contract doesn't return data for totalSupply, using sample data");
            totalSupply = SAMPLE_NFTS.length;
          }
        } catch (error) {
          console.error("Error fetching total supply:", error);
          // Fall back to sample data length if totalSupply fails
          totalSupply = SAMPLE_NFTS.length;
        }
        
        // For low supply or error cases, use sample data
        if (!totalSupply || totalSupply < 4) {
          setNfts(SAMPLE_NFTS);
          setIsLoading(false);
          return;
        }
        
        // Fetch a limited number of NFTs (to avoid too many requests)
        const fetchedNFTs = [];
        
        // We'll fetch the 8 most recent NFTs
        const startId = Math.max(1, totalSupply - 8);
        
        for (let i = startId; i < totalSupply; i++) {
          try {
            // Get token URI using low-level call
            let tokenURI = '';
            try {
              // Function signature for tokenURI(uint256): 0xc87b56dd
              const tokenIdHex = i.toString(16).padStart(64, '0');
              const tokenURIFunction = "0xc87b56dd" + tokenIdHex;
              
              const tokenURIResult = await provider.call({
                to: NFT_CONTRACT_ADDRESS,
                data: tokenURIFunction
              });
              
              if (tokenURIResult && tokenURIResult !== "0x") {
                // The result is an encoded string, we need to extract it
                // But for this demo, we'll just use the sample data with correct ID
                tokenURI = `ipfs://nft/${i}`;
              }
            } catch (uriError) {
              console.error(`Error fetching URI for token ${i}:`, uriError);
              // Continue with the sample data
            }
            
            // Instead of random selection, use deterministic pattern based on index
            // This ensures server and client render the same content
            const baseNFTIndex = i % SAMPLE_NFTS.length;
            const baseNFT = SAMPLE_NFTS[baseNFTIndex];
            
            fetchedNFTs.push({
              ...baseNFT,
              id: i,
              title: `${baseNFT.title} #${i}`,
              // In a real app, you'd fetch metadata from the tokenURI
            });
          } catch (error) {
            console.error(`Error fetching NFT ${i}:`, error);
          }
        }
        
        if (fetchedNFTs.length > 0) {
          setNfts(fetchedNFTs);
        } else {
          // Fall back to sample data if we couldn't fetch any NFTs
          setNfts(SAMPLE_NFTS);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        toast.error("Failed to load NFTs from the blockchain");
        // Fall back to sample data
        setNfts(SAMPLE_NFTS);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Wrap in try-catch to avoid breaking the page if something goes wrong
    try {
      fetchNFTs();
    } catch (error) {
      console.error("Critical error in fetchNFTs:", error);
      setNfts(SAMPLE_NFTS);
      setIsLoading(false);
    }
  }, [provider, address]);

  // Handle sorting
  const handleSort = (value: string) => {
    setSortBy(value)
    const sortedNfts = [...nfts]

    if (value === "price-high") {
      sortedNfts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    } else if (value === "price-low") {
      sortedNfts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (value === "popularity") {
      sortedNfts.sort((a, b) => b.likes - a.likes)
    } else if (value === "newest") {
      // In a real app, this would sort by creation date
      sortedNfts.sort((a, b) => b.id - a.id)
    }

    setNfts(sortedNfts)
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Meme NFT Marketplace</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Own a piece of meme history! Buy, sell, and collect the internet's funniest moments as NFTs.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 md:mb-0"
          >
            <h2 className="text-2xl font-bold text-white">Browse Meme NFTs</h2>
          </motion.div>

          <div className="flex items-center gap-4">
            {cartItems > 0 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-purple-800 rounded-full px-3 py-1 flex items-center text-white"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                <span>{cartItems} in cart</span>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-64"
            >
              <Select defaultValue="popularity" onValueChange={handleSort}>
                <SelectTrigger className="bg-purple-800/50 border-purple-600 text-white h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 border-purple-700 text-white">
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin text-4xl">🔄</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MemeNftCard nft={nft} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Load More NFTs
          </Button>
        </div>
      </div>
    </CartContext.Provider>
  )
}
