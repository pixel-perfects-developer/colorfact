/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,  // Keep this as false
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "finessementality.com",
        pathname: "/cdn/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "api.madtech-group.com",
      },
      {
        protocol: "https",
        hostname: "ambvlce.com",
      },
      {
        protocol: "https",
        hostname: "nestorevintage.fr",
      },
      {
        protocol: "https",
        hostname: "colorfulstandard.com",
      },
    ],
  },
  
  typedRoutes: true,

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' 
          },
        ],
      },
    ];
  },
};

export default nextConfig;