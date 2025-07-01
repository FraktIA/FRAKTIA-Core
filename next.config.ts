import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/**",
      },
    ],
    // Add these for better Chrome compatibility
    // formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Add headers for better browser compatibility
  // async headers() {
  //   return [
  //     {
  //       source: '/icons/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=3600, immutable',
  //         },
  //         {
  //           key: 'Content-Type',
  //           value: 'image/svg+xml',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/images/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=3600, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
