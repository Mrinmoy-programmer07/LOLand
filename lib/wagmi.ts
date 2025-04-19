import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { Chain } from 'wagmi/chains';

// Optional: Define custom chains (if needed)
export const lolandTestnet: Chain = {
  id: 31337, // Standard local dev chain id
  name: 'LOLand Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
  blockExplorers: {
    default: { name: 'LOLand Explorer', url: 'https://explorer.loland.com' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'LOLand Meme Platform',
  projectId: '7fdef79c28f06b874fcdf2a9a754df96', // Get a project ID from WalletConnect Cloud
  chains: [mainnet, sepolia, lolandTestnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [lolandTestnet.id]: http(),
  },
  ssr: true, // Enable server-side rendering
}); 