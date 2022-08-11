/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["logo.clearbit.com"],
  },
};

module.exports = nextConfig;
