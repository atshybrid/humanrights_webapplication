/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile certain ESM packages to improve HMR/Fast Refresh handling in dev
  transpilePackages: ['react-simple-maps', 'd3', 'topojson-client'],
}

module.exports = nextConfig
