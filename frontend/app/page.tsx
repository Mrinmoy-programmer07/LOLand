"use client"

import { motion } from "framer-motion"
import Hero from "@/components/hero"
import FeaturedMemes from "@/components/featured-memes"
import HowItWorks from "@/components/how-it-works"
import CreatorSpotlight from "@/components/creator-spotlight"
import { useEffect } from "react"

export default function Home() {
  // Add cursor trail effect
  useEffect(() => {
    const cursor = document.createElement("div")
    cursor.className = "cursor-trail"
    document.body.appendChild(cursor)

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeChild(cursor)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <Hero />
      <FeaturedMemes />
      <HowItWorks />
      <CreatorSpotlight />
    </motion.div>
  )
}
