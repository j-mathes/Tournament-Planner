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
  - Manual per-match assignment override (Assign / Clear Assignment)
  - Filter matches by division, venue, court, and status
  - Enter set scores
  - Clear match scores
  - Automatic winner and status updates
- Standings
  - Ranking by wins
  - Tiebreakers by set ratio, then point ratio
- Public display
  - Upcoming and active matches board
  - Includes assignment context (venue, court, time)
- Data handling
  - Export full app data as JSON
  - Import app data from JSON
- Printing
  - Print-friendly active view (Schedule/Matches flow)

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
- Manual match assignment currently uses prompt-based input flow

## Roadmap

Planned next improvements:
- Inline per-match assignment editor (replace prompt flow)
- Team schedule view with team filter and print workflow
- Improved print layouts for schedules and standings
- More advanced tournament formats and bracket workflows

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

Copyright (c) 2026 Jared Mathes
