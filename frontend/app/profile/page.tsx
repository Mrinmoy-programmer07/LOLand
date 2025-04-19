"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Share2, Users, Heart, ImageIcon, Wallet, Award, Plus, Minus } from "lucide-react"
import PageTransition from "@/components/page-transition"
import MemeCard from "@/components/meme-card"
import MemeNftCard from "@/components/meme-nft-card"
import { useInView } from "react-intersection-observer"
import { useAccount } from "wagmi"

// Sample meme data
const USER_MEMES = [
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
    creator: "CryptoJester",
    likes: 1872,
    tips: "0.31 ETH",
    tags: ["trading", "dip", "pain"],
  },
]

// Sample NFT data
const USER_NFTS = [
  {
    id: 1,
    title: "Wojak's First Million",
    image: "/placeholder.svg?height=400&width=400",
    creator: "CryptoJester",
    price: "0.42 ETH",
    badge: "hot",
    likes: 1243,
  },
  {
    id: 2,
    title: "Diamond Hands Pepe",
    image: "/placeholder.svg?height=400&width=400",
    creator: "CryptoJester",
    price: "1.2 ETH",
    badge: "rare",
    likes: 3567,
  },
]

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { address } = useAccount()

  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return "Not Connected"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Banner */}
        <div className="relative mb-16">
          <div className="h-48 md:h-64 rounded-xl overflow-hidden">
            <img
              src="/placeholder.svg?height=300&width=1200&text=Profile+Banner"
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-12 left-8 flex items-end">
            <Avatar className="h-24 w-24 border-4 border-[#1a0b2e] bg-[#2a0f47]">
              <AvatarImage src="/placeholder.svg?height=100&width=100&text=CJ" alt="CryptoJester" />
              <AvatarFallback className="text-2xl">CJ</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">CryptoJester</h1>
              <span className="bg-[#4ECDC4]/20 text-[#4ECDC4] px-2 py-1 rounded-full text-xs">Verified</span>
            </div>
            <div className="flex items-center gap-4 text-[#c4a7e7] mb-4">
              <span className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                {formatAddress(address)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>1.2K Followers</span>
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>4.5K Likes</span>
              </span>
            </div>
            <p className="text-[#c4a7e7] max-w-2xl mb-4">
              Former Wall Street analyst turned full-time meme creator. My memes predicted three market crashes. Join me
              on this wild ride through the crypto meme-verse!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#2a0f47]/50 text-[#c4a7e7] px-3 py-1 rounded-full text-sm">Crypto Memes</span>
              <span className="bg-[#2a0f47]/50 text-[#c4a7e7] px-3 py-1 rounded-full text-sm">NFT Creator</span>
              <span className="bg-[#2a0f47]/50 text-[#c4a7e7] px-3 py-1 rounded-full text-sm">Meme Lord</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`${
                isFollowing
                  ? "bg-[#2a0f47]/50 hover:bg-[#2a0f47]/70 text-white"
                  : "bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black"
              } rounded-full px-6`}
            >
              {isFollowing ? (
                <>
                  <Minus className="h-4 w-4 mr-2" /> Unfollow
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Follow
                </>
              )}
            </Button>
            <Button variant="outline" className="rounded-full border-[#c4a7e7]/50 text-white">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" className="rounded-full border-[#c4a7e7]/50 text-white">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-xl p-4 border border-[#c4a7e7]/30">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-5 w-5 text-[#FF6B6B]" />
              <h3 className="text-white font-semibold">Memes Created</h3>
            </div>
            <p className="text-2xl font-bold text-white">36</p>
          </div>
          <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-xl p-4 border border-[#c4a7e7]/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-[#FFE66D]" />
              <h3 className="text-white font-semibold">Points</h3>
            </div>
            <p className="text-2xl font-bold text-white">12,450</p>
          </div>
          <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-xl p-4 border border-[#c4a7e7]/30">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-[#4ECDC4]" />
              <h3 className="text-white font-semibold">Earnings</h3>
            </div>
            <p className="text-2xl font-bold text-[#4ECDC4]">8.7 ETH</p>
          </div>
          <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-xl p-4 border border-[#c4a7e7]/30">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-[#FF6B6B]" />
              <h3 className="text-white font-semibold">Total Likes</h3>
            </div>
            <p className="text-2xl font-bold text-white">12,876</p>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="memes" className="mt-8">
          <TabsList className="grid grid-cols-4 h-14 bg-[#2a0f47]/50 backdrop-blur-md rounded-full p-1 mb-8">
            <TabsTrigger
              value="memes"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
            >
              My Memes
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
            >
              Liked
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
            >
              NFTs
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
            >
              Wallet
            </TabsTrigger>
          </TabsList>

          <div ref={ref}>
            <TabsContent value="memes" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {USER_MEMES.map((meme, index) => (
                  <motion.div
                    key={`${meme.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, rotate: Math.random() > 0.5 ? 1 : -1 }}
                  >
                    <MemeCard meme={meme} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="liked" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {USER_MEMES.map((meme, index) => (
                  <motion.div
                    key={`liked-${meme.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, rotate: Math.random() > 0.5 ? 1 : -1 }}
                  >
                    <MemeCard meme={meme} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {USER_NFTS.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-0">
              <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-xl p-6 border border-[#c4a7e7]/30">
                <h3 className="text-xl font-bold text-white mb-4">Wallet Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <p className="text-[#c4a7e7] mb-1">Connected Wallet</p>
                      <p className="text-white font-semibold flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        {formatAddress(address)}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-[#c4a7e7] mb-1">Balance</p>
                      <p className="text-[#4ECDC4] font-bold text-2xl">3.45 ETH</p>
                    </div>
                    <div>
                      <p className="text-[#c4a7e7] mb-1">Network</p>
                      <p className="text-white font-semibold">Ethereum Mainnet</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <p className="text-[#c4a7e7] mb-1">Recent Transactions</p>
                      <div className="space-y-2">
                        <div className="bg-[#2a0f47]/50 p-3 rounded-lg">
                          <p className="text-white font-semibold">Meme NFT Purchase</p>
                          <p className="text-[#c4a7e7] text-sm">0.5 ETH • 2 days ago</p>
                        </div>
                        <div className="bg-[#2a0f47]/50 p-3 rounded-lg">
                          <p className="text-white font-semibold">Tip Received</p>
                          <p className="text-[#c4a7e7] text-sm">0.05 ETH • 3 days ago</p>
                        </div>
                        <div className="bg-[#2a0f47]/50 p-3 rounded-lg">
                          <p className="text-white font-semibold">Meme NFT Sale</p>
                          <p className="text-[#c4a7e7] text-sm">1.2 ETH • 5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageTransition>
  )
}
