import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { to: "/movies", label: "Movies", icon: "🎬" },
        { to: "/tv-shows", label: "TV Shows", icon: "📺" },
        { to: "/trending", label: "Trending", icon: "🔥" },
        { to: "/actors", label: "Actors", icon: "🎭" }
      ]
    },
    {
      title: "Account",
      links: [
        { to: "/watchlist", label: "Watchlist", icon: "📋" },
        { to: "/favorites", label: "Favorites", icon: "❤️" }
      ]
    },
    {
      title: "Legal",
      links: [
        { to: "/terms", label: "Terms of Service", icon: "📜" },
        { to: "/privacy", label: "Privacy Policy", icon: "🔒" },
        { to: "/FAQ", label: "FAQ", icon: "❓" },
        { to: "/cookies", label: "Cookies Policy", icon: "🍪" }
      ]
    }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#161616] to-black">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-[#82BC87]/10 rounded-full filter blur-[100px]" />
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 pt-16 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          {/* Logo and About Section */}
          <div className="space-y-6">
            <Link to="/" className="group flex items-center">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src="/logo.png" 
                alt="Playex" 
                className="h-12 transform transition-all duration-300" 
              />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent group-hover:from-[#E4D981] group-hover:to-[#82BC87] transition-all duration-500">
                Playex
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your premier destination for streaming movies and TV shows with an immersive experience.
            </p>
            <div className="pt-4 flex items-center gap-4">
              {[
                { icon: "github", url: "#" },
                { icon: "twitter", url: "#" },
                { icon: "discord", url: "#" }
              ].map((social) => (
                <motion.a
                  key={social.icon}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.url}
                  className="w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#82BC87]/50 transition-all duration-300"
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
            >
              <h3 className="text-[#E4D981] text-lg font-semibold mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li
                    key={link.to}
                    whileHover={{ x: 5 }}
                    className="transform transition-all duration-300"
                  >
                    <Link 
                      to={link.to}
                      className="flex items-center gap-2 text-gray-400 hover:text-white group"
                    >
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
            <p className="text-sm">
              © {currentYear} Playex. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#82BC87] animate-pulse" />
              <a 
                href="mailto:contact.playex@gmail.com"
                className="text-sm hover:text-[#82BC87] transition-colors duration-300"
              >
                contact.playex@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;