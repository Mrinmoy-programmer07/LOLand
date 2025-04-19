"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample creator data
const FEATURED_CREATORS = [
  {
    id: 1,
    name: "MemeKing",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "12.5 ETH",
    memes: 42,
    bio: "Creating the dankest memes since the ICO boom of 2017. Specializes in crypto humor and Web3 jokes.",
  },
  {
    id: 2,
    name: "CryptoJester",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "8.7 ETH",
    memes: 36,
    bio: "Former Wall Street analyst turned full-time meme creator. My memes predicted three market crashes.",
  },
  {
    id: 3,
    name: "NFTNinja",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "7.2 ETH",
    memes: 28,
    bio: "Digital artist and meme connoisseur. Creating visual stories that make you laugh and think.",
  },
]

export default function CreatorSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-20 bg-purple-950/50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Creator Spotlight</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Meet the meme masters who are earning crypto through their creativity and humor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_CREATORS.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-purple-900/40 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30 shadow-xl h-full flex flex-col hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center mb-6">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-pink-500">
                    <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                    <AvatarFallback className="bg-purple-700">{creator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{creator.name}</h3>
                    <p className="text-purple-300">@{creator.name.toLowerCase()}</p>
                  </div>
                </div>

                <p className="text-purple-200 mb-6 flex-grow">{creator.bio}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-800/50 rounded-xl p-3 text-center">
                    <p className="text-purple-300 text-sm">Earnings</p>
                    <p className="text-green-400 font-bold text-xl">{creator.earnings}</p>
                  </div>
                  <div className="bg-purple-800/50 rounded-xl p-3 text-center">
                    <p className="text-purple-300 text-sm">Memes</p>
                    <p className="text-white font-bold text-xl">{creator.memes}</p>
                  </div>
                </div>

                <Link href={`/feed?creator=${creator.id}`} className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full border-purple-500 text-white hover:bg-purple-800/30 transition-colors"
                  >
                    View Memes
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/leaderboard">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              View All Creators
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
