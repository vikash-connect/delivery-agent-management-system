# Delivery Agent Management System

A production-quality, decoupled web application for managing delivery agents, built with Node.js, Express, Next.js, PostgreSQL, Prisma, Redis, and Zod.

## Project Structure
- `backend/`: Node.js + Express REST API with TypeScript, Prisma ORM, Redis caching layer, and Zod request validation.
- `frontend/`: Next.js (App Router) + TypeScript + Tailwind CSS web interface.

## System Architecture

```
 [ Next.js Frontend (Port 3000) ]
               │
               │ HTTP / JSON REST APIs
               ▼
 [ Node.js + Express API (Port 4000) ]
         │               │
  Prisma │               │ ioredis
         ▼               ▼
 [ PostgreSQL DB ]    [ Redis Cache ]
```

---

## Redis Caching Architecture

### 1. Strategy: Cache-Aside (Lazy Loading)
- **Read Requests (`GET /api/agents`, `GET /api/agents/:id`)**:
  1. The API server checks Redis for an existing cached key.
  2. **Cache HIT**: Returns the JSON payload directly from Redis memory (with `"cached": true` in list metadata).
  3. **Cache MISS**: Queries PostgreSQL via Prisma, saves the output in Redis with a 60-second TTL, and returns the response.

### 2. Redis Key Naming Strategy
- **Single Agent Key**: `agents:id:<agent_id>`
- **Query List Key**: `agents:list:<md5_hash_of_sorted_query_parameters>`
- **Active List Keys Registry**: `agents:list_keys` (A Redis SET tracking all active list cache keys).

### 3. Cache Invalidation Strategy
- **Mutation Operations (`POST`, `PUT`, `DELETE`)**:
  1. When an agent is created, updated, or deleted, all query list keys registered in `agents:list_keys` are invalidated and deleted in a Redis pipeline.
  2. For `PUT` and `DELETE`, the specific single agent cache key (`agents:id:<agent_id>`) is also evicted immediately.
  3. This guarantees **zero stale list or detail responses** on subsequent read requests.

### 4. Fault Tolerance & Fallback Behavior
- If Redis becomes unreachable or experiences connection issues:
  - The API logs a warning (`[Cache Warning]`).
  - Requests gracefully fall back to PostgreSQL database queries.
  - The API server continues running without throwing unhandled exceptions or crashing.

---

## Getting Started

### Prerequisites
* Node.js v18+
* npm v9+
* Docker Desktop

### 1. Database & Cache Infrastructure
Start PostgreSQL and Redis containers using Docker Compose:
```bash
docker compose up -d
```

### 2. Running the Backend Server
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```
The backend REST API runs on `http://localhost:4000`.  
Health check endpoint: `http://localhost:4000/health`.
