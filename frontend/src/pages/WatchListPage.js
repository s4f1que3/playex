// File: frontend/src/pages/WatchlistPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';  
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { getWatchlist, removeFromWatchlist } from '../utils/LocalStorage';
import PrefetchLink from '../components/common/PrefetchLink';
import AlertDialog from '../components/common/AlertDialog';
import { Link } from 'react-router-dom'; 

const WatchlistPage = () => {
  const [mediaType, setMediaType] = useState('all');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, type: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '' });
  
  // Load watchlist from localStorage
  useEffect(() => {
    setData(getWatchlist());
    setIsLoading(false);
    
    // Add event listener to refresh data when localStorage changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'user_watchlist') {
        setData(getWatchlist());
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
  
  // Remove item from watchlist
  const handleRemoveItem = (mediaId, mediaType) => {
    removeFromWatchlist(mediaId, mediaType);
    setData(getWatchlist()); // Refresh data after removing an item
  };

  // Clear entire watchlist
  const clearWatchlist = () => {
    setDialog({
      isOpen: true,
      type: 'clearAll',
      title: 'Clear Entire Watchlist',
      message: 'Are you sure you want to clear your entire watchlist?',
      onConfirm: () => {
        localStorage.setItem('user_watchlist', JSON.stringify([]));
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
      message: `Are you sure you want to remove ${selectedCount} item(s) from your watchlist?`,
      onConfirm: () => {
        const selectedKeys = Object.keys(selectedItems).filter(key => selectedItems[key]);
        const watchlist = getWatchlist();
        const newWatchlist = watchlist.filter(item => {
          const itemKey = `${item.media_type}-${item.media_id}`;
          return !selectedKeys.includes(itemKey);
        });
        
        localStorage.setItem('user_watchlist', JSON.stringify(newWatchlist));
        setData(getWatchlist());
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
    <div className="-mt-[72px]">
      {/* Breadcrumbs - Add this section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <PrefetchLink to="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </PrefetchLink>
          <span className="text-gray-600">/</span>
          <span className="text-white">Watchlist</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative -mx-4 mb-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-pattern-grid opacity-5 animate-pulse transform rotate-45 scale-150" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
          </div>

          <div className="container relative mx-auto px-4 h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                </span>
                <span className="text-[#82BC87] font-medium">My Collection</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                My Watchlist
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                  ({transformedData.length})
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Keep track of movies and TV shows you want to watch later.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Media Type Filter */}
            <div className="inline-flex p-1 bg-gray-800/50 backdrop-blur-sm rounded-xl">
              {[
                { value: 'all', label: 'All' },
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
                      className="absolute inset-0 bg-gradient-to-r from-[#E4D981] to-[#d4c86e] rounded-lg"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectionMode}
                className="px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/5 text-white hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
              >
                {selectionMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Cancel Selection</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>Select Items</span>
                  </>
                )}
              </button>

              {selectionMode && (
                <button
                  onClick={clearSelectedItems}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Remove Selected</span>
                </button>
              )}

              <button
                onClick={clearWatchlist}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
        >
          {transformedData.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <div className="text-[#E4D981] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
              <p className="text-gray-400 mb-6">
                Add movies and TV shows to your watchlist to keep track of what you want to watch.
              </p>
              <a href="/" className="btn-primary inline-block">
                Browse Content
              </a>
            </motion.div>
          ) : (
            <MediaGrid 
              items={transformedData}
              selectionMode={selectionMode}
              onSelectItem={toggleSelectItem}
              onRemove={handleRemoveItem}
              selectedItems={selectedItems}
            />
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

export default WatchlistPage;