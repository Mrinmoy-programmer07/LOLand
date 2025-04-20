"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Upload, Search } from "lucide-react"
import Link from "next/link"

// Predefined values for bubbles to ensure consistent server/client rendering
const BUBBLES = [
  { top: "17.80%", left: "24.01%", width: "106px", height: "86.53px", xMove: 30, yMove: 20, duration: 15 },
  { top: "17.79%", left: "87.55%", width: "181.41px", height: "70.24px", xMove: -40, yMove: 30, duration: 18 },
  { top: "81.06%", left: "47.07%", width: "166px", height: "100.16px", xMove: 25, yMove: -45, duration: 14 },
  { top: "42.35%", left: "44.29%", width: "176.41px", height: "90.41px", xMove: 35, yMove: 25, duration: 17 },
  { top: "22.39%", left: "36.75%", width: "233.64px", height: "215.86px", xMove: -30, yMove: -20, duration: 19 },
  { top: "31.61%", left: "0.71%", width: "222.47px", height: "203.45px", xMove: 40, yMove: -15, duration: 16 },
  { top: "4.39%", left: "12.78%", width: "185.85px", height: "160.63px", xMove: 20, yMove: 40, duration: 20 },
  { top: "75.59%", left: "92.40%", width: "216.78px", height: "218.14px", xMove: -35, yMove: -25, duration: 15 },
  { top: "19.41%", left: "11.12%", width: "152.46px", height: "150.05px", xMove: 45, yMove: 15, duration: 17 },
  { top: "41.62%", left: "42.47%", width: "237.03px", height: "205.92px", xMove: -25, yMove: 35, duration: 19 },
  { top: "86.62%", left: "98.01%", width: "132.89px", height: "151.26px", xMove: -45, yMove: -30, duration: 16 },
  { top: "44.04%", left: "81.85%", width: "142.52px", height: "242.49px", xMove: 15, yMove: -40, duration: 18 },
  { top: "31.22%", left: "66.36%", width: "207.27px", height: "142.75px", xMove: -20, yMove: 30, duration: 15 },
  { top: "1.28%", left: "71.93%", width: "193.23px", height: "121.88px", xMove: 30, yMove: 20, duration: 17 },
  { top: "28.89%", left: "29.06%", width: "116.06px", height: "222.06px", xMove: 40, yMove: -25, duration: 16 },
  { top: "13.45%", left: "87.84%", width: "165.50px", height: "243.33px", xMove: -35, yMove: -15, duration: 19 },
  { top: "22.41%", left: "97.46%", width: "184.31px", height: "161.35px", xMove: -25, yMove: 35, duration: 14 },
  { top: "79.25%", left: "98.28%", width: "180.10px", height: "76.91px", xMove: -40, yMove: -20, duration: 16 },
  { top: "44.99%", left: "22.96%", width: "128.87px", height: "86.22px", xMove: 30, yMove: 20, duration: 18 },
  { top: "49.56%", left: "2.25%", width: "97.41px", height: "196.98px", xMove: 45, yMove: -30, duration: 17 },
];

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Mark component as client-side mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.5}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div ref={parallaxRef} className="absolute inset-0">
          {/* Animated background elements */}
          {BUBBLES.map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-xl"
              style={{
                top: bubble.top,
                left: bubble.left,
                width: bubble.width,
                height: bubble.height,
              }}
              animate={mounted ? {
                x: [0, bubble.xMove],
                y: [0, bubble.yMove],
              } : {}}
              transition={{
                duration: bubble.duration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
              <span className="block">Scroll.</span>
              <span className="block">Laugh.</span>
              <span className="block gradient-text">Earn.</span>
              <span className="block">Repeat.</span>
            </h1>

            <p className="text-xl text-purple-200 mb-8 max-w-lg">
              Welcome to LOLand, where memes become tokens, creators earn with laughs, and the scroll is never boring.
              Join the Web3 meme revolution!
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/upload">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your Meme
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-purple-500 text-white hover:bg-purple-800/30 font-bold py-6 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Explore Memes
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full">
              {/* Meme Cards */}
              {[
                {
                  image: "https://i.imgur.com/1QZ1Z1Z.jpg",
                  title: "Epic Meme #1",
                  creator: "MemeCreator1",
                  price: "0.2 ETH"
                },
                {
                  image: "https://i.imgur.com/2QZ2Z2Z.jpg",
                  title: "Epic Meme #2",
                  creator: "MemeCreator2",
                  price: "0.4 ETH"
                },
                {
                  image: "https://i.imgur.com/3QZ3Z3Z.jpg",
                  title: "Epic Meme #3",
                  creator: "MemeCreator3",
                  price: "0.6 ETH"
                }
              ].map((meme, index) => (
                <motion.div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full bg-purple-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-500/30 shadow-xl"
                  initial={{
                    rotate: (index - 2) * 5,
                    scale: 1 - (3 - index) * 0.05,
                    y: (3 - index) * 20,
                    zIndex: index,
                  }}
                  animate={{
                    rotate: [(index - 2) * 5, (index - 2) * 5 + 2, (index - 2) * 5 - 2, (index - 2) * 5],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={meme.image}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{meme.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">@{meme.creator}</span>
                      <span className="text-green-400 font-bold">{meme.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-pink-500/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
