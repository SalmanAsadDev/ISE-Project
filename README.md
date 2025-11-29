# Local Fitness Planner

Simple local-first fitness planner built with Node.js + Express and plain HTML/JS. All data is stored on disk under `data/` as JSON files.

## Features & User Stories

- Auth & Profiles: register/login (US-01/02), profile + goals (US-03/04), diet entries (US-05).
- Plans: auto meal/workout generation, save/edit/search/export/import (US-06 → US-08, US-17).
- Location & Professionals: geolocation with fallback, nearby professionals, profile view, mailto/tel/chat links, ratings (US-09 → US-12, US-21/22).
- Appointments & Progress: schedule appointments, log reminders w/ notifications, weight + steps tracking, charts (US-13 → US-16).
- Export/Feedback/Admin: export/import JSON, feedback form, admin dashboard for professionals/users/logs, analytics (US-17 → US-20, US-28).
- Misc: token auth, responsive layout, fake language selector, dark mode toggle, delete data, help page (US-23 → US-29).

## Project Structure

```
backend/
  index.js
  routes/
  utils/
frontend/
  index.html
  css/
  js/
data/
  professionals.json
  feedback.json
  admin_logs.json
  users/
  plans/
```

## Running Locally

```
npm install
npm run start
```

Open http://localhost:3000 in your browser.

## Storage Details

All JSON lives in the `data/` directory:

- `data/users/{emailHash}.json` → user account, profile, diet, progress
- `data/plans/{emailHash}_plans.json` → meal/workout plans
- `data/professionals.json` → editable via admin dashboard
- `data/feedback.json` → feedback entries
- `data/admin_logs.json` → analytics & request logs

You can inspect/delete these files manually for debugging. No remote storage exists.

## Export / Import Plans

1. After logging in, go to the Plans card.
2. Click **Export Plans** → downloads `{email}_plans.json`.
3. To import, click the file picker, choose a previously exported JSON, confirm success toast.

## Admin Login

Hardcoded local admin account:

- Email: `admin@local.test`
- Password: `AdminPass!123`

Admin section unlocks: add/remove professionals, set user statuses, view logs and analytics stream.

## Notifications & Service Worker

- Browser asks for notification permission when saving reminders.
- Service worker (`frontend/sw.js`) shows reminders even if tab is backgrounded.

## Manual Test Plan

1. Registration (US-01): sign up a new email, verify data file exists.
2. Login (US-02): authenticate, ensure token stored in localStorage.
3. Profile creation (US-03/04): fill forms, refresh page, fields stay populated.
4. Save daily plan (US-05/06/07/08): add diet entry, auto-generate plans, search and edit.
5. Export/import (US-17): export JSON, delete plans, import file, confirm restore.
6. Notifications (US-16): add reminder, allow notification, see toast and notification.
7. Location & professionals (US-09 → US-12): detect location, view cards, open tel/mailto/chat links.
8. Feedback & reviews (US-18/US-22): submit feedback, rate professional.
9. Admin actions (US-19/US-20/US-28): log in as admin, add/remove professional, change user status, review analytics list.
10. Data privacy (US-27): click delete data, confirm JSON reset in `data/users/...`.

## Automated Tests

```
npm test
```

Tests cover:
- `test/auth.test.js`: registration/login flow.
- `test/fileSave.test.js`: local JSON storage helper.
- `test/token.test.js`: signed token generation/validation.
