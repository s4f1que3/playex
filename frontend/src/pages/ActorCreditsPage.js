// File: frontend/src/pages/ActorCreditsPage.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';

const ActorCreditsPage = ({ type = 'movie' }) => {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState('popularity');
  
  // Fetch actor details and combined credits
  const { data, isLoading, error } = useQuery({
    queryKey: ['actorCredits', id],
    queryFn: () => tmdbApi.get(`/person/${id}`, {
      params: {
        append_to_response: 'combined_credits'
      }
    }).then(res => res.data),
    staleTime: 300000 // 5 minutes
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
        <p>Failed to load actor credits. Please try again later.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">No actor found</p>
        <p>The requested actor doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  // Filter and sort credits based on media type and sort option
  const credits = data.combined_credits?.cast
    ?.filter(credit => credit.media_type === type)
    ?.sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      } else if (sortBy === 'release_date') {
        const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01');
        const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01');
        return dateB - dateA;
      } else if (sortBy === 'title') {
        return (a.title || a.name).localeCompare(b.title || b.name);
      } else if (sortBy === 'vote_average') {
        return b.vote_average - a.vote_average;
      }
      return 0;
    }) || [];
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/actor/${id}`} className="text-[#82BC87] hover:text-[#E4D981] transition duration-300">
            ← Back to {data.name}
          </Link>
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {data.name} - {type === 'movie' ? 'Movies' : 'TV Shows'} 
            <span className="text-gray-400 text-lg ml-2">({credits.length})</span>
          </h1>
          
          {/* Sort options */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1F1F1F] text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#82BC87]"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="release_date">Sort by Release Date</option>
              <option value="title">Sort by Title</option>
              <option value="vote_average">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>
      
      <MediaGrid 
        items={credits.map(item => ({...item, media_type: type}))} 
        loading={false} 
        error={null}
        showType={false}
      />
      
      {credits.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-2xl mb-2">No {type === 'movie' ? 'movies' : 'TV shows'} found</p>
          <p>This actor has no {type === 'movie' ? 'movies' : 'TV shows'} in our database.</p>
        </div>
      )}
    </div>
  );
};

export default ActorCreditsPage;