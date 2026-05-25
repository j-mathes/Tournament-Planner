\# Tournament Planner Documentation — Master Index



This documentation set defines the complete specification for a multi‑sport tournament planning system, including volleyball‑specific features, real‑time operations, officiating, scheduling, match formats, and UI wireframes.



The documentation is divided into small, AI‑friendly chunks.  

Each chunk can be loaded independently by an AI agent to avoid timeouts.



\---



\# 📘 How the AI Agent Should Use These Files



1\. Load \*\*only one file at a time\*\*.

2\. Perform the requested task using the content of that file.

3\. If additional context is needed, load the next referenced file.

4\. Never attempt to load the entire documentation set at once.

5\. Use this master index to locate the correct file.



\---



\# 📚 Documentation Files



\## 1. Tournament Formats

\- `01\_TOURNAMENT\_FORMATS\_OVERVIEW.md`

\- `02\_SPECIALIZED\_VOLLEYBALL\_FORMAT.md`



\## 2. Operations Specification

\- `03\_OPERATIONS\_OVERVIEW.md`

\- `04\_DATA\_MODELS.md`

\- `05\_SCHEDULING\_ENGINE.md`

\- `06\_STANDINGS\_AND\_TIEBREAKERS.md`

\- `07\_BRACKET\_ENGINE.md`

\- `08\_MATCH\_ENGINE.md`

\- `09\_OFFICIATING\_AND\_WORK\_ASSIGNMENTS.md`

\- `10\_MATCH\_FORMATS\_AND\_TIMING.md`

\- `11\_PRINTING\_AND\_EXPORTING.md`



\## 3. Coach‑Friendly Guides

\- `12\_COACH\_GUIDE\_OVERVIEW.md`

\- `13\_COACH\_GUIDE\_VOLLEYBALL\_FORMATS.md`



\## 4. JSON Schemas

\- `14\_JSON\_SCHEMAS.md`



\## 5. UI Wireframes

\- `15\_WIREFRAMES\_ADMIN.md`

\- `16\_WIREFRAMES\_PUBLIC.md`



\---



\# 🔧 Dependencies \& Load Order



If the AI agent needs to understand:



\- \*\*Formats\*\* → load 01 → 02  

\- \*\*Operations\*\* → load 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11  

\- \*\*Coach Guides\*\* → load 12 → 13  

\- \*\*Schemas\*\* → load 14  

\- \*\*Wireframes\*\* → load 15 → 16  



\---



\# 📖 Glossary



\- \*\*Pool\*\* — A group of teams playing round robin.  

\- \*\*Crossover\*\* — A match pairing high vs low seeds across pools.  

\- \*\*Placement Bracket\*\* — A bracket that determines final ranking.  

\- \*\*Work Team\*\* — A team assigned to officiate or scorekeep.  

\- \*\*Officiating Role\*\* — A referee, line judge, scorekeeper, etc.  

\- \*\*Match Format\*\* — Rules defining sets, scoring, caps, etc.  

\- \*\*Time Slot\*\* — A scheduled block on a court.  



\---



\# End of Master Index



