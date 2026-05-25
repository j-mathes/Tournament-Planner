\# Data Models  

\### Core Entities for Tournament Operations



This document defines all data models used by the Tournament Planner System.  

These models are referenced by all operational engines and are designed to be:



\- Modular  

\- Sport‑agnostic  

\- Multi‑venue aware  

\- Extensible  

\- AI‑friendly  



This file is part of the modular documentation set referenced in `00\_MASTER\_INDEX.md`.



\---



\# 1. Overview



The system uses a structured set of data models to represent:



\- Tournaments  

\- Venues  

\- Courts  

\- Divisions  

\- Teams  

\- Pools  

\- Matches  

\- Brackets  

\- Standings  

\- Officiating roles  

\- Work assignments  

\- Match formats  

\- Scheduling structures  



Each model is designed to be serializable (JSON), deterministic, and compatible with automated reasoning by an AI agent.



\---



\# 2. Tournament Model



\### `Tournament`

Represents the entire event.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `name` | string | Tournament name |

| `startDate` | date | Start date |

| `endDate` | date | End date |

| `venues\[]` | Venue\[] | List of venues |

| `divisions\[]` | Division\[] | Divisions (e.g., 16U, 17U) |

| `status` | enum | draft, active, completed |

| `settings` | object | Global settings (time limits, defaults) |



\---



\# 3. Venue Model



\### `Venue`

Represents a physical location containing one or more courts.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `name` | string | Venue name |

| `address` | string | Street address |

| `city` | string | City |

| `postalCode` | string | Postal code |

| `timeZone` | string | Optional |

| `courts\[]` | Court\[] | Courts at this venue |

| `notes` | string | Parking, entry instructions, etc. |



\---



\# 4. Court Model



\### `Court`

Represents a playable surface at a venue.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `venueId` | string | Reference to Venue |

| `label` | string | e.g., “Court 3” |

| `surfaceType` | string | Optional |

| `isOutdoor` | bool | Optional |

| `availability\[]` | TimeWindow\[] | When the court is usable |



\---



\# 5. Time Slot \& Time Window Models



\### `TimeSlot`

Represents a scheduled block for a match.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `courtId` | string | Court reference |

| `startTime` | datetime | Start |

| `endTime` | datetime | End |



\### `TimeWindow`

Represents availability of a court or venue.



| Field | Type | Description |

|-------|------|-------------|

| `startTime` | datetime | Available from |

| `endTime` | datetime | Available until |



\---



\# 6. Division Model



\### `Division`

Represents a competitive grouping (e.g., 16U Girls).



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `name` | string | Division name |

| `teams\[]` | Team\[] | Teams in this division |

| `format` | object | Format configuration |

| `pools\[]` | Pool\[] | Pools for this division |

| `brackets\[]` | Bracket\[] | Brackets for this division |

| `workScheduleRules` | object | Optional work schedule settings |



\---



\# 7. Team Model



\### `Team`

Represents a team in a division.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `name` | string | Team name |

| `club` | string | Club or organization |

| `coachName` | string | Coach |

| `seed` | number | Optional |

| `divisionId` | string | Reference to Division |

| `metadata` | object | Region, notes, etc. |



\---



\# 8. Pool Model



\### `Pool`

Represents a round‑robin group.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `divisionId` | string | Reference to Division |

| `name` | string | e.g., “Pool A” |

| `teams\[]` | Team\[] | Teams in the pool |

| `matches\[]` | Match\[] | Matches in the pool |

| `standings\[]` | StandingsRow\[] | Computed standings |



\---



\# 9. Match Model



\### `Match`

Represents a single match between two teams.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `divisionId` | string | Division reference |

| `stage` | enum | pool, crossover, bracket, placement, friendly |

| `poolId` | string/null | Pool reference |

| `bracketNodeId` | string/null | Bracket reference |

| `roundNumber` | number | Round index |

| `courtId` | string/null | Assigned court |

| `timeSlotId` | string/null | Assigned time slot |

| `teamAId` | string | Team A |

| `teamBId` | string | Team B |

| `workTeamId` | string/null | Team assigned to officiate |

| `officialAssignments\[]` | OfficialAssignment\[] | Referees, scorers, etc. |

| `matchFormatId` | string | Reference to MatchFormat |

| `status` | enum | scheduled, in\_progress, completed |

| `setScores\[]` | SetScore\[] | Scores per set |

| `winnerId` | string/null | Winner |

| `loserId` | string/null | Loser |

| `locked` | bool | Prevents auto changes |



\---



\# 10. Set Score Model



\### `SetScore`

Represents the score of a single set.



| Field | Type | Description |

|-------|------|-------------|

| `setNumber` | number | Set index |

| `teamAScore` | number | Score |

| `teamBScore` | number | Score |



\---



\# 11. Standings Model



\### `StandingsRow`

Represents a team’s standing in a pool or division.



| Field | Type | Description |

|-------|------|-------------|

| `teamId` | string | Team reference |

| `wins` | number | Wins |

| `losses` | number | Losses |

| `setsWon` | number | Sets won |

| `setsLost` | number | Sets lost |

| `pointsFor` | number | Points scored |

| `pointsAgainst` | number | Points allowed |

| `rank` | number | Computed rank |

| `tiebreakDetails` | string | Explanation |



\---



\# 12. Bracket Models



\### `Bracket`

Represents a full bracket (championship, consolation, placement).



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `divisionId` | string | Division reference |

| `name` | string | e.g., “Championship Bracket” |

| `nodes\[]` | BracketNode\[] | Bracket structure |



\### `BracketNode`

Represents a single position in a bracket.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `matchId` | string | Match reference |

| `nextWinNodeId` | string/null | Next node if win |

| `nextLoseNodeId` | string/null | Next node if loss |

| `seed` | number/null | Initial seed |



\---



\# 13. Officiating Models



\### `OfficiatingRole`

Defines a role required for a match or court.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `name` | string | e.g., “R1”, “Line Judge” |

| `description` | string | Role description |

| `isRequired` | bool | Must be filled |

| `assignTo` | enum | match, court, venue |

| `maxAssignments` | number | e.g., reserve LJ can cover multiple courts |

| `canBeTeamWorkAssignment` | bool | Whether teams can fill this role |



\### `OfficialAssignment`

Represents a specific assignment of a person/team to a role.



| Field | Type | Description |

|-------|------|-------------|

| `roleId` | string | OfficiatingRole reference |

| `assignedToType` | enum | official, team |

| `assignedToId` | string | Official ID or Team ID |



\---



\# 14. Work Assignment Model



\### `WorkAssignment`

Represents a team assigned to officiate or scorekeep.



| Field | Type | Description |

|-------|------|-------------|

| `matchId` | string | Match reference |

| `teamId` | string | Team assigned |

| `roles\[]` | string\[] | Roles filled (e.g., scorer, LJ) |



\---



\# 15. Match Format Model



\### `MatchFormat`

Defines scoring rules, set structure, caps, and timing.



| Field | Type | Description |

|-------|------|-------------|

| `id` | string | Unique identifier |

| `name` | string | e.g., “Best of 3” |

| `sport` | string | volleyball, soccer, etc. |

| `setPoints` | number\[] | Points per set |

| `bestOf` | number/null | e.g., 3 |

| `decidingSetPoints` | number/null | Standard deciding set |

| `allowCustomDecidingSet` | bool | Allow override |

| `customDecidingSetPoints` | number/null | e.g., 7 |

| `winByTwo` | bool | Win by 2 |

| `capPoints` | number/null | Cap |

| `allowCapOverride` | bool | Allow override |

| `allowTieBreakerSet` | bool | Optional tie‑breaker |

| `tieBreakerSetPoints` | number/null | Points |

| `scoringType` | string | rally, sideout, running\_clock |

| `allowTies` | bool | For pool play |

| `timeLimitMinutes` | number/null | Optional |

| `timeLimitBehavior` | string/null | finish\_rally, cap\_now, freeze\_score |



\---



\# 16. Match Timing Model



\### `MatchTiming`

Defines expected duration and warmup/break rules.



| Field | Type | Description |

|-------|------|-------------|

| `defaultDurationMinutes` | number | Expected match length |

| `warmupDurationMinutes` | number | Warmup time |

| `breakAfterMatchMinutes` | number | Break time |

| `overrideAllowed` | bool | Allow override |

| `overrideDurationMinutes` | number/null | Custom duration |



\---



\# 17. Travel Time Model (Optional)



\### `TravelRules`

Defines travel constraints between venues.



| Field | Type | Description |

|-------|------|-------------|

| `minTravelTimeBetweenVenues` | number | Minutes |

| `enforceTravelTime` | bool | Enable/disable |



\---



\# End of File



