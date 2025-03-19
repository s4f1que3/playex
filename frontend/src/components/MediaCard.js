import PrefetchLink from './common/PrefetchLink';
import React from 'react';
import { Link } from 'react-router-dom';
import { commonStyles } from '../styles/commonStyles';

const MediaCard = ({ media }) => {
    return (
      <PrefetchLink
        to={`/${media.type}/${media.id}`}
        className={`${commonStyles.card} ${commonStyles.focusRing} block hover:scale-[1.02] transition-transform duration-300`}
        role="article"
        aria-label={`${media.title} - Click to view details`}
      >
        // ...existing content...
      </PrefetchLink>
    );
  };
  
  export default MediaCard;