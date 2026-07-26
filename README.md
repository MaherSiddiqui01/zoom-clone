# Zoom Clone

A functional clone of Zoom's meeting dashboard, join flow, scheduling, and
meeting room.

Note: Backend is hosted on Render's free tier, which spins down after ~15 minutes of inactivity. The first request after idle may take up to ~50 seconds to respond while the server wakes up (this is expected, not a bug :)).

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python) + SQLAlchemy 
- **Database:** SQLite (file-based, `backend/zoom_clone.db`)

## Features

- Dashboard with New Meeting / Join Meeting / Schedule Meeting actions
- Upcoming Meetings and Recent Meetings sections
- Instant meeting creation with unique Meeting ID + shareable invite link
- Join by Meeting ID or invite link, with display name entry and validation
- Schedule meetings with title, description, date/time, and duration
- Meeting room UI: fake video tiles, mute/camera toggle, leave button

## Assumptions / Scope Decisions

- **No login required**, per the assignment. A default user ("Default User")
  is assumed logged in everywhere.
- **No real video/audio (WebRTC).** The assignment's core features and
  evaluation criteria only require meeting creation/join/schedule workflows
  and UI similarity to Zoom -> not an actual peer-to-peer video connection.
  The meeting room is a UI-only shell: mute/camera buttons toggle local
  state only, no real media stream is opened. This kept the 1-day scope
  realistic without cutting any graded feature.
- Meeting IDs are generated in Zoom's `XXX-XXXX-XXX` format.

## Database Schema

**meetings**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| meeting_code | string, unique | e.g. `123-4567-890` |
| title | string | |
| description | text, nullable | |
| host_name | string | default "Default User" |
| meeting_type | enum | `instant` \| `scheduled` |
| scheduled_time | datetime, nullable | only set for scheduled meetings |
| duration_minutes | int | |
| status | enum | `upcoming` \| `completed` |
| created_at | datetime | |

**participants**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| meeting_id | int, FK -> meetings.id | |
| display_name | string | |
| joined_at | datetime | |

One meeting has many participants (1-to-many relationship).

## Running Locally

### 1. Backend

```
cd backend
pip install -r requirements.txt --break-system-packages
python seed.py          # optional: fills sample meetings
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`. Check `http://localhost:8000/api/health`.

### 2. Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`. It reads the backend URL from
`frontend/.env.local` (`NEXT_PUBLIC_API_URL`, already set to
`http://localhost:8000` for local dev).

## Deployment

- **Backend:** deploy to Render (free web service). Build command:
  `pip install -r requirements.txt`. Start command:
  `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- **Frontend:** deploy to Vercel. Set environment variable
  `NEXT_PUBLIC_API_URL` to your deployed backend's URL, and
  `BASE_INVITE_URL` on the backend to your deployed frontend's
  `/meeting` URL (e.g. `https://your-app.vercel.app/meeting`).

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/meetings/instant` | Create instant meeting |
| POST | `/api/meetings/schedule` | Create scheduled meeting |
| GET | `/api/meetings/upcoming` | List upcoming scheduled meetings |
| GET | `/api/meetings/recent` | List recent meetings |
| GET | `/api/meetings/{code}` | Get + validate a meeting |
| POST | `/api/meetings/{code}/join` | Join a meeting as a participant |
| GET | `/api/meetings/{code}/participants` | List participants |
