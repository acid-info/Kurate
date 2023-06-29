/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      //Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      //Probably there's a better way to handle this
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
