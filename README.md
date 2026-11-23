# TaskFlow

A full-stack task manager with secure JWT authentication. An Express + MongoDB REST API on the backend, and a dependency-free vanilla JavaScript frontend — register, log in, and manage your tasks on a three-column board (To do → In progress → Done).

## Features

- **User accounts** — register & login with bcrypt-hashed passwords and JWT sessions
- **Private tasks** — every query is scoped to the authenticated user; nobody can read or modify another user's tasks
- **Task board** — create tasks with priority (low / medium / high) and due dates, move them across columns, delete them
- **Filtering** — list tasks by `status` and `priority` via query parameters
- **Clean REST API** — predictable JSON responses and proper HTTP status codes

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | HTML, CSS, vanilla JavaScript (fetch API) |
| Backend  | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth     | JSON Web Tokens (jsonwebtoken) + bcryptjs |

## Getting started

```bash
git clone https://github.com/triptikarn/taskflow.git
cd taskflow
npm install
cp .env.example .env   # fill in MONGO_URI and a strong JWT_SECRET
npm run dev            # or: npm start
```

Open http://localhost:5000 — the API and the frontend are served by the same Express app.

## API reference

| Method | Endpoint             | Auth | Description            |
|--------|----------------------|------|------------------------|
| POST   | `/api/auth/register` | —    | Create an account      |
| POST   | `/api/auth/login`    | —    | Log in, receive a JWT  |
| GET    | `/api/tasks`         | JWT  | List my tasks (filters: `?status=`, `?priority=`) |
| POST   | `/api/tasks`         | JWT  | Create a task          |
| PATCH  | `/api/tasks/:id`     | JWT  | Update my task         |
| DELETE | `/api/tasks/:id`     | JWT  | Delete my task         |
| GET    | `/api/health`        | —    | Health check           |

Send the token as `Authorization: Bearer <token>` on authenticated routes.

## Tests

```bash
npm test   # node:test unit tests for the JWT helper
```

## Project structure

```
taskflow/
├── server.js            # Express app + startup
├── models/              # Mongoose schemas (User, Task)
├── routes/              # /api/auth and /api/tasks routers
├── middleware/auth.js   # JWT route protection
├── utils/token.js       # sign / verify helpers
├── public/              # frontend (index.html, styles.css, app.js)
└── tests/               # unit tests
```

## License

MIT © Tripti Karn
