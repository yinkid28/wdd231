// main.js - Main Application Logic

import {
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchMovieDetails,
    searchMovies,
    fetchGenres,
    discoverMovies,
    getPosterUrl,
    getBackdropUrl,
    getProfileUrl,
    formatCurrency,
    formatRuntime,
    getTrailerKey,
    getYear
  } from './api.js';
  
  import {
    saveFavorite,
    removeFavorite,
    isFavorited,
    toggleFavorite,
    saveSearchQuery,
    saveLastViewed,
    getPreferences,
    savePreferences
  } from './storage.js';
  
  // ===== GLOBAL STATE =====
  let currentPage = 1;
  let currentFilters = {};
  let allGenres = [];
  
  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', initializeApp);
  
  function initializeApp() {
    setupHamburgerMenu();
    setupModals();
    
    // Page-specific initialization
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
      initializeHomePage();
    } else if (currentPath.includes('details.html')) {
      initializeDetailsPage();
    } else if (currentPath.includes('browse.html')) {
      initializeBrowsePage();
    }
    
    // Initialize form rating slider
    const ratingSlider = document.getElementById('movieRating');
    const ratingValue = document.getElementById('ratingValue');
    if (ratingSlider && ratingValue) {
      ratingSlider.addEventListener('input', (e) => {
        ratingValue.textContent = e.target.value;
      });
    }
  }
  
  // ===== HAMBURGER MENU =====
  function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    
    if (hamburger && mainNav) {
      hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
          mainNav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
      
      // Close menu when clicking on a link
      const navLinks = mainNav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });
    }
  }
  
  // ===== MODAL SETUP =====
  function setupModals() {
    const modalOverlay = document.getElementById('modalOverlay');
    const movieModal = document.getElementById('movieModal');
    const modalClose = document.getElementById('modalClose');
    
    if (modalOverlay && modalClose) {
      modalClose.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', closeModal);
    }
    
    // Trailer modal
    const trailerOverlay = document.getElementById('trailerOverlay');
    const trailerClose = document.getElementById('trailerClose');
    
    if (trailerOverlay && trailerClose) {
      trailerClose.addEventListener('click', closeTrailerModal);
      trailerOverlay.addEventListener('click', closeTrailerModal);
    }
  }
  
  function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const movieModal = document.getElementById('movieModal');
    
    if (modalOverlay && movieModal) {
      modalOverlay.classList.add('active');
      movieModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const movieModal = document.getElementById('movieModal');
    
    if (modalOverlay && movieModal) {
      modalOverlay.classList.remove('active');
      movieModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  function openTrailerModal(trailerKey) {
    const trailerOverlay = document.getElementById('trailerOverlay');
    const trailerModal = document.getElementById('trailerModal');
    const trailerContainer = document.getElementById('trailerContainer');
    
    if (trailerOverlay && trailerModal && trailerContainer) {
      trailerContainer.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${trailerKey}?autoplay=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;
      
      trailerOverlay.classList.add('active');
      trailerModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeTrailerModal() {
    const trailerOverlay = document.getElementById('trailerOverlay');
    const trailerModal = document.getElementById('trailerModal');
    const trailerContainer = document.getElementById('trailerContainer');
    
    if (trailerOverlay && trailerModal && trailerContainer) {
      trailerOverlay.classList.remove('active');
      trailerModal.classList.remove('active');
      trailerContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  }
  
  // ===== HOME PAGE =====
  async function initializeHomePage() {
    await loadHeroMovie();
    await loadTrendingMovies();
    await loadPopularMovies();
    await loadGenreButtons();
    setupSearch();
  }
  
  async function loadHeroMovie() {
    try {
      const movies = await fetchTrendingMovies();
      if (movies && movies.length > 0) {
        const hero = movies[0];
        displayHeroMovie(hero);
      }
    } catch (error) {
      console.error('Error loading hero movie:', error);
    }
  }
  
  function displayHeroMovie(movie) {
    const hero = document.getElementById('hero');
    const heroTitle = document.getElementById('hero-title');
    const heroOverview = document.getElementById('hero-overview');
    const heroRating = document.getElementById('hero-rating');
    const heroYear = document.getElementById('hero-year');
    const heroDetails = document.getElementById('hero-details');
    
    if (hero && heroTitle && heroOverview) {
      hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${getBackdropUrl(movie.backdrop_path)}')`;
      heroTitle.textContent = movie.title;
      heroOverview.textContent = movie.overview;
      
      if (heroRating) {
        heroRating.textContent = `⭐ ${movie.vote_average.toFixed(1)}/10`;
      }
      
      if (heroYear) {
        heroYear.textContent = getYear(movie.release_date);
      }
      
      if (heroDetails) {
        heroDetails.addEventListener('click', () => {
          window.location.href = `details.html?id=${movie.id}`;
        });
      }
    }
  }
  
  async function loadTrendingMovies() {
    const container = document.getElementById('trendingMovies');
    if (!container) return;
    
    try {
      container.innerHTML = '<div class="loading">Loading trending movies...</div>';
      const movies = await fetchTrendingMovies();
      displayMovieGrid(movies.slice(0, 12), container);
    } catch (error) {
      container.innerHTML = '<div class="error">Failed to load trending movies. Please try again later.</div>';
    }
  }
  
  async function loadPopularMovies() {
    const container = document.getElementById('popularMovies');
    if (!container) return;
    
    try {
      container.innerHTML = '<div class="loading">Loading popular movies...</div>';
      const movies = await fetchPopularMovies();
      displayMovieGrid(movies.slice(0, 12), container);
    } catch (error) {
      container.innerHTML = '<div class="error">Failed to load popular movies. Please try again later.</div>';
    }
  }
  
  function displayMovieGrid(movies, container) {
    if (!movies || movies.length === 0) {
      container.innerHTML = '<div class="error">No movies found.</div>';
      return;
    }
    
    const html = movies.map(movie => `
      <div class="movie-card fade-in" data-id="${movie.id}">
        <img src="${getPosterUrl(movie.poster_path)}" 
             alt="${movie.title}" 
             loading="lazy">
        <div class="movie-card-content">
          <h3>${movie.title}</h3>
          <div>
            <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
          </div>
          <div class="movie-year">${getYear(movie.release_date)}</div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.movie-card').forEach(card => {
      card.addEventListener('click', () => {
        const movieId = card.dataset.id;
        window.location.href = `details.html?id=${movieId}`;
      });
    });
  }
  
  async function loadGenreButtons() {
    const container = document.getElementById('genreButtons');
    if (!container) return;
    
    try {
      allGenres = await fetchGenres();
      const mainGenres = allGenres.slice(0, 8);
      
      const html = mainGenres.map(genre => `
        <button class="genre-btn" data-genre="${genre.id}">
          ${genre.name}
        </button>
      `).join('');
      
      container.innerHTML = html;
      
      // Add click handlers
      container.querySelectorAll('.genre-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const genreId = btn.dataset.genre;
          const genreName = btn.textContent;
          window.location.href = `browse.html?genre=${genreId}&name=${encodeURIComponent(genreName)}`;
        });
      });
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  }
  
  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
      searchBtn.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
    }
  }
  
  async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query === '') return;
    
    saveSearchQuery(query);
    window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
  }
  
  // ===== DETAILS PAGE =====
  async function initializeDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id') || 278; // Default to Shawshank Redemption
    
    await loadMovieDetails(movieId);
    setupMovieIdInput();
  }
  
  async function loadMovieDetails(movieId) {
    try {
      const movie = await fetchMovieDetails(movieId);
      displayMovieDetails(movie);
      saveLastViewed(movie);
    } catch (error) {
      console.error('Error loading movie details:', error);
      showError('Failed to load movie details. Please try again.');
    }
  }
  
  function displayMovieDetails(movie) {
    // Update backdrop
    const backdrop = document.getElementById('detailsBackdrop');
    if (backdrop) {
      backdrop.style.backgroundImage = `url('${getBackdropUrl(movie.backdrop_path)}')`;
    }
    
    // Update poster
    const poster = document.getElementById('moviePoster');
    if (poster) {
      poster.src = getPosterUrl(movie.poster_path);
      poster.alt = movie.title;
    }
    
    // Update title and meta
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieYear').textContent = getYear(movie.release_date);
    document.getElementById('movieRuntime').textContent = formatRuntime(movie.runtime);
    document.getElementById('movieRating').textContent = `⭐ ${movie.vote_average.toFixed(1)}/10`;
    document.getElementById('movieOverview').textContent = movie.overview;
    
    // Update genres
    const genresContainer = document.getElementById('movieGenres');
    if (genresContainer && movie.genres) {
      genresContainer.innerHTML = movie.genres.map(genre => 
        `<span class="genre-tag">${genre.name}</span>`
      ).join('');
    }
    
    // Update stats
    document.getElementById('movieBudget').textContent = formatCurrency(movie.budget);
    document.getElementById('movieRevenue').textContent = formatCurrency(movie.revenue);
    document.getElementById('movieVoteCount').textContent = movie.vote_count.toLocaleString();
    document.getElementById('moviePopularity').textContent = movie.popularity.toFixed(1);
    
    // Setup favorite button
    setupFavoriteButton(movie);
    
    // Setup trailer button
    setupTrailerButton(movie);
    
    // Display cast
    if (movie.credits && movie.credits.cast) {
      displayCast(movie.credits.cast.slice(0, 12));
    }
    
    // Display similar movies
    if (movie.similar && movie.similar.results) {
      displaySimilarMovies(movie.similar.results.slice(0, 8));
    }
  }
  
  function setupFavoriteButton(movie) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (!favoriteBtn) return;
    
    const updateButton = () => {
      const favorited = isFavorited(movie.id);
      favoriteBtn.classList.toggle('favorited', favorited);
      favoriteBtn.querySelector('.heart').textContent = favorited ? '♥' : '♡';
    };
    
    updateButton();
    
    favoriteBtn.addEventListener('click', () => {
      toggleFavorite(movie);
      updateButton();
    });
  }
  
  function setupTrailerButton(movie) {
    const trailerBtn = document.getElementById('watchTrailerBtn');
    if (!trailerBtn) return;
    
    const trailerKey = getTrailerKey(movie.videos);
    
    if (trailerKey) {
      trailerBtn.addEventListener('click', () => {
        openTrailerModal(trailerKey);
      });
    } else {
      trailerBtn.disabled = true;
      trailerBtn.textContent = 'No Trailer Available';
    }
  }
  
  function displayCast(cast) {
    const container = document.getElementById('castGrid');
    if (!container) return;
    
    const html = cast.map(person => `
      <div class="cast-card">
        <img src="${getProfileUrl(person.profile_path)}" 
             alt="${person.name}" 
             loading="lazy">
        <div class="cast-info">
          <div class="cast-name">${person.name}</div>
          <div class="cast-character">${person.character}</div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  function displaySimilarMovies(movies) {
    const container = document.getElementById('similarMovies');
    if (!container) return;
    
    displayMovieGrid(movies, container);
  }
  
  function setupMovieIdInput() {
    const loadBtn = document.getElementById('loadMovieBtn');
    const input = document.getElementById('movieIdInput');
    
    if (loadBtn && input) {
      loadBtn.addEventListener('click', () => {
        const movieId = input.value.trim();
        if (movieId) {
          window.location.href = `details.html?id=${movieId}`;
        }
      });
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          loadBtn.click();
        }
      });
    }
  }
  
  // ===== BROWSE PAGE =====
  async function initializeBrowsePage() {
    await setupGenreFilter();
    setupFilterControls();
    setupSearch();
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('search')) {
      await performBrowseSearch(urlParams.get('search'));
    } else if (urlParams.has('genre')) {
      currentFilters.genre = urlParams.get('genre');
      await loadFilteredMovies();
    } else {
      await loadFilteredMovies();
    }
  }
  
  async function setupGenreFilter() {
    const genreFilter = document.getElementById('genreFilter');
    if (!genreFilter) return;
    
    try {
      allGenres = await fetchGenres();
      
      const options = allGenres.map(genre => 
        `<option value="${genre.id}">${genre.name}</option>`
      ).join('');
      
      genreFilter.innerHTML = '<option value="">All Genres</option>' + options;
      
      // Set from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('genre')) {
        genreFilter.value = urlParams.get('genre');
      }
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  }
  
  function setupFilterControls() {
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    if (applyBtn) {
      applyBtn.addEventListener('click', async () => {
        currentFilters = {
          genre: document.getElementById('genreFilter').value,
          year: document.getElementById('yearFilter').value,
          rating: document.getElementById('ratingFilter').value,
          sort: document.getElementById('sortFilter').value,
          page: 1
        };
        
        await loadFilteredMovies();
      });
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('genreFilter').value = '';
        document.getElementById('yearFilter').value = '';
        document.getElementById('ratingFilter').value = '0';
        document.getElementById('sortFilter').value = 'popularity.desc';
        
        currentFilters = { page: 1 };
        loadFilteredMovies();
      });
    }
  }
  
  async function loadFilteredMovies() {
    const container = document.getElementById('browseResults');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!container) return;
    
    try {
      container.innerHTML = '<div class="loading">Loading movies...</div>';
      
      const data = await discoverMovies(currentFilters);
      
      if (resultsTitle) {
        resultsTitle.textContent = getFilterTitle();
      }
      
      if (resultsCount) {
        resultsCount.textContent = `Found ${data.totalResults.toLocaleString()} movies`;
      }
      
      displayMovieGrid(data.results, container);
      displayPagination(data.currentPage, data.totalPages);
    } catch (error) {
      container.innerHTML = '<div class="error">Failed to load movies. Please try again.</div>';
    }
  }
  
  function getFilterTitle() {
    if (currentFilters.genre && allGenres.length > 0) {
      const genre = allGenres.find(g => g.id == currentFilters.genre);
      return `${genre ? genre.name : 'Filtered'} Movies`;
    }
    return 'All Movies';
  }
  
  async function performBrowseSearch(query) {
    const container = document.getElementById('browseResults');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!container) return;
    
    try {
      container.innerHTML = '<div class="loading">Searching...</div>';
      
      const movies = await searchMovies(query);
      
      if (resultsTitle) {
        resultsTitle.textContent = `Search Results for "${query}"`;
      }
      
      if (resultsCount) {
        resultsCount.textContent = `Found ${movies.length} movies`;
      }
      
      displayMovieGrid(movies, container);
    } catch (error) {
      container.innerHTML = '<div class="error">Search failed. Please try again.</div>';
    }
  }
  
  function displayPagination(currentPage, totalPages) {
    const container = document.getElementById('pagination');
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }
    
    const maxPages = Math.min(totalPages, 10);
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= maxPages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    // Next button
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>`;
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (!isNaN(page)) {
          currentFilters.page = page;
          loadFilteredMovies();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
  
  // ===== UTILITY FUNCTIONS =====
  function showError(message) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `<div class="container"><div class="error">${message}</div></div>`;
    }
  }