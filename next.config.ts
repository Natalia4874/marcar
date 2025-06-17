import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['ru-msk-dr3-1.store.cloud.mts.ru', 'store.cloud.mts.ru'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ru-msk-dr3-1.store.cloud.mts.ru',
        pathname: '/store/images/items/**'
      }
    ]
  }
}

export default nextConfig
