/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: ESLint configuration moved to .eslintrc or eslint.config.js
  // Run 'npm run lint' before deploying to production
  typescript: {
    // Only ignore TypeScript errors during builds in development
    // In production, fix all TypeScript errors before deploying
    ignoreBuildErrors: process.env.NODE_ENV !== "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: false, // Enable image optimization for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
  compress: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  // Bundle optimization
  swcMinify: true, // Use SWC minifier (faster and smaller bundles)
  experimental: {
    optimizePackageImports: ['lucide-react', '@vercel/analytics'], // Tree-shake unused exports
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
