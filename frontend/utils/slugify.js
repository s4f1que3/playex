// Store ID mappings in localStorage
const SLUG_MAP_KEY = 'slug_id_mappings';

const getSlugMappings = () => {
  try {
    return JSON.parse(localStorage.getItem(SLUG_MAP_KEY)) || {};
  } catch {
    return {};
  }
};

const setSlugMapping = (slug, id, type) => {
  const mappings = getSlugMappings();
  mappings[`${type}/${slug}`] = id;
  localStorage.setItem(SLUG_MAP_KEY, JSON.stringify(mappings));
};

export const createSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')     // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars except hyphens
    .replace(/--+/g, '-')        // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')          // Trim hyphens from start
    .replace(/-+$/, '');         // Trim hyphens from end
};

export const createMediaUrl = (type, id, title) => {
  const slug = createSlug(title);
  setSlugMapping(slug, id, type);
  
  // Handle different types of media URLs
  switch (type) {
    case 'person':
    case 'actor':
      return `/actor/${slug}`;
    case 'person/movies':
      return `/actor/${slug}/movies`;
    case 'person/tv':
      return `/actor/${slug}/tv`;
    case 'movie':
    case 'tv':
      return `/${type}/${slug}`;
    default:
      return `/${type}/${slug}`;
  }
};

export const parseMediaUrl = (param) => {
  if (!param) {
    return { id: null, slug: '' };
  }
  
  const match = param.match(/^(\d+)(?:-.+)?$/);
  return {
    id: match ? match[1] : param,
    slug: match ? match[0].slice(match[1].length + 1) : ''
  };
};

export const getIdFromSlug = (type, slug) => {
  const mappings = getSlugMappings();
  return mappings[`${type}/${slug}`];
};
