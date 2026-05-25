# Tournament Planner

Tournament Planner is a browser-based tournament organizer that runs as a static web app with no backend or build tools required.

It is designed to:
- Run locally by opening the app in a browser
- Run on GitHub Pages without backend services
- Store data in the browser using localStorage
- Stay lightweight and easy to maintain

## Current Features

### Tournament Setup
- Name, start date, end date

### Division Management
- Add, edit, delete divisions
- Assign a match format per division (Best of 3, Best of 5, Two Sets to 25, Single Set to 25)

### Team Management
- Add, edit, delete teams
- Assign teams to divisions
- Optional team seed
- Bulk CSV import with validation preview (warnings for unknown division, duplicates, invalid seed; errors for missing name)
- CSV export and blank template download

### Venue & Court Management
- Add, edit, delete venues
- Define multiple courts per venue

### Match Management
- Generate round-robin pool matches per division
- Inline per-match assignment editor (venue, court, start time)
- Auto-assign venue, court, and start time by division
- Filter matches by division, venue, court, and status
- Match rows labeled by phase (pool / bracket / consolation / losers / swiss / etc.)
- Scheduling conflict warnings — team overlap and court overlap badges on affected matches
- Enter set scores; clear match scores
- Automatic winner, loser, and status updates
- Lock matches to prevent edits; forfeit support with automatic winner assignment and bracket progression

### Bracket Formats

**Single Elimination**
- Generate bracket per division, or seed from current pool play standings
- Auto-advance bye matches
- Automatic winner progression to later rounds
- Round labels: Round N → Semifinal → Final
- Bracket integrity validation with one-click repair actions (fix self-matches, duplicates, invalid winners, or all at once)

**Consolation Bracket** *(add-on to single elimination)*
- Add a consolation bracket from first-round losers
- Consolation slots auto-fill as main bracket Round 1 matches complete
- Separate round labels: Consolation Round N → Consolation Semifinal → Consolation Final
- Clear consolation bracket independently of main bracket

**Double Elimination**
- Full Winners Bracket + Losers Bracket + Grand Final
- Winners Bracket labeled WB Round N / WB Semifinal / WB Final
- Losers Bracket alternates dropout rounds (WB losers enter) and consolidation rounds
- Rounds labeled LB Round N / LB Semifinal / LB Final
- Grand Final auto-populates with WB champion vs LB champion; displays division champion on completion
- Switching back to single elimination clears the losers bracket and grand final automatically

**Swiss System**
- Round-by-round pairing; no eliminations
- Round 1 seeded from pool play standings (or alphabetical if no pool play)
- Subsequent rounds pair teams within win-count groups, avoiding rematches where possible
- Odd group size: bottom team floats down to the next group; final odd-out receives a bye
- Buchholz tiebreaker (sum of opponents' win counts)
- Live standings table after each round showing rank, W-L, and Buchholz score
- Generate rounds one at a time; app enforces completion of the current round before advancing
- Clear all Swiss rounds with confirmation

### Bracket Scheduling
- Auto-schedule bracket rounds by venue, court, and start time
- Semifinal/final priority gap support
- Division-specific bracket JSON export and import

### Work Assignments
- Assign a work team (officiate/scorekeep) per match
- Auto-assign work teams across a division, balanced by workload
- Team cannot work a match they are playing in
- Manual inline override per match
- Work conflict warnings when a team is scheduled to both play and work in the same time slot
- Slot-aware conflict detection across all match stages (pool, bracket, swiss, etc.)

### Standings
- Pool standings: wins, set ratio, point ratio tiebreakers
- Division standings with cross-pool ranking
- Final results summary showing division champion and full ranked list
- CSV export

### Public Display Engine
- **Court board** — matches grouped by court with Now Playing / Up Next cards (teams, division, format, time, work team)
- **Live standings** — all-divisions or filtered standings grid, champion highlighted
- **Match schedule** — in-progress and upcoming matches with venue/court/time/work context
- Venue and division filters across all modes
- Full-screen button for TV/projector use

### Team Schedule
- Team-specific schedule view showing both playing and working assignments with role badges
- Print workflow

### Admin Panel
- Tournament setup form
- Data export/import as JSON; full reset
- Bulk team import/export (CSV)
- Generate test tournament data (Spring Classic 2026 — 4 divisions, 4 teams each, 2 venues, scheduled matches)
- Admin PIN lock — set a 4-digit PIN; lock nav into read-only kiosk mode; PIN recovery flow for forgotten PINs
- When locked: Divisions, Teams, Venues, Matches, and Admin tabs hidden; all edit forms and write buttons suppressed
- Audit log — last 100 admin actions with timestamps (score saves, forfeits, locks/unlocks, imports, PIN changes)
- Division status board — per-division match completion progress and champion

### Printing & Exporting
- Court schedule print — matches grouped by venue and court with work team and format
- Work assignment sheet print
- Match schedule CSV export (division, stage, round, teams, venue, court, time, format, status, sets, winner, work team)
- Standings CSV export
- Bracket print workflow
- Team schedule print

### PWA
- Installable on desktop and mobile
- Offline-capable via Service Worker (cache-first)

---

## Tech Stack

- HTML, CSS, Vanilla JavaScript (ES6+, strict mode)
- No build tools, no dependencies, no frameworks
- Browser localStorage for persistence
- Progressive Web App (Service Worker + Web App Manifest)

## Getting Started

1. Clone the repository.
2. Open `index.html` in your browser.

Optional local static server:

```
python -m http.server 8080
```

Then open http://localhost:8080.

## Deploy to GitHub Pages

1. Push to the `main` branch.
2. In repository settings → Pages, set source to **Deploy from a branch**.
3. Select `main` branch, root folder, and save.
4. Open the published URL.

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

## Data Persistence

All data is saved to localStorage under a versioned key (`tp.static.v1`).

Stored data includes:
- Tournament metadata
- Divisions, teams, venues and courts
- Matches, assignments, scores, audit log

Notes:
- Data is browser-specific and not synced across devices
- Use JSON export regularly for backups
- Clearing browser storage removes all saved data

## Current Limitations

- No multi-user synchronization
- No backend or authentication
- Scheduling uses slot sequencing and court rotation (no advanced constraint solver)
- Pool → Tier → Crossover → Full Placement (volleyball hybrid format) not yet implemented
- No drag-and-drop scheduling

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

Copyright (c) 2026 Jared Mathes


- Tournament setup
  - Name, start date, end date
- Division management
  - Add, edit, delete divisions
- Team management
  - Add, edit, delete teams
  - Assign teams to divisions
  - Optional team seed
- Venue and court management
  - Add, edit, delete venues
  - Define multiple courts per venue
- Match management
  - Generate round-robin matches per division
  - Auto-assign venue, court, and start time by division
  - Inline per-match assignment editor (Assign / Edit / Clear Assignment)
  - Filter matches by division, venue, court, and status
  - Match rows identify pool vs bracket phase
  - Scheduling conflict warnings for team overlaps and court overlaps
  - Conflict badges on affected matches
  - Enter set scores
  - Clear match scores
  - Automatic winner and status updates
- Brackets
  - Generate single-elimination bracket per division
  - Generate bracket seeded from current division standings
  - Auto-schedule bracket rounds by venue/court/time
  - Semifinal/final priority gap support in bracket auto-scheduling
  - Auto-advance bye matches
  - Automatic winner progression to later rounds
  - Bracket board grouped by rounds
  - Bracket integrity validation warnings (duplicates, malformed rounds, missing teams, invalid winners)
  - One-click bracket repair actions (fix self-matches, duplicate round entries, invalid/missing winners, or all at once)
  - Bracket print workflow
- Work assignments
  - Work team (officiate/scorekeep) assignment per match
  - Auto-assign work teams across a division, balanced by workload
  - Team cannot be assigned to work a match they are playing in
  - Manual override with inline team picker per match
  - Work conflict warnings when a team is both playing and working in the same slot
  - Team schedule view shows both playing and working entries with role badge
- Match formats
  - Predefined volleyball formats: Best of 3 (25/25/15), Best of 5, Two Sets to 25, Single Set to 25
  - Format assigned per division
  - Score entry form shows correct number of set inputs and placeholders for the format
  - Soft score validation warns if set scores don't match format rules (target points, win-by-two, cap)
  - Auto-scheduling uses format duration when no manual duration is set
- Printing and exporting
  - Court schedule print — matches grouped by venue and court, with work team and format, for posting at each court
  - Work assignment sheet print — division-filtered list of all work team assignments
  - CSV export for match schedule (division, stage, round, teams, venue, court, time, format, status, sets, winner, work team)
  - CSV export for standings
  - Final results summary on the Standings view — shows division champion (from completed bracket) and ranked standings
  - Division-specific bracket JSON export
  - Division-specific bracket JSON import
- Admin panel
  - Dashboard alerts — color-coded warnings for in-progress matches, missing work teams, work conflicts, and locked matches
  - Division status table — per-division view of pools/bracket generation state, match completion progress, and champion
  - Match locking — lock any match to prevent score edits, assignment changes, and forfeit actions; unlock at any time
  - Forfeit support — mark a match as forfeited by selecting the forfeiting team; winner is set automatically and bracket progression triggers
- Standings
  - Ranking by wins
  - Tiebreakers by set ratio, then point ratio
- Public display engine
  - Court board mode — matches grouped by court with "Now Playing" / "Up Next" cards showing teams, division, format, time, and work team
  - Live standings mode — all-divisions (or filtered) standings grid updating instantly as results are entered; champion highlighted
  - Match schedule mode — in-progress and upcoming matches list with venue/court/time/work team context
  - Venue and division filters apply across all three modes
  - Full-screen button (browser native fullscreen API) for TV/projector use
- Team schedule
  - Team-specific schedule view with team filter
  - Team schedule print workflow
- Data import & export
  - Export all teams as CSV
  - Download a pre-formatted CSV template with column headers and an example row (division names pre-filled)
  - Import teams from CSV — flexible header detection (name, club, coach, division, seed); shows a validation preview table before applying: ✔ valid rows, ⚠ warnings (unknown division, already exists, invalid seed), ✗ errors (missing name); applies only valid rows on confirm
  - Export match schedule as CSV (already in Matches view)
  - Export standings as CSV (already in Standings view)
  - Export / import full app data as JSON (in Dashboard)
  - Export / import division bracket structure as JSON (in Brackets view)
- Printing
  - Print-friendly schedule and standings output with context header (event, dates, filter/team/division)
  - Dedicated print actions for Matches, Team Schedule, Standings, and Brackets
- User permissions & admin security
  - Admin PIN lock — set a 4-digit PIN in the Dashboard; click "🔒 Lock" in the nav to enter read-only kiosk mode; entering the PIN unlocks full admin access
  - When locked: Divisions, Teams, Venues, and Matches nav tabs are hidden; all edit forms, score entry, and write buttons are suppressed via CSS
  - Audit log — last 100 admin actions recorded with timestamps; shown in the Dashboard; entries include score saves, forfeits, match locks/unlocks, CSV imports, and PIN changes

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (ES6+, strict mode)
- Browser localStorage persistence
- Progressive Web App (PWA) — installable, offline-capable via Service Worker

## Getting Started

1. Clone the repository.
2. Open index.html in your browser.
3. Start creating your tournament data.

Optional local static server:

  python -m http.server 8080

Then open http://localhost:8080.

## Deploy to GitHub Pages

1. Push to the main branch.
2. In repository settings, open Pages.
3. Set source to Deploy from a branch.
4. Select main branch and root folder.
5. Save and open the published URL.

## Project Structure

- index.html: App layout and views
- styles.css: Responsive UI styling
- app.js: App logic, state management, rendering, and persistence
- Specifications: Product and system requirements documentation
- AGENT_INSTRUCTIONS.md: Project-specific AI implementation guidance

## Data Persistence

All working data is saved to localStorage under a versioned key.

Stored data currently includes:
- Tournament metadata
- Divisions
- Teams
- Venues and courts
- Matches, assignments, and scores

Notes:
- Data is browser-specific
- Clearing browser storage will remove saved data
- Use JSON export regularly for backups

## Current Limitations

- No multi-user synchronization
- No backend APIs
- No authentication
- Scheduling uses simple slot sequencing and court rotation (no advanced constraint solver)
- Match assignment does not yet include drag-and-drop scheduling

## Roadmap

Planned next improvements:
- Additional tournament formats beyond single-elimination

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

Copyright (c) 2026 Jared Mathes
