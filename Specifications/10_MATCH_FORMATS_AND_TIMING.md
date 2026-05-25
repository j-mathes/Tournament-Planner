\# Match Formats \& Timing  

\### Set Structures, Scoring Rules, Caps, Time Limits, Warmups, and Duration Modeling



This document defines all match format and timing rules used by the Tournament Planner System.  

It describes how sets are structured, how scoring rules work, how time limits are applied, and how match duration is calculated for scheduling.



This file is part of the modular documentation set referenced in 00\_MASTER\_INDEX.md.



\---



\# 1. Purpose



The Match Formats \& Timing Engine is responsible for:



\- Defining match formats  

\- Defining set structures  

\- Defining scoring rules  

\- Defining caps and win‑by‑two logic  

\- Defining time‑compressed formats  

\- Defining warmup and break durations  

\- Providing expected match duration to the Scheduling Engine  

\- Supporting overrides per match or per division  



This engine ensures consistent match behavior across the tournament.



\---



\# 2. Inputs



The engine consumes:



\- MatchFormat configuration  

\- MatchTiming configuration  

\- Sport‑specific defaults  

\- Admin overrides  

\- Scheduling context  



\---



\# 3. Outputs



The engine produces:



\- Set structures  

\- Scoring rules  

\- Expected match duration  

\- Warmup and break durations  

\- Time‑limit behavior  

\- Integration with Match Engine and Scheduling Engine  



\---



\# 4. Match Format Structure



A MatchFormat defines:



\- Name (example: Best of 3)  

\- Sport (volleyball, soccer, etc.)  

\- Set points (example: 25, 25, 15)  

\- Best‑of value (example: best of 3)  

\- Deciding set points  

\- Win‑by‑two requirement  

\- Cap points  

\- Tie‑breaker set rules  

\- Time limits  

\- Scoring type  



\---



\# 5. Volleyball Match Formats



Common volleyball formats include:



\## 5.1 Best of 3 (Standard)



\- Set 1: 25 points  

\- Set 2: 25 points  

\- Set 3: 15 points  

\- Win by 2  

\- Optional cap  



\## 5.2 Best of 5 (Championship)



\- Sets 1–4: 25 points  

\- Set 5: 15 points  

\- Win by 2  

\- Optional cap  



\## 5.3 Two Sets to 25



\- Set 1: 25 points  

\- Set 2: 25 points  

\- Winner determined by sets or points  



\## 5.4 Single Set to 25



\- Used for time‑compressed events  

\- Winner determined by single set  



\## 5.5 Custom Deciding Set



\- First to 7  

\- First to 11  

\- First to 21  



\---



\# 6. Win‑By‑Two Logic



If win‑by‑two is enabled:



\- A team must lead by 2 points to win  

\- Example: 25‑23 is valid, 25‑24 is not  



If disabled:



\- A team may win by 1 point  

\- Example: 25‑24 is valid  



\---



\# 7. Caps (Maximum Points)



A cap sets a hard limit on a set.



Examples:



\- Cap at 27 for sets to 25  

\- Cap at 17 for sets to 15  

\- Cap at 7 for deciding set to 7  



If cap is reached:



\- Win‑by‑two is ignored  

\- First team to cap wins  



\---



\# 8. Tie‑Breaker Sets



Tie‑breaker sets may be:



\- Optional  

\- Mandatory  

\- Conditional  



Tie‑breaker set points may be:



\- 7  

\- 11  

\- 15  

\- Custom  



Tie‑breaker sets may have:



\- Win‑by‑two  

\- Cap  

\- No cap  



\---



\# 9. Time‑Compressed Match Formats



Time‑compressed formats are used when:



\- Venue time is limited  

\- Large tournaments need fast turnover  

\- Pool play must finish on schedule  



Supported behaviors:



\## 9.1 Hard Stop



Match ends immediately when time expires.



\## 9.2 Finish the Rally



Match ends after the current rally.



\## 9.3 Immediate Cap



Current set is capped at the current score.



\## 9.4 Freeze Score



Score is frozen and winner is determined by:



\- Current set score  

\- Total points  

\- Admin‑defined rule  



\## 9.5 Convert to Single Rally



Winner of next rally wins the match.



\---



\# 10. Time Limits



Time limits may apply to:



\- Entire match  

\- Individual sets  

\- Warmup periods  



Examples:



\- 45‑minute match limit  

\- 20‑minute set limit  

\- 5‑minute warmup  



Time‑limit behavior is defined in MatchFormat.



\---



\# 11. Warmup Timing



Warmup timing includes:



\- Shared warmup  

\- Dedicated warmup  

\- Court change warmup  

\- Ball handling time  



Examples:



\- 5 minutes shared  

\- 3 minutes per team  

\- 1 minute serving  



Warmup duration is included in expected match duration.



\---



\# 12. Break Timing



Breaks may occur:



\- Between sets  

\- Between matches  

\- After long matches  

\- For officials  



Examples:



\- 2‑minute break between sets  

\- 5‑minute break between matches  



Breaks are included in expected match duration.



\---



\# 13. Expected Match Duration



Expected match duration is calculated using:



\- Set structure  

\- Average rally length  

\- Warmup time  

\- Break time  

\- Time limits  

\- Historical data (optional)  



The Scheduling Engine uses expected duration to:



\- Build time slots  

\- Avoid conflicts  

\- Avoid venue overruns  



\---



\# 14. Per‑Match Overrides



Admins may override:



\- Match format  

\- Set points  

\- Caps  

\- Time limits  

\- Warmup duration  

\- Break duration  

\- Expected match duration  



Overrides must be logged.



\---



\# 15. Integration With Match Engine



The Match Engine uses MatchFormat to:



\- Validate set scores  

\- Determine set winners  

\- Determine match winners  

\- Apply caps  

\- Apply win‑by‑two logic  

\- Apply time‑limit behavior  



\---



\# 16. Integration With Scheduling Engine



The Scheduling Engine uses MatchTiming to:



\- Calculate time slots  

\- Avoid back‑to‑back matches  

\- Respect venue availability  

\- Respect travel time  

\- Adjust schedules dynamically  



\---



\# 17. Integration With Officiating Engine



Match formats affect:



\- Official workload  

\- Work team assignments  

\- Required roles per match  



Longer matches may require:



\- Additional officials  

\- Additional breaks  



\---



\# End of File



