# Tournament Planner

Tournament Planner is a simple, browser-based tournament organizer that runs as a static web app.

It is designed to:
- Run locally by opening the app in a browser
- Run on GitHub Pages without backend services
- Store data in the browser using localStorage
- Stay lightweight and easy to maintain

## Current Features

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
