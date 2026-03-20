/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // blog.codewithdmai.com -> /blog
        {
          source: '/',
          has: [{ type: 'host', value: 'blog.codewithdmai.com' }],
          destination: '/blog',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'blog.codewithdmai.com' }],
          destination: '/blog/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
