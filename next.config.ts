import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://kuqyxgjizzysthhyfoep.supabase.co/**')]
  },
};

export default nextConfig;
