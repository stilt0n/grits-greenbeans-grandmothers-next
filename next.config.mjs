/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // TODO: remove this after switching to presigned URLs
      // for image uploads
      bodySizeLimit: '3mb',
    },
  },
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
