/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname:
          'grits-greenbeans-and-grandmothers.s3.us-east-005.backblazeb2.com',
      },
    ],
  },
};

export default nextConfig;
