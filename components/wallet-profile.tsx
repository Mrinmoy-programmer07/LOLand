'use client';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Wallet, ExternalLink } from 'lucide-react';
import { formatEther } from 'viem';

export function WalletProfile() {
  const { 
    address, 
    isConnected, 
    disconnectWallet,
    getBalance 
  } = useWallet();

  if (!isConnected || !address) {
    return null;
  }

  // Format the address for display
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  // Get ETH balance formatted to 4 decimal places
  const walletBalance = getBalance();
  const ethBalance = walletBalance ? Number(formatEther(walletBalance)).toFixed(4) : '0.0000';

  return (
    <div className="p-4 bg-purple-800/30 rounded-lg space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-pink-500/50">
          <AvatarFallback className="bg-purple-700">{address.slice(2, 4)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <span className="font-medium text-white">{shortAddress}</span>
            <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-1 rounded">✓ Connected</span>
          </div>
          <div className="flex items-center text-sm text-purple-300">
            <Wallet className="h-3 w-3 mr-1" />
            <span>{ethBalance} ETH</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs border-purple-500 text-white hover:bg-purple-800/30"
          onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View on Etherscan
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs border-purple-500 text-white hover:bg-purple-800/30"
          onClick={() => disconnectWallet()}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
} 