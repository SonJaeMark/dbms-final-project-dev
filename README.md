# Job Match Up — DBMS Final Project

A client-side web application built with native Web Components and Supabase as the backend. It supports three roles — admin, job lister, and job seeker — and provides job browsing, posting, and application flows.

## Features

- Job listing grid with pagination (`js/comp/job-grid.js`)
- Job cards and details modals with image carousel (`js/comp/job-card.js`, `js/comp/job-details.js`, `js/comp/job-details-seeker.js`)
- Role-based dashboards: `dashboard-admin.html`, `dashboard-job-lister.html`, `dashboard-job-seeker.html`
- Authentication and session handling (`js/comp/login-form.js`), navbar updates on login/logout (`js/comp/navbar.js`)
- Search filters on Home and Seeker Dashboard (title, location, category, salary, work type)
- Mobile-friendly layout: hamburger sidebar, responsive cards and grids

## Tech Stack

- Frontend: Vanilla JS, HTML, CSS, native Web Components
- Design tokens: `js/core/design-token.js`
- Backend: Supabase (`js/core/supabase-client.js`) with RPC stored procedures

## Getting Started

1. Configure Supabase
   - Set `supabaseUrl` and `supabaseKey` in `js/core/supabase-client.js`.
   - Keep the key appropriate for client-side use.

2. Serve the site
   - Option A: Open `index.html` directly in a modern browser.
   - Option B (recommended for modules): Serve the project with any static server (e.g., VS Code Live Server, `python -m http.server`).

3. Open Pages
   - `index.html` — Home, browse jobs
   - `login.html` / `register.html` — Auth
   - `dashboard-job-seeker.html` — Seeker
   - `dashboard-job-lister.html` — Lister
   - `dashboard-admin.html` — Admin

## Project Structure

- `index.html` — Home page with hero search and `job-grid`
- `js/comp/` — UI components (cards, grids, modals, navbar, footer)
- `js/db-logic/` — Supabase RPC wrappers per domain (jobs, lister, seeker, admin, notifications)
- `js/core/` — Supabase client and helper executors
- `1_SQL_SCRIPTS/1.3_StoredLogic/` — Stored procedure files (documentation + skeletons)

## Key Components

- `js/comp/navbar.js` — Mobile sidebar, dynamic menu, session-driven content
- `js/comp/job-grid.js` — Loads published jobs via `getPublishedJobs` and renders cards
- `js/comp/job-card.js` — Displays summary info and emits `view-job`
- `js/comp/job-details.js` — Lister/Admin friendly details modal with image carousel
- `js/comp/job-details-seeker.js` — Seeker details modal with carousel and Apply form
- `js/comp/job-form.js` — Post job form (images upload UI, required fields, category list)

## Data Fetching & RPCs

Supabase RPC functions are used across the app. Highlights:

- Jobs
  - `get_published_jobs_paginated` — paginated published jobs (`js/db-logic/job-handler.js:14`)
  - `get_job_join_job_image_by_job_id` — single job with joined images (`js/db-logic/job-handler.js:144`)
  - `get_job_by_filter` — search by optional filters (`js/db-logic/job-handler.js:209`)
- Job Lister
  - `add_job_with_images`, `update_job`, `update_job_image`, `delete_job_return` (`js/db-logic/job-lister-handler.js`)
  - `get_all_jobs_by_status_and_user_id` — dashboard stats and listings (`dashboard-job-lister.html:532`)
- Seeker
  - `insert_application_status_applied_by_job_id` — apply
  - `get_application_status_applied_by_user_id`, `get_application_status_accepted_by_user_id`
  - `get_resume_by_user_id`, `insert_resume_by_user_id` (`js/db-logic/seeker-handler.js`)
- Admin
  - Pending approvals, publish/reject, users paginated and activation (`js/db-logic/admin-handler.js`)
- Notifications (currently not shown in sidebar)
  - `insert_notification`, `get_all_unread_notification`, `update_notification_to_read` (`js/db-logic/notification-handler.js`)

## Search & Categories

- Home hero search (`index.html`) and Seeker dashboard search (`dashboard-job-seeker.html`) support:
  - Title, Location, Category, Min/Max Salary, Work Type
- Category values are standardized:
  - Construction Worker
  - Karpintero
  - Tubero
  - Elektrisyan
  - Mekaniko (Sasakyan o Motor)
  - Kasambahay / Yaya
  - Tagalinis / Housekeeper
  - Drayber (Family Driver / Delivery Driver)
  - Tindero / Tindera
  - Tagapagturo / Tutor
  - Aricon Technician
  - Others

## Authentication & Sessions

- Login form calls `loginUser` and stores `auth_user` in `localStorage` (`js/comp/login-form.js:155`).
- Navbar listens for `login-success` and updates links (`js/comp/navbar.js:327`).
- Role redirects after login: admin, job_lister, job_seeker.

## Mobile Responsiveness

- Hamburger opens a sidebar with primary navigation; overlay click closes.
- Job cards and grids adapt with `minmax(240px, 1fr)` on small screens.
- Details modals optimized for mobile, with image carousel controls.

## Academic Documentation

- For academic technical documentation (SDAD) required for the DBMS course, see:
  - MD: [Software Design & Analysis Document](3_DOCUMENTATION/%23%20Software%20Design%20%26%20Analysis%20Document%20%28S.md)
  - PDF: [SDAD (final submission)](3_DOCUMENTATION/SDAD_[GroupName].pdf)
  - The SDAD covers normalization analysis, DBMS concepts, transactional procedures, test cases, and flowcharts.

## Notes

- Ensure your database has the required RPC functions. The app assumes they exist and return expected shapes.
- Avoid committing sensitive keys. Use client-safe keys and configure `js/core/supabase-client.js` appropriately.
