import { NFTStorage, File } from 'nft.storage';

const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY! });

export async function uploadToIPFS(file: File) {
  try {
    const metadata = await client.store({
      name: file.name,
      description: 'LOLand meme',
      image: file,
    });

    return metadata.url;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
} 