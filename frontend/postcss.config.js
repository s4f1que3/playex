module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          svgo: false, // Disable svgo to avoid parsing issues with SVG content
        }],
      },
    }),
  },
}
