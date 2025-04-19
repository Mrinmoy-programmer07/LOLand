"use client"

import { useState, useEffect, useRef } from "react"
import MemeCard from "@/components/meme-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import MemeModal from "@/components/meme-modal"
import PurchaseModal from "@/components/purchase-modal"

// Sample meme data
const MEMES = [
  {
    id: 1,
    title: "When the gas fees are higher than your rent",
    image: "/placeholder.svg?height=400&width=400",
    creator: "CryptoJester",
    likes: 2453,
    tips: "0.42 ETH",
    price: "0.75 ETH",
    tags: ["crypto", "eth", "gasfees"],
    reactions: {
      "🔥": 423,
      "😂": 1256,
      "🤯": 389,
      "💀": 385,
    },
  },
  {
    id: 2,
    title: "POV: You bought the dip but it keeps dipping",
    image: "/placeholder.svg?height=400&width=400",
    creator: "MemeWhale",
    likes: 1872,
    tips: "0.31 ETH",
    price: "0.5 ETH",
    tags: ["trading", "dip", "pain"],
    reactions: {
      "🔥": 312,
      "😂": 876,
      "🤯": 245,
      "💀": 439,
    },
  },
  {
    id: 3,
    title: "Web3 developers explaining why the app is down",
    image: "/placeholder.svg?height=400&width=400",
    creator: "DevLolz",
    likes: 3201,
    tips: "0.56 ETH",
    price: "1.2 ETH",
    tags: ["developers", "bugs", "excuses"],
    reactions: {
      "🔥": 567,
      "😂": 1876,
      "🤯": 432,
      "💀": 326,
    },
  },
  {
    id: 4,
    title: "My portfolio after following Reddit advice",
    image: "/placeholder.svg?height=400&width=400",
    creator: "StonksMaster",
    likes: 1543,
    tips: "0.22 ETH",
    price: "0.4 ETH",
    tags: ["investing", "reddit", "advice"],
    reactions: {
      "🔥": 234,
      "😂": 765,
      "🤯": 187,
      "💀": 357,
    },
  },
  {
    id: 5,
    title: "NFT artists explaining their masterpiece",
    image: "/placeholder.svg?height=400&width=400",
    creator: "PixelPunker",
    likes: 2876,
    tips: "0.48 ETH",
    price: "0.9 ETH",
    tags: ["nft", "art", "explanation"],
    reactions: {
      "🔥": 654,
      "😂": 1432,
      "🤯": 398,
      "💀": 392,
    },
  },
  {
    id: 6,
    title: "When someone asks if crypto is in a bubble",
    image: "/placeholder.svg?height=400&width=400",
    creator: "BubbleTrouble",
    likes: 1987,
    tips: "0.35 ETH",
    price: "0.65 ETH",
    tags: ["crypto", "bubble", "denial"],
    reactions: {
      "🔥": 345,
      "😂": 987,
      "🤯": 276,
      "💀": 379,
    },
  },
]

export default function MemeFeed() {
  const [filter, setFilter] = useState("trending")
  const [memes, setMemes] = useState(MEMES)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeme, setSelectedMeme] = useState(null)
  const [purchaseMeme, setPurchaseMeme] = useState(null)
  const searchInputRef = useRef(null)

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

  // Filter memes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setMemes([...MEMES])
      return
    }

    const query = searchQuery.toLowerCase()
    const filteredMemes = MEMES.filter(
      (meme) =>
        meme.title.toLowerCase().includes(query) ||
        meme.creator.toLowerCase().includes(query) ||
        meme.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
    setMemes(filteredMemes)
  }, [searchQuery])

  // Handle meme click to open modal
  const handleMemeClick = (meme) => {
    setSelectedMeme(meme)
  }

  // Handle buy click to open purchase modal
  const handleBuyClick = (e, meme) => {
    e.stopPropagation() // Prevent opening the meme modal
    setPurchaseMeme(meme)
  }

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Meme Feed</h1>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-6">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search memes, creators, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-purple-800/50 border-purple-600 text-white placeholder:text-purple-400 h-12 text-lg pl-12 pr-12 rounded-full"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <Tabs defaultValue="trending" className="w-full max-w-3xl mx-auto mb-8" onValueChange={setFilter}>
          <TabsList className="grid grid-cols-5 h-14 bg-purple-800/50 backdrop-blur-md rounded-full p-1">
            <TabsTrigger
              value="trending"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Trending 🔥
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              New 💥
            </TabsTrigger>
            <TabsTrigger
              value="classic"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Classic 🏆
            </TabsTrigger>
            <TabsTrigger
              value="remixable"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Remixable 🎭
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Video 📹
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme, index) => (
          <motion.div
            key={`${meme.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MemeCard
              meme={meme}
              onMemeClick={() => handleMemeClick(meme)}
              onBuyClick={(e) => handleBuyClick(e, meme)}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button
          onClick={loadMoreMemes}
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70"
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

      {/* Meme Modal */}
      {selectedMeme && (
        <MemeModal
          meme={selectedMeme}
          onClose={() => setSelectedMeme(null)}
          onBuy={(e) => handleBuyClick(e, selectedMeme)}
        />
      )}

      {/* Purchase Modal */}
      {purchaseMeme && <PurchaseModal meme={purchaseMeme} onClose={() => setPurchaseMeme(null)} />}
    </div>
  )
}
