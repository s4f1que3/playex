// File: frontend/src/pages/TrendingPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';

const TrendingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Get filter values from URL query params
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialTimeWindow = queryParams.get('time_window') || 'week';
  
  const [page, setPage] = useState(initialPage);
  const [timeWindow, setTimeWindow] = useState(initialTimeWindow);
  
  // Update URL when page or timeWindow changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    if (timeWindow !== 'week') {
      params.set('time_window', timeWindow);
    }
    
    const queryString = params.toString();
    navigate(`/trending${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [page, timeWindow, navigate]);
  
  // Fetch trending media
  const { data, isLoading, error } = useQuery(
    ['trending', page, timeWindow],
    () => tmdbApi.get(`/trending/all/${timeWindow}`, { params: { page } }).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 300000 // 5 minutes
    }
  );
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Trending</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeWindow('day')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeWindow === 'day' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow('week')}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              timeWindow === 'week' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            This Week
          </button>
        </div>
      </div>
      
      <MediaGrid 
        items={data?.results} 
        loading={isLoading} 
        error={error}
      />
      
      {data && (
        <Pagination
          currentPage={page}
          totalPages={data.total_pages > 500 ? 500 : data.total_pages} // API limits to 500 pages
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TrendingPage;