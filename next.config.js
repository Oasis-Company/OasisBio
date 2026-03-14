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
        path: false,
        url: false,
        process: false,
      };
      
      // 忽略 @prisma/client 模块，只在服务器端使用
      config.externals = {
        ...config.externals,
        '@prisma/client': 'commonjs @prisma/client',
      };
      
      // 处理 server-only 包
      config.module.rules.push({
        test: /server-only/,
        use: {
          loader: 'null-loader',
        },
      });
      
      // 重定向所有 Prisma 相关的导入到空模块
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': false,
        '@/generated/prisma/client': false,
        '@/generated/prisma/internal/class': false,
      };
    }
    return config;
  },
  // 禁用字体优化，避免从 Google Fonts 加载
  optimizeFonts: false,
};

module.exports = nextConfig;
