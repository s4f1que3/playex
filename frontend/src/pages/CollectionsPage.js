import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';

const CollectionsPage = () => {
  const { id } = useParams();

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => tmdbApi.get(`/collection/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 600000 // 10 minutes
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#161616]">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#161616]/80 to-transparent z-10" />
          <img 
            src={`https://image.tmdb.org/t/p/original${collection?.backdrop_path}`}
            alt={collection?.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {collection?.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-300"
            >
              {collection?.overview}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Collection Items Grid */}
      <div className="container mx-auto px-4 py-12">
        <MediaGrid 
          items={collection?.parts}
          loading={isLoading}
          showType={true}
        />
      </div>
    </div>
  );
};

export default CollectionsPage;
