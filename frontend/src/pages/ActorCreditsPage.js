// File: frontend/src/pages/ActorCreditsPage.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import MediaCard from '../components/common/MediaCard';
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
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative -mx-4 mb-8"
      >
        <div className="relative h-[30vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]">
          <div className="absolute inset-0">
            {data?.profile_path && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm"
                style={{ 
                  backgroundImage: `url(${tmdbHelpers.getImageUrl(data.profile_path, 'original')})` 
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-[#161616]" />
          </div>

          <div className="container relative mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex flex-col gap-4">
              <Link
                to={`/actor/${id}`}
                className="text-[#82BC87] hover:text-[#E4D981] transition duration-300 flex items-center gap-2 group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {data?.name}
              </Link>

              <h1 className="text-4xl font-bold text-white flex items-center gap-4">
                {data?.name}
                <span className="text-2xl text-gray-400">
                  {type === 'movie' ? 'Movies' : 'TV Shows'}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content Section */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
        >
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">
                {credits?.length || 0} {type === 'movie' ? 'Movies' : 'TV Shows'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#82BC87]/50 hover:bg-black/40 transition-all duration-300"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="release_date">Sort by Release Date</option>
                <option value="title">Sort by Title</option>
                <option value="vote_average">Sort by Rating</option>
              </select>

              <Link
                to={`/actor/${id}/${type === 'movie' ? 'tv' : 'movies'}`}
                className="bg-[#82BC87]/10 hover:bg-[#82BC87]/20 text-[#82BC87] px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-[#82BC87]/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Switch to {type === 'movie' ? 'TV Shows' : 'Movies'}
              </Link>
            </div>
          </div>

          {/* Fixed Grid Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {credits.map(item => (
              <MediaCard
                key={item.id}
                media={{
                  ...item,
                  media_type: type,
                  // Ensure proper data mapping for movies/shows
                  title: type === 'movie' ? item.title : item.name,
                  release_date: type === 'movie' ? item.release_date : item.first_air_date
                }}
                showType={false}
              />
            ))}
          </div>

          {/* Empty State */}
          {credits.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h3 className="text-xl text-gray-400 mb-2">No {type === 'movie' ? 'movies' : 'TV shows'} found</h3>
              <p className="text-gray-500">This actor hasn't appeared in any {type === 'movie' ? 'movies' : 'TV shows'} yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ActorCreditsPage;