"use client"

import { useState, useRef, useEffect, useContext, createContext } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  ShoppingCart,
  Bookmark,
  FlameIcon as Fire,
  Sparkles,
  Diamond,
  User,
  Check,
  X,
  ShoppingBag,
} from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

// Create a cart context (this should be in a separate file in a real app)
const CartContext = createContext({
  cartItems: 0,
  addToCart: () => {},
})

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
  const [cartMessage, setCartMessage] = useState(false)
  
  const [purchaseState, setPurchaseState] = useState<"initial" | "options" | "processing" | "completed">("initial")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isConnected, connectWallet } = useWallet()

  // Update the handleAddToCart function to use the cart context
  const { addToCart } = useContext(CartContext)

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

  const handleBuyNow = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setPurchaseState("options")
  }

  const handlePurchase = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setPurchaseState("processing")

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Simulate processing time
    timeoutRef.current = setTimeout(() => {
      setPurchaseState("completed")

      // Reset back to initial state after showing completion
      timeoutRef.current = setTimeout(() => {
        setPurchaseState("initial")
      }, 3000)
    }, 2000)
  }

  const handleAddToCart = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    // Add to cart
    addToCart()
    setCartMessage(true)

    // Reset message after showing completion
    timeoutRef.current = setTimeout(() => {
      setCartMessage(false)
      setPurchaseState("initial")
    }, 3000)
  }

  const handleCancel = () => {
    setPurchaseState("initial")
  }

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Get badge icon and color
  const getBadge = () => {
    switch (nft.badge) {
      case "hot":
        return {
          icon: <Fire className="h-4 w-4 mr-1" />,
          text: "Hot 🔥",
          color: "bg-gradient-to-r from-orange-500 to-red-500",
        }
      case "new":
        return {
          icon: <Sparkles className="h-4 w-4 mr-1" />,
          text: "New 💥",
          color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        }
      case "rare":
        return {
          icon: <Diamond className="h-4 w-4 mr-1" />,
          text: "Rare 💎",
          color: "bg-gradient-to-r from-purple-500 to-indigo-500",
        }
      default:
        return null
    }
  }

  const badge = getBadge()

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="overflow-hidden bg-purple-900/40 backdrop-blur-sm border-purple-500/30 shadow-xl h-full flex flex-col meme-cursor">
        <div className="relative">
          <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-48 object-cover" />

          {badge && (
            <div
              className={`absolute top-2 right-2 ${badge.color} text-white text-xs px-3 py-1 rounded-full flex items-center`}
            >
              {badge.icon}
              {badge.text}
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col">
          {/* Title with badge */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-white">{nft.title}</h3>
            {nft.badge && (
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  nft.badge === "hot"
                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                    : nft.badge === "new"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500"
                }`}
              >
                {nft.badge === "hot" ? "🔥 Hot" : nft.badge === "new" ? "💥 New" : "💎 Rare"}
              </span>
            )}
          </div>

          {/* Creator info with verification */}
          <div className="flex items-center justify-between mb-4 bg-purple-800/30 p-2 rounded-lg">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border-2 border-pink-500/50">
                <AvatarImage
                  src={`/placeholder.svg?height=50&width=50&text=${nft.creator.charAt(0)}`}
                  alt={nft.creator}
                />
                <AvatarFallback className="bg-purple-700">{nft.creator.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-white text-sm">@{nft.creator.toLowerCase()}</span>
                  <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-1 rounded">✓ Verified</span>
                </div>
                <p className="text-purple-300 text-xs">Top 10 Creator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full text-purple-300 hover:text-white hover:bg-purple-800/50"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>

          {/* Reaction Bar */}
          <div className="flex justify-between items-center mb-4 bg-purple-800/30 rounded-lg p-2">
            {["🔥", "😂", "🤯", "💀"].map((emoji) => (
              <motion.button
                key={emoji}
                className="flex flex-col items-center justify-center px-2 py-1 rounded-md hover:bg-purple-700/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-xs text-purple-300">{Math.floor(Math.random() * 100) + 10}</span>
              </motion.button>
            ))}
          </div>

          {/* Price and transaction details */}
          <div className="bg-purple-800/30 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-200 text-sm">Current Price</span>
              <span className="text-green-400 font-bold text-lg">{nft.price}</span>
            </div>
            <div className="flex justify-between text-xs text-purple-300 mb-2">
              <span>Floor: 0.2 ETH</span>
              <span>Highest Bid: {Number.parseFloat(nft.price) * 1.2} ETH</span>
            </div>
            <div className="w-full bg-purple-900/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full"
                style={{ width: `${Math.min(Number.parseFloat(nft.price) * 20, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Transaction history */}
          <div className="bg-purple-800/30 rounded-lg p-3 mb-4 text-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Transaction History</span>
              <Button variant="ghost" size="sm" className="h-6 p-0 text-purple-300 hover:text-white">
                View All
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-purple-200">Purchased by @whale21</span>
                </div>
                <span className="text-purple-300">2d ago</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
                  <span className="text-purple-200">Listed by @{nft.creator.toLowerCase()}</span>
                </div>
                <span className="text-purple-300">5d ago</span>
              </div>
            </div>
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
              onClick={handleSave}
              className={`text-white hover:bg-purple-800/50 ${saved ? "text-yellow-500" : ""}`}
            >
              <Bookmark className={`h-5 w-5 mr-1 ${saved ? "fill-current text-yellow-500" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>

          {purchaseState === "initial" && (
            <Button
              onClick={handleBuyNow}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          )}

          {purchaseState === "options" && (
            <div className="w-full mt-4 bg-purple-800/50 rounded-lg p-3 border border-purple-500/30">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-medium">Purchase Options</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full text-purple-300 hover:text-white hover:bg-purple-700/50"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePurchase}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 rounded-lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Confirm Pay
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 border-purple-500 text-white hover:bg-purple-800/30"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </div>
          )}

          {purchaseState === "processing" && (
            <Button disabled className="w-full mt-4 bg-purple-800/50 text-white font-bold py-2 rounded-lg">
              <div className="flex items-center justify-center">
                <span className="animate-spin mr-2">🔄</span> Processing...
              </div>
            </Button>
          )}

          {purchaseState === "completed" && (
            <div className="w-full mt-4 bg-green-500/20 rounded-lg p-3 border border-green-500/30">
              <div className="flex items-center justify-center text-green-400">
                <Check className="mr-2 h-5 w-5" />
                <span className="font-medium">Purchase Successful!</span>
              </div>
            </div>
          )}

          {cartMessage && (
            <div className="w-full mt-4 bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center justify-center text-blue-400">
                <ShoppingBag className="mr-2 h-5 w-5" />
                <span className="font-medium">Item added to cart!</span>
              </div>
            </div>
          )}

          {/* Alternative actions */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-purple-500 text-white hover:bg-purple-800/30"
            >
              Make Offer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-purple-500 text-white hover:bg-purple-800/30"
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
