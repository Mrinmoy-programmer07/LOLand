"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MemeNftCard from "@/components/meme-nft-card"

// Sample NFT data
const NFTS = [
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
]

export default function Marketplace() {
  const [sortBy, setSortBy] = useState("popularity")
  const [nfts, setNfts] = useState(NFTS)

  // Handle sorting
  const handleSort = (value: string) => {
    setSortBy(value)
    const sortedNfts = [...NFTS]

    if (value === "price-high") {
      sortedNfts.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
    } else if (value === "price-low") {
      sortedNfts.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
    } else if (value === "popularity") {
      sortedNfts.sort((a, b) => b.likes - a.likes)
    } else if (value === "newest") {
      // In a real app, this would sort by creation date
      sortedNfts.sort(() => Math.random() - 0.5)
    }

    setNfts(sortedNfts)
  }

  return (
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

      <div className="flex justify-center mt-12">
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
          Load More NFTs
        </Button>
      </div>
    </div>
  )
}
