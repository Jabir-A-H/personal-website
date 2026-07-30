import type {NextConfig} from 'next';

const basePath = process.env.BASE_PATH?.trim() || '';

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  transpilePackages: ['motion'],

};

export default nextConfig;
