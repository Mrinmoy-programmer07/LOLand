"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MemeNftCard from "@/components/meme-nft-card"
import PageTransition from "@/components/page-transition"
import { useInView } from "react-intersection-observer"

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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
    <PageTransition>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Meme NFT Marketplace</h1>
          <p className="text-xl text-[#c4a7e7] max-w-2xl mx-auto">
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
              <SelectTrigger className="bg-[#2a0f47]/50 border-[#c4a7e7]/50 text-white h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a0f47] border-[#c4a7e7]/50 text-white">
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {nfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  rotate: Math.random() > 0.5 ? 1 : -1,
                  boxShadow: "0 10px 25px rgba(255, 107, 107, 0.2)",
                }}
              >
                <MemeNftCard nft={nft} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-12">
          <Button className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Load More NFTs
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
