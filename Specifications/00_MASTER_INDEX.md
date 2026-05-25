# Tournament Planner Documentation - Master Index

This documentation set defines the specification for the Tournament Planner static web application.
The current implementation target is browser-only and GitHub Pages compatible.

---

# How AI Agents Should Use These Files

1. Load one file at a time.
2. Use the loaded file to complete the immediate task.
3. Load additional files only when needed.
4. Do not assume files listed here but missing on disk exist.
5. Treat files currently present in `/Specifications` as authoritative.

---

# Documentation Files

## 1. Tournament Formats
- `01_TOURNAMENT_FORMATS_OVERVIEW.md`
- `02_SPECIALIZED_VOLLEYBALL_FORMAT.md`

## 2. Operations Specification
- `03_OPERATIONS_OVERVIEW.md`
- `04_DATA_MODELS.md`
- `05_SCHEDULING_ENGINE.md`
- `06_STANDINGS_AND_TIEBREAKERS.md`
- `07_BRACKET_ENGINE.md`
- `08_MATCH_ENGINE.md`
- `09_OFFICIATING_AND_WORK_ASSIGNMENTS.md`
- `10_MATCH_FORMATS_AND_TIMING.md`
- `11_PRINTING_AND_EXPORTING.md`

## 3. Admin and Public Experience
- `12_ADMIN_PANEL.md`
- `13_PUBLIC_DISPLAY_ENGINE.md`

## 4. Data Exchange and Access Control
- `14_DATA_IMPORT_EXPORT.md`
- `15_USER_PERMISSIONS_AND_ROLES.md`

## 5. System Architecture
- `16_SYSTEM_ARCHITECTURE.md`

---

# Recommended Load Order

If the AI agent needs to understand:

- Formats -> load 01 -> 02
- Operations -> load 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 10 -> 11
- Admin/Public UX -> load 12 -> 13
- Import/Permissions -> load 14 -> 15
- Architecture -> load 16

---

# Glossary

- Pool: A group of teams playing round robin.
- Crossover: A match pairing high vs low seeds across pools.
- Placement Bracket: A bracket that determines final ranking.
- Work Team: A team assigned to officiate or scorekeep.
- Officiating Role: A referee, line judge, scorekeeper, etc.
- Match Format: Rules defining sets, scoring, and caps.
- Time Slot: A scheduled block on a court.

---

# End of Master Index