# CivicDesk — Frontend

React + Vite frontend for the Municipal Complaint System, styled as a
civic "ledger" of ticket stubs. Talks to the existing Express/Mongo
Backend in `../Backend`.

## Stack
- React 19 + Vite
- React Router (client-side routing)
- Tailwind CSS v4
- Axios

## Setup

```bash
cd Frontend
npm install
```

Copy `.env.example` to `.env` if it doesn't already exist, and point it
at your running backend:

```
VITE_API_URL=http://localhost:5000
```

Then start the dev server:

```bash
npm run dev
```

The backend (in `../Backend`) must be running separately on the port
in `VITE_API_URL` — see `Backend/README.md` for its routes.

## Structure

```
src/
  lib/api.js              axios instance (baseURL = VITE_API_URL)
  context/AuthContext.jsx citizen + admin auth state (localStorage-backed)
  components/             Navbar, Footer, TicketCard, StatusStamp, route guards
  pages/
    Home.jsx              public landing page
    CitizenSignup.jsx      /signup
    CitizenLogin.jsx       /login
    CitizenDashboard.jsx   /dashboard   (protected) file + track own complaints
    AdminLogin.jsx          /admin/login
    AdminDashboard.jsx      /admin/dashboard (protected) review + accept all complaints
    NotFound.jsx            404
```

## Notes on wiring to the backend

- Citizen signup/login → `POST /auth/sign-up`, `POST /auth/login`
- Admin login → `POST /login/Admin`
- File a complaint → `POST /send-complain` (citizen JWT)
- My tickets → `GET /complain-list` (citizen JWT) — filtered client-side
  to the logged-in user's own complaints, since the endpoint returns
  every complaint in the system
- Withdraw a ticket → `DELETE /complains/:id` (citizen JWT, must own it)
- Full ward queue → `GET /complain-list/Admin` (admin JWT)
- Accept a ticket → `PATCH /complains/:id/accept` (admin JWT)

Citizen and admin sessions are stored under separate localStorage keys
so a resident and staff account can, in principle, be logged in at the
same time in the same browser.
