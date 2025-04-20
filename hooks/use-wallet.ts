'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if MetaMask is available
  const isMetaMaskAvailable = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }, []);

  // Initialize provider on component mount
  useEffect(() => {
    const initProvider = async () => {
      if (isMetaMaskAvailable()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            setAddress(null);
            setSigner(null);
            setIsConnected(false);
            toast.info('Wallet disconnected');
          } else {
            // Account changed
            setAddress(accounts[0]);
            toast.info('Account changed');
            // Update signer with new account
            provider.getSigner().then(setSigner);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainIdHex: string) => {
          const newChainId = parseInt(chainIdHex, 16);
          setChainId(newChainId);
          toast.info(`Network changed to ${getNetworkName(newChainId)}`);
        });

        // Get current chain ID
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    };

    initProvider();

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [isMetaMaskAvailable]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskAvailable() && provider) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            const signer = provider.getSigner();
            setSigner(signer);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };
    
    checkConnection();
  }, [provider, isMetaMaskAvailable]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskAvailable()) {
      toast.error('MetaMask is not installed');
      return false;
    }

    if (!provider) {
      toast.error('Provider not initialized');
      return false;
    }

    try {
      setIsConnecting(true);
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Get the first account
      const account = accounts[0];
      setAddress(account);
      
      // Get signer
      const signer = provider.getSigner();
      setSigner(signer);
      
      setIsConnected(true);
      toast.success('Wallet connected');
      return true;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('User denied account access');
      } else {
        toast.error('Failed to connect wallet');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [provider, isMetaMaskAvailable]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setIsConnected(false);
    toast.info('Wallet disconnected');
  }, []);

  // Switch network function
  const switchNetwork = useCallback(async (networkId: number) => {
    if (!isMetaMaskAvailable() || !provider) {
      toast.error('MetaMask is not available');
      return false;
    }

    try {
      // Request network switch
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      // If the requested chain is not added, add it
      if (error.code === 4902) {
        try {
          const networkData = getNetworkData(networkId);
          if (!networkData) {
            toast.error('Unknown network');
            return false;
          }

          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkData],
          });
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add network');
          return false;
        }
      }
      console.error('Error switching network:', error);
      toast.error('Failed to switch network');
      return false;
    }
  }, [provider, isMetaMaskAvailable]);

  // Helper function to get network name from chain ID
  const getNetworkName = (id: number): string => {
    switch (id) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Mumbai Testnet';
      default:
        return `Chain ID ${id}`;
    }
  };

  // Helper function to get network data for adding new network
  const getNetworkData = (id: number) => {
    switch (id) {
      case 5:
        return {
          chainId: '0x5',
          chainName: 'Goerli Testnet',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://eth-goerli.public.blastapi.io'],
          blockExplorerUrls: ['https://goerli.etherscan.io'],
        };
      case 11155111:
        return {
          chainId: '0xaa36a7',
          chainName: 'Sepolia Testnet',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://eth-sepolia.public.blastapi.io'],
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        };
      case 80001:
        return {
          chainId: '0x13881',
          chainName: 'Mumbai Testnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com'],
        };
      default:
        return null;
    }
  };

  const getBalance = useCallback(async () => {
    if (!provider || !address) return null;
    try {
      const balance = await provider.getBalance(address);
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [provider, address]);

  return {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getNetworkName,
    isMetaMaskAvailable,
    getBalance
  };
} 