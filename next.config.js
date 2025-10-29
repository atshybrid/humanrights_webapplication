/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization domains
  images: {
    domains: [
      'app.hrcitodaynews.in',
      'app.humanrightscouncilforindia.org',
      'cdn.jsdelivr.net',
      // Add other image domains as needed
    ],
  },
  
  // Transpile packages for better dev experience
  transpilePackages: ['react-simple-maps', 'd3', 'topojson-client'],
  
  // Compression
  compress: true,
  
  // Performance optimizations (removed optimizeCss to avoid critters dependency issue)
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // Security headers
  async headers() {
    return [
      // Allow embedding only for our PDF API so the iframe viewer works
      {
        source: '/api/pdf/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      // Add redirects as needed
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ]
  }
}

module.exports = nextConfig
