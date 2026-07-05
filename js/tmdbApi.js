// =====================================================
// tmdbApi.js — ES6 class wrapping all TMDB API calls
// =====================================================

class TMDBApi {
  constructor() {
    this.apiKey = '5172ee980b994289713571386d5686eb';
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBase = 'https://image.tmdb.org/t/p/w500';
  }

  // Build a full poster URL from a TMDB poster_path
  getPosterUrl(posterPath) {
    if (!posterPath) return null;
    return `${this.imageBase}${posterPath}`;
  }

  // Fetch the full list of movie genres from TMDB
  async getGenres() {
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch genres');
    const data = await response.json();
    return data.genres; // [{ id, name }, ...]
  }

  // Discover movies by one or more genre IDs, with pagination
  async discoverByGenres(genreIds = [], page = 1) {
    const genreParam = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : '';
    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=en-US&sort_by=popularity.desc&page=${page}${genreParam}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movies');
    const data = await response.json();
    return {
      movies: data.results,
      totalPages: Math.min(data.total_pages, 500), // TMDB caps at 500 pages
      currentPage: data.page,
    };
  }

  // Search movies by title query, with pagination
  async searchMovies(query, page = 1) {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search movies');
    const data = await response.json();
    return {
      movies: data.results,
      totalPages: Math.min(data.total_pages, 500),
      currentPage: data.page,
    };
  }
}
