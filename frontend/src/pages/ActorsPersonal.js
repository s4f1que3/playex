// File: frontend/src/pages/ActorsPersonal.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaCarousel from '../components/media/MediaCarousel';
import { useActorResolver } from '../hooks/useActorResolver';
import PremiumLoader from '../components/common/PremiumLoader';

const ActorsPersonal = () => {
  const { slug } = useParams();
  const { id, loading: resolverLoading, error: resolverError } = useActorResolver(slug);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: actorData, isLoading } = useQuery({
    queryKey: ['actor', id],
    queryFn: () => tmdbApi.get(`/person/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 300000 // 5 minutes
  });

  if (resolverLoading || isLoading) {
    return <PremiumLoader text="Loading Actor Details" overlay={true} />;
  }

  if (resolverError || !actorData) {
    return (
      <div className="min-h-screen bg-[#161616] pt-24">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Actor Not Found</h2>
            <p className="text-gray-400">
              {resolverError || "The requested actor doesn't exist or has been removed."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const actor = actorData;

  // Sort credits by popularity
  const movieCredits = actor.combined_credits?.cast
    ?.filter(credit => credit.media_type === 'movie')
    ?.sort((a, b) => b.popularity - a.popularity) || [];

  const tvCredits = actor.combined_credits?.cast
    ?.filter(credit => credit.media_type === 'tv')
    ?.sort((a, b) => b.popularity - a.popularity) || [];

  // Helper function to determine if text needs expansion
  const shouldShowExpand = (text) => {
    const wordCount = text?.split(/\s+/).length || 0;
    return wordCount > 100; // Show expand button if more than 100 words
  };

  // Function to get truncated text
  const getTruncatedText = (text) => {
    const words = text?.split(/\s+/) || [];
    if (words.length <= 100) return text;
    return words.slice(0, 100).join(' ') + '...';
  };

  return (
    <div className="-mx-4 -mt-6">
      {/* Enhanced Hero Section */}
      <div className="relative min-h-[60vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]">
        {/* Background Image with Parallax Effect */}
        {actor?.images?.profiles && actor.images.profiles.length > 0 && (
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-sm"
              style={{ 
                backgroundImage: `url(${tmdbHelpers.getImageUrl(actor.images.profiles[0].file_path, 'original')})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-[#161616]" />
          </motion.div>
        )}

        {/* Actor Info Content */}
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-64 md:w-80 shrink-0"
            >
              <div className="relative group">
                <img
                  src={tmdbHelpers.getImageUrl(actor?.profile_path, 'w500') || 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={actor?.name}
                  className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Social Links */}
              {actor?.external_ids && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 mt-4 justify-center"
                >
                  {actor.external_ids.instagram_id && (
                    <a href={`https://instagram.com/${actor.external_ids.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-[#82BC87] hover:text-[#E4D981]">
                      Instagram
                    </a>
                  )}
                  {actor.external_ids.twitter_id && (
                    <a href={`https://twitter.com/${actor.external_ids.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-[#82BC87] hover:text-[#E4D981]">
                      Twitter
                    </a>
                  )}
                  {actor.external_ids.facebook_id && (
                    <a href={`https://facebook.com/${actor.external_ids.facebook_id}`} target="_blank" rel="noopener noreferrer" className="text-[#82BC87] hover:text-[#E4D981]">
                      Facebook
                    </a>
                  )}
                  {actor.imdb_id && (
                    <a href={`https://www.imdb.com/name/${actor.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-[#82BC87] hover:text-[#E4D981]">
                      IMDb
                    </a>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Actor Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {actor?.name}
              </h1>

              {/* Known For Badge */}
              {actor?.known_for_department && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6">
                  <span className="text-[#82BC87] font-medium">{actor.known_for_department}</span>
                </div>
              )}

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {actor?.birthday && (
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <span className="text-gray-400 block mb-1">Born</span>
                    <span className="text-white">
                      {new Date(actor.birthday).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      {actor.place_of_birth && (
                        <span className="text-gray-400 ml-2">in {actor.place_of_birth}</span>
                      )}
                    </span>
                  </div>
                )}

                {actor.deathday && (
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <span className="text-gray-400 block mb-1">Died</span>
                    <span className="text-white">
                      {new Date(actor.deathday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                
                {actor.known_for_department && (
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <span className="text-gray-400 block mb-1">Known For</span>
                    <span className="text-white">{actor.known_for_department}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4">
        {/* Biography */}
        {actor?.biography && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="my-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm3 7a1 1 0 100-2 1 1 0 000 2zm-3 2h6v1H7v-1z" clipRule="evenodd"/>
              </svg>
              Biography
            </h2>
            <div className="relative">
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : "auto" }}
                className="text-gray-300 leading-relaxed space-y-4"
              >
                {isExpanded ? actor.biography : getTruncatedText(actor.biography)}
              </motion.div>

              {shouldShowExpand(actor.biography) && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 text-[#82BC87] hover:text-[#6da972] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Enhanced Media Carousels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <MediaCarousel
            title="Known For - Movies"
            items={movieCredits.slice(0, 20)}
            viewAllLink={`/actor/${id}/movies`}
            loading={false}
            error={null}
          />
          
          <MediaCarousel
            title="Known For - TV Shows"
            items={tvCredits.slice(0, 20)}
            viewAllLink={`/actor/${id}/tv`}
            loading={false}
            error={null}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ActorsPersonal;