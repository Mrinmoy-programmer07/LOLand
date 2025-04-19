import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { uploadToIPFS } from '../../../lib/nftStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, image, walletAddress } = req.body;

    if (!title || !image || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload image to IPFS
    const imageUrl = await uploadToIPFS(image);

    // Create meme record
    const meme = await prisma.meme.create({
      data: {
        title,
        imageUrl,
        createdBy: walletAddress,
      },
    });

    return res.status(201).json(meme);
  } catch (error) {
    console.error('Error uploading meme:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 