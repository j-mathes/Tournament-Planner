# Tournament Planner

Browser-based tournament organizer — static web app, no backend, no build tools.

## Features

- **Tournament setup** — name, dates, divisions, teams, venues/courts
- **Match formats** — Best of 3, Best of 5, Two Sets to 25, Single Set to 25 (per division)
- **Pool play** — round-robin match generation per division
- **Bracket formats** — Single Elimination, Consolation Bracket, Double Elimination, Swiss System
- **Scheduling** — auto-assign venue/court/time; conflict detection for team and court overlaps
- **Work assignments** — auto-assign and balance officiation duties; conflict warnings
- **Standings** — wins ? set ratio ? point ratio tiebreakers; CSV export
- **Public display** — court board, live standings, and match schedule views (full-screen ready)
- **Admin panel** — PIN-protected kiosk lock, audit log, division status board, test data generator
- **Data portability** — JSON full export/import, CSV team and schedule export, bracket JSON export/import
- **PWA** — installable, offline-capable via Service Worker

## Tech Stack

- HTML, CSS, Vanilla JavaScript (ES6+, strict mode)
- No build tools, no dependencies, no frameworks
- Browser `localStorage` for persistence (`tp.static.v1`)
- Progressive Web App (Service Worker + Web App Manifest)

## Getting Started

```
git clone https://github.com/j-mathes/Tournament-Planner.git
cd Tournament-Planner
# Open index.html directly, or serve locally:
python -m http.server 8080
```

Then open http://localhost:8080.

## Deploy to GitHub Pages

1. Push to the `main` branch.
2. In repository settings ? **Pages**, set source to **Deploy from a branch**.
3. Select `main` branch, root folder, and save.

## Project Structure

| File/Folder | Purpose |
|---|---|
| `index.html` | App layout and all views |
| `styles.css` | Responsive UI styling |
| `app.js` | All app logic, state, rendering, persistence |
| `manifest.json` | PWA manifest |
| `sw.js` | Service Worker (cache-first offline support) |
| `icon.svg` | App icon |
| `Specifications/` | Product and system requirements documentation |
| `AGENT_INSTRUCTIONS.md` | Project-specific AI implementation guidance |

## License

This project is licensed under [CC BY-NC-SA 4.0](LICENSE).
