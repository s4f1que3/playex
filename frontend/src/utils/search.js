// Levenshtein distance calculation
export const getLevenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Find similar titles
export const findSimilarTitles = (searchTerm, items, threshold = 3) => {
  const normalizedSearch = searchTerm.toLowerCase();
  
  return items.filter(item => {
    const title = (item.title || item.name || '').toLowerCase();
    const distance = getLevenshteinDistance(normalizedSearch, title);
    
    // For collections, also check if the search term matches any part of the collection name
    if (item.media_type === 'collection') {
      return distance <= threshold || 
             title.includes(normalizedSearch) || 
             normalizedSearch.split(' ').some(word => title.includes(word.toLowerCase()));
    }
    
    return distance <= threshold || title.includes(normalizedSearch);
  });
};

// Get search suggestions based on common typos and similar titles
export const getSearchSuggestions = (searchTerm, results) => {
  const suggestions = new Set();
  const commonTypos = {
    'the': ['teh', 'eth', 'te'],
    'and': ['adn', 'nad', 'an'],
    // Add more common typos as needed
  };

  // Check for common typos
  const words = searchTerm.toLowerCase().split(' ');
  words.forEach(word => {
    Object.entries(commonTypos).forEach(([correct, typos]) => {
      if (typos.includes(word)) {
        const corrected = searchTerm.replace(new RegExp(word, 'i'), correct);
        suggestions.add(corrected);
      }
    });
  });

  // Find similar titles from results
  const titles = results.map(item => item.title || item.name);
  const similarTitles = titles.filter(title => {
    const distance = getLevenshteinDistance(searchTerm.toLowerCase(), title.toLowerCase());
    return distance <= 3 && distance > 0;
  });

  similarTitles.forEach(title => suggestions.add(title));

  return Array.from(suggestions);
};
