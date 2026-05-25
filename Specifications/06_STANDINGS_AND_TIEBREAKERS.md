\# Standings \& Tiebreakers  

\### Pool Standings, Division Standings, Cross‑Pool Ranking, and Volleyball‑Specific Logic



This document defines how standings are calculated in the Tournament Planner System.  

It covers pool standings, division standings, tiebreaker rules, cross‑pool comparisons, and volleyball‑specific ranking logic.



This file is part of the modular documentation set referenced in `00\_MASTER\_INDEX.md`.



\---



\# 1. Purpose



The Standings Engine is responsible for:



\- Calculating standings for each pool  

\- Calculating standings for each division  

\- Applying tiebreakers in the correct order  

\- Supporting volleyball‑specific rules  

\- Supporting cross‑pool comparisons  

\- Producing ranked outputs for bracket seeding  

\- Explaining tiebreaker results for transparency  



Standings must update automatically as match results are entered.



\---



\# 2. Inputs



The Standings Engine consumes:



\- Pool match results  

\- Set scores  

\- Point totals  

\- Match formats  

\- Tiebreaker configuration  

\- Cross‑pool comparison rules  

\- Division format rules  



\---



\# 3. Outputs



The Standings Engine produces:



\- Ordered standings for each pool  

\- Ordered standings for each division  

\- Tiebreaker explanations  

\- Seed lists for bracket generation  

\- Cross‑pool ranking lists  



\---



\# 4. Pool Standings



Pool standings are computed using the following fields:



\- Wins  

\- Losses  

\- Sets won  

\- Sets lost  

\- Points for  

\- Points against  

\- Tiebreaker results  

\- Final rank  



\## 4.1 Standard Volleyball Tiebreaker Order



The default volleyball tiebreaker order is:



1\. Match Wins  

2\. Head‑to‑Head Result (if exactly two teams are tied)  

3\. Set Ratio  

&#x20;  - setsWon / setsLost  

4\. Point Ratio  

&#x20;  - pointsFor / pointsAgainst  

5\. Coin Flip (or random draw)



\## 4.2 Three‑Way Ties



When three teams are tied:



\- Head‑to‑head is ignored unless one team beat both others  

\- Set ratio is computed only among tied teams  

\- If still tied, point ratio is computed only among tied teams  

\- If still tied, overall set ratio is used  

\- If still tied, overall point ratio is used  

\- If still tied, random draw  



\## 4.3 Example Tiebreaker Explanation



The system must produce human‑readable explanations.  

Example:



Pool A — 3‑Way Tie (Teams 3, 5, 7)  

\- Head‑to‑head inconclusive  

\- Set ratio among tied teams:  

&#x20; - Team 3: 3‑2 (1.50)  

&#x20; - Team 5: 2‑2 (1.00)  

&#x20; - Team 7: 2‑3 (0.67)  

Final ranking: 3rd, 5th, 7th  



\---



\# 5. Division Standings



Division standings are used when:



\- Pools feed into tiers  

\- Pools feed into crossovers  

\- Pools feed into brackets  

\- Early‑season events require cross‑pool ranking  



\## 5.1 Division Ranking Fields



\- Pool finish (1st, 2nd, 3rd, etc.)  

\- Cross‑pool tiebreakers  

\- Overall record (optional)  

\- Strength of pool (optional)  

\- Random draw (if needed)  



\## 5.2 Cross‑Pool Ranking Logic



When comparing teams across pools:



Step 1 — Rank by Pool Finish  

All 1st‑place teams are ranked above all 2nd‑place teams, etc.



Step 2 — Apply Cross‑Pool Tiebreakers  

Within each finish group:



1\. Set ratio (overall)  

2\. Point ratio (overall)  

3\. Strength of pool (optional)  

4\. Random draw  



Step 3 — Produce Seed List  

Used for:



\- Crossovers  

\- Brackets  

\- Tier assignment  



\---



\# 6. Cross‑Pool Comparison Examples



\## Example A — 16‑Team Division (4 Pools of 4)



Step 1 — Group by Pool Finish  

\- Group 1: 1st‑place teams (4 teams)  

\- Group 2: 2nd‑place teams (4 teams)  

\- Group 3: 3rd‑place teams (4 teams)  

\- Group 4: 4th‑place teams (4 teams)  



Step 2 — Rank within each group  

Use set ratio → point ratio → random.



Step 3 — Produce seeds 1–16  



\---



\## Example B — 24‑Team Division (6 Pools of 4)



Step 1 — Split into Black/Blue Divisions  

\- Black: top 2 from each pool (12 teams)  

\- Blue: bottom 2 from each pool (12 teams)  



Step 2 — Rank within each division  

Same tiebreakers as above.



Step 3 — Produce seeds 1–12 for each division  



\---



\## Example C — Early‑Season 40‑Team Event



Step 1 — Group by Pool Finish  

\- Tier 1: all 1st‑place teams (10 teams)  

\- Tier 2: all 2nd‑place teams (10 teams)  

\- Tier 3: all 3rd‑place teams (10 teams)  

\- Tier 4: all 4th‑place teams (10 teams)  



Step 2 — Rank within each tier  

Set ratio → point ratio → random.



Step 3 — Produce seeds for each tier’s bracket  



\---



\# 7. Volleyball‑Specific Rules



\## 7.1 Set Ratio Calculation



setRatio = setsWon / setsLost  



If setsLost = 0, treat ratio as infinite.



\## 7.2 Point Ratio Calculation



pointRatio = pointsFor / pointsAgainst  



If pointsAgainst = 0, treat ratio as infinite.



\## 7.3 Handling Time‑Compressed Matches



If a match ends early due to time limit:



\- Set scores are still counted  

\- Ratios still apply  

\- Admin may override if needed  



\## 7.4 Handling Ties in Pool Play



If ties are allowed:



\- A tie counts as 0.5 win  

\- Standings reflect win percentage  



\---



\# 8. Integration With Other Engines



\## 8.1 Scheduling Engine



Standings determine:



\- Crossover matchups  

\- Bracket seeding  

\- Tier assignment  



\## 8.2 Bracket Engine



Standings produce:



\- Seed lists  

\- Placement into bracket nodes  



\## 8.3 Match Engine



Match results feed directly into standings.



\## 8.4 Printing Engine



Standings appear on:



\- Pool sheets  

\- Division summary sheets  

\- Final results  



\---



\# 9. Admin Overrides



Admins may override:



\- Standings  

\- Tiebreaker results  

\- Seed lists  

\- Pool finish  

\- Division finish  



Overrides must be logged and visible.



\---



\# 10. Transparency Requirements



The system must:



\- Display tiebreaker explanations  

\- Show set and point ratios  

\- Show head‑to‑head results  

\- Show final ranking logic  



This ensures coaches and parents understand the results.



\---



\# End of File



