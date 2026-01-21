import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PrefetchLink from '../components/common/PrefetchLink';
import ContactLink from '../components/common/ContactLink';

const FooterSection = ({ title, links, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium section header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          className="h-px flex-1 bg-gradient-to-r from-[#82BC87]/20 to-transparent"
        />
        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {title}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-l from-[#82BC87]/20 to-transparent" />
      </div>

      {/* Enhanced navigation links */}
      <div className="space-y-3">
        {links.map((link, idx) => (
          <motion.div
            key={link.to}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + (idx * 0.1) }}
          >
            <PrefetchLink
              to={link.to}
              className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300"
            >
              <motion.span
                className="relative w-6 h-6 flex items-center justify-center"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {link.icon}
              </motion.span>
              <span className="relative overflow-hidden group-hover:pl-2 transition-all duration-300">
                {link.label}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#82BC87] to-[#E4D981]"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </span>
            </PrefetchLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Enhanced footer sections with icons
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { to: "/movies", label: "Movies", icon: "🎬" },
        { to: "/tv-shows", label: "TV Shows", icon: "📺" },
        { to: "/trending", label: "Trending", icon: "🔥" },
        { to: "/fan-favorites", label: "Fan Favorites", icon: "⭐" },
        { to: "/AdBlockers", label: "Ad Blockers", icon: "🚫" }

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
    <footer className="relative">
      {/* Premium geometric background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-[0.02]" />
        
        {/* Enhanced gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 left-1/4 w-96 h-96 bg-[#82BC87]/10 rounded-full filter blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 right-1/4 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[100px]"
        />
      </div>

      {/* Main footer content */}
      <div className="relative container mx-auto px-4 pt-20 pb-8">
        {/* Premium top section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-2xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/5">
            <div className="flex items-center gap-6">
              <motion.img
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1, type: "spring" }}
                src="/logo.png"
                alt="Playex"
                className="h-16 w-16"
              />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to start watching?</h2>
                <p className="text-gray-400">Discover your next favorite show with Playex</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/movies"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white font-medium hover:from-[#75b07a] hover:to-[#619665] transition-all duration-300 shadow-lg hover:shadow-[#82BC87]/25"
              >
                <span>Start Watching</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <PrefetchLink to="/" className="group flex items-center">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src="/logo.png" 
                alt="Playex" 
                className="h-12 transform transition-all duration-300" 
              />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent group-hover:from-[#E4D981] group-hover:to-[#82BC87] transition-all duration-500">
                Playex
              </span>
            </PrefetchLink>
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
          </motion.div>

          {/* Navigation sections */}
          {footerSections.map((section, idx) => (
            <FooterSection
              key={section.title}
              {...section}
              delay={0.1 * (idx + 1)}
            />
          ))}
        </div>

        {/* Enhanced footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                © {currentYear} Playex. All rights reserved.
              </span>
              <div className="h-4 w-px bg-gradient-to-b from-[#82BC87]/20 to-transparent" />
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] cursor-pointer"
              >
                Terms & Privacy
              </motion.span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
             <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                <p>Created by <a href="https://www.linkedin.com/company/safique-solutions" target="_blank" rel="noreferrer" className="text-[#82BC87] hover:text-[#E4D981]">NOVA</a></p>
              </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#82BC87]" />
                </span>
                <ContactLink className="hover:text-[#82BC8i7] transition-colors duration-300">
                  contact.playex@gmail.com
                </ContactLink>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;