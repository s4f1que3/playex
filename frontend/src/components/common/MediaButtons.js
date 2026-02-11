import React, { useState } from 'react';
import { isInWatchlist, isInFavorites, toggleWatchlist, toggleFavorites } from '../../utils/LocalStorage';
import ConfirmationDialog from './ConfirmationDialog';

const MediaButtons = ({ mediaId, mediaType, details }) => {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(mediaId, mediaType));
  const [inFavorites, setInFavorites] = useState(isInFavorites(mediaId, mediaType));
  const [dialog, setDialog] = useState({ isOpen: false, type: null });

  const handleWatchlistClick = () => {
    if (inWatchlist) {
      setDialog({
        isOpen: true,
        type: 'watchlist',
        title: 'Remove from Watchlist',
        message: 'Are you sure you want to remove this from your watchlist?',
        onConfirm: () => {
          toggleWatchlist(mediaId, mediaType, details);
          setInWatchlist(false);
          setDialog({ isOpen: false });
        }
      });
    } else {
      toggleWatchlist(mediaId, mediaType, details);
      setInWatchlist(true);
    }
  };

  const handleFavoritesClick = () => {
    if (inFavorites) {
      setDialog({
        isOpen: true,
        type: 'favorites',
        title: 'Remove from Favorites',
        message: 'Are you sure you want to remove this from your favorites?',
        onConfirm: () => {
          toggleFavorites(mediaId, mediaType, details);
          setInFavorites(false);
          setDialog({ isOpen: false });
        }
      });
    } else {
      toggleFavorites(mediaId, mediaType, details);
      setInFavorites(true);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={handleWatchlistClick}
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            inWatchlist 
              ? 'bg-cyan-500 text-white' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </button>
        <button
          onClick={handleFavoritesClick}
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            inFavorites 
              ? 'bg-cyan-500 text-white' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {inFavorites ? 'In Favorites' : 'Add to Favorites'}
        </button>
      </div>

      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog({ isOpen: false })}
      />
    </>
  );
};

export default MediaButtons;
