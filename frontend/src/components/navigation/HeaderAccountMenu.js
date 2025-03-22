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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
      >
        {userProfile.avatar ? (
          <img
            src={userProfile.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#82BC87]/20 flex items-center justify-center">
            <span className="text-[#82BC87] font-medium">
              {(userProfile.username || 'G')[0].toUpperCase()}
            </span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-72 rounded-xl bg-gray-900/90 backdrop-blur-xl border border-white/5 shadow-2xl"
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/5">
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
                  <p className="text-sm text-gray-400">Local Profile</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                to="/watchlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#89A1B3]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span className="text-gray-200">Watchlist</span>
              </Link>

              <Link
                to="/favorites"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B38989]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-200">Favorites</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-200">Settings</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderAccountMenu;
