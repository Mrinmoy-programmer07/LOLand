"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"

// Sample meme data
const FEATURED_MEMES = [
  {
    id: 1,
    title: "When Gas Fees Are Higher Than Your Rent",
    image: "/placeholder.svg?height=300&width=300",
    creator: "CryptoJester",
    likes: 2453,
  },
  {
    id: 2,
    title: "POV: You Bought The Dip But It Keeps Dipping",
    image: "/placeholder.svg?height=300&width=300",
    creator: "MemeWhale",
    likes: 1872,
  },
  {
    id: 3,
    title: "Web3 Developers Explaining Why The App Is Down",
    image: "/placeholder.svg?height=300&width=300",
    creator: "DevLolz",
    likes: 3201,
  },
  {
    id: 4,
    title: "My Portfolio After Following Reddit Advice",
    image: "/placeholder.svg?height=300&width=300",
    creator: "StonksMaster",
    likes: 1543,
  },
  {
    id: 5,
    title: "NFT Artists Explaining Their Masterpiece",
    image: "/placeholder.svg?height=300&width=300",
    creator: "PixelPunker",
    likes: 2876,
  },
  {
    id: 6,
    title: "When Someone Asks If Crypto Is In A Bubble",
    image: "/placeholder.svg?height=300&width=300",
    creator: "BubbleTrouble",
    likes: 1987,
  },
]

export default function FeaturedMemes() {
  const [startIndex, setStartIndex] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Handle navigation
  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? FEATURED_MEMES.length - 3 : prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => (prev === FEATURED_MEMES.length - 3 ? 0 : prev + 1))
  }

  // Get visible memes
  const visibleMemes = [
    FEATURED_MEMES[startIndex],
    FEATURED_MEMES[(startIndex + 1) % FEATURED_MEMES.length],
    FEATURED_MEMES[(startIndex + 2) % FEATURED_MEMES.length],
  ]

  return (
    <section ref={ref} className="py-20 bg-[#1a0b2e]/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Trending Memes</h2>
          <p className="text-xl text-[#c4a7e7] max-w-2xl mx-auto">
            The freshest, funniest, and most valuable memes in the LOLand ecosystem.
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2a0f47]/70 text-white rounded-full hover:bg-[#2a0f47] -ml-4 lg:-ml-6"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2a0f47]/70 text-white rounded-full hover:bg-[#2a0f47] -mr-4 lg:-mr-6"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Meme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            {visibleMemes.map((meme, index) => (
              <motion.div
                key={`${meme.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  rotate: Math.random() > 0.5 ? 2 : -2,
                  boxShadow: "0 10px 25px rgba(255, 107, 107, 0.2)",
                }}
                className="group"
              >
                <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#c4a7e7]/30 shadow-xl transition-all duration-300 h-full flex flex-col meme-cursor">
                  <div className="relative overflow-hidden">
                    <img
                      src={meme.image || "/placeholder.svg"}
                      alt={meme.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e]/90 via-[#1a0b2e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4">
                        <p className="text-white font-bold">{meme.likes.toLocaleString()} likes</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{meme.title}</h3>
                    <p className="text-[#c4a7e7] mb-4">by @{meme.creator}</p>
                    <div className="mt-auto">
                      <Link href={`/feed?id=${meme.id}`}>
                        <Button
                          variant="outline"
                          className="w-full border-[#c4a7e7]/50 text-white hover:bg-[#2a0f47]/50 transition-colors"
                        >
                          View Meme
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/feed">
            <Button className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              Explore All Memes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
