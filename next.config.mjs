/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "finessementality.com",
        pathname: "/cdn/**", // ✅ allow Shopify-style CDN path under main domain
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
        hostname: "nestorevintage.fr", // optional, from your earlier data
      },
    ],
  },
};

export default nextConfig;
