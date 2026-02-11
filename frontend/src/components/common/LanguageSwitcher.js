import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';
import i18n from '../../i18n';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', tmdbLang: 'en-US' },
  { code: 'es', name: 'Español', flag: '🇪🇸', tmdbLang: 'es-ES' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', tmdbLang: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', tmdbLang: 'de-DE' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', tmdbLang: 'pt-BR' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', tmdbLang: 'it-IT' },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const changeLanguage = (langCode) => {
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
      // Store TMDB language in localStorage
      localStorage.setItem('tmdbLanguage', selectedLang.tmdbLang);
      // Change i18n language
      i18n.changeLanguage(langCode);
      // Reload the page to apply changes to all TMDB API calls
      window.location.reload();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Language Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-sm"
        aria-label="Select Language"
      >
        <GlobeAltIcon className="w-5 h-5 text-cyan-500" />
        <span className="flex items-center space-x-2 text-white text-sm font-medium">
          <span className="text-lg">{currentLanguage.flag}</span>
          <span>{currentLanguage.code.toUpperCase()}</span>
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 bottom-full mb-2 w-56 bg-[#1a1a1a]/95 backdrop-blur-md rounded-xl shadow-2xl border border-cyan-500/20 overflow-hidden z-[9999]"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent uppercase tracking-wide">
                  Select Language
                </div>
                
                {languages.map((language) => {
                  const isSelected = currentLang === language.code;
                  
                  return (
                    <button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </div>
                      
                      {isSelected && (
                        <CheckIcon className="w-5 h-5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
