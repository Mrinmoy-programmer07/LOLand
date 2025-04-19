"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, ShoppingCart, Check, Wallet, AlertCircle } from "lucide-react"
import confetti from "canvas-confetti"

interface PurchaseModalProps {
  meme: {
    id: number
    title: string
    image: string
    creator: string
    price: string
  }
  onClose: () => void
}

export default function PurchaseModal({ meme, onClose }: PurchaseModalProps) {
  const [purchaseState, setPurchaseState] = useState<"initial" | "processing" | "success" | "error">("initial")

  // Prevent propagation of click events
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Handle purchase confirmation
  const handlePurchase = () => {
    setPurchaseState("processing")

    // Simulate transaction processing
    setTimeout(() => {
      // 90% chance of success
      if (Math.random() < 0.9) {
        setPurchaseState("success")

        // Trigger confetti on successful purchase
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FF6B6B", "#FFE66D", "#4ECDC4"],
          })
        }, 300)
      } else {
        setPurchaseState("error")
      }
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-purple-900/90 backdrop-blur-md rounded-3xl overflow-hidden max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={handleContentClick}
        >
          {/* Header */}
          <div className="p-4 border-b border-purple-800/50 flex justify-between items-center">
            <h3 className="font-bold text-white text-xl">Purchase Meme</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-purple-800/50 text-white"
              disabled={purchaseState === "processing"}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meme Preview */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <img src={meme.image || "/placeholder.svg"} alt={meme.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-bold text-white text-center">{meme.title}</h4>
            </div>

            {/* Creator Info */}
            <div className="flex items-center mb-6 bg-purple-800/30 p-3 rounded-xl">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage
                  src={`/placeholder.svg?height=50&width=50&text=${meme.creator.charAt(0)}`}
                  alt={meme.creator}
                />
                <AvatarFallback className="bg-purple-700">{meme.creator.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-white">@{meme.creator.toLowerCase()}</span>
                <p className="text-purple-300 text-sm">Creator</p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-purple-800/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Price</span>
                <span className="text-green-400 font-bold text-2xl">{meme.price}</span>
              </div>
            </div>

            {/* Purchase States */}
            {purchaseState === "initial" && (
              <Button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Confirm Purchase
              </Button>
            )}

            {purchaseState === "processing" && (
              <Button disabled className="w-full bg-purple-800/50 text-white font-bold py-4 rounded-xl text-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <Wallet className="h-5 w-5" />
                </motion.div>
                Processing Transaction...
              </Button>
            )}

            {purchaseState === "success" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-white mb-2">Purchase Successful!</h4>
                <p className="text-purple-300 mb-6">The meme has been added to your collection</p>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  View My Collection
                </Button>
              </div>
            )}

            {purchaseState === "error" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200 }}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <AlertCircle className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-white mb-2">Transaction Failed</h4>
                <p className="text-purple-300 mb-6">There was an error processing your purchase. Please try again.</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setPurchaseState("initial")}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-purple-500 text-white hover:bg-purple-800/30"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
