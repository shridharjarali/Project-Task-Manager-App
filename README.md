# Project & Task Manager App

A full-stack mobile app for managing projects and tasks.

## Tech Stack

| Layer           | Technology                          |
|-----------------|-------------------------------------|
| Frontend        | React Native (Expo)                 |
| State Mgmt      | Redux Toolkit (Thunks)             |
| Backend         | Node.js + Express                  |
| Database        | PostgreSQL                          |
| Auth            | OTP-based + JWT                     |
| HTTP Client     | Axios                               |

## Project Structure

```
├── backend/          # Node.js Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── config/
│   │   └── utils/
│   └── migrations/
│
└── mobile/           # React Native Expo app
    └── src/
        ├── components/
        ├── screens/
        ├── store/slices/
        ├── navigation/
        ├── theme/
        └── utils/
```

## Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Expo Go app on your phone (or Android emulator)

### Database Setup

```bash
# Run as postgres superuser:
sudo -u postgres bash -c '
  psql -c "CREATE ROLE <your_username> WITH LOGIN CREATEDB;"
  createdb -O <your_username> taskmanager
  psql -d taskmanager -f backend/migrations/001_init.sql
  psql -d taskmanager -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <your_username>;"
  psql -d taskmanager -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO <your_username>;"
'
```

### Backend

```bash
cd backend
cp .env.example .env  # Update DATABASE_URL if needed
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app.

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` — Send OTP to email
- `POST /api/auth/verify-otp` — Verify OTP & get JWT

### Projects (Protected)
- `GET /api/projects` — List all projects
- `POST /api/projects` — Create project
- `PUT /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project

### Tasks (Protected)
- `GET /api/projects/:projectId/tasks` — List tasks
- `POST /api/projects/:projectId/tasks` — Create task
- `PUT /api/projects/:projectId/tasks/:id` — Update task
- `DELETE /api/projects/:projectId/tasks/:id` — Delete task

## Features

- ✅ OTP-based authentication
- ✅ JWT session persistence
- ✅ Project CRUD
- ✅ Task CRUD with status toggle
- ✅ Light/Dark theme with persistence
- ✅ Pull-to-refresh
- ✅ Search/filter
- ✅ Progress tracking
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Empty states

## Dev Note

In development mode, the OTP code is printed to the **backend console** instead of being sent via email. Look for the `📧 OTP for ...` log message.
