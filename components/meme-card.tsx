"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, DollarSign, Tag, ShoppingCart } from "lucide-react"

interface MemeCardProps {
  meme: {
    id: number
    title: string
    image: string
    creator: string
    likes: number
    tips: string
    price: string
    tags: string[]
    reactions?: {
      [key: string]: number
    }
  }
  onMemeClick?: () => void
  onBuyClick?: (e: React.MouseEvent) => void
}

export default function MemeCard({ meme, onMemeClick, onBuyClick }: MemeCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(meme.likes)
  const [tipped, setTipped] = useState(false)
  const [reactions, setReactions] = useState(meme.reactions || { "🔥": 0, "😂": 0, "🤯": 0, "💀": 0 })
  const [recentReaction, setRecentReaction] = useState<string | null>(null)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!liked) {
      setLikeCount(likeCount + 1)
    } else {
      setLikeCount(likeCount - 1)
    }
    setLiked(!liked)
  }

  const handleTip = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTipped(true)
    // In a real app, this would open a wallet modal
    setTimeout(() => setTipped(false), 2000)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, this would open a share modal
    navigator.clipboard.writeText(`https://loland.com/meme/${meme.id}`)
    alert("Link copied to clipboard!")
  }

  const handleReaction = (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setReactions({
      ...reactions,
      [emoji]: (reactions[emoji] || 0) + 1,
    })

    // Set recent reaction for animation
    setRecentReaction(emoji)
    setTimeout(() => setRecentReaction(null), 1000)
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full" onClick={onMemeClick}>
      <Card className="overflow-hidden bg-purple-900/40 backdrop-blur-sm border-purple-500/30 shadow-xl h-full flex flex-col meme-cursor">
        <div className="p-4 border-b border-purple-800/50">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={`/placeholder.svg?height=50&width=50&text=${meme.creator.charAt(0)}`}
                alt={meme.creator}
              />
              <AvatarFallback className="bg-purple-700">{meme.creator.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-white">@{meme.creator.toLowerCase()}</span>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <img src={meme.image || "/placeholder.svg"} alt={meme.title} className="w-full h-64 object-cover" />
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{meme.title}</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {meme.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-purple-800/50 text-purple-200 text-xs px-2 py-1 rounded-full flex items-center"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>

          {/* Reaction Bar */}
          <div className="flex justify-between items-center mb-4 bg-purple-800/30 rounded-lg p-2">
            {Object.entries(reactions).map(([emoji, count]) => (
              <motion.button
                key={emoji}
                className="flex flex-col items-center justify-center px-2 py-1 rounded-md hover:bg-purple-700/50 transition-colors relative"
                onClick={(e) => handleReaction(emoji, e)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-xs text-purple-300">{count}</span>

                {/* Animated reaction */}
                <AnimatePresence>
                  {recentReaction === emoji && (
                    <motion.span
                      className="absolute text-2xl"
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -20, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                    >
                      {emoji}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-white hover:bg-purple-800/50 ${liked ? "text-pink-500" : ""}`}
            >
              <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current text-pink-500" : ""}`} />
              {likeCount.toLocaleString()}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleTip}
              className="text-white hover:bg-purple-800/50"
              disabled={tipped}
            >
              <DollarSign className="h-5 w-5 mr-1" />
              {tipped ? "Tipped!" : "Tip"}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleShare} className="text-white hover:bg-purple-800/50">
              <Share2 className="h-5 w-5 mr-1" />
              Share
            </Button>
          </div>

          {/* Buy Button */}
          <Button
            onClick={onBuyClick}
            className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Buy for {meme.price}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
