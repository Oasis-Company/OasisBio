/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  
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
      
      // 重定向所有 Prisma 和 Auth 相关的导入到客户端版本
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': false,
        '@/generated/prisma/client': false,
        '@/generated/prisma/internal/class': false,
        '@/generated/prisma/internal/prismaNamespace': false,
        '@/lib/prisma': '@/lib/prisma.client',
        '@/lib/auth': '@/lib/auth.client',
        // 重定向 node: 前缀的模块导入到空模块
        'node:child_process': false,
        'node:fs': false,
        'node:fs/promises': false,
        'node:module': false,
        'node:os': false,
      };
    }
    return config;
  },

};

module.exports = nextConfig;

// Note: Cloudflare/OpenNext initialization removed — deployment target is Vercel
// The @opennextjs/cloudflare package can be uninstalled when ready to clean up dependencies
