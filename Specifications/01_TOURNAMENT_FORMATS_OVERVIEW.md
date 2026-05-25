\# Tournament Formats Overview



This document describes all tournament formats supported by the Tournament Planner System.  

Each format is defined in a sport‑agnostic way, with volleyball‑specific notes where relevant.



This file is part of the modular documentation set referenced in `00\_MASTER\_INDEX.md`.



\---



\# 1. Single Elimination



\## Definition

A knockout bracket where a team is eliminated after one loss.



\## Characteristics

\- Fastest format.

\- High stakes.

\- Simple to run and understand.

\- Works best when seeding is accurate.



\## Structure

\- Bracket size is typically a power of two.

\- Byes are assigned if needed.

\- Winners advance; losers are eliminated.



\## Output

\- Champion.

\- Optional full placement if configured.



\---



\# 2. Double Elimination



\## Definition

Teams are eliminated after two losses.  

Two brackets: Winners and Losers.



\## Characteristics

\- More accurate than single elimination.

\- Guarantees at least two matches per team.

\- More complex scheduling.



\## Structure

\- Winners Bracket → Losers Bracket → Grand Final.

\- Possible bracket reset if Losers Bracket finalist wins first final.



\## Output

\- Champion.

\- Optional full placement.



\---



\# 3. Round Robin



\## Definition

Every team plays every other team once (or twice).



\## Characteristics

\- Most accurate ranking method.

\- No eliminations.

\- Match count grows quickly with number of teams.



\## Structure

\- Single or double round robin.

\- Standings determined by wins, sets, points, etc.



\## Output

\- Ordered standings table.



\---



\# 4. Swiss System



\## Definition

Teams play a fixed number of rounds; pairings are based on current record.



\## Characteristics

\- Scales well to large tournaments.

\- No eliminations.

\- Requires pairing logic to avoid repeats.



\## Structure

\- Round 1: seeded or random.

\- Subsequent rounds: pair within score groups.

\- Tiebreakers: Buchholz, Median‑Buchholz, etc.



\## Output

\- Final standings.

\- Optional playoff bracket.



\---



\# 5. Pool Play + Playoffs



\## Definition

Teams are divided into pools for round robin; top teams advance to playoffs.



\## Characteristics

\- Guarantees multiple matches.

\- Produces fairer playoff seeding.

\- Very common in volleyball, soccer, basketball.



\## Structure

\- Pools of 3–6 teams.

\- Round robin inside each pool.

\- Playoff bracket seeded by pool results.



\## Output

\- Pool standings.

\- Playoff bracket.

\- Final rankings.



\---



\# 6. Consolation Brackets



\## Definition

Teams eliminated early enter a secondary bracket.



\## Characteristics

\- Provides more matches.

\- Useful for recreational or developmental events.



\## Structure

\- Main bracket (single elimination).

\- Consolation bracket for early losers.

\- Does not feed back into main bracket.



\## Output

\- Main bracket winner.

\- Consolation bracket winner.

\- Optional full placement.



\---



\# 7. Ladder Format



\## Definition

Teams challenge others above them to climb the ladder.



\## Characteristics

\- Continuous, flexible.

\- Good for leagues or long‑term play.

\- Can become stagnant without oversight.



\## Structure

\- Ladder positions.

\- Challenge rules.

\- Promotion/demotion logic.



\## Output

\- Ladder ranking.



\---



\# 8. King of the Court



\## Definition

Fast‑rotation format where winners stay on the court.



\## Characteristics

\- High participation.

\- Great for practices or fun events.

\- Not suitable for strict competitive ranking.



\## Structure

\- Short timed games.

\- Winners stay; challengers rotate in.



\## Output

\- Court‑by‑court results.

\- Optional ranking.



\---



\# 9. Multi‑Stage Hybrid Formats



\## Definition

Any combination of pool play, Swiss, elimination brackets, or tiered sorting.



\## Characteristics

\- Highly customizable.

\- Used in large events (volleyball, esports, soccer).



\## Structure

Examples:

\- Pools → Brackets  

\- Swiss → Brackets  

\- Pools → Power Pools → Brackets  

\- Pools → Tiered Divisions → Crossovers → Full Placement  



\## Output

\- Depends on configuration.



\---



\# 10. Specialized Format: Pool → Tier → Crossover → Full Placement



This format is common in volleyball and is described in detail in  

`02\_SPECIALIZED\_VOLLEYBALL\_FORMAT.md`.



\## Summary

\- Pools of 3–5 teams.

\- Teams sorted into tiers/divisions.

\- Crossovers (1 vs 16, 2 vs 15, etc.).

\- Winners go to championship side; losers to consolation side.

\- Full placement brackets determine final ranking.



\---



\# End of File



