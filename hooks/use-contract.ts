'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './use-wallet';
import NFTContractABI from '@/contracts/NFTContract.json';
import { toast } from 'sonner';
import { NFT_CONTRACT_ADDRESS } from '@/lib/contracts';

// Use environment variable or fallback to the address from contracts.ts file
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || NFT_CONTRACT_ADDRESS;

export interface NFT {
  id: string;
  tokenURI: string;
  owner: string;
}

export const useNFTContract = () => {
  const { provider, signer, address, isConnected } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize contract when provider/signer changes
  useEffect(() => {
    if (!provider) return;

    try {
      // Read-only contract with provider
      const readContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTContractABI,
        provider
      );
      
      // Writable contract with signer if available
      const contractWithSigner = signer 
        ? readContract.connect(signer) 
        : readContract;
      
      setContract(contractWithSigner);
    } catch (error) {
      console.error("Error initializing contract:", error);
      toast.error("Failed to initialize NFT contract");
    }
  }, [provider, signer]);

  // Get total supply when contract is ready
  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (!contract || !contract.provider) return;
      
      try {
        // Instead of using the contract method directly, make a low-level call to handle empty responses
        const provider = contract.provider;
        
        // Create the calldata for totalSupply() function: 0x18160ddd
        const totalSupplyFunction = "0x18160ddd";
        
        // Make a direct call to the contract
        const result = await provider.call({
          to: CONTRACT_ADDRESS,
          data: totalSupplyFunction
        });
        
        // If we got a valid result (not empty)
        if (result && result !== "0x") {
          // Parse the result (uint256)
          const supply = ethers.toBigInt(result);
          setTotalSupply(Number(supply));
        } else {
          // Handle empty result
          console.log("Contract doesn't return data for totalSupply, using default value");
          setTotalSupply(0);
        }
      } catch (error) {
        console.error("Error fetching total supply:", error);
        // Set a default value if the contract doesn't support totalSupply
        setTotalSupply(0);
      }
    };

    fetchTotalSupply();
  }, [contract]);

  // Fetch owned NFTs when address or contract changes
  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!contract || !address || !isConnected || !contract.provider) {
        setOwnedNFTs([]);
        return;
      }

      setIsLoading(true);
      
      try {
        // Use low-level call for balanceOf to avoid decoding errors
        const provider = contract.provider;
        // Function signature for balanceOf(address)
        const balanceOfFunction = "0x70a08231" + address.slice(2).padStart(64, '0');
        
        let balanceHex;
        try {
          balanceHex = await provider.call({
            to: CONTRACT_ADDRESS,
            data: balanceOfFunction
          });
          
          // If empty result, user has no NFTs
          if (!balanceHex || balanceHex === "0x") {
            setOwnedNFTs([]);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error using low-level balanceOf call:", error);
          setOwnedNFTs([]);
          setIsLoading(false);
          return;
        }
        
        // Parse the balance from hex
        const balance = balanceHex !== "0x" ? Number(ethers.toBigInt(balanceHex)) : 0;
        
        if (balance === 0) {
          setOwnedNFTs([]);
          setIsLoading(false);
          return;
        }
        
        const nfts: NFT[] = [];

        // Loop through each owned NFT by index
        for (let i = 0; i < balance; i++) {
          try {
            // Function signature for tokenOfOwnerByIndex(address,uint256)
            const tokenByIndexFunction = "0x2f745c59" + 
              address.slice(2).padStart(64, '0') + 
              i.toString(16).padStart(64, '0');
            
            let tokenIdHex;
            try {
              tokenIdHex = await provider.call({
                to: CONTRACT_ADDRESS,
                data: tokenByIndexFunction
              });
              
              if (!tokenIdHex || tokenIdHex === "0x") {
                continue;
              }
            } catch (indexError) {
              console.error(`Error using low-level tokenOfOwnerByIndex for index ${i}:`, indexError);
              break;
            }
            
            const tokenId = tokenIdHex !== "0x" ? ethers.toBigInt(tokenIdHex).toString() : '';
            
            if (!tokenId) continue;
            
            // Try to get token URI
            let tokenURI = '';
            try {
              tokenURI = await contract.tokenURI(tokenId);
            } catch (uriError) {
              console.error(`Error fetching URI for token ${tokenId}:`, uriError);
            }
            
            nfts.push({
              id: tokenId,
              tokenURI,
              owner: address,
            });
          } catch (error) {
            console.error(`Error fetching NFT at index ${i}:`, error);
          }
        }

        setOwnedNFTs(nfts);
      } catch (error) {
        console.error("Error fetching owned NFTs:", error);
        setOwnedNFTs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, [contract, address, isConnected]);

  // Mint a new NFT
  const mintNFT = async (tokenURI: string) => {
    if (!contract || !signer || !address) {
      toast.error("Wallet not connected");
      return null;
    }

    setIsLoading(true);
    
    try {
      const tx = await contract.mintTo(address, tokenURI);
      toast.info("Minting NFT...");
      
      const receipt = await tx.wait();
      
      // Find the NFTMinted event
      const event = receipt.events?.find(
        (e: any) => e.event === "TokensMinted"
      );
      
      if (event) {
        const tokenId = event.args.tokenIdMinted.toString();
        toast.success("NFT minted successfully!");
        
        // Refresh owned NFTs
        const newNFT: NFT = {
          id: tokenId,
          tokenURI,
          owner: address,
        };
        
        setOwnedNFTs((prev) => [...prev, newNFT]);
        setTotalSupply((prev) => prev + 1);
        
        return tokenId;
      }
      
      toast.success("NFT minted successfully!");
      return null;
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      
      // Handle user rejected transaction
      if (error.code === 4001) {
        toast.error("Transaction rejected");
      } else if (error.reason) {
        toast.error(`Minting failed: ${error.reason}`);
      } else {
        toast.error("Failed to mint NFT");
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    ownedNFTs,
    totalSupply,
    isLoading,
    mintNFT,
  };
}; 