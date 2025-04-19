"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ImageIcon, Upload, ShoppingCart, Trophy, Menu, X, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"
import useMobile from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { isConnected } = useAccount()

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Meme Feed", href: "/feed", icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Upload Meme", href: "/upload", icon: <Upload className="h-5 w-5" /> },
    { name: "Marketplace", href: "/marketplace", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Leaderboard", href: "/leaderboard", icon: <Trophy className="h-5 w-5" /> },
    { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1a0b2e]/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ rotate: -2 }}
              animate={{ rotate: 2 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 1.5,
              }}
              className="relative"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aff053c2-b557-4579-b886-dac1f1716f69-5aWifpG9GeiSKihmyvY3eeCcbQOGsE.png"
                alt="LOLand Logo"
                className="h-12 md:h-16"
              />
            </motion.div>
          </Link>

          {/* Search Bar - Desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
              <Input
                type="text"
                placeholder="Search memes, creators, tags..."
                className="bg-[#2a0f47]/50 border-[#c4a7e7]/30 text-white placeholder:text-[#c4a7e7]/50 pl-10 h-10 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c4a7e7]" />
            </div>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-white transition-all duration-300 hover:bg-[#2a0f47]/50 ${
                    pathname === item.href ? "bg-[#2a0f47]/50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Connect Wallet Button */}
          <div className="flex items-center gap-2">
            {/* Search Toggle - Mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-6 w-6" />
              </Button>
            )}

            {/* RainbowKit Connect Button */}
            <div className="hidden md:block">
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold rounded-full px-6 transition-all duration-300 transform hover:scale-105"
                            >
                              Connect Wallet
                            </Button>
                          )
                        }

                        return (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={openChainModal}
                              className="bg-[#2a0f47]/70 hover:bg-[#2a0f47] text-white rounded-full px-4"
                            >
                              {chain.name}
                            </Button>
                            <Button
                              onClick={openAccountModal}
                              className="bg-[#4ECDC4] hover:bg-[#3DBCB0] text-black font-bold rounded-full px-4"
                            >
                              {account.displayName}
                            </Button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>

            {/* Profile Button - Desktop */}
            <div className="hidden md:block">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-[#2a0f47]/70 hover:bg-[#2a0f47] transition-all duration-300 transform hover:scale-105"
                >
                  <User className="h-5 w-5 text-white" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Profile Button */}
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <User className="h-6 w-6" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {searchOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#1a0b2e]/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search memes, creators, tags..."
                  className="bg-[#2a0f47]/50 border-[#c4a7e7]/30 text-white placeholder:text-[#c4a7e7]/50 pl-10 h-10 rounded-full w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c4a7e7]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#1a0b2e]/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-white transition-all duration-300 ${
                      pathname === item.href ? "bg-[#2a0f47]/70 border-l-4 border-[#FF6B6B]" : "hover:bg-[#2a0f47]/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                {/* Mobile Connect Button */}
                <div className="mt-4">
                  <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                      const ready = mounted
                      const connected = ready && account && chain

                      return (
                        <div
                          {...(!ready && {
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <Button
                                  onClick={openConnectModal}
                                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-3 rounded-xl transition-all duration-300"
                                >
                                  Connect Wallet
                                </Button>
                              )
                            }

                            return (
                              <div className="flex flex-col gap-2">
                                <Button
                                  onClick={openChainModal}
                                  className="w-full bg-[#2a0f47]/70 hover:bg-[#2a0f47] text-white py-3 rounded-xl"
                                >
                                  {chain.name}
                                </Button>
                                <Button
                                  onClick={openAccountModal}
                                  className="w-full bg-[#4ECDC4] hover:bg-[#3DBCB0] text-black font-bold py-3 rounded-xl"
                                >
                                  {account.displayName}
                                </Button>
                              </div>
                            )
                          })()}
                        </div>
                      )
                    }}
                  </ConnectButton.Custom>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e]/90 backdrop-blur-md border-t border-[#c4a7e7]/20 z-50 md:hidden">
          <div className="flex justify-around items-center h-16">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg ${
                  pathname === item.href ? "text-[#FF6B6B]" : "text-[#c4a7e7]"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
