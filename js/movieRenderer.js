// =====================================================
// movieRenderer.js — ES6 class handling all DOM updates
// =====================================================

class MovieRenderer {
  constructor() {
    this.grid        = document.getElementById('movieGrid');
    this.pagination  = document.getElementById('pagination');
    this.loading     = document.getElementById('loadingState');
    this.error       = document.getElementById('errorState');
    this.empty       = document.getElementById('emptyState');
    this.genreRow    = document.getElementById('genreFilters');
  }

  // ── State helpers ──────────────────────────────────

  showLoading() {
    this.grid.innerHTML = '';
    this.pagination.innerHTML = '';
    this.loading.classList.remove('d-none');
    this.error.classList.add('d-none');
    this.empty.classList.add('d-none');
  }

  showError() {
    this.loading.classList.add('d-none');
    this.error.classList.remove('d-none');
    this.grid.innerHTML = '';
    this.pagination.innerHTML = '';
  }

  showEmpty() {
    this.loading.classList.add('d-none');
    this.empty.classList.remove('d-none');
    this.grid.innerHTML = '';
    this.pagination.innerHTML = '';
  }

  hideStates() {
    this.loading.classList.add('d-none');
    this.error.classList.add('d-none');
    this.empty.classList.add('d-none');
  }

  // ── Genre filter buttons ───────────────────────────

  renderGenres(genres, activeIds, onToggle) {
    this.genreRow.innerHTML = '';
    genres.forEach(genre => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'genre-ticket' + (activeIds.includes(genre.id) ? ' active' : '');
      btn.dataset.genreId = genre.id;
      btn.textContent = genre.name;
      btn.addEventListener('click', () => onToggle(genre.id));
      this.genreRow.appendChild(btn);
    });
  }

  // Update active/inactive state on genre buttons without re-rendering all
  updateGenreButtons(activeIds) {
    this.genreRow.querySelectorAll('.genre-ticket').forEach(btn => {
      const id = parseInt(btn.dataset.genreId);
      btn.classList.toggle('active', activeIds.includes(id));
    });
  }

  // ── Movie cards ────────────────────────────────────

  renderMovies(movies, api) {
    this.hideStates();
    this.grid.innerHTML = '';

    movies.forEach(movie => {
      const posterUrl = api.getPosterUrl(movie.poster_path);
      const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

      const col = document.createElement('div');
      col.className = 'col-6 col-sm-4 col-md-3';

      col.innerHTML = `
        <div class="movie-card" data-movie-id="${movie.id}" style="cursor:pointer;">
          ${posterUrl
            ? `<img src="${posterUrl}" alt="Poster for ${movie.title}" loading="lazy">`
            : `<div class="no-poster">No Poster</div>`
          }
          <div class="curated-poster-overlay"><span>View Details</span></div>
          <div class="movie-card-body">
            <p class="movie-card-title">${movie.title}</p>
            <div class="movie-card-meta">
              <span>${year}</span>
              <span class="movie-card-rating">★ ${rating}</span>
            </div>
          </div>
        </div>
      `;

      col.querySelector('.movie-card').addEventListener('click', () => {
        window.movieModal.open(movie.id);
      });

      this.grid.appendChild(col);
    });
  }

  // ── Pagination ─────────────────────────────────────

  renderPagination(currentPage, totalPages, onPageChange) {
    this.pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end   = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    // Prev button
    const prev = this.#makePageItem('&laquo; Prev', currentPage === 1, () => onPageChange(currentPage - 1));
    this.pagination.appendChild(prev);

    // Page number buttons
    for (let p = start; p <= end; p++) {
      const item = this.#makePageItem(p, false, () => onPageChange(p));
      if (p === currentPage) item.querySelector('.page-link').classList.add('active-page');
      this.pagination.appendChild(item);
    }

    // Next button
    const next = this.#makePageItem('Next &raquo;', currentPage === totalPages, () => onPageChange(currentPage + 1));
    this.pagination.appendChild(next);
  }

  // Private helper: build a single <li> pagination item
  #makePageItem(label, disabled, onClick) {
    const li = document.createElement('li');
    li.className = 'page-item' + (disabled ? ' disabled' : '');
    const a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = label;
    a.href = '#';
    if (!disabled) {
      a.addEventListener('click', e => {
        e.preventDefault();
        onClick();
      });
    }
    li.appendChild(a);
    return li;
  }
}
