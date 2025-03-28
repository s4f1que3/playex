// Store ID mappings in localStorage
const SLUG_MAP_KEY = 'slug_id_mappings';

const getSlugMappings = () => {
  try {
    return JSON.parse(localStorage.getItem(SLUG_MAP_KEY)) || {};
  } catch {
    return {};
  }
};

export const slugify = (text) => {
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

export const createMediaUrl = (mediaType, id, title) => {
  // For all media types including actors, use id-slug format
  const slug = `${id}-${slugify(title)}`;
  return `/${mediaType}/${slug}`;
};

export const parseMediaUrl = (slug) => {
  // Simple id-slug split for all media types
  const id = slug.split('-')[0];
  return {
    id: parseInt(id),
    slug: slug
  };
};
