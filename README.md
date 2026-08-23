# CivicDesk — Municipal Complaint System

A full-stack app for reporting and tracking municipal issues (potholes,
streetlight outages, sanitation, drainage, etc.). Residents file a
complaint and track it as a numbered "ticket"; municipal staff review
the ward-wide queue and accept tickets for action.

The project is split into two independent apps:

```
Municipal-Complain-System/
├── Backend/    Express + MongoDB REST API
└── Frontend/   React + Vite client
```

---

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, Vite, React Router, Tailwind CSS v4, Axios |
| Backend  | Node.js, Express 5, MongoDB (Mongoose), JWT auth, bcrypt |

---

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database (local or Atlas)

---

## Quick start

Run the backend and frontend in two separate terminals.

### 1. Backend

```bash
cd Backend
npm install
```

Create/edit `Backend/.env`:

```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
MONGODB_USERNAME=<if your URI needs it separately>
MONGODB_PASSWORD=<if your URI needs it separately>
JWT_SECRET=<a long random secret>
JWT_EXPIRES_IN=7d
```

Start the API (with auto-reload):

```bash
npm run dev
```

The server listens on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd Frontend
npm install
```

Check `Frontend/.env` points at your running backend:

```
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

---

## Features

**Citizens**
- Sign up / log in with name, phone, and password
- File a complaint with type, location, and description
- View their own complaints as ticket cards with a live status stamp
  (Pending → Accepted → Resolved, or Rejected)
- Withdraw (delete) their own complaint

**Municipal staff (admin)**
- Separate staff sign-in
- View every complaint filed across the ward
- Filter by status
- Accept a pending complaint to move it into the queue

Citizen and admin sessions are independent — a resident and a staff
member can be logged in at the same time in the same browser.

---

## Backend API reference

Base URL: `http://localhost:5000` (or your `PORT`/deployment URL)

| Method | Route                       | Auth        | Description                              |
|--------|------------------------------|-------------|-------------------------------------------|
| POST   | `/auth/sign-up`              | —           | Register a citizen (`name`, `phone`, `password`) |
| POST   | `/auth/login`                | —           | Citizen login (`phone`, `password`)       |
| POST   | `/login/Admin`                | —           | Admin login (`email`, `password`)         |
| POST   | `/send-complain`             | Citizen JWT | File a complaint (`name`, `phone`, `type`, `description`, `location`) |
| GET    | `/complain-list`             | Citizen JWT | Fetch complaints                          |
| DELETE | `/complains/:id`             | Citizen JWT | Delete a complaint the citizen owns       |
| GET    | `/complain-list/Admin`       | Admin JWT   | Fetch every complaint                     |
| PATCH  | `/complains/:id/accept`      | Admin JWT   | Mark a complaint `Accepted`               |

Authenticated requests send `Authorization: Bearer <token>`, using the
token returned from the relevant login/signup call.

### Data models

**User**: `name`, `phone` (unique), `password` (hashed), `role` (`user` | `admin`), timestamps.

**Admin**: `email` (unique), `password` (hashed).

**Complaint**: `userId` (ref → User), `name`, `phone`, `type`,
`description`, `location`, `status` (`Pending` | `Accepted` |
`Rejected` | `Resolved`, default `Pending`), timestamps.

See `Backend/README.md` for the original endpoint notes.

---

## Frontend structure

```
Frontend/src/
├── lib/api.js               Axios instance (baseURL = VITE_API_URL)
├── context/AuthContext.jsx  Citizen + admin auth state (localStorage-backed)
├── components/
│   ├── Navbar.jsx / Footer.jsx
│   ├── TicketCard.jsx        Ticket-stub complaint card
│   ├── StatusStamp.jsx       Status "stamp" badge
│   ├── AuthCard.jsx          Shared auth form shell
│   └── ProtectedRoute.jsx    CitizenRoute / AdminRoute guards
└── pages/
    ├── Home.jsx                    Public landing page
    ├── CitizenSignup.jsx           /signup
    ├── CitizenLogin.jsx            /login
    ├── CitizenDashboard.jsx        /dashboard        (protected)
    ├── AdminLogin.jsx              /admin/login
    ├── AdminDashboard.jsx          /admin/dashboard  (protected)
    └── NotFound.jsx                404
```

See `Frontend/README.md` for more detail on how each page maps to the
API above.

---

## Design notes

The UI uses a "civic ledger" theme: deep ink-navy and brass tones,
a serif/mono type pairing (Fraunces, Inter, IBM Plex Mono), and
complaints rendered as numbered ticket stubs with an ink-stamp status
badge — evoking an official register rather than a generic dashboard.

---

## Building for production

```bash
cd Frontend
npm run build   # outputs to Frontend/dist
```

Serve `Frontend/dist` with any static host, and deploy `Backend/`
(e.g. to a Node host) with the same environment variables as above.
Set `VITE_API_URL` at build time to your deployed backend's URL.
