# AGENT_INSTRUCTIONS.md

### AI Development Rules for the Tournament Planner Project

This file defines how any AI agent must behave when working on the **Tournament Planner** application.
These instructions are mandatory and override default behavior.

---

# 1. Project Overview

Build a **browser-based tournament organizer app** called **Tournament Planner**.

The app must:

- Run as a **static web app** (no backend services, no build step)
- Work when opened directly in a browser or hosted on GitHub Pages
- Prioritize simplicity and maintainability over feature depth
- Use **vanilla JavaScript (ES6+, "use strict")** by default
- Use **localStorage** as primary persistence
- Use **IndexedDB** only when data volume requires it
- Use a **multi-view layout** simulated in the browser
- Be fully **responsive** (desktop, tablet, mobile)
- Follow the specification suite in `/Specifications`

This project should remain framework-free and build-step-free unless the user explicitly requests otherwise.

---

# 2. Specification Requirements

Before implementing major features, the AI should:

1. Read `Specifications/00_MASTER_INDEX.md`
2. Read relevant specification files in `/Specifications` (01-16)
3. Ask clarifying questions only when there is material ambiguity
4. Avoid assumptions that would change behavior or scope
5. Keep implementation aligned with user priorities

If a conflict exists between older documentation and explicit user direction, update documentation first, then implement.

---

# 3. Implementation Rules

The AI must:

- Keep the app browser-only (no server runtime required)
- Use no build tools
- Prefer no external dependencies
- Keep architecture client-side and modular
- Use semantic HTML
- Use CSS only (no preprocessors)
- Use event delegation where practical
- Use progressive enhancement
- Use defensive programming
- Use strict mode in JavaScript

The AI must not:

- Introduce backend services or deployment dependencies
- Introduce bundlers or required compile steps
- Invent features not requested by user or specifications

---

# 4. UI Requirements

The app should include:

- A top navigation area
- Multiple screens/views swapped in browser
- Clean, mobile-friendly layout
- Admin-oriented workflows
- Public-display oriented workflows

All UI should be accessible and responsive.

---

# 5. Development Workflow

When implementing or modifying code:

1. Re-read relevant specification files
2. Clarify only unresolved, high-impact ambiguity
3. Implement the simplest valid solution first
4. Explain architecture decisions briefly
5. Keep docs aligned with implementation reality

---

# 6. Documentation Requirements

The AI should maintain:

- A clear README
- Updated specifications when direction changes
- Short architectural notes for key decisions
- Inline comments only where needed for clarity

---

# 7. License Requirements

All generated work must include the following license header when required by project policy:

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
Copyright (c) 2026 Jared Mathes

To view a copy of this license, visit:
http://creativecommons.org/licenses/by-nc-sa/4.0/

Or send a letter to:
Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

---

# 8. If Unclear

If unclear about critical behavior, the AI must ask for clarification before implementing that behavior.

---

# End of File