import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Industrial B2B: assume factory / mobile networks. Keep the payload lean.
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default config
