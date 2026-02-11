import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const providers = [
  { id: 8, name: 'Netflix', shortName: 'NF', color: '#E50914', gradient: 'from-red-600 to-red-700' },
  { id: 9, name: 'Prime Video', shortName: 'PV', color: '#00A8E1', gradient: 'from-blue-500 to-blue-600' },
  { id: 337, name: 'Disney+', shortName: 'D+', color: '#113CCF', gradient: 'from-blue-600 to-indigo-700' },
  { id: 350, name: 'Apple TV+', shortName: 'TV', color: '#000000', gradient: 'from-gray-800 to-black' },
  { id: 1899, name: 'HBO Max', shortName: 'HBO', color: '#5B2E82', gradient: 'from-purple-600 to-purple-800' },
  { id: 15, name: 'Hulu', shortName: 'HU', color: '#1CE783', gradient: 'from-green-500 to-emerald-600' },
  { id: 2303, name: 'Paramount+', shortName: 'P+', color: '#0064FF', gradient: 'from-blue-500 to-blue-700' },
  { id: 2616, name: 'Peacock', shortName: 'PC', color: '#000000', gradient: 'from-yellow-500 to-orange-500' },
];

const StreamingProviders = () => {
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const navigate = useNavigate();

  const handleProviderClick = (provider) => {
    navigate(`/provider/${provider.id}?name=${encodeURIComponent(provider.name)}`);
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0] 
          }} 
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-5"
        >
          <div className="absolute inset-0 bg-pattern-grid transform scale-150" />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px] rotate-3">
              <div className="w-full h-full rounded-xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-white">Browse by </span>
            <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Streaming Service
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Discover exclusive movies and TV shows from your favorite platforms
          </p>
        </motion.div>

        {/* Providers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-5">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative group"
            >
              <motion.button
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredProvider(provider.id)}
                onMouseLeave={() => setHoveredProvider(null)}
                onClick={() => handleProviderClick(provider)}
                className="w-full relative"
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-black border border-white/10 hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-xl group-hover:shadow-2xl group-hover:shadow-cyan-500/20">
                  
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${provider.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative p-6 flex flex-col items-center justify-center aspect-square">
                    {/* Provider Icon/Letter */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${provider.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <span className="text-white text-2xl font-bold tracking-tight">
                        {provider.shortName}
                      </span>
                    </div>
                    
                    {/* Provider Name */}
                    <h3 className="text-white font-bold text-sm md:text-base text-center leading-tight">
                      {provider.name}
                    </h3>
                    
                    {/* Subtitle on hover */}
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: hoveredProvider === provider.id ? 1 : 0,
                        height: hoveredProvider === provider.id ? 'auto' : 0
                      }}
                      className="text-gray-400 text-xs mt-2 text-center overflow-hidden"
                    >
                      Browse library
                    </motion.p>
                  </div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: hoveredProvider === provider.id ? '100%' : '-100%' }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-500 -z-10 ${
                    hoveredProvider === provider.id ? 'opacity-40' : 'opacity-0'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${provider.color}, #06b6d4)` }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-14"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-400 text-sm font-medium">
              Click any service to explore their content library
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreamingProviders;
