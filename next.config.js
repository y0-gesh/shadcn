const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? "/" : '',  // Ensure it starts with a leading /
  basePath: isProd ? '' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'out',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }
    return config;
  }
};

module.exports = nextConfig;
