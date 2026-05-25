\# Scheduling Engine  

\### Court Assignment, Time Management, Multi‑Venue Logic, and Conflict Avoidance



This document defines the Scheduling Engine used by the Tournament Planner System.  

It describes how the system generates match schedules, assigns courts and time slots, respects venue constraints, avoids conflicts, and integrates with match formats, officiating, and work assignments.



This file is part of the modular documentation set referenced in `00\_MASTER\_INDEX.md`.



\---



\# 1. Purpose



The Scheduling Engine is responsible for:



\- Generating pool play schedules  

\- Generating crossover schedules  

\- Generating bracket schedules  

\- Assigning courts and time slots  

\- Supporting multiple venues  

\- Respecting match durations and breaks  

\- Avoiding conflicts (teams, officials, work crews)  

\- Supporting overrides and rescheduling  

\- Integrating with match formats and timing rules  



The engine must be deterministic, reproducible, and configurable.



\---



\# 2. Inputs



The Scheduling Engine consumes:



\- Tournament structure  

\- Venues and courts  

\- Court availability windows  

\- Match formats (set lengths, caps, time limits)  

\- Match timing rules (warmup, breaks)  

\- Pools and brackets  

\- Team lists  

\- Work schedule rules (optional)  

\- Officiating requirements  

\- Travel‑time rules (optional)  



\---



\# 3. Outputs



The Scheduling Engine produces:



\- A complete schedule of matches  

\- Court assignments  

\- Time slot assignments  

\- Work assignments (if enabled)  

\- Officiating assignments (if configured)  

\- Warnings for conflicts or timing issues  



\---



\# 4. Scheduling Phases



The engine operates in three major phases:



1\. \*\*Pool Play Scheduling\*\*  

2\. \*\*Crossover Scheduling\*\*  

3\. \*\*Bracket Scheduling\*\*



Each phase is described below.



\---



\# 5. Pool Play Scheduling



\## 5.1 Pool Structure

Pools may contain:



\- 3 teams  

\- 4 teams  

\- 5 teams  



\## 5.2 Match Generation

Matches are generated using round‑robin pairing:



\- 3‑team pool → 3 matches  

\- 4‑team pool → 6 matches  

\- 5‑team pool → 10 matches  



\## 5.3 Court Assignment Strategies



\### Strategy A — One Pool Per Court

\- Most common in volleyball  

\- All pool matches occur on the same court  

\- Simplifies work assignments  



\### Strategy B — Multiple Pools Per Court

\- Used when court availability is limited  

\- Requires careful conflict avoidance  



\### Strategy C — Multi‑Venue Pool Distribution

\- Pools may be assigned to different venues  

\- Travel‑time constraints apply only between matches  



\## 5.4 Time Slot Assignment

Time slots are assigned based on:



\- Match duration (from MatchFormat + MatchTiming)  

\- Warmup time  

\- Break time  

\- Court availability windows  



\## 5.5 Conflict Avoidance

The engine ensures:



\- A team never plays two matches at the same time  

\- A team does not play back‑to‑back unless unavoidable  

\- A team is not scheduled at two venues without travel time  

\- Work teams are not scheduled to work while playing  

\- Officials are not double‑booked  



\---



\# 6. Crossover Scheduling



Crossovers occur after pool play and determine bracket placement.



\## 6.1 Match Generation

Matches are generated based on seeding rules:



Example (16‑team division):

\- 1 vs 16  

\- 2 vs 15  

\- …  

\- 8 vs 9  



\## 6.2 Court Assignment

Crossovers may be:



\- Assigned to a single venue  

\- Distributed across multiple venues  

\- Assigned to specific courts based on bracket size  



\## 6.3 Time Slot Assignment

Crossovers must occur \*\*after\*\* all pool matches are completed.



The engine ensures:



\- Adequate rest time  

\- Travel time (if needed)  

\- No conflicts with officiating or work assignments  



\---



\# 7. Bracket Scheduling



\## 7.1 Bracket Structure

Supports:



\- Single elimination  

\- Double elimination  

\- Consolation brackets  

\- Full placement brackets  

\- Multi‑tier brackets (Black/Blue, Gold/Silver/Bronze)  



\## 7.2 Match Ordering

The engine schedules:



\- Early rounds first  

\- Later rounds after winners are known  

\- Consolation and championship sides in parallel  



\## 7.3 Court Assignment

Bracket matches may be:



\- Assigned to specific venues  

\- Spread across all available courts  

\- Prioritized by bracket importance (e.g., semifinals on main courts)  



\## 7.4 Time Slot Assignment

The engine respects:



\- Match duration  

\- Warmup time  

\- Breaks  

\- Venue availability  

\- Travel time  

\- Avoiding back‑to‑back matches  



\---



\# 8. Multi‑Venue Scheduling



\## 8.1 Venue Awareness

Each court belongs to a venue.  

Each venue has its own:



\- Availability windows  

\- Court count  

\- Travel‑time constraints  



\## 8.2 Travel‑Time Rules (Optional)

If enabled:



\- Teams must have `minTravelTimeBetweenVenues`  

\- Officials must have travel time  

\- Work teams must be assigned within the same venue  



\## 8.3 Venue‑Specific Scheduling

The engine can:



\- Assign entire pools to a venue  

\- Assign brackets to a venue  

\- Balance load across venues  

\- Avoid scheduling a team at two venues in consecutive time slots  



\---



\# 9. Match Duration \& Timing Integration



The engine uses:



\### From `MatchFormat`:

\- Set lengths  

\- Caps  

\- Tie‑breaker rules  

\- Time limits  



\### From `MatchTiming`:

\- Default duration  

\- Warmup duration  

\- Break duration  

\- Overrides  



The engine calculates:



\- Expected match length  

\- Total time slot length  

\- Venue‑specific scheduling windows  



\---



\# 10. Work Assignment Integration



If work schedules are enabled:



\- The Scheduling Engine ensures work teams are idle during work assignments  

\- Work teams are assigned within the same venue  

\- Work teams are not double‑booked  

\- Work teams are not assigned back‑to‑back with matches  



Work assignment logic is defined in `09\_OFFICIATING\_AND\_WORK\_ASSIGNMENTS.md`.



\---



\# 11. Officiating Integration



The Scheduling Engine ensures:



\- Required officiating roles are filled  

\- Officials are not double‑booked  

\- Reserve officials may cover multiple courts (if allowed)  

\- Officials are not scheduled across venues without travel time  



Officiating logic is defined in `09\_OFFICIATING\_AND\_WORK\_ASSIGNMENTS.md`.



\---



\# 12. Rescheduling \& Overrides



Admins may:



\- Move matches to different courts  

\- Move matches to different venues  

\- Change time slots  

\- Override match formats  

\- Override officiating assignments  

\- Override work assignments  



The engine must:



\- Recalculate conflicts  

\- Recalculate travel time  

\- Recalculate work assignments  

\- Recalculate officiating assignments  

\- Warn about violations  



\---



\# 13. Error Handling \& Warnings



The engine must detect and warn about:



\- Team playing two matches at once  

\- Team playing back‑to‑back  

\- Team scheduled at two venues without travel time  

\- Court unavailable  

\- Venue unavailable  

\- Match duration exceeding venue hours  

\- Work team conflict  

\- Official conflict  

\- Overlapping time slots  



Warnings must be visible in the Admin Panel.



\---



\# 14. Determinism \& Reproducibility



Given the same inputs:



\- The Scheduling Engine must produce the same schedule  

\- Overrides must be logged  

\- Randomization (if used) must be seed‑based  



\---



\# End of File



