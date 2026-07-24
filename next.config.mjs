/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    serverActions: {
      // Media (images/video/resume PDFs) is uploaded straight through server actions.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
