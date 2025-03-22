import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { getUserProfile, updateUserProfile, clearUserData } from '../utils/userProfile';

const SettingsCard = ({ icon, title, subtitle, children }) => (
  <motion.div
    layout
    className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden"
  >
    <div className="p-6 border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const SettingsPage = () => {
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [pendingUsername, setPendingUsername] = useState(userProfile.username);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleUsernameChange = (e) => {
    setPendingUsername(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = useCallback(() => {
    const updates = {};
    
    if (pendingUsername !== userProfile.username) {
      updates.username = pendingUsername.trim() || 'Guest User';
    }
    
    if (pendingAvatar) {
      updates.avatar = pendingAvatar;
    }

    if (Object.keys(updates).length > 0) {
      const newProfile = updateUserProfile(updates);
      setUserProfile(newProfile);
      setPendingAvatar(null);
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  }, [pendingUsername, pendingAvatar, userProfile.username]);

  const handleClearData = () => {
    clearUserData();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#161616]">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[40vh] overflow-hidden">
        <motion.div
          animate={{ y: -20 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url("data:image/svg+xml,...)"', // Add a subtle pattern
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161616]/0 via-[#161616]/80 to-[#161616]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981]">
                Profile Settings
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Customize your Playex experience</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 pb-20">
        <LayoutGroup>
          <motion.div className="max-w-2xl mx-auto space-y-8">
            {/* Success Message */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#82BC87]/20 border border-[#82BC87]/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-[#82BC87] flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    <span className="text-[#82BC87] font-medium">Changes saved successfully!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Section */}
            <SettingsCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
              title="Profile"
              subtitle="Manage your personal information"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-4">Profile Picture</label>
                <div className="flex items-center gap-6">
                  {(pendingAvatar || userProfile.avatar) ? (
                    <img
                      src={pendingAvatar || userProfile.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-[#82BC87]/20 flex items-center justify-center">
                      <span className="text-[#82BC87] text-3xl font-medium">
                        {(pendingUsername || 'G')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 rounded-lg bg-[#82BC87]/10 text-[#82BC87] hover:bg-[#82BC87]/20 transition-all duration-300"
                    >
                      Choose Image
                    </button>
                    {pendingAvatar && (
                      <button
                        onClick={() => setPendingAvatar(null)}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={pendingUsername}
                  onChange={handleUsernameChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 text-white focus:border-[#82BC87]/50 focus:ring-1 focus:ring-[#82BC87]/50 transition-all duration-300"
                  placeholder="Enter username"
                />
              </div>

              {(pendingUsername !== userProfile.username || pendingAvatar) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <button
                    onClick={handleSaveChanges}
                    className="w-full px-4 py-3 rounded-xl bg-[#82BC87] hover:bg-[#6da972] text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </button>
                </motion.div>
              )}
            </SettingsCard>
            {/* Data Management Section */}
            <SettingsCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
              title="Data Management"
              subtitle="Manage your local data and preferences"
            >
              <div className="p-6">
                <button
                  onClick={() => setShowClearDataModal(true)}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-300"
                >
                  Clear All Local Data
                </button>
              </div>
            </SettingsCard>
          </motion.div>
        </LayoutGroup>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {showClearDataModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Clear All Data?</h3>
              <p className="text-gray-400 mb-6">
                This will permanently delete all your local data, including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Watchlist items</li>
                  <li>Favorite movies and shows</li>
                  <li>Watch history and progress</li>
                  <li>Continue watching list</li>
                  <li>Profile settings</li>
                </ul>
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowClearDataModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-all duration-300"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
