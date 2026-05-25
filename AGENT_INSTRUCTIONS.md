\# AGENT\_INSTRUCTIONS.md  

\### AI Development Rules for the Tournament Planner Project



This file defines how any AI agent must behave when working on the \*\*Tournament Planner\*\* application.  

These instructions are mandatory and override all default behavior.  

The agent must follow this document \*\*before generating any code, documentation, or architectural decisions\*\*.



\---



\# 1. Project Overview



Build a \*\*browser‑based tournament organizer / creator app\*\* called \*\*Tournament Planner\*\*.



The app must:



\- Run as a \*\*static web app\*\* (no backend, no build step)  

\- Use exactly three files: \*\*index.html\*\*, \*\*app.js\*\*, \*\*styles.css\*\*  

\- Work when opened directly in a browser or hosted on GitHub Pages  

\- Use \*\*vanilla JavaScript (ES6+, "use strict")\*\*  

\- Use \*\*localStorage\*\* as primary persistence  

\- Use \*\*IndexedDB\*\* as a fallback for large data  

\- Use a \*\*multi‑page layout\*\* simulated via DOM swapping  

\- Be fully \*\*responsive\*\* (desktop, iPad, iPhone)  

\- Keep \*\*all logic in app.js\*\*  

\- Follow the \*\*full specification suite\*\* in `/Specifications`  

\- Ask clarifying questions before implementing anything unclear  



This project must remain framework‑free and build‑step‑free.



\---



\# 2. Specification Requirements



Before implementing anything, the AI must:



1\. Read `Specifications/00\_MASTER\_INDEX.md`  

2\. Read \*\*all referenced specification files\*\* (01–16)  

3\. Ask clarifying questions if anything is ambiguous  

4\. Assume nothing  

5\. Follow the specifications exactly  



The specification suite defines:



\- Data models  

\- Engines  

\- Scheduling logic  

\- Standings logic  

\- Bracket logic  

\- Match formats  

\- Officiating/work assignment logic  

\- Printing/exporting  

\- Public display engine  

\- Permissions  

\- System architecture  



These files are \*\*authoritative\*\*.  

If a conflict exists, the specification suite wins.



\---



\# 3. Implementation Rules



The AI must:



\- Use \*\*no frameworks\*\*  

\- Use \*\*no build tools\*\*  

\- Use \*\*no external dependencies\*\*  

\- Keep all logic in \*\*app.js\*\*  

\- Use \*\*modular patterns inside app.js\*\* (namespaces, closures, IIFE, etc.)  

\- Use \*\*semantic HTML\*\*  

\- Use \*\*CSS only\*\* (no preprocessors)  

\- Use \*\*event delegation\*\* for UI interactions  

\- Use \*\*progressive enhancement\*\*  

\- Use \*\*defensive programming\*\*  

\- Use \*\*strict mode\*\*  



The AI must not:



\- Introduce new files beyond index.html, app.js, styles.css, and documentation  

\- Introduce new libraries  

\- Introduce bundlers or build steps  

\- Invent features not in the specifications  



\---



\# 4. UI Requirements



The app must include:



\- A top navigation bar  

\- Multiple “views” (screens) swapped via JavaScript  

\- A clean, mobile‑friendly layout  

\- Printable views where required  

\- Public display modes  

\- Admin panel modes  



All UI must be accessible and responsive.



\---



\# 5. Development Workflow



When the AI is asked to implement or modify code:



1\. Re‑read relevant specification files  

2\. Ask clarifying questions if needed  

3\. Produce code that strictly follows the specs  

4\. Explain architectural decisions  

5\. Never assume missing details  

6\. Never invent features not in the specs  



If the user asks for something outside the spec, the AI must ask whether the spec should be updated.



\---



\# 6. Documentation Requirements



The AI must generate:



\- A comprehensive README  

\- Additional documentation as needed  

\- Clear explanations of architecture and design  

\- Inline comments in code where appropriate  



Documentation must be consistent with the specification suite.



\---



\# 7. License Requirements



All generated work must include the following license header:



Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License  

Copyright (c) 2026 Jared Mathes  



To view a copy of this license, visit:  

http://creativecommons.org/licenses/by-nc-sa/4.0/



Or send a letter to:  

Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.



\---



\# 8. If Unclear



If the AI is unclear about \*\*anything\*\*, it must:



\- Ask questions  

\- Request clarification  

\- Never proceed with assumptions  



This rule is absolute.



\---



\# End of File



