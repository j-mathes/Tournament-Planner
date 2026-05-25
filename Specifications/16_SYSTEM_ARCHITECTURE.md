# System Architecture

### Browser-Only Architecture, Client Modules, Local Storage, and Optional Sync Export

This document defines the architecture of the Tournament Planner application as a static web app.
It is designed to run directly in a browser and on GitHub Pages, with no backend services required.

This file is part of the modular documentation set referenced in `00_MASTER_INDEX.md`.

---

# 1. Purpose

The System Architecture defines:

- Core client-side components
- How modules communicate in-browser
- How data flows through the app
- How storage is structured locally
- How reliability and performance are maintained

This architecture prioritizes simplicity, portability, and tournament-day usability.

---

# 2. High-Level Architecture Overview

The app is composed of the following layers:

1. UI Layer (Admin + Public views)
2. Client Engine Layer
3. State and Persistence Layer
4. Import/Export Layer

All layers run in the browser runtime.

---

# 3. Core Client Engines

The app includes the following client-side engines:

- Scheduling Engine
- Match Engine
- Standings Engine
- Bracket Engine
- Officiating and Work Assignment Engine
- Printing and Export Engine
- Public Display Engine
- Data Import and Export Engine
- Permissions Engine

Each engine is implemented as a JavaScript module or namespace and communicates through shared application state.

---

# 4. Data Flow Overview

Data flows through the app in this sequence:

Step 1: Admin configures divisions, teams, pools, and brackets
Step 2: Scheduling Engine generates match schedules
Step 3: Match Engine processes score entry
Step 4: Standings Engine recalculates standings
Step 5: Bracket Engine advances teams
Step 6: Officiating Engine updates assignments
Step 7: Public Display views refresh from current state
Step 8: Printing and Export Engine produces documents/files

All steps are handled in-browser from shared state.

---

# 5. Persistence Layer

Primary persistence is:

- localStorage for app settings and normal tournament data

Optional persistence for large datasets:

- IndexedDB for larger tournaments or extended history

Persistence requirements:

- Deterministic serialization to JSON-compatible objects
- Recovery-safe saves after important mutations
- Import/export compatibility with CSV/JSON/XML workflows

---

# 6. Synchronization Model

There is no required server-side real-time channel.

Updates are reflected by:

- In-memory state updates
- UI rerenders in the same browser session
- Optional manual refresh or file-based handoff between devices

If future hosted sync is introduced, it must remain optional and must not break static standalone operation.

---

# 7. UI Architecture

The frontend includes:

- Admin Panel views
- Public Display views
- Team Schedule views
- Court Board views
- Venue and Division dashboards
- Mobile-friendly layouts

UI characteristics:

- Responsive design
- Multi-view navigation
- Progressive enhancement
- Offline-friendly operation on a single device

---

# 8. Integration Model

External interaction is file-first:

- Import from CSV/JSON/XML files
- Export to CSV/JSON/XML and printable views

Any future API integration is optional and out of scope for the baseline static deployment.

---

# 9. Reliability and Performance

Reliability goals:

- App works without internet after load
- Data remains available between browser sessions
- Core workflows remain usable on desktop and mobile browsers

Performance goals:

- Fast schedule and standings updates for typical event sizes
- Efficient rerendering of changed sections only
- Defensive validation for imported or edited data

---

# End of File