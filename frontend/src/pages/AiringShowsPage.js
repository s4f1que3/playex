import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import PremiumLoader from '../components/common/PremiumLoader';

const AiringShowsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['airingShows', page],
    queryFn: async () => {
      const response = await tmdbApi.get('/tv/airing_today', {
        params: { page }
      });
      
      // Get full show details for each airing show
      const shows = response.data.results;
      const showDetailsPromises = shows.map(show => 
        tmdbApi.get(`/tv/${show.id}`).then(res => ({
          ...res.data,
          media_type: 'tv'
        }))
      );
      
      const showDetails = await Promise.all(showDetailsPromises);
      
      return {
        results: showDetails,
        page: response.data.page,
        total_pages: response.data.total_pages
      };
    },
    staleTime: 300000 // 5 minutes
  });

  if (isLoading) {
    return <PremiumLoader text="Loading Shows" overlay={true} />;
  }

  return (
    <div className="min-h-screen bg-[#161616]">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-[#161616]/60 to-[#161616] z-20" />
        <div className="absolute inset-0 bg-[#161616]">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150" />
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-30 mx-auto px-4 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
              </span>
              <span className="text-[#82BC87] font-medium">Currently Airing</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Latest TV
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                Episodes
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
              Discover TV shows with new episodes airing today. Stay up to date with your favorite series.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <MediaGrid 
          items={data?.results || []}
          loading={isLoading}
          showType={true}
        />

        {data?.total_pages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={data.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiringShowsPage;
