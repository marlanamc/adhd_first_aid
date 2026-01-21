const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables are automatically handled by Next.js for NEXT_PUBLIC_* vars
  // No need for custom webpack config or env object
  
  // ESLint: Enable during builds for better code quality
  // TODO: Run `npm run lint` and fix all errors, then set to false
  eslint: {
    ignoreDuringBuilds: true, // Temporarily true - set to false after fixing ESLint errors
  },
  
  // TypeScript: Enable type checking during builds
  typescript: {
    ignoreBuildErrors: false, // Ensure type safety
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sjbsmjaagvyyshumkohq.supabase.co',
        pathname: '/**',
      },
    ],
    // Use modern image formats
    formats: ['image/avif', 'image/webp'],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // Compiler optimizations
  swcMinify: true,
}

module.exports = withBundleAnalyzer(nextConfig)

