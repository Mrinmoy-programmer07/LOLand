import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'LOLand Meme Platform',
  projectId: '7fdef79c28f06b874fcdf2a9a754df96', // Get a project ID from WalletConnect Cloud
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true, // Enable server-side rendering
}); 