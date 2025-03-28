import React from 'react';
import { createMediaUrl } from '../../utils/slugify';

const SearchSuggestions = ({ results, onClose }) => {
  const getItemLink = (item) => {
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    if (mediaType === 'person' || mediaType== 'actor') {
      return createMediaUrl('actor', item.id, item.name);
    }
    return createMediaUrl(mediaType, item.id, item.title || item.name);
  };

  return (
    <div className="search-suggestions">
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <a href={getItemLink(item)} onClick={onClose}>
              {item.title || item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;