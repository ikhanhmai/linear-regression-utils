/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Allow loading from localhost in electron
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
