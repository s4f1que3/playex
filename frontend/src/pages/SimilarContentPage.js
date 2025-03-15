import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';

const SimilarContentPage = () => {
  const { mediaType, id } = useParams();
  const [page, setPage] = useState(1);

  { /* This controls the similar content page, it just calls recommended content because its better for similar in tmdb */ }

  const { data, isLoading, error } = useQuery({
    queryKey: ['similarContent', mediaType, id, page],
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}/recommendations`, { params: { page } })
      .then(res => res.data),
    keepPreviousData: true,
    staleTime: 300000
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Similar Content</h1>
      
      <MediaGrid 
        items={data?.results?.map(item => ({ ...item, media_type: mediaType }))}
        loading={isLoading}
        error={error}
      />
      
      {data && (
        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SimilarContentPage;