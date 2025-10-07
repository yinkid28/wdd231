// api.js - TMDB API Integration Module

// IMPORTANT: Replace with your actual TMDB API key
// Get your API key from: https://www.themoviedb.org/settings/api
const API_KEY = '097655746e720194abee445b53d51002';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Fetch trending movies for the week
 * @returns {Promise<Array>} Array of trending movie objects
 */

//Fetch trending movies function making an asynchronous call to the TMDB endpoint
export async function fetchTrendingMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
}

/**
 * Fetch popular movies
 * @returns {Promise<Array>} Array of popular movie objects
 */
export async function fetchPopularMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

/**
 * Fetch movie details by ID
 * @param {number} movieId - The TMDB movie ID
 * @returns {Promise<Object>} Movie details object
 */
export async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,similar`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Search movies by query
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of movie search results
 */
export async function searchMovies(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

/**
 * Fetch movies by genre
 * @param {number} genreId - The genre ID
 * @returns {Promise<Array>} Array of movies in the specified genre
 */
export async function fetchMoviesByGenre(genreId) {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
}

/**
 * Fetch all movie genres
 * @returns {Promise<Array>} Array of genre objects
 */
export async function fetchGenres() {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}

/**
 * Discover movies with filters
 * @param {Object} filters - Filter options (genre, year, rating, sort)
 * @returns {Promise<Object>} Object containing results and total pages
 */
export async function discoverMovies(filters = {}) {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      language: 'en-US',
      sort_by: filters.sort || 'popularity.desc',
      page: filters.page || 1,
      'vote_count.gte': 100
    });

    if (filters.genre) {
      params.append('with_genres', filters.genre);
    }

    if (filters.year) {
      if (filters.year.includes('-')) {
        const [start, end] = filters.year.split('-');
        params.append('primary_release_date.gte', `${start}-01-01`);
        params.append('primary_release_date.lte', `${end}-12-31`);
      } else {
        params.append('primary_release_year', filters.year);
      }
    }

    if (filters.rating) {
      params.append('vote_average.gte', filters.rating);
    }

    const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      results: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      currentPage: data.page
    };
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
}

/**
 * Get poster image URL
 * @param {string} posterPath - The poster path from TMDB
 * @param {string} size - Image size (w185, w342, w500, w780, original)
 * @returns {string} Full image URL
 */
export function getPosterUrl(posterPath, size = 'w500') {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750/1a1a2e/ff6b35?text=No+Image';
  }
  return `${IMAGE_BASE_URL}/${size}${posterPath}`;
}

/**
 * Get backdrop image URL
 * @param {string} backdropPath - The backdrop path from TMDB
 * @param {string} size - Image size (w300, w780, w1280, original)
 * @returns {string} Full image URL
 */
export function getBackdropUrl(backdropPath, size = 'w1280') {
  if (!backdropPath) {
    return 'https://via.placeholder.com/1280x720/1a1a2e/ff6b35?text=No+Backdrop';
  }
  return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
}

/**
 * Get profile image URL
 * @param {string} profilePath - The profile path from TMDB
 * @param {string} size - Image size (w185, h632, original)
 * @returns {string} Full image URL
 */
export function getProfileUrl(profilePath, size = 'w185') {
  if (!profilePath) {
    return 'https://via.placeholder.com/185x278/1a1a2e/ff6b35?text=No+Image';
  }
  return `${IMAGE_BASE_URL}/${size}${profilePath}`;
}

/**
 * Format currency
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (!amount || amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format runtime to hours and minutes
 * @param {number} minutes - Runtime in minutes
 * @returns {string} Formatted runtime string
 */
export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Get YouTube trailer URL
 * @param {Array} videos - Array of video objects from TMDB
 * @returns {string|null} YouTube video ID or null
 */
export function getTrailerKey(videos) {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? trailer.key : null;
}

/**
 * Extract release year from date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Year or 'N/A'
 */
export function getYear(dateString) {
  if (!dateString) return 'N/A';
  return dateString.split('-')[0];
}