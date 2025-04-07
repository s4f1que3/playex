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
            const chunkPromises = chunk.map(async (query) => {
              try {
                const response = await tmdbApi.get('/search/collection', {
                  params: {
                    query,
                    include_adult: false,
                    language: 'en-US',
                    page: 1
                  }
                });

                // Get additional details for each collection
                const collections = await Promise.all(
                  response.data.results.map(async (collection) => {
                    try {
                      const details = await tmdbApi.get(`/collection/${collection.id}`, {
                        params: { language: 'en-US' }
                      });
                      
                      // Get the first movie in collection to check its genres
                      const firstMovie = details.data.parts?.[0]?.id;
                      let movieGenres = [];
                      
                      if (firstMovie) {
                        const movieDetails = await tmdbApi.get(`/movie/${firstMovie}`, {
                          params: { language: 'en-US' }
                        });
                        movieGenres = movieDetails.data.genres || [];
                      }

                      return {
                        ...collection,
                        ...details.data,
                        genres: movieGenres,
                        media_type: 'collection',
                        searchText: `${collection.name} ${details.data.overview || ''}`
                      };
                    } catch {
                      return null;
                    }
                  })
                );

                return { data: { results: collections.filter(Boolean) } };
              } catch {
                return { data: { results: [] } };
              }
            });

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
            category: determineCategory(collection, categoryKeywords)
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

function determineCategory(collection, categoryKeywords) {
  const genres = collection.genres?.map(g => g.name.toLowerCase()) || [];
  const searchText = collection.searchText?.toLowerCase() || '';
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matchesKeywords = keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    const matchesGenre = genres.some(genre => 
      keywords.some(keyword => genre.includes(keyword.toLowerCase()))
    );

    if (matchesKeywords || matchesGenre) {
      return category;
    }
  }
  
  return 'all';
}
