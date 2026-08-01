/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
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
