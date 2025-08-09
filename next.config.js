/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Allow builds to proceed even if there are ESLint errors during content work
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable experimental features for better environment variable support
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Add Supabase domain to allowed image sources
  images: {
    domains: ['sjbsmjaagvyyshumkohq.supabase.co'],
  },
  // Webpack configuration for better environment variable handling
  webpack: (config, { isServer }) => {
    // Add environment variables to DefinePlugin
    config.plugins.forEach((plugin) => {
      if (plugin.constructor.name === 'DefinePlugin') {
        Object.assign(plugin.definitions, {
          'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
          'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        });
      }
    });
    return config;
  },
}

module.exports = nextConfig

