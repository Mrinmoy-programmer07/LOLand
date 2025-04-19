"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ImageIcon, Upload, ShoppingCart, Trophy, Menu, X, Wallet, User } from "lucide-react"
import { usePathname } from "next/navigation"
import useMobile from "@/hooks/use-mobile"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from "@/hooks/use-wallet"
import { WalletProfile } from "@/components/wallet-profile"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [expandedProfile, setExpandedProfile] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { connectWallet, isConnected } = useWallet()

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (profileOpen && !target.closest(".profile-dropdown")) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileOpen])

  // Navigation items
  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Meme Feed", href: "/feed", icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Upload Meme", href: "/upload", icon: <Upload className="h-5 w-5" /> },
    { name: "Marketplace", href: "/marketplace", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Leaderboard", href: "/leaderboard", icon: <Trophy className="h-5 w-5" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-purple-900/80 backdrop-blur-md shadow-lg" : "bg-transparent"
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
                className="h-24 md:h-32" 
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-white transition-all duration-300 hover:bg-purple-800/50 ${
                    pathname === item.href ? "bg-purple-800/50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Connect Wallet Button and Profile Icon */}
          <div className="flex items-center space-x-2">
            <ConnectButton.Custom>
              {({ 
                account, 
                chain, 
                openAccountModal, 
                openChainModal, 
                openConnectModal, 
                mounted 
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            className="hidden md:flex items-center space-x-2 rounded-full px-6 py-2 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            <User className="h-5 w-5 mr-2" />
                            <span>Sign In</span>
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center">
                          <Button
                            onClick={openAccountModal}
                            className={`hidden md:flex items-center space-x-2 rounded-full px-6 py-2 transition-all duration-300 transform hover:scale-105 bg-green-500 hover:bg-green-600`}
                          >
                            <User className="h-5 w-5 mr-2" />
                            <span>{account.displayName}</span>
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            <div className="hidden md:block relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-all duration-300 transform hover:scale-105"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <User className="h-5 w-5 text-white" />
                <span className="sr-only">Profile</span>
              </Button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-[400px] rounded-xl bg-purple-900/90 backdrop-blur-md border border-purple-500/30 shadow-xl z-50 overflow-hidden profile-dropdown">
                  {isConnected ? (
                    <div className="p-4">
                      <WalletProfile />
                      
                      {/* Additional profile options can be added here */}
                      <div className="mt-4 pt-4 border-t border-purple-700/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-300 hover:text-white p-0 h-auto"
                          onClick={() => setProfileOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h3 className="font-bold text-white text-xl mb-4 text-center">Sign In to LOLand</h3>
                      <p className="text-purple-300 text-sm mb-6 text-center">Connect your wallet to start creating and earning from memes</p>
                      
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                          onClick={connectWallet}
                        >
                          <Wallet className="h-5 w-5 mr-2" />
                          Connect Wallet
                        </Button>
                      </div>
                    
                      <div className="mt-6 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-300 hover:text-white"
                          onClick={() => setProfileOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-purple-900/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-white transition-all duration-300 ${
                      pathname === item.href ? "bg-purple-800/70 border-l-4 border-pink-500" : "hover:bg-purple-800/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {!connected ? (
                          <Button
                            onClick={openConnectModal}
                            className="flex items-center justify-center space-x-2 rounded-xl px-4 py-6 mt-4 w-full transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
                          >
                            <Wallet className="h-5 w-5 mr-2" />
                            <span>Connect Wallet</span>
                          </Button>
                        ) : (
                          <Button
                            onClick={openAccountModal}
                            className="flex items-center justify-center space-x-2 rounded-xl px-4 py-6 mt-4 w-full transition-all duration-300 bg-green-500 hover:bg-green-600 text-white font-bold"
                          >
                            <User className="h-5 w-5 mr-2" />
                            <span>{account.displayName}</span>
                          </Button>
                        )}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
