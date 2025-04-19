"use client"

import { WagmiConfig, createConfig } from "wagmi"
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { connectorsForWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  phantomWallet,
  rainbowWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets"
import type { ReactNode } from "react"
import "@rainbow-me/rainbowkit/styles.css"

// Create a client
const queryClient = new QueryClient()

// Your project ID from WalletConnect Cloud
const projectId = "YOUR_PROJECT_ID" // In a real app, this would be an environment variable

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      metaMaskWallet({ projectId, chains: [mainnet, polygon, optimism, arbitrum, base] }),
      coinbaseWallet({ appName: "LOLand", chains: [mainnet, polygon, optimism, arbitrum, base] }),
      walletConnectWallet({ projectId, chains: [mainnet, polygon, optimism, arbitrum, base] }),
      phantomWallet({ chains: [mainnet, polygon, optimism, arbitrum, base] }),
    ],
  },
  {
    groupName: "More",
    wallets: [
      rainbowWallet({ projectId, chains: [mainnet, polygon, optimism, arbitrum, base] }),
      trustWallet({ projectId, chains: [mainnet, polygon, optimism, arbitrum, base] }),
    ],
  },
])

const wagmiConfig = createConfig({
  connectors,
  publicClient: null, // This will be automatically configured by RainbowKit
})

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[mainnet, polygon, optimism, arbitrum, base]}
          theme={darkTheme({
            accentColor: "#FF6B6B",
            accentColorForeground: "black",
            borderRadius: "large",
            fontStack: "system",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
