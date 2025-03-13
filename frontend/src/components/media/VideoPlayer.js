import React, { useEffect } from 'react';

const VideoPlayer = ({ tmdbId, mediaType, season, episode, playerType = 'vidlink' }) => {
  // Build the embed URL based on playerType
  let embedUrl = '';
  
  if (playerType === 'vidlink') {
    if (mediaType === 'movie') {
      embedUrl = `https://vidlink.pro/movie/${tmdbId}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
    }
  } else if (playerType === 'embedsu') {
    if (mediaType === 'movie') {
      embedUrl = `https://embed.su/embed/movie/${tmdbId}`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
    }
  } else if (playerType === 'vidsrc') {
    if (mediaType === 'movie') {
      embedUrl = `https://vidsrc.to/embed/movie/${tmdbId}`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
    }
  }
  
  // Add event listener for vidlink player messages
  useEffect(() => {
    if (playerType !== 'vidlink') return; // Only for vidlink player
    
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
  }, [playerType]);
  
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
        title={
          playerType === 'vidlink' ? "Playex Player" : 
          playerType === 'embedsu' ? "Playex Player" : 
          "Vidsrc Player"
        }
      ></iframe>
    </div>
  );
};

export default VideoPlayer;