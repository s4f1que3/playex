// File: frontend/src/components/media/GenreFilter.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';

const GenreFilter = ({ selectedGenres, setSelectedGenres, mediaType }) => {
  const { data: genresData, isLoading } = useQuery(
    ['genres', mediaType],
    () => tmdbApi.get(`/genre/${mediaType}/list`).then(res => res.data.genres),
    {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
    }
  );
  
  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };
  
  if (isLoading || !genresData) {
    return <div className="flex items-center justify-center py-4">Loading genres...</div>;
  }
  
  return (
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
  );
};

export default GenreFilter;