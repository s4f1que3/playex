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
  // Always include the ID in a consistent format
  const slug = `${id}-${slugify(title)}`;
  return `/${mediaType}/${slug}`;
};

export const parseMediaUrl = (slug) => {
  // Extract ID from slug (it's always the first part before the first hyphen)
  const id = slug.split('-')[0];
  return {
    id: parseInt(id),
    slug: slug
  };
};

export const getIdFromSlug = (type, slug) => {
  const mappings = getSlugMappings();
  return mappings[`${type}/${slug}`];
};
