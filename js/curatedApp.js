// =====================================================
// curatedApp.js — fetches TMDB posters for curated cards
// and handles the Netflix-style detail modal
// =====================================================

// Descriptions stored here (keyed by TMDB ID) since the HTML only holds the title
const MOVIE_DESCRIPTIONS = {
  302699: "Dwayne Johnson and Kevin Hart make one of the funniest on-screen pairings of the decade — a former high school nerd turned CIA agent drags his accountant classmate into a wild spy mission.",
  587807: "The classic cat-and-mouse duo brought into a live-action New York setting — pure nostalgic fun with the same chaotic energy that made the originals timeless.",
  174349: "Aaron Paul trades Breaking Bad for a cross-country street racing revenge story — practical car stunts, no CGI shortcuts, and a relentless pace from start to finish.",
  18785:  "Three groomsmen wake up in a trashed Las Vegas hotel suite with no memory of the night before and a missing groom. One of the funniest mystery-comedies ever made.",
  20352:  "A supervillain adopts three orphan girls as part of an evil plan — and completely loses the plot. The Minions are a bonus, but the heart of this film is genuinely earned.",
  168259: "The franchise at its peak — cars parachuting from planes, a fight through a collapsing skyscraper, and one of cinema's most genuinely moving send-offs for Paul Walker.",
  419430: "Jordan Peele's debut is a masterclass in slow-building dread — a Black man visiting his white girlfriend's family uncovers something far darker than an awkward weekend.",
  447332: "A family survives in a post-apocalyptic world where any sound means death. John Krasinski turned near-silence into one of the most tense cinematic experiences in recent memory.",
  157336: "Christopher Nolan sends a crew through a wormhole to save humanity — part hard science, part emotional gut-punch, with a docking sequence that will make your palms sweat.",
  286217: "Matt Damon gets stranded alone on Mars and has to science his way to survival. Ridley Scott makes problem-solving feel genuinely thrilling across every frame.",
  11036:  "Ryan Gosling and Rachel McAdams in the romance film that defined a generation — a summer love story told across decades, with a final scene that still hits every time.",
  65759:  "Steve Carell, Ryan Gosling, and Emma Stone in a sharp, funny, and surprisingly layered romantic comedy that earns every twist it throws at you in the third act.",
  210577: "A wife goes missing on her anniversary and her husband becomes the prime suspect. David Fincher's adaptation keeps you second-guessing everything right up to its deeply unsettling ending.",
  146233: "Hugh Jackman and Jake Gyllenhaal in a relentlessly tense kidnapping thriller — a film that asks how far a parent would go, and doesn't let either the characters or audience off the hook.",
  1402:   "Will Smith's best performance — a true story of a broke single father who refuses to give up on an unpaid internship as his last shot at turning his life around.",
};

class CuratedApp {
  constructor() {
    this.apiKey    = '5172ee980b994289713571386d5686eb';
    this.imageBase = 'https://image.tmdb.org/t/p/w500';
    this.backdropBase = 'https://image.tmdb.org/t/p/w1280';
    this.cards     = document.querySelectorAll('.curated-col');
    this.modal     = new bootstrap.Modal(document.getElementById('movieModal'));
    this.movieData = {}; // cache fetched data by tmdb id
  }

  async init() {
    await this.loadAllPosters();
    this.bindCardClicks();
  }

  // ── Fetch poster for every card in parallel ────────

  async loadAllPosters() {
    const fetches = Array.from(this.cards).map(col => {
      const id = col.dataset.tmdbId;
      return this.fetchMovieData(id).then(data => {
        if (!data) return;
        this.movieData[id] = data;
        const img = col.querySelector('.curated-poster');
        if (img && data.poster_path) {
          img.src = `${this.imageBase}${data.poster_path}`;
        }
      });
    });
    await Promise.allSettled(fetches);
  }

  async fetchMovieData(id) {
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

  // ── Card click → open modal ────────────────────────

  bindCardClicks() {
    this.cards.forEach(col => {
      col.style.cursor = 'pointer';
      col.addEventListener('click', () => {
        const id   = col.dataset.tmdbId;
        const data = this.movieData[id];
        const genre = col.querySelector('.curated-genre-tag').textContent;
        const title = col.querySelector('.curated-title').textContent;
        this.openModal(id, title, genre, data);
      });
    });
  }

  openModal(id, title, genre, data) {
    // Poster
    const poster = document.getElementById('modalPoster');
    poster.src = data?.poster_path ? `${this.imageBase}${data.poster_path}` : '';
    poster.alt = title;

    // Backdrop
    const backdrop = document.getElementById('modalBackdrop');
    if (data?.backdrop_path) {
      backdrop.style.backgroundImage = `url(${this.backdropBase}${data.backdrop_path})`;
    } else {
      backdrop.style.backgroundImage = 'none';
    }

    // Text content
    document.getElementById('modalGenre').textContent  = genre;
    document.getElementById('modalTitle').textContent  = title;
    document.getElementById('modalDesc').textContent   = MOVIE_DESCRIPTIONS[id] || '';
    document.getElementById('modalOverview').textContent = data?.overview || '';

    // Meta
    const year    = data?.release_date ? data.release_date.slice(0, 4) : '';
    const rating  = data?.vote_average ? `★ ${data.vote_average.toFixed(1)}` : '';
    const runtime = data?.runtime      ? `${data.runtime} min` : '';
    document.getElementById('modalYear').textContent    = year;
    document.getElementById('modalRating').textContent  = rating;
    document.getElementById('modalRuntime').textContent = runtime;

    this.modal.show();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new CuratedApp();
  app.init();
});
