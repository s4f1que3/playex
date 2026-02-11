import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import { useCollectionResolver } from '../hooks/useCollectionResolver';
import PremiumLoader from '../components/common/PremiumLoader';
import SEO from '../components/common/SEO';

const CollectionsPage = () => {
  const { id: slugOrId } = useParams();
  const { id, loading: resolverLoading, error: resolverError } = useCollectionResolver(slugOrId);

  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => tmdbApi.get(`/collection/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 600000 // 10 minutes
  });

  const isLoading = resolverLoading || collectionLoading;

  if (isLoading) {
    return <PremiumLoader text="Loading Collection" overlay={true} />;
  }

  if (resolverError || !collection) {
    return (
      <div className="min-h-screen bg-[#141822] pt-24">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Collection Not Found</h2>
            <p className="text-gray-400">
              {resolverError || "The requested collection doesn't exist or has been removed."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={collection?.name}
        description={`Browse the complete ${collection?.name} collection. Watch all movies in the series on Playex.`}
        image={`https://image.tmdb.org/t/p/w1280${collection?.backdrop_path}`}
        url={window.location.href}
        type="website"
      />
      <div className="min-h-screen bg-[#141822]">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#141822] to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#141822]/80 to-transparent z-10" />
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
    </>
  );
};

export default CollectionsPage;
