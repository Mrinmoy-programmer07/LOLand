"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Heart, Share2, DollarSign, Tag, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface MemeModalProps {
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
  onClose: () => void
  onBuy: (e: React.MouseEvent) => void
}

export default function MemeModal({ meme, onClose, onBuy }: MemeModalProps) {
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

  // Prevent propagation of click events
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-purple-900/90 backdrop-blur-md rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={handleContentClick}
        >
          {/* Header */}
          <div className="p-4 border-b border-purple-800/50 flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage
                  src={`/placeholder.svg?height=50&width=50&text=${meme.creator.charAt(0)}`}
                  alt={meme.creator}
                />
                <AvatarFallback className="bg-purple-700">{meme.creator.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-white text-lg">@{meme.creator.toLowerCase()}</span>
                <p className="text-purple-300 text-sm">Creator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-purple-800/50 text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-grow">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-2/3 p-4 flex items-center justify-center">
                <img
                  src={meme.image || "/placeholder.svg"}
                  alt={meme.title}
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              </div>

              {/* Details */}
              <div className="md:w-1/3 p-4 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4">{meme.title}</h2>

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

                {/* Price */}
                <div className="bg-purple-800/50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Price</span>
                    <span className="text-green-400 font-bold text-xl">{meme.price}</span>
                  </div>
                </div>

                {/* Reaction Bar */}
                <div className="flex justify-between items-center mb-4 bg-purple-800/30 rounded-lg p-3">
                  {Object.entries(reactions).map(([emoji, count]) => (
                    <motion.button
                      key={emoji}
                      className="flex flex-col items-center justify-center px-2 py-1 rounded-md hover:bg-purple-700/50 transition-colors relative"
                      onClick={(e) => handleReaction(emoji, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-xs text-purple-300">{count}</span>

                      {/* Animated reaction */}
                      <AnimatePresence>
                        {recentReaction === emoji && (
                          <motion.span
                            className="absolute text-3xl"
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

                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    onClick={handleLike}
                    className={`text-white hover:bg-purple-800/50 ${liked ? "text-pink-500" : ""}`}
                  >
                    <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current text-pink-500" : ""}`} />
                    {likeCount.toLocaleString()}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleTip}
                    className="text-white hover:bg-purple-800/50"
                    disabled={tipped}
                  >
                    <DollarSign className="h-5 w-5 mr-1" />
                    {tipped ? "Tipped!" : "Tip"}
                  </Button>

                  <Button variant="ghost" onClick={handleShare} className="text-white hover:bg-purple-800/50">
                    <Share2 className="h-5 w-5 mr-1" />
                    Share
                  </Button>
                </div>

                {/* Buy Button */}
                <Button
                  onClick={onBuy}
                  className="w-full mt-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Buy for {meme.price}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
