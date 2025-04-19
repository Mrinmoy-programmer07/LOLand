"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Upload, DollarSign, Laugh, Repeat } from "lucide-react"

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Steps data
  const steps = [
    {
      icon: <Upload className="h-10 w-10 text-black" />,
      title: "Create & Upload",
      description: "Create your funniest meme and upload it to the LOLand platform.",
      color: "from-[#FF6B6B] to-[#FF8C42]",
    },
    {
      icon: <Laugh className="h-10 w-10 text-black" />,
      title: "Make People Laugh",
      description: "Share your meme with the community and collect those sweet likes.",
      color: "from-[#FFE66D] to-[#FF8C42]",
    },
    {
      icon: <DollarSign className="h-10 w-10 text-black" />,
      title: "Earn Rewards",
      description: "Get tipped in crypto when your meme makes someone's day better.",
      color: "from-[#4ECDC4] to-[#1A535C]",
    },
    {
      icon: <Repeat className="h-10 w-10 text-black" />,
      title: "Repeat & Grow",
      description: "Build your reputation, grow your following, and earn even more.",
      color: "from-[#6A0572] to-[#AB83A1]",
    },
  ]

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How LOLand Works</h2>
          <p className="text-xl text-[#c4a7e7] max-w-2xl mx-auto">
            Turn your humor into crypto in four simple steps. It's meme magic meets blockchain technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="bg-[#2a0f47]/40 backdrop-blur-sm rounded-3xl p-8 border border-[#c4a7e7]/30 shadow-xl h-full flex flex-col items-center text-center hover:shadow-lg hover:shadow-[#FF6B6B]/10 transition-all duration-300">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6`}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-[#c4a7e7]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connecting lines between steps (visible on desktop) */}
        <div className="hidden lg:block relative h-0">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-[-120px] left-[25%] right-[25%] h-0.5 bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4]"
          />
        </div>
      </div>
    </section>
  )
}
