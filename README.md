# Fullstack Transaction App

A monorepo fullstack app for the Widya Robotics knowledge test.

## Tech Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Password hashing: bcrypt
- Frontend: Vue 3, Vite
- Styling: Tailwind CSS
- HTTP client: Axios
- Testing: Jest, Supertest

## Project Structure

```text
fullstack-transaction-app/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## Requirements

- Node.js 18+ recommended
- npm 9+
- PostgreSQL 16+
- Optional: Docker Desktop for the provided `docker-compose.yml`

## Installation

1. Install dependencies from the repo root:

```bash
npm install
```

2. Copy backend environment variables:

```bash
copy backend\.env.example backend\.env
```

3. Copy frontend environment variables:

```bash
copy frontend\.env.example frontend\.env
```

4. Start PostgreSQL locally. The easiest option is Docker:

```bash
docker compose up -d postgres
```

## Database Migration and Seeder

Run the Prisma migration from the backend package:

```bash
npm run prisma:migrate --workspace backend
```

Seed the default admin user:

```bash
npm run seed --workspace backend
```

Default login:

- Username: `admin`
- Password: `admin123`

## Running the Backend

```bash
npm run dev:backend
```

Backend API runs on `http://localhost:3000` by default.

## Running the Frontend

```bash
npm run dev:frontend
```

Frontend runs on `http://localhost:5173` by default.

## API Endpoints

### Authentication

- `POST /api/auth/login`

### Transactions

- `GET /api/transactions?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

## Request Notes

- All transaction routes require `Authorization: Bearer <token>`.
- `kode` is generated automatically by the backend in the format `T-${randomUniqueString}`.
- `unitPrice` is derived from `productType` and validated by the backend.
- `totalPrice` is calculated as `unitPrice × quantity`.

## Automated Tests

Run backend unit tests:

```bash
npm test --workspace backend
```

Current automated coverage focuses on transaction utilities and payload validation.

## Additional Information

- The frontend stores the JWT token in `localStorage`.
- Route guards protect all transaction pages.
- Axios interceptors attach the JWT token automatically.
- The frontend uses a custom toast and confirm dialog for CRUD feedback.
- Prisma schema maps the database tables to `users` and `transactions`.
