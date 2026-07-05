// =====================================================
// curatedFilter.js — filters curated cards by genre tab
// =====================================================

class CuratedFilter {
  constructor() {
    this.tabs  = document.querySelectorAll('#curatedTabs .nav-link');
    this.cards = document.querySelectorAll('#curatedGrid .col-md-4');
    this.bindEvents();
  }

  bindEvents() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selected = tab.textContent.trim().toLowerCase();
        this.filterCards(selected);
      });
    });
  }

  filterCards(genre) {
    this.cards.forEach(col => {
      const tag = col.querySelector('.curated-genre-tag');
      if (!tag) return;
      const cardGenre = tag.textContent.trim().toLowerCase();

      if (genre === 'all' || cardGenre === genre) {
        col.style.display = '';
      } else {
        col.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new CuratedFilter());
