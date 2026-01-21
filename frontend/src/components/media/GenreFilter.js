// File: frontend/src/components/media/GenreFilter.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';

const GenreFilter = ({ selectedGenres, setSelectedGenres, mediaType, showSelected }) => {
  const { data: genresData, isLoading } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => tmdbApi.get(`/genre/${mediaType}/list`).then(res => res.data.genres),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const toggleGenre = (genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(newGenres);
  };

  // Helper to get genre name by ID
  const getGenreName = (id) => {
    const genre = genresData?.find(g => g.id === id);
    return genre ? genre.name : '';
  };

  // Render selected genres badges
  const renderSelectedGenres = () => {
    if (selectedGenres.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {selectedGenres.map(genreId => (
          <button
            key={genreId}
            onClick={() => toggleGenre(genreId)}
            className="bg-[#82BC87] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#6ea973] transition-colors"
          >
            {getGenreName(genreId)}
            <span className="ml-1">×</span>
          </button>
        ))}
      </div>
    );
  };
  
  if (isLoading || !genresData) {
    return <div className="flex items-center justify-center py-4">Loading genres...</div>;
  }
  
  return (
    <>
      {renderSelectedGenres()}
      <div className="flex flex-wrap gap-2 py-4">
        {genresData.map((genre) => (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`px-3 py-1 rounded-full text-sm transition duration-300 ${
              selectedGenres.includes(genre.id)
                ? 'bg-[#82BC87] text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default GenreFilter;