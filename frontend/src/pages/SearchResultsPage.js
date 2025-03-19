// File: frontend/src/pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '@headlessui/react';

const FilterOption = ({ value, icon, label, current, onClick }) => (
  <Menu.Item>
    {({ active }) => (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(value)}
        className={`w-full text-left px-4 py-3 flex items-center gap-3 group transition-all duration-300
                   ${active ? 'bg-[#82BC87]/10' : 'bg-transparent'}
                   ${current ? 'text-[#82BC87]' : 'text-gray-400'}`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${current ? 'bg-[#82BC87]/20' : 'bg-gray-800/50'} 
                      group-hover:bg-[#82BC87]/20 transition-all duration-300`}>
          {icon}
        </div>
        <span className="font-medium group-hover:text-[#82BC87] transition-colors duration-300">
          {label}
        </span>
        {current && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto bg-[#82BC87]/20 rounded-full p-1"
          >
            <svg className="w-4 h-4 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    )}
  </Menu.Item>
);

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const searchQuery = queryParams.get('q') || '';
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialMediaType = queryParams.get('media_type') || 'all';
  
  const [page, setPage] = useState(initialPage);
  const [mediaType, setMediaType] = useState(initialMediaType);
  
  // Update URL when page or filter changes
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      
      if (page > 1) {
        params.set('page', page.toString());
      }
      
      if (mediaType !== 'all') {
        params.set('media_type', mediaType);
      }
      
      navigate(`/search?${params.toString()}`, { replace: true });
    }
  }, [page, searchQuery, mediaType, navigate]);
  
  // Redirect to home if no search query
  useEffect(() => {
    if (!searchQuery) {
      navigate('/');
    }
  }, [searchQuery, navigate]);
  
  // Fetch search results
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, page, mediaType],
    queryFn: () => {
      // If specific media type is selected, use that endpoint
      if (mediaType !== 'all' && mediaType !== 'person') {
        return tmdbApi.get(`/search/${mediaType}`, {
          params: { query: searchQuery, page }
        }).then(res => res.data);
      } 
      else if (mediaType === 'person') {
        return tmdbApi.get('/search/person', {
          params: { query: searchQuery, page }
        }).then(res => {
          // Format person results to match multi search
          return {
            ...res.data,
            results: res.data.results.map(person => ({
              ...person,
              media_type: 'person'
            }))
          };
        });
      }
      // Otherwise use multi search
      return tmdbApi.get('/search/multi', {
        params: { query: searchQuery, page }
      }).then(res => res.data);
    },
    enabled: !!searchQuery,
    keepPreviousData: true,
    staleTime: 300000 // 5 minutes
  });
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Filter results based on media type if using multi search
  const filteredResults = data?.results?.filter(item => {
    if (mediaType === 'all') {
      return ['movie', 'tv', 'person'].includes(item.media_type);
    }
    return item.media_type === mediaType;
  });

  const filterOptions = [
    {
      value: 'all',
      label: 'All Content',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      value: 'movie',
      label: 'Movies Only',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      value: 'tv',
      label: 'TV Shows Only',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      value: 'person',
      label: 'Actors Only',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  // Replace the existing filter dropdown with this enhanced version
  const FilterDropdown = () => (
    <Menu as="div" className="relative z-[60] inline-block">  {/* Added inline-block */}
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900/90 
                                backdrop-blur-xl border border-white/5 hover:border-[#82BC87]/20 
                                transition-all duration-300 group relative z-[60]">  {/* Added relative and z-[60] */}
            <div className="w-8 h-8 rounded-lg bg-[#82BC87]/10 flex items-center justify-center">
              {filterOptions.find(option => option.value === mediaType)?.icon}
            </div>
            <span className="text-white font-medium">
              {filterOptions.find(option => option.value === mediaType)?.label}
            </span>
            <motion.svg
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-5 text-gray-400 group-hover:text-[#82BC87]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </motion.svg>
          </Menu.Button>

          <AnimatePresence>
            {open && (
              <Menu.Items
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                static
                className="fixed right-0 mt-2 w-72 rounded-xl bg-gray-900/95 backdrop-blur-xl 
                         border border-white/5 shadow-lg shadow-black/50 divide-y divide-white/5
                         focus:outline-none z-[100]"
                style={{ top: "calc(100% + 8px)" }}
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm text-gray-400">Filter Content</p>
                  <p className="text-xs text-gray-500">Show specific content types</p>
                </div>
                <div className="py-2">
                  {filterOptions.map((option) => (
                    <FilterOption
                      key={option.value}
                      current={mediaType === option.value}
                      onClick={(value) => {
                        setMediaType(value);
                        setPage(1);
                      }}
                      {...option}
                    />
                  ))}
                </div>
              </Menu.Items>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search Info */}
      <div className="relative mb-8 bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Results for "{searchQuery}"
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 relative z-50">  {/* Added relative and z-50 */}
            <div className="flex items-center gap-2">
              <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400">Searching...</span>
                  </div>
                ) : (
                  <span className="text-gray-400">
                    {data?.total_results 
                      ? <span>Found <strong className="text-[#82BC87] font-medium">{data.total_results}</strong> results</span>
                      : 'No results found'}
                  </span>
                )}
              </div>
            </div>

            <FilterDropdown />
          </div>
        </div>
      </div>

      {/* Results Grid with Enhanced Animation */}
      <div className="container mx-auto px-4">
        <div className="relative">
          <MediaGrid 
            items={filteredResults} 
            loading={isLoading} 
            error={error}
            className="animate-fadeIn"
          />
          
          {/* Elegant Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-900/95 p-6 rounded-2xl shadow-xl border border-white/5 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300 animate-pulse">Loading results...</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {data && data.total_pages > 1 && (
          <div className="mt-12 mb-8">
            <Pagination
              currentPage={page}
              totalPages={data.total_pages > 500 ? 500 : data.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* No Results State */}
        {!isLoading && (!data?.results || data.results.length === 0) && (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search term or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;