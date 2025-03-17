import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';

const CollectionsIndexPage = () => {
  const { data: collections, isLoading } = useQuery({
    queryKey: ['allCollections'],
    queryFn: async () => {
      const queries = [
        'marvel', 'star wars', 'harry potter', 'lord of the rings', 
        'dc comics', 'james bond', 'fast and furious', 'mission impossible',
        'jurassic park', 'indiana jones', 'matrix', 'terminator',
        'transformers', 'pirates of the caribbean', 'alien'
      ];
      
      const collectionsPromises = queries.map(query => 
        tmdbApi.get('/search/collection', {
          params: {
            query,
            include_adult: false,
            language: 'en-US',
            page: 1
          }
        })
      );
      
      const responses = await Promise.all(collectionsPromises);
      
      const allCollections = responses.flatMap(response => 
        response.data.results.map(collection => ({
          ...collection,
          media_type: 'collection',
          poster_path: collection.poster_path,
          title: collection.name,
          id: collection.id
        }))
      );
      
      // Remove duplicates
      const uniqueCollections = [...new Map(allCollections.map(item => [item.id, item])).values()];
      return uniqueCollections;
    },
    staleTime: 600000
  });

  return (
    <div className="min-h-screen bg-[#161616] pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Movie Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Explore complete movie series and franchises
          </motion.p>
        </div>

        <MediaGrid 
          items={collections}
          loading={isLoading}
          showType={true}
        />
      </div>
    </div>
  );
};

export default CollectionsIndexPage;
