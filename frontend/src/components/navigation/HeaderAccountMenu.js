import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile } from '../../utils/userProfile';

const HeaderAccountMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add effect to listen for profile updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'playex_user_profile') {
        setUserProfile(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check for updates every second (for same-window updates)
    const interval = setInterval(() => {
      const currentProfile = getUserProfile();
      if (JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
        setUserProfile(currentProfile);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userProfile]);

  // Add hover functionality
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: 'continue-watching',
      title: 'Continue Watching',
      subtitle: 'Resume where you left off',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/continue-watching'
    },
    {
      id: 'watchlist',
      title: 'My Watchlist',
      subtitle: 'Saved for later',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#89A1B3]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
      path: '/watchlist'
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      subtitle: 'Your loved content',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B38989]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      ),
      path: '/favorites'
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Manage your profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" />
        </svg>
      ),
      path: '/settings'
    }
  ];

  return (
    <div 
      className="relative" 
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group overflow-hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 
                   transition-all duration-700 border border-white/10 hover:border-[#82BC87]/30 
                   hover:shadow-lg hover:shadow-[#82BC87]/20"
      >
        <div className="relative z-10">
          {userProfile.avatar ? (
            <motion.img
              src={userProfile.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover"
              layoutId="profileImage"
            />
          ) : (
            <motion.div
              layoutId="profileAvatar"
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#82BC87]/20 to-[#E4D981]/20 
                         flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-[#82BC87] font-medium">
                {(userProfile.username || 'G')[0].toUpperCase()}
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Enhanced Hover Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at center, rgba(130,188,135,0.15) 0%, transparent 70%)',
            transform: 'scale(1.5)'
          }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-4 w-80 rounded-2xl overflow-hidden"
          >
            {/* Glassmorphism Container */}
            <div className="bg-gray-900/90 backdrop-blur-xl border border-white/5 shadow-2xl">
              {/* Profile Section */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt="Profile"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#82BC87]/20 flex items-center justify-center">
                      <span className="text-[#82BC87] text-lg font-medium">
                        {(userProfile.username || 'G')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-medium">
                      {userProfile.username || 'Guest User'}
                    </h3>
                    <p className="text-sm text-gray-400">Your Profile</p>
                  </div>
                </div>
              </motion.div>

              {/* Menu Items */}
              <div className="p-3">
                <AnimatePresence>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className="group relative flex items-center gap-4 p-3 rounded-xl 
                                 transition-all duration-500 hover:bg-white/5 overflow-hidden"
                        onClick={() => setIsOpen(false)}
                      >
                        {/* Enhanced Navigation Item Background Effect */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                          style={{
                            background: 'radial-gradient(circle at center, rgba(130,188,135,0.1) 0%, transparent 70%)',
                            transform: 'scale(1.5)'
                          }}
                        />

                        {/* Icon Container with Enhanced Hover */}
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center 
                                    transition-all duration-500 group-hover:bg-gradient-to-br 
                                    from-[#82BC87]/20 to-[#E4D981]/20"
                          >
                            {item.icon}
                          </motion.div>
                          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                                      transition-all duration-500 blur-xl bg-gradient-to-br 
                                      from-[#82BC87]/10 to-[#E4D981]/10" />
                        </div>

                        {/* Text Content with Enhanced Hover */}
                        <div className="flex-1 relative z-10">
                          <span className="block text-gray-200 font-medium transition-all duration-500 
                                       group-hover:text-white group-hover:translate-x-1">
                            {item.title}
                          </span>
                          <span className="text-sm text-gray-500 transition-all duration-500 
                                       group-hover:text-gray-400 group-hover:translate-x-1">
                            {item.subtitle}
                          </span>
                        </div>

                        {/* Enhanced Arrow Animation */}
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 transition-all duration-500 
                                   group-hover:text-white group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderAccountMenu;
