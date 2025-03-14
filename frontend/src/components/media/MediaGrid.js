// File: frontend/src/components/media/MediaGrid.js
import React from 'react';
import { Link } from 'react-router-dom';
import MediaCard from '../common/MediaCard';
import Spinner from '../common/Spinner';
import { useMediaQueries } from '../../hooks/useMediaQueries';

const MediaGrid = ({
  items,
  loading,
  error,
  columnCount,
  selectionMode = false,
  onSelectItem,
  onRemove,
  selectedItems = {},
  showType = true,
  mediaType = null
}) => {
  const { isMobile, isTablet } = useMediaQueries();
  
  // Dynamically set column count based on screen size and provided prop
  const getColumnCount = () => {
    if (columnCount) return columnCount;
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 5;
  };
  
  const cols = getColumnCount();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
        <p>Failed to load content. Please try again later.</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">No results found</p>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${cols} gap-4 md:gap-6`}>
      {items.map((item) => {
        // If mediaType prop is provided, use it to override the item's media_type
        const itemMediaType = mediaType || item.media_type || 'movie';
        const enhancedItem = {
          ...item,
          media_type: itemMediaType
        };
        
        return (
          <div key={`${item.media_type}-${item.id}`} className="relative">
            {selectionMode && (
              <div 
                onClick={() => onSelectItem(item.id, item.media_type)}
                className="absolute inset-0 z-10 bg-black bg-opacity-80 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-opacity-70"
              >
                <div className={`w-8 h-8 rounded-lg shadow-lg transform transition-transform duration-200 ${
                  selectedItems[`${item.media_type}-${item.id}`] 
                    ? 'bg-[#82BC87] scale-110' 
                    : 'bg-gray-800 hover:bg-gray-700'
                } flex items-center justify-center`}>
                  {selectedItems[`${item.media_type}-${item.id}`] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                  )}
                </div>
              </div>
            )}
            <Link 
              to={`/player/${itemMediaType}/${item.id}`}
              className="media-card"
            >
              <MediaCard
                media={enhancedItem}
                onRemove={selectionMode ? null : onRemove ? (() => onRemove(item.id, itemMediaType)) : undefined}
                showType={showType}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;