// =====================================================
// movieApp.js — ES6 class orchestrating the whole page
// =====================================================

class MovieApp {
  constructor() {
    this.api          = new TMDBApi();
    this.renderer     = new MovieRenderer();
    this.genres       = [];        // full genre list from TMDB
    this.activeGenres = [];        // genre IDs currently selected
    this.currentPage  = 1;
    this.totalPages   = 1;
    this.searchQuery  = '';
    this.searchTimer  = null;      // debounce timer for search input

    this.searchInput  = document.getElementById('searchInput');
    this.retryBtn     = document.getElementById('retryBtn');
  }

  // ── Boot ───────────────────────────────────────────

  async init() {
    this.bindEvents();
    await this.loadGenres();
    await this.fetchAndRender();
  }

  // ── Event wiring ───────────────────────────────────

  bindEvents() {
    // Search — debounced so we don't fire on every keystroke
    this.searchInput.addEventListener('input', () => {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.searchQuery  = this.searchInput.value.trim();
        this.currentPage  = 1;
        this.activeGenres = []; // clear genre filters when searching
        this.renderer.updateGenreButtons([]);
        this.fetchAndRender();
      }, 400);
    });

    // Retry button in error state
    this.retryBtn.addEventListener('click', () => this.fetchAndRender());
  }

  // ── Genres ─────────────────────────────────────────

  async loadGenres() {
    try {
      this.genres = await this.api.getGenres();
      this.renderer.renderGenres(this.genres, this.activeGenres, (id) => this.toggleGenre(id));
    } catch {
      // Non-fatal: genres are also hard-coded in HTML as fallback;
      // just leave the static buttons in place
    }
  }

  toggleGenre(genreId) {
    const idx = this.activeGenres.indexOf(genreId);
    if (idx === -1) {
      this.activeGenres.push(genreId);
    } else {
      this.activeGenres.splice(idx, 1);
    }
    this.searchQuery = '';             // clear search when filtering by genre
    this.searchInput.value = '';
    this.currentPage = 1;
    this.renderer.updateGenreButtons(this.activeGenres);
    this.fetchAndRender();
  }

  // ── Fetch + render cycle ───────────────────────────

  async fetchAndRender() {
    this.renderer.showLoading();

    try {
      let result;

      if (this.searchQuery.length > 0) {
        // Search mode: use the search endpoint
        result = await this.api.searchMovies(this.searchQuery, this.currentPage);
      } else {
        // Browse mode: use discover with optional genre filter
        result = await this.api.discoverByGenres(this.activeGenres, this.currentPage);
      }

      const { movies, totalPages, currentPage } = result;
      this.totalPages  = totalPages;
      this.currentPage = currentPage;

      if (movies.length === 0) {
        this.renderer.showEmpty();
        return;
      }

      this.renderer.renderMovies(movies, this.api);
      this.renderer.renderPagination(this.currentPage, this.totalPages, (page) => {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.fetchAndRender();
      });

    } catch (err) {
      console.error('MovieApp fetch error:', err);
      this.renderer.showError();
    }
  }
}

// ── Boot when DOM is ready ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const app = new MovieApp();
  app.init();
});
