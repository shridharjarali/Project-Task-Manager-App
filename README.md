<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

<h1 align="center">📋 Project Task Manager</h1>

<p align="center">
  A full-stack mobile application for organizing projects and tracking tasks — built with React Native (Expo), Node.js, and PostgreSQL.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-author">Author</a>
</p>

---

## 📖 About

**Project Task Manager** is a mobile-first productivity app that lets users create projects, break them into actionable tasks, and track progress — all behind a secure OTP-based authentication flow. The app features a polished UI with light/dark theme support, real-time progress tracking, and intuitive task management with status toggling, due dates, and filtering.

Built as a monorepo with a **React Native (Expo)** frontend and a **Node.js/Express** REST API backed by **PostgreSQL**.

---

## ✨ Features

| Category | Details |
|----------|---------|
| **Authentication** | OTP-based login via email, JWT session management, persistent auth state |
| **Projects** | Create, view, edit, and delete projects with title & description |
| **Tasks** | Create tasks within projects, toggle complete/incomplete, set optional due dates, delete |
| **Progress Tracking** | Visual progress bars on project cards and detail views |
| **Search & Filter** | Search projects by title/description; filter tasks by status (All / Active / Done) |
| **Theming** | Light & Dark mode with curated color palettes, persisted across sessions |
| **UX Polish** | Pull-to-refresh, loading indicators, empty states, form validation, press animations |
| **State Management** | Redux Toolkit with async thunks, 4 dedicated slices |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [React Native](https://reactnative.dev/) | Cross-platform mobile UI |
| [Expo](https://expo.dev/) | Development toolchain & build system |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Centralized state management with async thunks |
| [React Navigation](https://reactnavigation.org/) | Stack-based screen navigation |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Local persistence (tokens, theme) |

### Backend
| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express](https://expressjs.com/) | REST API framework |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [JSON Web Tokens](https://jwt.io/) | Stateless authentication |
| [express-validator](https://express-validator.github.io/) | Request validation & sanitization |

---

## 🏗 Architecture

```
project-task-manager/
│
├── backend/                          # REST API Server
│   ├── migrations/
│   │   └── 001_init.sql              # Database schema
│   └── src/
│       ├── index.js                  # Server entry point
│       ├── config/
│       │   └── db.js                 # PostgreSQL pool & migrations
│       ├── controllers/
│       │   ├── authController.js     # OTP send/verify, JWT issuance
│       │   ├── projectController.js  # Project CRUD
│       │   └── taskController.js     # Task CRUD with ownership checks
│       ├── middleware/
│       │   ├── auth.js               # JWT verification
│       │   └── validate.js           # Validation error handler
│       ├── routes/
│       │   ├── auth.js               # /api/auth/*
│       │   ├── projects.js           # /api/projects/*
│       │   └── tasks.js              # /api/projects/:projectId/tasks/*
│       └── utils/
│           └── otp.js                # OTP generation & verification
│
├── mobile/                           # React Native (Expo) App
│   ├── App.js                        # Root component with providers
│   └── src/
│       ├── components/
│       │   ├── ProjectCard.js        # Animated project card
│       │   ├── TaskItem.js           # Task row with checkbox
│       │   ├── CreateTaskModal.js    # Bottom sheet for new tasks
│       │   ├── EmptyState.js         # Illustrated empty state
│       │   ├── LoadingOverlay.js     # Full-screen loader
│       │   └── ThemeToggle.js        # Light/dark mode switch
│       ├── screens/
│       │   ├── LoginScreen.js        # Email input + send OTP
│       │   ├── OTPScreen.js          # 6-digit verification
│       │   ├── ProjectListScreen.js  # Project list with search
│       │   ├── CreateProjectScreen.js# New project form
│       │   └── ProjectDetailScreen.js# Tasks + filters + progress
│       ├── store/
│       │   ├── index.js              # Redux store configuration
│       │   ├── api/axios.js          # Axios instance + interceptors
│       │   └── slices/
│       │       ├── authSlice.js      # Auth state & thunks
│       │       ├── projectSlice.js   # Projects state & thunks
│       │       ├── taskSlice.js      # Tasks state & thunks
│       │       └── themeSlice.js     # Theme state & persistence
│       ├── navigation/
│       │   └── AppNavigator.js       # Auth/Main stack navigator
│       ├── theme/
│       │   └── colors.js             # Light & Dark color palettes
│       └── utils/
│           └── storage.js            # AsyncStorage helpers
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **PostgreSQL** v14 or later — [Download](https://www.postgresql.org/download/)
- **Expo Go** app on your phone — [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)
- **Git** — [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/shridharjarali/Project-Task-Manager-App.git
cd Project-Task-Manager-App
```

### 2. Database Setup

Create the PostgreSQL database and apply the schema:

```bash
sudo -u postgres bash -c '
  psql -c "CREATE ROLE your_username WITH LOGIN CREATEDB;"
  createdb -O your_username taskmanager
  psql -d taskmanager -f backend/migrations/001_init.sql
  psql -d taskmanager -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;"
  psql -d taskmanager -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;"
'
```

> **Note:** Replace `your_username` with your system username.

### 3. Backend Setup

```bash
cd backend
cp .env.example .env    # Create env file (see Environment Variables below)
npm install
npm run dev
```

The server will start at `http://localhost:3000`.

### 4. Mobile App Setup

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app to launch on your device.

> **Tip:** If running on an Android emulator, the API base URL in `mobile/src/store/api/axios.js` uses `10.0.2.2:3000`. For physical devices on the same network, update it to your machine's local IP address.

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=3000

# Database
DATABASE_URL=postgresql://your_username@localhost:5432/taskmanager

# Authentication
JWT_SECRET=your-super-secret-jwt-key
OTP_EXPIRY_MINUTES=5
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `OTP_EXPIRY_MINUTES` | Time before an OTP expires | `5` |

> ⚠️ **Never commit your `.env` file.** It is already included in `.gitignore`.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/send-otp` | Send a 6-digit OTP to email | ❌ |
| `POST` | `/api/auth/verify-otp` | Verify OTP and receive JWT | ❌ |

<details>
<summary><b>Request & Response Examples</b></summary>

**Send OTP**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```
```json
{ "message": "OTP sent successfully. Check console in dev mode." }
```

**Verify OTP**
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```
```json
{
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "email": "user@example.com", "created_at": "..." }
}
```
</details>

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/projects` | List all user projects | ✅ |
| `POST` | `/api/projects` | Create a new project | ✅ |
| `PUT` | `/api/projects/:id` | Update a project | ✅ |
| `DELETE` | `/api/projects/:id` | Delete a project (cascades tasks) | ✅ |

<details>
<summary><b>Request & Response Examples</b></summary>

**Create Project**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Mobile App Redesign", "description": "Revamp the entire UI"}'
```
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Mobile App Redesign",
  "description": "Revamp the entire UI",
  "task_count": "0",
  "completed_count": "0",
  "created_at": "2025-05-28T...",
  "updated_at": "2025-05-28T..."
}
```
</details>

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/projects/:projectId/tasks` | List all tasks in a project | ✅ |
| `POST` | `/api/projects/:projectId/tasks` | Create a task | ✅ |
| `PUT` | `/api/projects/:projectId/tasks/:id` | Update a task | ✅ |
| `DELETE` | `/api/projects/:projectId/tasks/:id` | Delete a task | ✅ |

<details>
<summary><b>Request & Response Examples</b></summary>

**Create Task**
```bash
curl -X POST http://localhost:3000/api/projects/<projectId>/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Design login screen", "due_date": "2025-06-15"}'
```
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "title": "Design login screen",
  "status": "incomplete",
  "due_date": "2025-06-15",
  "created_at": "2025-05-28T...",
  "updated_at": "2025-05-28T..."
}
```

**Toggle Task Status**
```bash
curl -X PUT http://localhost:3000/api/projects/<projectId>/tasks/<taskId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "complete"}'
```
</details>

---

## 📸 Screenshots

> Screenshots will be added soon.

| Login | OTP Verification | Projects |
|:-----:|:----------------:|:--------:|
| ![Login](screenshots/login.png) | ![OTP](screenshots/otp.png) | ![Projects](screenshots/projects.png) |

| Create Project | Project Detail | Dark Mode |
|:--------------:|:--------------:|:---------:|
| ![Create](screenshots/create-project.png) | ![Detail](screenshots/project-detail.png) | ![Dark](screenshots/dark-mode.png) |

---

## 🌐 Live Demo

> 🚧 _Coming soon — APK and live demo link will be added here._

<!--
- **APK Download:** [Download latest release](https://github.com/shridharjarali/Project-Task-Manager-App/releases)
- **Live API:** [https://your-api-url.com](https://your-api-url.com)
-->

---

## 🗄️ Database Schema

```sql
users           projects              tasks
┌──────────┐    ┌──────────────┐      ┌──────────────┐
│ id (PK)  │◄───│ user_id (FK) │      │ project_id   │
│ email    │    │ id (PK)      │◄─────│ id (PK)      │
│ created  │    │ title        │      │ title        │
└──────────┘    │ description  │      │ status       │
                │ created_at   │      │ due_date     │
                │ updated_at   │      │ created_at   │
                └──────────────┘      │ updated_at   │
                                      └──────────────┘
```

---

## 🧪 Development Notes

- **OTP in Dev Mode:** The OTP code is printed to the **backend console** (not sent via email). Look for the `📧 OTP for ...` log message.
- **API Base URL:** When running on a physical device, update the `API_BASE_URL` in `mobile/src/store/api/axios.js` to your machine's local IP address.
- **Database Migrations:** Migrations run automatically when the backend server starts.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Shridhar Jarali**

[![GitHub](https://img.shields.io/badge/GitHub-shridharjarali-181717?style=for-the-badge&logo=github)](https://github.com/shridharjarali)

---

<p align="center">
  <b>⭐ Star this repo if you found it useful!</b>
</p>
