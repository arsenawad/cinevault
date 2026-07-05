// =====================================================
// movieModal.js — Netflix-style modal for movies.html
// Fetches full movie details from TMDB on card click
// =====================================================

class MovieModal {
  constructor(apiKey) {
    this.apiKey       = apiKey;
    this.imageBase    = 'https://image.tmdb.org/t/p/w500';
    this.backdropBase = 'https://image.tmdb.org/t/p/w1280';
    this.modal        = new bootstrap.Modal(document.getElementById('movieModal'));
  }

  async open(movieId) {
    // Show modal immediately with loading state
    document.getElementById('modalTitle').textContent    = 'Loading…';
    document.getElementById('modalOverview').textContent = '';
    document.getElementById('modalGenre').textContent    = '';
    document.getElementById('modalYear').textContent     = '';
    document.getElementById('modalRating').textContent   = '';
    document.getElementById('modalRuntime').textContent  = '';
    document.getElementById('modalPoster').src           = '';
    document.getElementById('modalBackdrop').style.backgroundImage = 'none';
    this.modal.show();

    // Fetch full details
    const data = await this.fetchDetails(movieId);
    if (!data) {
      document.getElementById('modalTitle').textContent = 'Could not load details.';
      return;
    }

    this.populate(data);
  }

  async fetchDetails(id) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=en-US`
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  populate(data) {
    // Backdrop
    const backdrop = document.getElementById('modalBackdrop');
    backdrop.style.backgroundImage = data.backdrop_path
      ? `url(${this.backdropBase}${data.backdrop_path})`
      : 'none';

    // Poster
    const poster = document.getElementById('modalPoster');
    poster.src = data.poster_path ? `${this.imageBase}${data.poster_path}` : '';
    poster.alt = data.title;

    // Genre (first one from array)
    const genre = data.genres && data.genres.length > 0 ? data.genres[0].name : '';
    document.getElementById('modalGenre').textContent = genre;

    // Title
    document.getElementById('modalTitle').textContent = data.title;

    // Meta
    document.getElementById('modalYear').textContent    = data.release_date ? data.release_date.slice(0, 4) : '';
    document.getElementById('modalRating').textContent  = data.vote_average ? `★ ${data.vote_average.toFixed(1)}` : '';
    document.getElementById('modalRuntime').textContent = data.runtime ? `${data.runtime} min` : '';

    // Overview
    document.getElementById('modalOverview').textContent = data.overview || 'No description available.';
  }
}

// Attach to window so movieRenderer can call it
document.addEventListener('DOMContentLoaded', () => {
  window.movieModal = new MovieModal('5172ee980b994289713571386d5686eb');
});
