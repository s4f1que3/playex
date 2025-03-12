// File: frontend/src/components/media/MediaGrid.js
import React from 'react';
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
  selectedItems = {}
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
      {items.map((item) => (
        <div key={item.id} className="relative">
          {selectionMode && (
            <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-60 rounded-md p-1">
              <input
                type="checkbox"
                checked={selectedItems[`${item.media_type}-${item.id}`] || false}
                onChange={() => onSelectItem(item.id, item.media_type)}
                className="w-5 h-5 cursor-pointer accent-[#82BC87]"
              />
            </div>
          )}
          
          <MediaCard 
            media={item} 
            onRemove={selectionMode ? null : (() => onRemove(item.id, item.media_type))} 
          />
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;