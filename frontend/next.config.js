const JavaScriptObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'],
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    SITE_URL: process.env.SITE_URL || 'https://playex.vercel.app',
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enhanced chunk naming strategy
      config.output = {
        ...config.output,
        filename: '[name].[contenthash].js',
        chunkFilename: '[id].[chunkhash].js',
        assetModuleFilename: 'assets/[hash][ext][query]',
        uniqueName: 'playex'
      };

      // Improved optimization settings
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        runtimeChunk: {
          name: 'runtime'
        },
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            defaultVendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `lib.${packageName.replace('@', '').replace('/', '.')}`;
              }
            }
          }
        },
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
              },
              mangle: {
                reserved: [],
                toplevel: true,
                safari10: true
              },
              format: {
                comments: false
              }
            },
            extractComments: false
          })
        ]
      };

      // Obfuscation configuration
      config.plugins.push(
        new JavaScriptObfuscator({
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          numbersToExpressions: true,
          simplify: true,
          stringArrayShuffle: true,
          splitStrings: true,
          stringArrayThreshold: 1,
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['rc4'],
          stringArrayIndexShift: true,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 1,
          debugProtection: true,
          debugProtectionInterval: true,
          renameGlobals: true,
          selfDefending: true,
          numberToString: true,
          identifierNamesGenerator: 'hexadecimal',
          disableConsoleOutput: true,
          transformObjectKeys: true,
          unicodeEscapeSequence: true
        })
      );
    }
    return config;
  }
};

module.exports = nextConfig;