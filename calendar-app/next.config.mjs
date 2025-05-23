/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/events/:path*',
        destination: 'http://localhost:5000/api/events/:path*',
      },
    ];
  },
};

export default nextConfig;