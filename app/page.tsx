import Hero from "@/components/hero"
import FeaturedMemes from "@/components/featured-memes"
import HowItWorks from "@/components/how-it-works"
import CreatorSpotlight from "@/components/creator-spotlight"

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <FeaturedMemes />
      <HowItWorks />
      <CreatorSpotlight />
    </div>
  )
}
