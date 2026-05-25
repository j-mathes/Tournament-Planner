\# Bracket Engine  

\### Bracket Generation, Advancement Logic, Crossovers, Full Placement, and Multi‑Tier Support



This document defines the Bracket Engine used by the Tournament Planner System.  

It describes how brackets are generated, how teams advance, how crossovers feed into brackets, and how full placement is produced for volleyball and other sports.



This file is part of the modular documentation set referenced in 00\_MASTER\_INDEX.md.



\---



\# 1. Purpose



The Bracket Engine is responsible for:



\- Generating brackets from seeds  

\- Supporting single elimination  

\- Supporting double elimination  

\- Supporting consolation brackets  

\- Supporting full placement brackets  

\- Supporting multi‑tier brackets (Black, Blue, Gold, Silver, Bronze)  

\- Integrating crossover results  

\- Advancing winners and losers  

\- Handling byes  

\- Supporting reseeding (optional)  

\- Supporting multi‑venue scheduling  



The engine must be deterministic and reproducible.



\---



\# 2. Inputs



The Bracket Engine consumes:



\- Seed lists from the Standings Engine  

\- Crossover results  

\- Bracket format configuration  

\- Match format configuration  

\- Venue and court availability  

\- Scheduling constraints  



\---



\# 3. Outputs



The Bracket Engine produces:



\- Bracket structures  

\- Bracket nodes  

\- Matches for each round  

\- Advancement rules  

\- Placement results  

\- Integration with the Scheduling Engine  



\---



\# 4. Bracket Types Supported



The system supports the following bracket types:



1\. Single Elimination  

2\. Double Elimination  

3\. Consolation Brackets  

4\. Full Placement Brackets  

5\. Multi‑Tier Brackets  

6\. Modified Brackets (e.g., reseed after quarterfinals)  

7\. Crossover‑Fed Brackets  



Each type is described below.



\---



\# 5. Single Elimination Brackets



\## 5.1 Structure



\- Teams are seeded 1 through N  

\- Winners advance  

\- Losers are eliminated  

\- Byes are assigned if needed  



\## 5.2 Example (8‑Team)



Quarterfinals:  

1 vs 8  

4 vs 5  

3 vs 6  

2 vs 7  



Semifinals:  

Winner 1/8 vs Winner 4/5  

Winner 3/6 vs Winner 2/7  



Finals:  

Winners meet for championship  



\---



\# 6. Double Elimination Brackets



\## 6.1 Structure



\- Winners Bracket  

\- Losers Bracket  

\- Grand Final  

\- Optional bracket reset if Losers Bracket finalist wins first final  



\## 6.2 Advancement



\- Winners drop to Losers Bracket  

\- Losers in Losers Bracket are eliminated  

\- Final determines champion  



\---



\# 7. Consolation Brackets



\## 7.1 Purpose



Provides additional matches for teams eliminated early.



\## 7.2 Structure



\- Main bracket (single elimination)  

\- Consolation bracket for early losers  

\- Does not feed back into main bracket  



\---



\# 8. Full Placement Brackets



\## 8.1 Purpose



Determines final ranking for all teams.



\## 8.2 Structure



For a 16‑team division:



\- Championship side determines 1st–8th  

\- Consolation side determines 9th–16th  



\## 8.3 Volleyball Use Case



This is the most common format in volleyball tournaments.



\---



\# 9. Multi‑Tier Brackets



\## 9.1 Purpose



Used when divisions are split into tiers after pool play.



Examples:



\- Black Division (top tier)  

\- Blue Division (middle tier)  

\- Red Division (lower tier)  



\## 9.2 Structure



Each tier receives its own bracket:



\- 12‑team Black bracket  

\- 12‑team Blue bracket  

\- 8‑team Red bracket  



\---



\# 10. Crossover‑Fed Brackets



\## 10.1 Purpose



Crossovers determine which side of the bracket a team enters.



\## 10.2 Example (16‑Team)



Crossovers:  

1 vs 16  

2 vs 15  

3 vs 14  

4 vs 13  

5 vs 12  

6 vs 11  

7 vs 10  

8 vs 9  



Winners → Championship side  

Losers → Consolation side  



\## 10.3 Byes



Top seeds may receive byes in:



\- 12‑team brackets  

\- 10‑team brackets  

\- Early‑season formats  



\---



\# 11. Bracket Node Structure



Each bracket position is represented by a BracketNode.



Fields include:



\- id  

\- matchId  

\- nextWinNodeId  

\- nextLoseNodeId  

\- seed  

\- roundNumber  

\- bracketSide (championship or consolation)  



\---



\# 12. Match Generation



\## 12.1 Initial Matches



Generated from seeds:



\- 1 vs 16  

\- 8 vs 9  

\- etc.  



\## 12.2 Subsequent Matches



Generated from:



\- Winners of previous matches  

\- Losers of previous matches (if consolation or double elimination)  



\## 12.3 Byes



If a team receives a bye:



\- They automatically advance  

\- Their next opponent is determined normally  



\---



\# 13. Advancement Logic



\## 13.1 Single Elimination



Winner → nextWinNode  

Loser → eliminated  



\## 13.2 Double Elimination



Winner → nextWinNode  

Loser → nextLoseNode  



\## 13.3 Consolation Brackets



Winner → nextWinNode  

Loser → eliminated  



\## 13.4 Full Placement



Both winners and losers advance to determine final ranking.



\---



\# 14. Placement Calculation



The Bracket Engine must produce final placements:



\- Champion (1st)  

\- Runner‑up (2nd)  

\- Semifinal losers (3rd and 4th)  

\- Quarterfinal losers (5th–8th)  

\- Consolation winners (9th–16th)  



Placement is deterministic.



\---



\# 15. Multi‑Venue Integration



The Bracket Engine supports:



\- Assigning rounds to specific venues  

\- Assigning semifinals and finals to feature courts  

\- Avoiding travel conflicts  

\- Scheduling championship matches at preferred venues  



\---



\# 16. Scheduling Integration



The Bracket Engine passes matches to the Scheduling Engine, which assigns:



\- Courts  

\- Time slots  

\- Venues  

\- Work assignments  

\- Officials  



Bracket rounds must respect:



\- Match duration  

\- Warmup time  

\- Breaks  

\- Venue availability  



\---



\# 17. Reseeding (Optional)



Some tournaments reseed after:



\- Quarterfinals  

\- Semifinals  



If enabled:



\- Highest remaining seed plays lowest remaining seed  

\- Bracket nodes are recalculated dynamically  



\---



\# 18. Admin Overrides



Admins may override:



\- Seeds  

\- Bracket structure  

\- Advancement  

\- Match results  

\- Placement  



Overrides must be logged.



\---



\# 19. Error Handling



The engine must detect:



\- Invalid seeds  

\- Missing nodes  

\- Circular advancement  

\- Conflicting nextWinNode or nextLoseNode  

\- Bracket size mismatches  



Errors must be surfaced in the Admin Panel.



\---



\# End of File



