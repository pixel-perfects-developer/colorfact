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
        hostname: "www.sunspel.fr",
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
      {
        protocol: "https",
        hostname: "encore-atelier.com",
      },
      {
        protocol: "https",
        hostname: "media.street-one.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "circleessentials.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "danyberd.com",
      },
      {
        protocol: "https",
        hostname: "media.cecile.com",
      },
      {
        protocol: "https",
        hostname: "harshandcruel.com",
      },
      {
        protocol: "https",
        hostname: "izzdu.com",
      },
    ],
  },
  
  typedRoutes: true,

  async headers() {
    return [
       {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: 'upgrade-insecure-requests',
        },
      ],
    },
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