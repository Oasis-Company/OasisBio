/** @type {import('next').NextConfig} */
const webpackNodeExternals = require('webpack-node-externals');

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
      
      // 处理 node: 前缀的模块
      config.plugins.push(
        new (require('webpack').NormalModuleReplacementPlugin)(
          /^node:/,
          (resource) => {
            const mod = resource.request.replace(/^node:/, '');
            switch (mod) {
              case 'child_process':
              case 'fs':
              case 'fs/promises':
              case 'module':
              case 'os':
              case 'path':
              case 'process':
              case 'url':
                resource.request = false;
                break;
              default:
                resource.request = mod;
            }
          }
        )
      );
    } else {
      // 服务器端构建时使用 webpack-node-externals
      config.externals = [
        webpackNodeExternals({
          allowlist: [/^next-auth/],
        }),
        ...config.externals,
      ];
    }
    return config;
  },
  // 禁用字体优化，避免从 Google Fonts 加载
  optimizeFonts: false,
};

module.exports = nextConfig;
