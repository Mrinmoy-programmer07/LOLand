"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { DiscIcon as Discord, Twitter, Instagram, Github, Heart, ArrowUp } from "lucide-react"
import { useInView } from "react-intersection-observer"

export default function Footer() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Easter egg function
  const triggerEasterEgg = () => {
    // Create a random meme popup
    const memes = [
      "🚀 To the moon!",
      "💎 Diamond hands!",
      "🦍 Apes together strong!",
      "🤣 Found the easter egg!",
      "🧠 Big brain time!",
      "🔥 This is fine.",
      "👀 What doing?",
      "🤯 Mind blown!",
    ]

    const randomMeme = memes[Math.floor(Math.random() * memes.length)]

    // Create popup element
    const popup = document.createElement("div")
    popup.innerText = randomMeme
    popup.style.position = "fixed"
    popup.style.left = `${Math.random() * 70 + 15}%`
    popup.style.top = `${Math.random() * 70 + 15}%`
    popup.style.transform = "translate(-50%, -50%)"
    popup.style.padding = "10px 20px"
    popup.style.borderRadius = "20px"
    popup.style.background = "linear-gradient(to right, #FF6B6B, #FFE66D)"
    popup.style.color = "black"
    popup.style.fontWeight = "bold"
    popup.style.fontSize = "24px"
    popup.style.zIndex = "9999"
    popup.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)"

    // Add animation
    popup.style.animation = "popupAnim 2s forwards"

    // Add keyframes
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes popupAnim {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        30% { transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) translateY(-50px); }
      }
    `

    document.head.appendChild(style)
    document.body.appendChild(popup)

    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(popup)
    }, 2000)
  }

  return (
    <footer className="bg-[#1a0b2e]/80 backdrop-blur-md border-t border-[#c4a7e7]/20 pt-12 pb-6 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">About LOLand</h3>
            <p className="text-[#c4a7e7] mb-4">
              Where memes become tokens, creators earn with laughs, and the scroll is never boring.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="text-[#c4a7e7] hover:text-[#FF6B6B] transition-colors"
              >
                <Discord />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="text-[#c4a7e7] hover:text-[#FF6B6B] transition-colors"
              >
                <Twitter />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="text-[#c4a7e7] hover:text-[#FF6B6B] transition-colors"
              >
                <Instagram />
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="text-[#c4a7e7] hover:text-[#FF6B6B] transition-colors"
              >
                <Github />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/feed" className="text-[#c4a7e7] hover:text-white transition-colors">
                  Explore Memes
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-[#c4a7e7] hover:text-white transition-colors">
                  NFT Marketplace
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-[#c4a7e7] hover:text-white transition-colors">
                  Create & Upload
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-[#c4a7e7] hover:text-white transition-colors">
                  Creator Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#c4a7e7] hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#c4a7e7] hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#c4a7e7] hover:text-white transition-colors">
                  Creator Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#c4a7e7] hover:text-white transition-colors">
                  NFT Basics
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#c4a7e7] hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Meme of the Day */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Meme of the Day</h3>
            <div className="bg-[#2a0f47]/30 rounded-xl p-3 border border-[#c4a7e7]/20">
              <img
                src="/placeholder.svg?height=150&width=250"
                alt="Meme of the Day"
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <p className="text-white font-medium">When your NFT finally sells</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#c4a7e7] text-sm">By: MemeKing</span>
                <button className="text-[#FF6B6B] hover:text-[#FF5151] transition-colors">
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#c4a7e7]/20 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#c4a7e7] text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} LOLand. All rights reserved.
            </div>

            <div className="flex space-x-6">
              <Link href="#" className="text-[#c4a7e7] hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[#c4a7e7] hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-[#c4a7e7] hover:text-white text-sm transition-colors">
                Meme Rights
              </Link>
              <button onClick={triggerEasterEgg} className="text-[#c4a7e7] hover:text-white text-sm transition-colors">
                🥚
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            className="bg-[#2a0f47]/50 hover:bg-[#2a0f47]/70 text-white p-3 rounded-full transition-colors"
          >
            <ArrowUp size={20} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
