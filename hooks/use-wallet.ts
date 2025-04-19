'use client';

import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    watch: true,
  });

  const connectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    isBalanceLoading,
    balance: balanceData,
    disconnectWallet: disconnect,
    connectWallet,
  };
} 