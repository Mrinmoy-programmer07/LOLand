'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { User, Wallet } from 'lucide-react';

interface WalletConnectButtonProps {
  variant?: 'default' | 'mobile' | 'profile';
  onClick?: () => void;
}

export function WalletConnectButton({ variant = 'default', onClick }: WalletConnectButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <>
                    {variant === 'default' && (
                      <Button
                        onClick={openConnectModal}
                        className="hidden md:flex items-center space-x-2 rounded-full px-6 py-2 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <User className="h-5 w-5 mr-2" />
                        <span>Sign In</span>
                      </Button>
                    )}
                    {variant === 'mobile' && (
                      <Button
                        onClick={openConnectModal}
                        className="flex items-center justify-center space-x-2 rounded-xl px-4 py-6 mt-4 w-full transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
                      >
                        <Wallet className="h-5 w-5 mr-2" />
                        <span>Connect Wallet</span>
                      </Button>
                    )}
                    {variant === 'profile' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-all duration-300 transform hover:scale-105"
                        onClick={onClick || openConnectModal}
                      >
                        <User className="h-5 w-5 text-white" />
                        <span className="sr-only">Profile</span>
                      </Button>
                    )}
                  </>
                );
              }

              if (variant === 'profile') {
                return (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-all duration-300 transform hover:scale-105"
                    onClick={onClick || openAccountModal}
                  >
                    <User className="h-5 w-5 text-white" />
                    <span className="sr-only">Profile</span>
                  </Button>
                );
              }

              return (
                <div className="flex items-center">
                  <div className="flex items-center" onClick={openChainModal}>
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="h-4 w-4 mr-2 rounded-full"
                      />
                    )}
                    <Button
                      onClick={openAccountModal}
                      className={`hidden md:flex items-center space-x-2 rounded-full px-6 py-2 transition-all duration-300 transform hover:scale-105 bg-green-500 hover:bg-green-600`}
                    >
                      <User className="h-5 w-5 mr-2" />
                      <span>{account.displayName}</span>
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
} 