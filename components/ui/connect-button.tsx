"use client";

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from './button';
import { Wallet } from 'lucide-react';

interface ConnectButtonProps {
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export function ConnectButton({ label = "Connect Wallet", variant = "default" }: ConnectButtonProps) {
  return (
    <RainbowConnectButton.Custom>
      {({ 
        account, 
        chain, 
        openAccountModal, 
        openChainModal, 
        openConnectModal, 
        mounted 
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

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
                  <Button
                    onClick={openConnectModal}
                    variant={variant}
                    className="flex items-center space-x-2"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    <span>{label}</span>
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
} 