# Wallet Connection Setup

This project uses RainbowKit and wagmi for wallet connections. The integration allows users to connect their Ethereum wallets (MetaMask, WalletConnect, Coinbase Wallet, etc.) to interact with the NFT marketplace features.

## Setup Steps

1. The necessary packages have already been added to the project:
   - `@rainbow-me/rainbowkit`
   - `wagmi`
   - `viem`
   - `@tanstack/react-query`

2. Get a WalletConnect Project ID:
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up and create a new project
   - Copy your Project ID
   - Replace `7fdef79c28f06b874fcdf2a9a754df96` in `lib/wagmi.ts` with your actual Project ID

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Implementation Details

The wallet integration consists of:

1. **Web3Provider**: A provider component that wraps the app with RainbowKit and wagmi providers
2. **useWallet hook**: A custom hook that provides wallet connection state and functions
3. **WalletProfile component**: A UI component that displays wallet information when connected
4. **Integration in Header**: Wallet connection buttons in the main navigation
5. **Integration in NFT Cards**: Purchase actions that check for wallet connection

## Testing

1. Click the "Sign In" button in the header
2. Connect with your preferred wallet (MetaMask recommended for testing)
3. Your wallet address should appear in the header
4. Click on your address to see your balance and other wallet details
5. Try interacting with NFT purchase functions in the marketplace

## Troubleshooting

If you encounter connection issues:
- Make sure you have MetaMask or another compatible wallet installed
- Verify the correct WalletConnect Project ID is set in `lib/wagmi.ts`
- Check the browser console for any errors
- Try reconnecting your wallet

## Chains Supported

The current configuration supports:
- Mainnet
- Sepolia (Testnet)
- Local development chain (for testing) 