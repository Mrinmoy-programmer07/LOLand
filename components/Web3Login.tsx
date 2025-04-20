'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { WalletProfile } from './wallet-profile';

export function Web3Login() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const connected = await connectWallet();
      
      if (connected && address) {
        // Create or update user in database
        const response = await fetch('/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
          body: JSON.stringify({ 
            walletAddress: address,
            displayName: null // You can add ENS lookup here if needed
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }

        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected && address) {
    return <WalletProfile />;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-purple-900/30 rounded-lg">
      <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
      <p className="text-purple-300 text-center">
        Connect your wallet to start creating and sharing memes on LOLand
      </p>
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </div>
  );
} 