# Botanica

Botanica is a plant care app built on the belief that anyone can have a green thumb — even the most notorious plant killers. It takes the guesswork out of plant care by giving you everything you need to keep your plants alive and thriving: browse plants, learn their care requirements, and build a personal garden you can actually manage. Whether you've never kept a plant alive or you're looking to grow your collection, Botanica makes it easy.

## Tech stack

- **Frontend:** React 18, Vite, Redux, React Router 7, React Hook Form, Bootstrap 5, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JWT stored in httpOnly cookies

## Project structure

The repo has two top-level directories — `backend/` and `frontend/` — plus a `docker-compose.yml` at the root that wires them together with a MongoDB instance.

```
backend/                    Entry point: server.js
├── routes/
├── controllers/
├── models/                 # Mongoose models
└── middleware/auth.js      # JWT auth middleware

frontend/src/               Entry point: main.jsx
├── pages/
├── components/
├── services/               # Axios API calls
└── store/                  # Redux global state
```

## Running with Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build   # first run
docker compose up           # subsequent runs
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | http://localhost:5001  |
| MongoDB  | localhost:27017        |

Source files are mounted as volumes — saving any file triggers hot reload automatically without rebuilding.

Use `--build` again after installing new npm packages or changing a `Dockerfile`.

## Running without Docker

**Prerequisites:** Node.js 22+, MongoDB running locally on port 27017.

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env      # then fill in JWT_SECRET
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

## Environment variables

Copy `backend/.env.example` to `backend/.env` and set the following:

| Variable      | Default                                  | Description              |
|---------------|------------------------------------------|--------------------------|
| `PORT`        | `5001`                                   | Backend port             |
| `MONGO_URI`   | `mongodb://127.0.0.1:27017/BotanicaDB`   | MongoDB connection string |
| `JWT_SECRET`  | —                                        | Secret for signing JWTs  |
| `CORS_ORIGIN` | `http://localhost:5173`                  | Allowed frontend origin  |

Docker Compose overrides `MONGO_URI` automatically to use the `mongo` service name.

## API routes

| Method | Path                    | Auth | Description          |
|--------|-------------------------|------|----------------------|
| POST   | `/api/users/signup`     |      | Register             |
| POST   | `/api/users/login`      |      | Login                |
| GET    | `/api/users/auth/me`    | JWT  | Get current user     |
| GET    | `/api/plants`           |      | List plants (paginated, filterable) |
| GET    | `/api/plants/:id`       |      | Get plant by ID      |
