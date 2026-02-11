export const commonStyles = {
  card: `
    group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 
    backdrop-blur-sm border border-white/5 shadow-xl transition-all duration-300
  `,
  focusRing: `
    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 
    focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
  `,
  container: `container mx-auto px-4`,
  heading: `text-2xl font-bold text-white mb-4`,
  subheading: `text-lg text-gray-400 mb-6`,
  button: `
    px-4 py-2 rounded-lg font-medium transition-all duration-300 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `,
  buttonPrimary: `
    bg-gradient-to-r from-cyan-500 to-blue-600 text-white
    hover:shadow-lg hover:shadow-cyan-500/20
  `,
  buttonSecondary: `
    bg-white/5 text-white hover:bg-white/10 border border-white/10
  `,
  input: `
    w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500
    transition-all duration-300
  `
};
