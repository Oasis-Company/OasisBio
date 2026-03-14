/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 忽略 Node.js 内置模块，只在服务器端使用
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        module: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
