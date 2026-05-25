\# User Permissions \& Roles  

\### Access Control, Role Definitions, Privilege Levels, Audit Rules, and Multi‑Venue Restrictions



This document defines the user permission system used by the Tournament Planner System.  

It describes how roles are structured, how permissions are granted, and how access is controlled across divisions, venues, and tournament operations.



This file is part of the modular documentation set referenced in 00\_MASTER\_INDEX.md.



\---



\# 1. Purpose



The User Permissions \& Roles Engine is responsible for:



\- Defining user roles  

\- Controlling access to administrative features  

\- Restricting sensitive actions  

\- Supporting multi‑venue permissions  

\- Supporting division‑specific permissions  

\- Logging all privileged actions  

\- Ensuring safe and auditable tournament operations  



This engine ensures that only authorized users can modify critical tournament data.



\---



\# 2. Permission Model Overview



The system uses a hierarchical permission model:



1\. Super Admin  

2\. Tournament Director  

3\. Division Admin  

4\. Venue Admin  

5\. Court Admin  

6\. Official  

7\. Coach  

8\. Spectator (public access)



Higher roles inherit permissions from lower roles.



\---



\# 3. Role Definitions



Each role is described below.



\---



\# 3.1 Super Admin



Super Admins have full access to:



\- All tournaments  

\- All divisions  

\- All venues  

\- All courts  

\- All settings  

\- All overrides  

\- All audit logs  



Super Admins can:



\- Create tournaments  

\- Delete tournaments  

\- Manage system‑wide settings  

\- Manage user accounts  

\- Assign roles  



This is the highest‑privilege role.



\---



\# 3.2 Tournament Director



Tournament Directors have full access to:



\- All divisions within the tournament  

\- All venues within the tournament  

\- All scheduling tools  

\- All override tools  

\- All printing and exporting tools  



Tournament Directors can:



\- Generate pools  

\- Generate brackets  

\- Edit schedules  

\- Override results  

\- Manage officials  

\- Manage work teams  

\- Manage venues and courts  



They cannot modify system‑wide settings.



\---



\# 3.3 Division Admin



Division Admins have access to:



\- Their assigned division(s) only  

\- Pool management  

\- Bracket management  

\- Team management  

\- Division‑specific scheduling  

\- Division‑specific printing  



Division Admins cannot:



\- Modify other divisions  

\- Modify venue settings  

\- Modify global tournament settings  



\---



\# 3.4 Venue Admin



Venue Admins have access to:



\- Their assigned venue(s) only  

\- Court schedules  

\- Court availability  

\- Venue‑specific printing  

\- Venue‑specific officiating and work assignments  



Venue Admins cannot:



\- Modify pools  

\- Modify brackets  

\- Modify seeds  

\- Override match results  



\---



\# 3.5 Court Admin



Court Admins have access to:



\- Their assigned court(s) only  

\- Match status updates  

\- Score entry  

\- Work team confirmation  

\- Official confirmation  



Court Admins cannot:



\- Change schedules  

\- Override results  

\- Modify assignments  

\- Edit formats  



This role is typically used for court managers or score table staff.



\---



\# 3.6 Official



Officials have access to:



\- Their personal officiating schedule  

\- Match details for assigned matches  

\- Score entry (if enabled)  

\- Match status updates (if enabled)  



Officials cannot:



\- Edit schedules  

\- Override results  

\- Modify assignments  

\- Access admin tools  



\---



\# 3.7 Coach



Coaches have access to:



\- Their team’s schedule  

\- Their team’s standings  

\- Their team’s bracket path  

\- Public displays  

\- Team‑specific notifications  



Coaches cannot:



\- Edit schedules  

\- Enter scores  

\- Override results  

\- Access admin tools  



\---



\# 3.8 Spectator (Public Access)



Spectators have access to:



\- Public displays  

\- Live brackets  

\- Live standings  

\- Court boards  

\- Team schedules  



Spectators cannot:



\- Log in  

\- Edit anything  

\- Access admin tools  



\---



\# 4. Permission Categories



Permissions are grouped into categories:



\- Tournament Management  

\- Division Management  

\- Scheduling  

\- Match Control  

\- Officiating  

\- Work Assignments  

\- Printing \& Exporting  

\- Data Import \& Export  

\- Settings \& Overrides  

\- Audit Logs  



Each role has access to specific categories.



\---



\# 5. Sensitive Actions



Sensitive actions require elevated permissions:



\- Overriding match results  

\- Overriding standings  

\- Overriding bracket advancement  

\- Editing seeds after play begins  

\- Editing schedules after play begins  

\- Editing court availability  

\- Editing venue availability  

\- Editing match formats  

\- Editing time limits  

\- Editing officiating rules  

\- Editing work assignment rules  



These actions are logged.



\---



\# 6. Multi‑Venue Permission Rules



The system supports venue‑specific restrictions:



\- Venue Admins cannot modify other venues  

\- Court Admins cannot modify other courts  

\- Officials cannot view assignments at other venues  

\- Coaches cannot view restricted venue data (if enabled)  



Tournament Directors override all venue restrictions.



\---



\# 7. Division‑Specific Permission Rules



Division Admins:



\- Cannot modify other divisions  

\- Cannot modify global settings  

\- Cannot modify venue settings  

\- Cannot modify other division’s schedules  



Tournament Directors override all division restrictions.



\---



\# 8. Audit Logging



All privileged actions must be logged, including:



\- Schedule changes  

\- Court changes  

\- Venue changes  

\- Score overrides  

\- Standings overrides  

\- Bracket overrides  

\- Assignment overrides  

\- Format changes  

\- Time limit changes  

\- User role changes  



Audit logs include:



\- Timestamp  

\- User  

\- Action  

\- Before and after values  



Audit logs cannot be deleted except by Super Admins.



\---



\# 9. Role Assignment



Roles may be assigned by:



\- Super Admin  

\- Tournament Director (for lower roles)  



Role assignment includes:



\- User  

\- Role  

\- Division scope (optional)  

\- Venue scope (optional)  

\- Court scope (optional)  



\---



\# 10. Temporary Permissions



Temporary permissions may be granted for:



\- Volunteers  

\- Court managers  

\- Guest officials  

\- Visiting directors  



Temporary permissions expire automatically.



\---



\# 11. Read‑Only Mode



The system supports read‑only mode for:



\- Completed tournaments  

\- Archived tournaments  

\- Public viewing  



In read‑only mode:



\- No edits are allowed  

\- No overrides are allowed  

\- No schedule changes are allowed  



\---



\# End of File



