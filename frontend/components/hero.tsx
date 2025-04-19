"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Upload, Search } from "lucide-react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
    <div ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div ref={parallaxRef} className="absolute inset-0">
          {/* Animated background elements */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFE66D]/20 blur-xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
              <span className="block">Scroll.</span>
              <span className="block">Laugh.</span>
              <span className="block gradient-text">Earn.</span>
              <span className="block">Repeat.</span>
            </h1>

            <p className="text-xl text-[#c4a7e7] mb-8 max-w-lg">
              Welcome to LOLand, where memes become tokens, creators earn with laughs, and the scroll is never boring.
              Join the Web3 meme revolution!
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/upload">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-6 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your Meme
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#c4a7e7] text-white hover:bg-[#2a0f47]/30 font-bold py-6 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
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
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full">
              {/* Meme Cards */}
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full bg-[#2a0f47]/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#c4a7e7]/30 shadow-xl"
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
                  whileHover={{ scale: 1.02, rotate: 0 }}
                >
                  <img
                    src={`/placeholder.svg?height=400&width=600&text=Meme+${index}`}
                    alt={`Featured meme ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a0b2e]/90 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Epic Meme #{index}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-[#c4a7e7]">@MemeCreator{index}</span>
                      <span className="text-[#4ECDC4] font-bold">0.{index * 2} ETH</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-[#FF6B6B]/30 rounded-full blur-xl"
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
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FFE66D]/30 rounded-full blur-xl"
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
