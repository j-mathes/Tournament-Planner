\# Match Engine  

\### Real‑Time Scoring, Set Logic, Match Formats, Overrides, and Integration



This document defines the Match Engine used by the Tournament Planner System.  

It describes how matches are scored, how sets are processed, how winners are determined, and how match formats and timing rules are applied.



This file is part of the modular documentation set referenced in 00\_MASTER\_INDEX.md.



\---



\# 1. Purpose



The Match Engine is responsible for:



\- Real‑time score entry  

\- Set‑by‑set scoring  

\- Determining match winners  

\- Applying match format rules  

\- Handling caps and win‑by‑two logic  

\- Handling time‑compressed formats  

\- Supporting tie‑breaker sets  

\- Supporting per‑match overrides  

\- Updating standings  

\- Triggering bracket advancement  

\- Locking and unlocking matches  



The Match Engine is the core of real‑time tournament operations.



\---



\# 2. Inputs



The Match Engine consumes:



\- MatchFormat configuration  

\- MatchTiming configuration  

\- Set scores entered by officials or admins  

\- Overrides from admins  

\- Scheduling context  

\- Bracket context  

\- Pool context  



\---



\# 3. Outputs



The Match Engine produces:



\- Completed match results  

\- Set scores  

\- Winner and loser  

\- Updated standings  

\- Updated bracket advancement  

\- Updated work and officiating schedules (if needed)  



\---



\# 4. Match Lifecycle



A match moves through the following states:



1\. scheduled  

2\. in\_progress  

3\. completed  

4\. locked (optional)  



Admins may unlock a match to correct errors.



\---



\# 5. Set‑By‑Set Scoring



Each match consists of one or more sets.



A set includes:



\- setNumber  

\- teamAScore  

\- teamBScore  



The Match Engine determines:



\- Whether the set is complete  

\- Whether the set winner is valid  

\- Whether the set meets format rules  



\---



\# 6. Determining Set Winners



A set winner is determined by:



\- Reaching the required points  

\- Meeting win‑by‑two requirement (if enabled)  

\- Respecting cap rules (if enabled)  



Examples:



\- Standard volleyball set: first to 25, win by 2  

\- Deciding set: first to 15, win by 2  

\- Custom deciding set: first to 7, cap at 7  



\---



\# 7. Determining Match Winners



The match winner is determined by:



\- Best‑of format (best of 3, best of 5)  

\- Number of sets won  

\- Tie‑breaker sets (if enabled)  

\- Time‑compressed rules (if applied)  



Examples:



\- Best of 3: first to 2 sets  

\- Best of 5: first to 3 sets  

\- Two sets to 25: winner determined by total points if tied  



\---



\# 8. Match Formats



Match formats define:



\- Number of sets  

\- Points per set  

\- Deciding set points  

\- Caps  

\- Win‑by‑two rules  

\- Tie‑breaker set rules  

\- Time limits  

\- Scoring type (rally, sideout, running clock)  



The Match Engine must apply these rules consistently.



\---



\# 9. Time‑Compressed Matches



Some tournaments use time‑compressed formats.



Supported behaviors include:



\- Hard stop  

\- Finish the rally  

\- Immediate cap  

\- Freeze score  

\- Convert remaining sets to single rally  



When time expires:



\- The Match Engine applies the configured behavior  

\- Admins may override the result  



\---



\# 10. Tie‑Breaker Sets



Tie‑breaker sets may be:



\- Optional  

\- Mandatory  

\- Conditional (only if time remains)  



Tie‑breaker sets may use:



\- First to 7  

\- First to 11  

\- First to 15  

\- Custom values  



\---



\# 11. Handling Forfeits



A match may be marked as:



\- Forfeit win  

\- Forfeit loss  

\- Double forfeit  



Forfeits affect:



\- Standings  

\- Bracket advancement  

\- Work assignments  



Default volleyball forfeit score:



\- 25‑0, 25‑0  



\---



\# 12. Handling Retired Matches



If a team cannot continue:



\- The match is marked as retired  

\- The opponent is declared the winner  

\- Completed sets remain valid  

\- Incomplete sets are ignored  



\---



\# 13. Integration With Standings



When a match is completed:



\- Wins and losses update  

\- Sets won and lost update  

\- Points for and against update  

\- Standings recalculate automatically  

\- Tiebreaker logic applies  



\---



\# 14. Integration With Brackets



When a bracket match is completed:



\- Winner advances to nextWinNode  

\- Loser advances to nextLoseNode (if applicable)  

\- Byes are processed automatically  

\- Bracket updates in real time  



\---



\# 15. Integration With Scheduling



The Match Engine notifies the Scheduling Engine when:



\- A match finishes early  

\- A match runs long  

\- A match is delayed  

\- A match is overridden  



The Scheduling Engine may:



\- Adjust future time slots  

\- Reassign courts  

\- Reassign work teams  

\- Reassign officials  



\---



\# 16. Integration With Officiating



The Match Engine ensures:



\- Officials are credited for assignments  

\- Work teams are credited  

\- Conflicts are detected  

\- Reassignments are triggered if needed  



\---



\# 17. Admin Overrides



Admins may override:



\- Set scores  

\- Match results  

\- Winner and loser  

\- Match format  

\- Time limit behavior  

\- Work assignments  

\- Officiating assignments  



Overrides must be logged.



\---



\# 18. Locking and Unlocking Matches



A match may be locked to prevent changes.



Locked matches:



\- Cannot be edited  

\- Cannot be overridden  

\- Cannot be reopened  



Admins may unlock a match if corrections are needed.



\---



\# 19. Error Handling



The Match Engine must detect:



\- Invalid set scores  

\- Violations of match format  

\- Caps exceeded  

\- Win‑by‑two violations  

\- Missing sets  

\- Too many sets  

\- Conflicting results  

\- Bracket advancement errors  



Errors must be surfaced in the Admin Panel.



\---



\# End of File



