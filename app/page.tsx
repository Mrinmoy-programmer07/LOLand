import Hero from "@/components/hero"
import FeaturedMemes from "@/components/featured-memes"
import HowItWorks from "@/components/how-it-works"
import CreatorSpotlight from "@/components/creator-spotlight"
import { Web3Login } from "@/components/Web3Login"

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <div className="py-12 bg-gradient-to-b from-purple-900/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Web3Login />
          </div>
        </div>
      </div>
      <FeaturedMemes />
      <HowItWorks />
      <CreatorSpotlight />
    </div>
  )
}
