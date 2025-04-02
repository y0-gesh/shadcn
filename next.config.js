/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're running in Electron
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig 