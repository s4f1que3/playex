// TMDB API helper functions for consistent data formatting
export const formatCollectionResult = (collection) => ({
  ...collection,
  media_type: 'collection',
  poster_path: collection.poster_path,
  title: collection.name,
  overview: collection.overview,
  id: collection.id
});

export const searchCollections = async (tmdbApi, query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/collection', {
      params: {
        query,
        page,
        language: 'en-US'
      }
    });

    return {
      ...response.data,
      results: response.data.results.map(formatCollectionResult)
    };
  } catch (error) {
    console.error('Error searching collections:', error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
};