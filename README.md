# 🎮 LOLand - Web3 Meme Platform

<div align="center">

![LOLand Banner](https://via.placeholder.com/1200x300/4a2c8e/ffffff?text=LOLand+-+Web3+Meme+Platform)

[![Next.js](https://img.shields.io/badge/Next.js-13.0+-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web3](https://img.shields.io/badge/Web3-Powered-F16822?style=flat&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**LOLand is a decentralized meme platform that empowers creators to share, monetize, and mint their memes as NFTs.**

[Demo](https://loland.vercel.app) · [Report Bug](https://github.com/yourusername/loland/issues) · [Request Feature](https://github.com/yourusername/loland/issues)

</div>

---

## ✨ Features

- 🔐 **Web3 Authentication** - Secure login using Web3Auth with multiple social and wallet options
- 🖼️ **Meme Creation & Sharing** - Upload, share, and discover memes in a decentralized environment
- 🏆 **NFT Minting** - Turn your best memes into NFTs for collectors to purchase
- 💰 **Creator Economy** - Receive tips in cryptocurrency for your content
- 🤝 **Social Interactions** - Like, comment, follow, and engage with creators and their memes
- 📚 **Collections** - Organize memes into themed collections
- 👤 **Profile Management** - Customize your profile with bio, avatar, and social links
- 🔍 **Discovery** - Find trending memes and popular creators through algorithmic recommendations
- 📱 **Responsive Design** - Optimized for both desktop and mobile experiences
- 🌙 **Dark Mode** - Easy on the eyes with a beautiful dark theme

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td>
      <img src="https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
      <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind" />
      <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white" alt="Framer Motion" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Authentication</b></td>
    <td>
      <img src="https://img.shields.io/badge/Web3Auth-6851FF?style=flat&logo=ethereum&logoColor=white" alt="Web3Auth" />
      <img src="https://img.shields.io/badge/NextAuth.js-black?style=flat&logo=next.js&logoColor=white" alt="NextAuth.js" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Database</b></td>
    <td>
      <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
      <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Blockchain</b></td>
    <td>
      <img src="https://img.shields.io/badge/Ethers.js-3C3C3D?style=flat&logo=ethereum&logoColor=white" alt="Ethers.js" />
      <img src="https://img.shields.io/badge/Wagmi-black?style=flat&logo=ethereum&logoColor=white" alt="Wagmi" />
      <img src="https://img.shields.io/badge/RainbowKit-7B3FE4?style=flat&logo=ethereum&logoColor=white" alt="RainbowKit" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Storage</b></td>
    <td>
      <img src="https://img.shields.io/badge/IPFS-65C2CB?style=flat&logo=ipfs&logoColor=white" alt="IPFS" />
      <img src="https://img.shields.io/badge/Infura-FF6B4A?style=flat&logo=infura&logoColor=white" alt="Infura" />
    </td>
  </tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- PostgreSQL database
- Web3Auth account for client credentials
- Infura account for IPFS storage (optional)

### Installation

<details>
<summary>Click to expand installation steps</summary>

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/loland.git
   cd loland
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by copying the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

4. Update your `.env` file with your own values:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/loland_db"

   # Web3Auth Configuration
   WEB3AUTH_CLIENT_ID="YOUR_WEB3AUTH_CLIENT_ID"
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="YOUR_WEB3AUTH_CLIENT_ID"
   NEXT_PUBLIC_WEB3AUTH_NETWORK="testnet" # "mainnet" for production

   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"

   # IPFS Configuration
   NEXT_PUBLIC_IPFS_GATEWAY="https://ipfs.io/ipfs/"
   INFURA_IPFS_PROJECT_ID="YOUR_INFURA_IPFS_PROJECT_ID"
   INFURA_IPFS_PROJECT_SECRET="YOUR_INFURA_IPFS_PROJECT_SECRET"
   ```

5. Create and seed the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

</details>

## 📊 Database Schema

LOLand uses a PostgreSQL database with the following key models:

<details>
<summary>Click to view database schema</summary>

### Core Models

- **User** 
  - Stores user profiles, wallet addresses, and Web3Auth credentials
  - Manages social relationships and content ownership

- **Meme**
  - Contains meme content, metadata, and on-chain information if minted
  - Tracks views, likes, and monetization metrics

- **Collection**
  - Groups of memes created by users
  - Can be public or private

### Metadata Models

- **Tag & Category**
  - Organizational metadata for memes
  - Enables efficient content discovery

### Interaction Models

- **Like, Comment, Tip**
  - Social interactions and monetization
  - Records engagement metrics

- **Follow & Notification**
  - Social connections and activity alerts
  - Powers the user feed algorithm

### System Models

- **ContractEvent**
  - Tracks on-chain events related to the platform
  - Ensures blockchain synchronization

- **SystemConfig**
  - Platform-wide configuration settings
  - Manages feature flags and parameters

</details>

## 🔐 Authentication Flow

<details>
<summary>Click to view authentication details</summary>

1. **User Authentication**:
   - Users can sign in using Web3Auth with various social logins or their existing wallets
   - Upon successful authentication, user information is stored in the database

2. **Session Management**:
   - NextAuth.js handles session management and persistence
   - Sessions are linked to both Web3Auth credentials and wallet addresses

3. **Wallet Integration**:
   - After authentication, users can connect their wallets using RainbowKit
   - The connected wallet is associated with the user's account

</details>

## 💎 NFT Minting Process

<details>
<summary>Click to view NFT minting details</summary>

1. User uploads a meme to the platform
2. Meme is stored on IPFS to ensure decentralized persistence
3. User can initiate minting through the UI
4. Smart contract interaction creates an NFT on the blockchain
5. Meme is updated in the database with tokenId and contract address
6. Creator can set a price and collectors can purchase the NFT

</details>

## 📡 API Routes

<details>
<summary>Click to view API routes</summary>

| Endpoint | Description |
|----------|-------------|
| `/api/auth/*` | Authentication endpoints (handled by NextAuth.js) |
| `/api/users/*` | User profile management |
| `/api/memes/*` | Meme creation, retrieval, and management |
| `/api/collections/*` | Collection creation and management |
| `/api/social/*` | Social interactions (likes, comments, follows) |
| `/api/tips/*` | Cryptocurrency tipping functionality |
| `/api/nft/*` | NFT minting and marketplace functionality |

</details>

## 📱 Responsive Design

LOLand is fully responsive and optimized for all devices:

<div align="center">

| Desktop | Mobile |
|---------|--------|
| ![Desktop View](https://via.placeholder.com/500x300/4a2c8e/ffffff?text=Desktop+View) | ![Mobile View](https://via.placeholder.com/200x400/4a2c8e/ffffff?text=Mobile+View) |

</div>

## 🎨 Color Palette

<div align="center">
<img src="https://via.placeholder.com/800x100/4a2c8e/ffffff?text=Primary" alt="Primary" />
<img src="https://via.placeholder.com/800x100/c4a7e7/000000?text=Secondary" alt="Secondary" />
<img src="https://via.placeholder.com/800x100/eb6f92/ffffff?text=Accent" alt="Accent" />
<img src="https://via.placeholder.com/800x100/1f1d2e/ffffff?text=Background" alt="Background" />
</div>

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

<details>
<summary>Click to view contribution guidelines</summary>

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

</details>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

<div align="center">

Project Link: [https://github.com/yourusername/loland](https://github.com/yourusername/loland)

Join our community:

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/loland)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/lolandapp)

</div>

---

<div align="center">

### Made with ❤️ by LOLand Team

**Share a meme, earn a coin!**

<img src="https://via.placeholder.com/150x150/4a2c8e/ffffff?text=LOLand" alt="LOLand Logo" width="100" />

</div> 