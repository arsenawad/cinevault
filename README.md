# CineVault — Multi-Genre Movie Explorer

**Student:** Arsen Awad  
**Course:** Full Stack Development — Final Project 2026  
**Institution:** Lebanese University, Faculty of Engineering, Branch 2 - Roumieh

---

## Project Description

CineVault is a multi-genre movie discovery website that lets users search, filter, and explore films across 8 genres in real time. It pulls live data from The Movie Database (TMDB) API and displays results as interactive movie cards. Clicking any card opens a Netflix-style detail modal showing the backdrop, poster, rating, runtime, and overview. The site also includes a personal "My Favourites" page — a hand-picked collection of 15 films across genres, each with a detail modal powered by the same API.

---

## API Used

**The Movie Database (TMDB) API**  
- Base URL: `https://api.themoviedb.org/3`
- Registration required — API key used for all requests
- Endpoints used:
  - `/genre/movie/list` — fetch genre list dynamically
  - `/discover/movie` — browse movies filtered by genre
  - `/search/movie` — search movies by title
  - `/movie/{id}` — fetch full movie details for the modal

---

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, stats strip, how it works, genre grid, testimonials, CTA |
| Explore Movies | `movies.html` | Live TMDB data, genre filters, search, pagination, modal |
| My Favourites | `database.html` | 15 hand-picked films, genre tabs, poster grid, modal |

---

## Technologies Used

- Semantic HTML5
- Hand-written CSS3 with custom design tokens
- Flexbox and CSS Grid for layout
- Bootstrap 5 (navbar, cards, modal, grid)
- Vanilla JavaScript — ES6 classes only (no jQuery)
- TMDB REST API (fetch-based, no library)

---

## JavaScript Classes (ES6)

| Class | File | Responsibility |
|---|---|---|
| `TMDBApi` | `js/tmdbApi.js` | All TMDB API fetch calls |
| `MovieRenderer` | `js/movieRenderer.js` | Renders movie cards, genre buttons, pagination |
| `MovieApp` | `js/movieApp.js` | Orchestrates search, filter, pagination flow |
| `MovieModal` | `js/movieModal.js` | Fetches and displays movie detail modal on Explore page |
| `CuratedApp` | `js/curatedApp.js` | Fetches posters and handles modal on My Favourites page |
| `CuratedFilter` | `js/curatedFilter.js` | Genre tab filtering on My Favourites page |

---

## Unique Front-End Requirement

**Testimonials section styled with Bootstrap cards**

Located on `index.html` in the `#testimonials` section. Six Bootstrap `.card` components are arranged in a responsive 3-column grid, each containing a large quote mark, a viewer testimonial, the author name, and their role. The section is styled with custom CSS on top of Bootstrap's card component — dark background, gold accent borders, and hover lift animation. The requirement is marked with a comment in the HTML source code.

---

## Deployment

- **Live URL:** `[https://cinevault-asren.netlify.app/]`
- **GitHub Repository:** `[https://github.com/arsenawad/cinevault]`

---

## Screenshots

Screenshots at mobile (375px), tablet (768px), and desktop (1440px) widths are saved in the `/screenshots` folder of this repository.

---

## AI-Use Appendix

### Tools Used

| Tool | Used For |
|---|---|
| **Claude (Anthropic)** | Project planning, HTML structure, CSS design system, all JS class architecture, debugging genre tab filtering, modal layout, README |
| **ChatGPT (OpenAI)** | Cross-checking TMDB API endpoint syntax, asking about Bootstrap 5 modal options |

---

### Sample Prompts Used

**Prompt 1 (Claude):**
> "I have a full stack project with these requirements, I need some ideas and a plan to follow starting from the front end reaching to the backend. I need a detailed guide."

**Prompt 2 (Claude):**
> "In the curated picks the old layouts are still showing, remove them. Also I don't like the home page, make it better structured, add some nice pictures."

**Prompt 3 (ChatGPT):**
> "What is the correct TMDB API endpoint to get full movie details including runtime and genres by movie ID?"

---

### What the AI Got Wrong

**Issue 1 — Genre tabs not filtering**

Claude built the genre tab buttons in `database.html` but initially added `disabled` attributes to all tabs except "All", and never wrote the JavaScript to actually filter the cards. The tabs showed in the UI but clicking Drama, Horror, etc. did nothing. I identified this by clicking the tabs and seeing no change in the displayed cards. The fix was to remove the `disabled` attributes from all tab buttons and create a new `CuratedFilter` JS class that listens for tab clicks and toggles card visibility by matching the `.curated-genre-tag` text against the selected tab label.

**Issue 2 — Old duplicate cards still showing**

After updating the curated picks to the new poster-only layout, the old text-description cards from a previous version were still showing below the new ones. This happened because Claude's edits appended new card blocks without fully replacing the old ones. The file had two complete sets of cards — the new poster cards and the old text-only cards — stacked one after the other. I identified this by scrolling down on the page and seeing repeated movie entries. The fix was to completely rewrite `database.html` from scratch, ensuring only one set of 15 cards exists in the file.
