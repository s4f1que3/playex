import React, { useEffect } from 'react';
import { addToContinueWatching, setMediaProgress } from '../../utils/LocalStorage';

const VideoPlayer = ({ tmdbId, mediaType, season, episode, playerType = 'vidlink' }) => {
  // Build the embed URL based on playerType
  let embedUrl = '';
  
  if (playerType === 'vidlink') {
    if (mediaType === 'movie') {
      embedUrl = `https://vidlink.pro/movie/${tmdbId}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
    }
  } else if (playerType === 'mapple') {
    if (mediaType === 'movie') {
      embedUrl = `https://mapple.uk/watch/movie/${tmdbId}`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://mapple.uk/watch/tv/${tmdbId}/${season}/${episode}`;
    }
  } else if (playerType === 'vidsrc') {
    if (mediaType === 'movie') {
      embedUrl = `https://vidsrc-embed.su/embed/movie/${tmdbId}`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://vidsrc-embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
    }
  }
  
  // Add event listener for vidlink player messages
  useEffect(() => {
    if (playerType !== 'vidlink') return;
    
    const handleMessage = (event) => {
      if (event.origin !== 'https://vidlink.pro') return;
      
      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        
        // Calculate progress percentage
        const progress = mediaData.duration > 0 
          ? (mediaData.currentTime / mediaData.duration) * 100 
          : 0;
        
        // Store progress
        setMediaProgress(tmdbId, mediaType, progress);
        
        // Update continue watching
        if (progress > 0) {
          const details = {
            ...JSON.parse(localStorage.getItem('vidLinkProgress') || '{}'),
            ...(mediaType === 'tv' ? {
              season_number: parseInt(season),
              episode_number: parseInt(episode),
              total_seasons: mediaData.totalSeasons || season,
              total_episodes: mediaData.totalEpisodes || episode
            } : {})
          };
          
          addToContinueWatching(tmdbId, mediaType, details, progress);
        }
        
        localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tmdbId, mediaType, season, episode, playerType]);
  
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
          playerType === 'vidlink' ? "Nova" : 
          playerType === 'mapple' ? "Surge" : 
          "Orion"
        }
      ></iframe>
    </div>
  );
};

export default VideoPlayer;