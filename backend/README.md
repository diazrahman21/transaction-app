# Backend

Express + Prisma backend for the transaction app.

## Setup

```bash
npm install
copy .env.example .env
```

## Database

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

Run migration and seed:

```bash
npm run prisma:migrate
npm run seed
```

## Run

```bash
npm run dev
```

## Test

```bash
npm test
```

## Environment Variables

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
