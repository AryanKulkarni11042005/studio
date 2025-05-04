
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
   experimental: {
    serverActions: {
        allowedOrigins: ["localhost:9002", "YOUR_DEPLOYMENT_DOMAIN.TLD"] // Add your deployment domain if applicable
    }
  },
  // Add webpack configuration to handle Node.js specific modules
  webpack: (config, { isServer }) => {
    // Exclude 'async_hooks' from client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false, // Tells webpack to provide an empty module for this on the client
      };
    }

    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
