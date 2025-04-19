/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty not found - use our mock implementation instead of disabling
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': path.resolve(__dirname, 'webpack-fixes.js'),
    };
    return config;
  },
  // Add static file serving configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/memes/**',
      },
    ],
  },
  // Configure static folders
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
      {
        source: '/memes/:path*',
        destination: '/memes/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 