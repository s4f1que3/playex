// File: frontend/src/pages/WatchlistPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';  // Add this import
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { getWatchlist, removeFromWatchlist } from '../utils/LocalStorage';
import AlertDialog from '../components/common/AlertDialog';
import FilterPanel from '../components/common/FilterPanel';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative -mx-4 mb-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[30vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]"
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
                Watchlist
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
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
                        className="absolute inset-0 bg-gradient-to-r from-[#82BC87] to-[#6da972] rounded-lg"
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
              <FilterPanel mediaType={mediaType} />
              <button
                onClick={toggleSelectionMode}
                className="px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/5 text-white hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                {selectionMode ? 'Cancel' : 'Select'}
              </button>

              <button
                onClick={clearSelectedItems}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition duration-300"
              >
                Clear Selected
              </button>
            
              <button
                onClick={clearWatchlist}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition duration-300"
              >
                Clear Watchlist
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

export default WatchlistPage;