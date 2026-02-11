import React, { useEffect, useState } from 'react';
import { addToContinueWatching, setMediaProgress } from '../../utils/LocalStorage';

const VideoPlayer = ({ tmdbId, mediaType, season, episode, playerType = 'vidlink' }) => {
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  
  // Build the embed URL based on playerType
  let embedUrl = '';
  
  if (playerType === 'vidlink') {
    if (mediaType === 'movie') {
      embedUrl = `https://vidlink.pro/movie/${tmdbId}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=82BC87&secondaryColor=161616&iconColor=E4D981&title=true&poster=true&autoplay=true&nextbutton=true`;
    }
  } else if (playerType === 'nova') {
    // Nova player (Videasy)
    if (mediaType === 'movie') {
      embedUrl = `https://player.videasy.net/movie/${tmdbId}?color=82BC87&autoplayNextEpisode=true&overlay=true`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}?color=82BC87&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true`;
    }
  } else if (playerType === 'star') {
    // Star player (Vidfast) - using vidfast.pro domain
    if (mediaType === 'movie') {
      embedUrl = `https://vidfast.pro/movie/${tmdbId}?theme=82BC87&autoPlay=true`;
    } else if (mediaType === 'tv' && season && episode) {
      embedUrl = `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?theme=82BC87&autoPlay=true&nextButton=true&autoNext=true`;
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
  
  // Add event listener for vidlink and nova player messages
  useEffect(() => {
    if (playerType !== 'vidlink' && playerType !== 'nova') return;
    
    const handleMessage = (event) => {
      // Accept messages from both vidlink.pro and videasy.net
      if (event.origin !== 'https://vidlink.pro' && event.origin !== 'https://player.videasy.net') return;
      
      // Handle MEDIA_DATA from vidlink
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
      
      // Handle messages from Nova player (Videasy)
      if (typeof event.data === 'string' && playerType === 'nova') {
        try {
          const novaData = JSON.parse(event.data);
          
          // Nova sends progress updates
          if (novaData.id && novaData.type && novaData.timestamp && novaData.duration) {
            const progress = novaData.duration > 0 
              ? (novaData.timestamp / novaData.duration) * 100 
              : 0;
            
            // Store progress
            setMediaProgress(tmdbId, mediaType, progress);
            
            // Update continue watching
            if (progress > 0) {
              const details = {
                ...JSON.parse(localStorage.getItem('vidLinkProgress') || '{}'),
                ...(mediaType === 'tv' ? {
                  season_number: parseInt(novaData.season || season),
                  episode_number: parseInt(novaData.episode || episode),
                } : {})
              };
              
              addToContinueWatching(tmdbId, mediaType, details, progress);
            }
          }
        } catch (e) {
          // Not JSON, ignore
        }
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
  
  // Handle mouse interactions to enable/disable pointer events
  const handleMouseEnter = () => {
    if (playerType === 'vidlink') {
      setIsPlayerActive(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (playerType === 'vidlink') {
      // Add a small delay before disabling to allow for smooth interaction
      setTimeout(() => setIsPlayerActive(false), 100);
    }
  };
  
  const handleClick = () => {
    if (playerType === 'vidlink') {
      setIsPlayerActive(true);
    }
  };
  
  return (
    <div 
      className="w-full aspect-video"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <iframe
        src={embedUrl}
        className="w-full h-full"
        style={{
          pointerEvents: playerType === 'vidlink' && !isPlayerActive ? 'none' : 'auto'
        }}
        frameBorder="0"
        allowFullScreen
        allow="encrypted-media"
        title={
          playerType === 'vidlink' ? "VidLink Player" : 
          playerType === 'nova' ? "Nova Player" :
          playerType === 'star' ? "Star Player" :
          playerType === 'mapple' ? "Surge Player" : 
          "Orion Player"
        }
      ></iframe>
    </div>
  );
};

export default VideoPlayer;