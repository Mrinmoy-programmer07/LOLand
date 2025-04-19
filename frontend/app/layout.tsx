import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Web3ModalProvider } from "@/components/web3-modal-provider"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LOLand - Where Memes Become Tokens",
  description: "Scroll. Laugh. Earn. Repeat.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className} bg-gradient-to-br from-[#1a0b2e] via-[#2a0f47] to-[#3b1768] min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Web3ModalProvider>
            <div className="relative min-h-screen flex flex-col">
              <div className="absolute inset-0 bg-noise opacity-[0.03] z-0 pointer-events-none"></div>
              <Header />
              <main className="flex-grow relative z-10">{children}</main>
              <Footer />
            </div>
          </Web3ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
