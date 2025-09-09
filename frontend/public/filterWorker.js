self.onmessage = function(e) {

  if (category !== 'all') {
    result = result.filter(c => c.category === category);
  }
  
  if (searchTerm) {
    result = result.filter(c => c.searchText.includes(searchTerm));
  }

  self.postMessage(result);
};
