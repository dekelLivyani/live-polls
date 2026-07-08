# Live Polls

A real-time polling app built with NestJS + Prisma + PostgreSQL + Redis + React.

## Quick Start

### Infrastructure (postgres + redis)
```bash
docker-compose up -d
```

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — you should see all services reporting as healthy.
