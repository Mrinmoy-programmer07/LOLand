"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, DollarSign, Tag, Wallet, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

interface MemeCardProps {
  meme: {
    id: number
    title: string
    image: string
    creator: string
    likes: number
    tips: string
    tags: string[]
  }
}

export default function MemeCard({ meme }: MemeCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(meme.likes)
  const [tipped, setTipped] = useState(false)
  const [tipping, setTipping] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Web3Modal integration
  const { isConnected } = useAccount()

  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1)
    } else {
      setLikeCount(likeCount - 1)
    }
    setLiked(!liked)
  }

  const handleTip = async () => {
    if (!isConnected) {
      return
    }

    setTipping(true)
    // Simulate transaction
    setTimeout(() => {
      setTipping(false)
      setTipped(true)
      setTimeout(() => setTipped(false), 2000)
    }, 1500)
  }

  const handleShare = () => {
    // In a real app, this would open a share modal
    navigator.clipboard.writeText(`https://loland.com/meme/${meme.id}`)
    alert("Link copied to clipboard!")
  }

  // Format wallet address
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Mock wallet address for the creator
  const creatorWallet = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"

  return (
    <motion.div
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="overflow-hidden bg-[#2a0f47]/40 backdrop-blur-sm border-[#c4a7e7]/30 shadow-xl h-full flex flex-col meme-cursor relative">
        <div className="p-4 border-b border-[#c4a7e7]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border border-[#c4a7e7]/30">
                <AvatarImage
                  src={`/placeholder.svg?height=50&width=50&text=${meme.creator.charAt(0)}`}
                  alt={meme.creator}
                />
                <AvatarFallback className="bg-[#2a0f47]">{meme.creator.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-white">@{meme.creator.toLowerCase()}</span>
                <div className="flex items-center text-xs text-[#c4a7e7]">
                  <Wallet className="h-3 w-3 mr-1" />
                  <span>{formatWalletAddress(creatorWallet)}</span>
                </div>
              </div>
            </div>
            <a
              href={`https://etherscan.io/address/${creatorWallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c4a7e7] hover:text-[#FF6B6B] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <img src={meme.image || "/placeholder.svg"} alt={meme.title} className="w-full h-64 object-cover" />

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e]/80 via-[#1a0b2e]/40 to-transparent flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold rounded-full px-6 py-2 transform hover:scale-105 transition-all duration-300"
              onClick={() => window.open(`/feed?id=${meme.id}`, "_blank")}
            >
              View Details
            </Button>
          </motion.div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{meme.title}</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {meme.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-[#2a0f47]/50 text-[#c4a7e7] text-xs px-2 py-1 rounded-full flex items-center"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-white hover:bg-[#2a0f47]/50 ${liked ? "text-[#FF6B6B]" : ""}`}
            >
              <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current text-[#FF6B6B]" : ""}`} />
              {likeCount.toLocaleString()}
            </Button>

            {isConnected ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTip}
                className="text-white hover:bg-[#2a0f47]/50"
                disabled={tipped || tipping}
              >
                <DollarSign className="h-5 w-5 mr-1" />
                {tipping ? "Processing..." : tipped ? "Tipped!" : "Tip"}
              </Button>
            ) : (
              <div className="scale-90">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={openConnectModal}
                      className="text-white hover:bg-[#2a0f47]/50"
                    >
                      <DollarSign className="h-5 w-5 mr-1" />
                      Connect to Tip
                    </Button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={handleShare} className="text-white hover:bg-[#2a0f47]/50">
              <Share2 className="h-5 w-5 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Tip amount badge */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#4ECDC4] to-[#1A535C] text-white text-xs px-3 py-1 rounded-full">
          {meme.tips}
        </div>
      </Card>
    </motion.div>
  )
}
