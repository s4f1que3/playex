// File: frontend/src/pages/FavoritesPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import AlertDialog from '../components/common/AlertDialog';
import { getFavorites, removeFromFavorites } from '../utils/LocalStorage';

const FavoritesPage = () => {
  const [mediaType, setMediaType] = useState('all');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, type: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '' });
  
  // Load favorites from localStorage
  useEffect(() => {
    setData(getFavorites());
    setIsLoading(false);
    
    // Add event listener to refresh data when localStorage changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'user_favorites') {
        setData(getFavorites());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Filter data based on selected media type
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    if (mediaType === 'all') {
      return data;
    }
    
    return data.filter(item => item.media_type === mediaType);
  }, [data, mediaType]);
  
  // Transform data for MediaGrid component
  const transformedData = React.useMemo(() => {
    return filteredData.map(item => ({
      id: item.media_id,
      media_type: item.media_type,
      ...item.details
    }));
  }, [filteredData]);
  
  // Remove item from favorites
  const handleRemoveItem = (mediaId, mediaType) => {
    removeFromFavorites(mediaId, mediaType);
    setData(getFavorites()); // Refresh data after removing an item
  };
  
  // Clear entire favorites list
  const clearFavorites = () => {
    setDialog({
      isOpen: true,
      type: 'clearAll',
      title: 'Clear All Favorites',
      message: 'Are you sure you want to clear your entire favorites list?',
      onConfirm: () => {
        localStorage.setItem('user_favorites', JSON.stringify([]));
        setData([]);
        setSelectedItems({});
        setDialog({ isOpen: false });
      }
    });
  };

  // Toggle item selection
  const toggleSelectItem = (mediaId, mediaType) => {
    const itemKey = `${mediaType}-${mediaId}`;
    setSelectedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  // Clear selected items
  const clearSelectedItems = () => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    
    if (selectedCount === 0) {
      setAlertDialog({
        isOpen: true,
        message: 'Please select at least one item to remove.'
      });
      return;
    }

    setDialog({
      isOpen: true,
      type: 'clearSelected',
      title: 'Remove Selected Items',
      message: `Are you sure you want to remove ${selectedCount} item(s) from your favorites?`,
      onConfirm: () => {
        const selectedKeys = Object.keys(selectedItems).filter(key => selectedItems[key]);
        const favorites = getFavorites();
        const newFavorites = favorites.filter(item => {
          const itemKey = `${item.media_type}-${item.media_id}`;
          return !selectedKeys.includes(itemKey);
        });
        
        localStorage.setItem('user_favorites', JSON.stringify(newFavorites));
        setData(getFavorites());
        setSelectedItems({});
        setSelectionMode(false);
        setDialog({ isOpen: false });
      }
    });
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedItems({});
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative -mx-4 mb-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[30vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5 animate-pulse transform rotate-45 scale-150" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
          </div>

          <div className="container relative mx-auto px-4 h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#E6C6BB]/10 border border-[#E6C6BB]/20 mb-6 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6C6BB] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E6C6BB]" />
                </span>
                <span className="text-[#E6C6BB] font-medium">My Collection</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Favorites
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E6C6BB] to-[#E4D981] ml-3">
                  ({transformedData.length})
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Content Section */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
        >
          {/* Enhanced Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex p-1 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                {[
                  { value: 'all', label: 'All Content' },
                  { value: 'movie', label: 'Movies' },
                  { value: 'tv', label: 'TV Shows' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setMediaType(value)}
                    className={`relative px-6 py-2 rounded-lg font-medium transition-all duration-500 ${
                      mediaType === value 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {mediaType === value && (
                      <motion.div
                        layoutId="mediaType"
                        className="absolute inset-0 bg-gradient-to-r from-[#E6C6BB] to-[#c7a99e] rounded-lg"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectionMode}
                className="px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/5 text-white hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {selectionMode ? 'Cancel' : 'Select Items'}
              </button>

              <button
                onClick={clearSelectedItems}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition duration-300"
              >
                Clear Selected
              </button>
            
              <button
                onClick={clearFavorites}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition duration-300"
              >
                Clear Favorites
              </button>
            </div>
          </div>

          {transformedData.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <div className="text-[#E6C6BB] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your favorites list is empty</h2>
              <p className="text-gray-400 mb-6">
                Add movies and TV shows to your favorites to save the ones you love.
              </p>
              <a href="/" className="btn-primary inline-block">
                Browse Content
              </a>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <MediaGrid 
                items={transformedData}
                selectionMode={selectionMode}
                onSelectItem={toggleSelectItem}
                onRemove={handleRemoveItem}
                selectedItems={selectedItems}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog({ isOpen: false })}
      />

      <AlertDialog
        isOpen={alertDialog.isOpen}
        title="No Items Selected"
        message={alertDialog.message}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />
    </div>
  );
};

export default FavoritesPage;