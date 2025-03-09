// File: frontend/src/components/media/VideoPlayer.js
import React, { useEffect } from 'react';

const VideoPlayer = ({ tmdbId, mediaType, season, episode }) => {
  // Built the embed URL
  let embedUrl = '';
  
  if (mediaType === 'movie') {
    embedUrl = `https://vidlink.pro/movie/${tmdbId}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
  } else if (mediaType === 'tv' && season && episode) {
    embedUrl = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
  }
  
  // Add event listener for player messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://vidlink.pro') return;
      
      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  if (!embedUrl) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-black">
        <div className="text-white text-center">
          <p className="text-2xl mb-2">Video not available</p>
          <p>Invalid media information provided</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full aspect-video">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        title="Playex Video Player"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;