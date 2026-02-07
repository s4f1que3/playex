// Webpack Bundle Analyzer Configuration (optional)
// Add this to check bundle size and optimize imports

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    plugins: {
      add: [
        // Only run analyzer when ANALYZE=true
        process.env.ANALYZE && new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false,
        }),
      ].filter(Boolean),
    },
    configure: (webpackConfig) => {
      // Optimize production build
      if (process.env.NODE_ENV === 'production') {
        // Split chunks for better caching
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Vendor chunk for node_modules
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
                reuseExistingChunk: true,
              },
              // React/ReactDOM in separate chunk
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                priority: 20,
                reuseExistingChunk: true,
              },
              // Framer Motion in separate chunk (it's large)
              motion: {
                test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                name: 'framer-motion',
                priority: 15,
                reuseExistingChunk: true,
              },
              // Axios & API libs
              api: {
                test: /[\\/]node_modules[\\/](axios|@tanstack)[\\/]/,
                name: 'api-libs',
                priority: 15,
                reuseExistingChunk: true,
              },
              // Common chunks used across routes
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
          // Runtime chunk for webpack runtime code
          runtimeChunk: 'single',
          // Minimize and mangle
          minimize: true,
        };

        // Tree shaking - mark side effects
        webpackConfig.module.rules.push({
          test: /\.js$/,
          sideEffects: false,
        });
      }

      return webpackConfig;
    },
  },
};
