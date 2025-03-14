// File: frontend/src/pages/WatchlistPage.js
import React, { useState, useEffect } from 'react';
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { getWatchlist, removeFromWatchlist } from '../utils/LocalStorage';

const WatchlistPage = () => {
  const [mediaType, setMediaType] = useState('all');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, type: null });
  
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
      alert('No items selected');
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        
        <div className="flex space-x-2">
          {/* Media Type Filter */}
          <button
            onClick={() => setMediaType('all')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              mediaType === 'all' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMediaType('movie')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              mediaType === 'movie' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              mediaType === 'tv' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            TV Shows
          </button>
        </div>
      </div>
      
      {transformedData.length === 0 ? (
        <div className="text-center py-12">
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
        </div>
      ) : (
        <>
          {/* Watchlist Management Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={toggleSelectionMode}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
            >
              {selectionMode ? 'Cancel Selection' : 'Select Items'}
            </button>
            
            {selectionMode && (
              <button
                onClick={clearSelectedItems}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition duration-300"
              >
                Clear Selected
              </button>
            )}
            
            <button
              onClick={clearWatchlist}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition duration-300"
            >
              Clear Watchlist
            </button>
          </div>
          
          <MediaGrid 
            items={transformedData}
            selectionMode={selectionMode}
            onSelectItem={toggleSelectItem}
            onRemove={handleRemoveItem}
            selectedItems={selectedItems}
          />
        </>
      )}
      
      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog({ isOpen: false })}
      />
    </div>
  );
};

export default WatchlistPage;