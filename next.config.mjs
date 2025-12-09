/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,       // ensures clean folder-based URLs
  images: {
    unoptimized: true,       // disable next/image optimization for static
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
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
