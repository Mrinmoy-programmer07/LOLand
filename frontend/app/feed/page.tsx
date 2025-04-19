"use client"

import { useState, useEffect } from "react"
import MemeCard from "@/components/meme-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import PageTransition from "@/components/page-transition"

// Sample meme data
const MEMES = [
  {
    id: 1,
    title: "When the gas fees are higher than your rent",
    image: "/placeholder.svg?height=400&width=400",
    creator: "CryptoJester",
    likes: 2453,
    tips: "0.42 ETH",
    tags: ["crypto", "eth", "gasfees"],
  },
  {
    id: 2,
    title: "POV: You bought the dip but it keeps dipping",
    image: "/placeholder.svg?height=400&width=400",
    creator: "MemeWhale",
    likes: 1872,
    tips: "0.31 ETH",
    tags: ["trading", "dip", "pain"],
  },
  {
    id: 3,
    title: "Web3 developers explaining why the app is down",
    image: "/placeholder.svg?height=400&width=400",
    creator: "DevLolz",
    likes: 3201,
    tips: "0.56 ETH",
    tags: ["developers", "bugs", "excuses"],
  },
  {
    id: 4,
    title: "My portfolio after following Reddit advice",
    image: "/placeholder.svg?height=400&width=400",
    creator: "StonksMaster",
    likes: 1543,
    tips: "0.22 ETH",
    tags: ["investing", "reddit", "advice"],
  },
  {
    id: 5,
    title: "NFT artists explaining their masterpiece",
    image: "/placeholder.svg?height=400&width=400",
    creator: "PixelPunker",
    likes: 2876,
    tips: "0.48 ETH",
    tags: ["nft", "art", "explanation"],
  },
  {
    id: 6,
    title: "When someone asks if crypto is in a bubble",
    image: "/placeholder.svg?height=400&width=400",
    creator: "BubbleTrouble",
    likes: 1987,
    tips: "0.35 ETH",
    tags: ["crypto", "bubble", "denial"],
  },
]

export default function MemeFeed() {
  const [filter, setFilter] = useState("trending")
  const [memes, setMemes] = useState(MEMES)
  const [loading, setLoading] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Simulate loading more memes on scroll
  const loadMoreMemes = () => {
    setLoading(true)
    setTimeout(() => {
      setMemes([...memes, ...MEMES.map((meme) => ({ ...meme, id: meme.id + memes.length }))])
      setLoading(false)
    }, 1000)
  }

  // Filter memes based on selected tab
  useEffect(() => {
    // In a real app, this would fetch from an API with the filter
    // For now, we'll just shuffle the existing memes
    setMemes([...MEMES].sort(() => Math.random() - 0.5))
  }, [filter])

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Meme Feed</h1>

          <Tabs defaultValue="trending" className="w-full max-w-3xl mx-auto mb-8" onValueChange={setFilter}>
            <TabsList className="grid grid-cols-5 h-14 bg-[#2a0f47]/50 backdrop-blur-md rounded-full p-1">
              <TabsTrigger
                value="trending"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                Trending 🔥
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                New 💥
              </TabsTrigger>
              <TabsTrigger
                value="classic"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                Classic 🏆
              </TabsTrigger>
              <TabsTrigger
                value="remixable"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                Remixable 🎭
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                Video 📹
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {memes.map((meme, index) => (
              <motion.div
                key={`${meme.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, rotate: Math.random() > 0.5 ? 1 : -1 }}
              >
                <MemeCard meme={meme} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div ref={ref} className="flex justify-center mt-10">
          <Button
            onClick={loadMoreMemes}
            disabled={loading}
            className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2">🔄</span> Loading...
              </div>
            ) : (
              "Load More Memes"
            )}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
