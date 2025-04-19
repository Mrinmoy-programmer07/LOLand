"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, TrendingUp, DollarSign, Award } from "lucide-react"
import PageTransition from "@/components/page-transition"
import { useInView } from "react-intersection-observer"

// Sample creator data
const CREATORS = [
  {
    id: 1,
    name: "MemeKing",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "12.5 ETH",
    memes: 42,
    likes: 15243,
    badge: "weekly-star",
  },
  {
    id: 2,
    name: "CryptoJester",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "8.7 ETH",
    memes: 36,
    likes: 12876,
    badge: "most-tipped",
  },
  {
    id: 3,
    name: "NFTNinja",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "7.2 ETH",
    memes: 28,
    likes: 9543,
    badge: "",
  },
  {
    id: 4,
    name: "BlockchainBandit",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "6.8 ETH",
    memes: 31,
    likes: 8721,
    badge: "",
  },
  {
    id: 5,
    name: "TokenTroll",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "5.4 ETH",
    memes: 25,
    likes: 7654,
    badge: "",
  },
  {
    id: 6,
    name: "DegenDreamer",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "4.9 ETH",
    memes: 22,
    likes: 6543,
    badge: "",
  },
  {
    id: 7,
    name: "EthMaximalist",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "4.2 ETH",
    memes: 19,
    likes: 5432,
    badge: "",
  },
  {
    id: 8,
    name: "GweiGuru",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "3.8 ETH",
    memes: 17,
    likes: 4321,
    badge: "",
  },
  {
    id: 9,
    name: "YieldFarmer",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "3.5 ETH",
    memes: 15,
    likes: 3987,
    badge: "",
  },
  {
    id: 10,
    name: "MoonLambo",
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: "3.1 ETH",
    memes: 14,
    likes: 3654,
    badge: "",
  },
]

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("all-time")
  const [creators, setCreators] = useState(CREATORS)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    // In a real app, this would fetch different data based on timeframe
    // For now, we'll just shuffle the existing data
    setCreators([...CREATORS].sort(() => Math.random() - 0.5))
  }

  // Get badge icon
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "weekly-star":
        return <Award className="h-5 w-5 text-yellow-400" />
      case "most-tipped":
        return <DollarSign className="h-5 w-5 text-green-400" />
      default:
        return null
    }
  }

  // Get badge text
  const getBadgeText = (badge: string) => {
    switch (badge) {
      case "weekly-star":
        return "Weekly Star"
      case "most-tipped":
        return "Most Tipped"
      default:
        return ""
    }
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Creator Leaderboard</h1>
          <p className="text-xl text-[#c4a7e7] max-w-2xl mx-auto">
            The funniest minds in Web3. These creators are turning laughs into tokens and making bank!
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <Tabs defaultValue="all-time" className="w-full max-w-md" onValueChange={handleTimeframeChange}>
            <TabsList className="grid grid-cols-3 h-14 bg-[#2a0f47]/50 backdrop-blur-md rounded-full p-1">
              <TabsTrigger
                value="all-time"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                All Time
              </TabsTrigger>
              <TabsTrigger
                value="this-month"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                This Month
              </TabsTrigger>
              <TabsTrigger
                value="this-week"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFE66D] data-[state=active]:text-black transition-all duration-300"
              >
                This Week
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div
          ref={ref}
          className="bg-[#2a0f47]/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-[#c4a7e7]/30"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#c4a7e7]/30">
                  <th className="px-4 py-4 text-left text-[#c4a7e7]">Rank</th>
                  <th className="px-4 py-4 text-left text-[#c4a7e7]">Creator</th>
                  <th className="px-4 py-4 text-right text-[#c4a7e7]">Memes</th>
                  <th className="px-4 py-4 text-right text-[#c4a7e7]">Likes</th>
                  <th className="px-4 py-4 text-right text-[#c4a7e7]">Earnings</th>
                  <th className="px-4 py-4 text-right text-[#c4a7e7]">Badge</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {creators.map((creator, index) => (
                    <motion.tr
                      key={creator.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[#c4a7e7]/20 hover:bg-[#2a0f47]/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index === 0 ? "bg-[#FFE66D]" : index === 1 ? "bg-[#E0E0E0]" : "bg-[#CD7F32]"
                              }`}
                            >
                              <Trophy className="h-4 w-4 text-black" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#2a0f47] flex items-center justify-center text-[#c4a7e7]">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 border-2 border-[#c4a7e7]/50">
                            <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                            <AvatarFallback className="bg-[#2a0f47]">{creator.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-white">{creator.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-[#c4a7e7]">{creator.memes}</td>
                      <td className="px-4 py-4 text-right text-[#c4a7e7]">
                        <div className="flex items-center justify-end">
                          <TrendingUp className="h-4 w-4 mr-1 text-[#FF6B6B]" />
                          {creator.likes.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-[#4ECDC4]">{creator.earnings}</td>
                      <td className="px-4 py-4 text-right">
                        {creator.badge && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#2a0f47]/70 border border-[#c4a7e7]/30">
                            {getBadgeIcon(creator.badge)}
                            <span className="ml-1 text-sm text-white">{getBadgeText(creator.badge)}</span>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
