"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, ShoppingCart, Bookmark, FlameIcon as Fire, Sparkles, Diamond, Wallet, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

interface MemeNftCardProps {
  nft: {
    id: number
    title: string
    image: string
    creator: string
    price: string
    badge: string
    likes: number
  }
}

export default function MemeNftCard({ nft }: MemeNftCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(nft.likes)
  const [saved, setSaved] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
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

  const handleSave = () => {
    setSaved(!saved)
  }

  const handlePurchase = async () => {
    if (!isConnected) {
      return
    }

    setPurchasing(true)
    // Simulate transaction
    setTimeout(() => {
      setPurchasing(false)
    }, 2000)
  }

  // Format wallet address
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Mock wallet address for the creator
  const creatorWallet = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"

  // Get badge icon and color
  const getBadge = () => {
    switch (nft.badge) {
      case "hot":
        return {
          icon: <Fire className="h-4 w-4 mr-1" />,
          text: "Hot 🔥",
          color: "bg-gradient-to-r from-[#FF6B6B] to-[#FF8C42]",
        }
      case "new":
        return {
          icon: <Sparkles className="h-4 w-4 mr-1" />,
          text: "New 💥",
          color: "bg-gradient-to-r from-[#4ECDC4] to-[#1A535C]",
        }
      case "rare":
        return {
          icon: <Diamond className="h-4 w-4 mr-1" />,
          text: "Rare 💎",
          color: "bg-gradient-to-r from-[#6A0572] to-[#AB83A1]",
        }
      default:
        return null
    }
  }

  const badge = getBadge()

  return (
    <motion.div
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="overflow-hidden bg-[#2a0f47]/40 backdrop-blur-sm border-[#c4a7e7]/30 shadow-xl h-full flex flex-col meme-cursor">
        <div className="relative">
          <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-48 object-cover" />

          {badge && (
            <div
              className={`absolute top-2 right-2 ${badge.color} text-black text-xs px-3 py-1 rounded-full flex items-center`}
            >
              {badge.icon}
              {badge.text}
            </div>
          )}

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e]/80 via-[#1a0b2e]/40 to-transparent flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold rounded-full px-6 py-2 transform hover:scale-105 transition-all duration-300"
              onClick={() => window.open(`/marketplace?id=${nft.id}`, "_blank")}
            >
              View NFT
            </Button>
          </motion.div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">{nft.title}</h3>

          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2 border border-[#c4a7e7]/30">
                <AvatarImage
                  src={`/placeholder.svg?height=50&width=50&text=${nft.creator.charAt(0)}`}
                  alt={nft.creator}
                />
                <AvatarFallback className="bg-[#2a0f47]">{nft.creator.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm text-[#c4a7e7]">@{nft.creator.toLowerCase()}</span>
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

          <div className="bg-[#2a0f47]/50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[#c4a7e7] text-sm">Price</span>
              <span className="text-[#4ECDC4] font-bold">{nft.price}</span>
            </div>
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

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`text-white hover:bg-[#2a0f47]/50 ${saved ? "text-[#FFE66D]" : ""}`}
            >
              <Bookmark className={`h-5 w-5 mr-1 ${saved ? "fill-current text-[#FFE66D]" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>

          {isConnected ? (
            <Button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full mt-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70"
            >
              {purchasing ? (
                <div className="flex items-center justify-center">
                  <span className="animate-spin mr-2">🔄</span> Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                </div>
              )}
            </Button>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  onClick={openConnectModal}
                  className="w-full mt-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Wallet className="mr-2 h-5 w-5" /> Connect to Buy
                </Button>
              )}
            </ConnectButton.Custom>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
