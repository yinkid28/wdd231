// storage.js - Local Storage Management Module

const STORAGE_KEYS = {
    FAVORITES: 'cinema_favorites',
    SEARCH_HISTORY: 'cinema_search_history',
    USER_PREFERENCES: 'cinema_preferences',
    LAST_VIEWED: 'cinema_last_viewed'
  };
  
  /**
   * Save a movie to favorites
   * @param {Object} movie - Movie object to save
   */
  export function saveFavorite(movie) {
    const favorites = getFavorites();
    
    // Check if movie already exists
    const exists = favorites.some(fav => fav.id === movie.id);
    
    if (!exists) {
      favorites.push({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        rating: movie.vote_average,
        addedDate: new Date().toISOString()
      });
      
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    }
    
    return false;
  }
  
  /**
   * Remove a movie from favorites
   * @param {number} movieId - Movie ID to remove
   */
  export function removeFavorite(movieId) {
    const favorites = getFavorites();
    const updated = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  }
  
  /**
   * Get all favorite movies
   * @returns {Array} Array of favorite movie objects
   */
  export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Check if a movie is favorited
   * @param {number} movieId - Movie ID to check
   * @returns {boolean} True if movie is favorited
   */
  export function isFavorited(movieId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === movieId);
  }
  
  /**
   * Toggle favorite status of a movie
   * @param {Object} movie - Movie object
   * @returns {boolean} New favorite status
   */
  export function toggleFavorite(movie) {
    if (isFavorited(movie.id)) {
      removeFavorite(movie.id);
      return false;
    } else {
      saveFavorite(movie);
      return true;
    }
  }
  
  /**
   * Save search query to history
   * @param {string} query - Search query to save
   */
  export function saveSearchQuery(query) {
    if (!query || query.trim() === '') return;
    
    const history = getSearchHistory();
    
    // Remove duplicate if exists
    const filtered = history.filter(item => item.query !== query);
    
    // Add new query to beginning
    filtered.unshift({
      query: query,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 searches
    const limited = filtered.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
  }
  
  /**
   * Get search history
   * @returns {Array} Array of search query objects
   */
  export function getSearchHistory() {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Clear search history
   */
  export function clearSearchHistory() {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }
  
  /**
   * Save user preferences
   * @param {Object} preferences - User preferences object
   */
  export function savePreferences(preferences) {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  }
  
  /**
   * Get user preferences
   * @returns {Object} User preferences object
   */
  export function getPreferences() {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : {
      theme: 'dark',
      defaultSort: 'popularity.desc',
      showAdult: false,
      resultsPerPage: 20
    };
  }
  
  /**
   * Save last viewed movie
   * @param {Object} movie - Movie object
   */
  export function saveLastViewed(movie) {
    const history = getLastViewed();
    
    // Remove if already exists
    const filtered = history.filter(item => item.id !== movie.id);
    
    // Add to beginning
    filtered.unshift({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      viewedDate: new Date().toISOString()
    });
    
    // Keep only last 20
    const limited = filtered.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEYS.LAST_VIEWED, JSON.stringify(limited));
  }
  
  /**
   * Get last viewed movies
   * @returns {Array} Array of last viewed movie objects
   */
  export function getLastViewed() {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_VIEWED);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Clear all stored data
   */
  export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  /**
   * Get storage usage statistics
   * @returns {Object} Object with storage stats
   */
  export function getStorageStats() {
    return {
      favoritesCount: getFavorites().length,
      searchHistoryCount: getSearchHistory().length,
      lastViewedCount: getLastViewed().length,
      hasPreferences: !!localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    };
  }