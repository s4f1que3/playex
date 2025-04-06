import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { tmdbApi } from '../utils/api';

export const useCollectionsPrefetch = (categoryKeywords) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchCollections = async () => {
      const queries = Object.values(categoryKeywords).flat();
      const chunkSize = 10;
      const chunks = [];
      
      for (let i = 0; i < queries.length; i += chunkSize) {
        chunks.push(queries.slice(i, i + chunkSize));
      }

      await queryClient.prefetchQuery({
        queryKey: ['allCollections'],
        queryFn: async () => {
          let allResults = [];

          for (const chunk of chunks) {
            const chunkPromises = chunk.map(query => 
              tmdbApi.get('/search/collection', {
                params: {
                  query,
                  include_adult: false,
                  language: 'en-US',
                  page: 1
                }
              }).catch(() => ({ data: { results: [] } }))
            );

            const chunkResponses = await Promise.allSettled(chunkPromises);
            const validResults = chunkResponses
              .filter(response => response.status === 'fulfilled')
              .map(response => response.value.data.results)
              .flat();

            allResults = [...allResults, ...validResults];
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          const processedCollections = allResults.map(collection => ({
            ...collection,
            media_type: 'collection',
            poster_path: collection.poster_path,
            title: collection.name,
            id: collection.id,
            category: 'all'
          }));

          return [...new Map(
            processedCollections
              .filter(item => item && item.id && item.poster_path)
              .map(item => [item.id, item])
          ).values()];
        },
        staleTime: 600000,
        cacheTime: 3600000,
      });
    };

    prefetchCollections();
  }, [queryClient, categoryKeywords]);
};
