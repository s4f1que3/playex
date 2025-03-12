// File: frontend/src/pages/ActorsPersonal.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaCarousel from '../components/media/MediaCarousel';

const ActorsPersonal = () => {
  const { id } = useParams();

  // Fetch actor details
  const { data: actor, isLoading: actorLoading, error: actorError } = useQuery({
    queryKey: ['actorDetails', id],
    queryFn: () => tmdbApi.get(`/person/${id}`, {
      params: {
        append_to_response: 'combined_credits,external_ids,images'
      }
    }).then(res => res.data),
    staleTime: 300000 // 5 minutes
  });

  if (actorLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }

  if (actorError) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
        <p>Failed to load actor details. Please try again later.</p>
        <p className="text-sm">{actorError.message}</p>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">No actor found</p>
        <p>The requested actor doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Sort credits by popularity
  const movieCredits = actor.combined_credits?.cast
    ?.filter(credit => credit.media_type === 'movie')
    ?.sort((a, b) => b.popularity - a.popularity) || [];

  const tvCredits = actor.combined_credits?.cast
    ?.filter(credit => credit.media_type === 'tv')
    ?.sort((a, b) => b.popularity - a.popularity) || [];

  return (
    <div className="-mx-4 -mt-6">
      {/* Actor Header */}
      <div className="relative bg-gradient-to-b from-transparent to-[#111111] pb-6">
        <div className="absolute inset-0 bg-[#111111] opacity-90 z-0"></div>
        
        {/* Background Image (if available) */}
        {actor.images?.profiles && actor.images.profiles.length > 0 && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: `url(${tmdbHelpers.getImageUrl(actor.images.profiles[0].file_path, 'original')})`,
              filter: 'blur(8px)' 
            }}
          ></div>
        )}
        
        <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Actor Profile Image */}
            <div className="w-48 md:w-64 shrink-0">
              <img
                src={tmdbHelpers.getImageUrl(actor.profile_path, 'w500') || 'https://via.placeholder.com/500x750?text=No+Image'}
                alt={actor.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Actor Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{actor.name}</h1>
              
              {actor.birthday && (
                <div className="mb-3">
                  <span className="text-gray-400">Born: </span>
                  <span className="text-white">
                    {new Date(actor.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {actor.place_of_birth && ` in ${actor.place_of_birth}`}
                  </span>
                </div>
              )}
              
              {actor.deathday && (
                <div className="mb-3">
                  <span className="text-gray-400">Died: </span>
                  <span className="text-white">
                    {new Date(actor.deathday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              
              {actor.known_for_department && (
                <div className="mb-3">
                  <span className="text-gray-400">Known For: </span>
                  <span className="text-white">{actor.known_for_department}</span>
                </div>
              )}
              
              {/* External Links if available */}
              {actor.external_ids && (
                <div className="flex gap-3 mt-4">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Biography */}
        {actor.biography && (
          <div className="my-8">
            <h2 className="text-2xl font-bold text-white mb-4">Biography</h2>
            <div className="text-gray-300 space-y-4">
              {actor.biography.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
        
        {/* Known For - Top Movies */}
        <MediaCarousel
          title="Known For - Movies"
          items={movieCredits.slice(0, 20)}
          viewAllLink={`/actor/${id}/movies`}
          loading={false}
          error={null}
        />
        
        {/* Known For - Top TV Shows */}
        <MediaCarousel
          title="Known For - TV Shows"
          items={tvCredits.slice(0, 20)}
          viewAllLink={`/actor/${id}/tv`}
          loading={false}
          error={null}
        />
      </div>
    </div>
  );
};

export default ActorsPersonal;