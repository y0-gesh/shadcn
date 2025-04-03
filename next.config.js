/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure asset prefix for static export in Electron
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/' : './',
  assetPrefix: '',
  // Configure images for static export
  images: {
    unoptimized: true,
  },
  // Ensure proper static file handling
  trailingSlash: true,
  // Specify output directory
  distDir: 'out',
  // Configure webpack for Electron
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }
    return config;
  }
}

module.exports = nextConfig
