# Task Manager Backend

This is the backend for the MERN Task Manager.

Setup:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in dev:

```bash
npm run dev
```

APIs:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- Protected: /api/tasks (CRUD) - requires Authorization: Bearer <token>

Socket.IO is exposed on the same server and emits `taskCreated`, `taskUpdated`, `taskDeleted` events.
