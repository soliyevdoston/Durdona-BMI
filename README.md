# EduCode — AKT Virtual Sinf (Monorepo)

TATU bitiruv malakaviy ishi uchun ishlab chiqilgan ta'lim platformasi.
**4 ta mustaqil loyiha:** 1 ta backend (Render + Neon PostgreSQL) + 3 ta frontend app (Vercel).

## 📁 Struktura

```
Durdona BMI/
├── backend/              → Render'ga deploy (Node.js + Express + TypeScript)
├── apps/
│   ├── student/          → Vercel deploy #1 (port 3000)
│   ├── teacher/          → Vercel deploy #2 (port 3001)
│   └── admin/            → Vercel deploy #3 (port 3002)
├── README.md             (bu fayl)
└── CLAUDE.md             (batafsil hujjat)
```

## 🚀 Lokalda ishga tushirish

**4 ta terminal kerak** (yoki `tmux`/`screen` bilan):

```bash
# Terminal 1 — Backend
cd backend && npm install
cp .env.example .env           # DATABASE_URL ga Neon URL kiriting
npm run db:push                # Schema'ni DB'ga yuklash
npm run db:seed                # Demo ma'lumotlar
npm run dev
# → http://localhost:8080

# Terminal 2 — Student app
cd apps/student && npm install && npm run dev
# → http://localhost:3000

# Terminal 3 — Teacher app
cd apps/teacher && npm install && npm run dev
# → http://localhost:3001

# Terminal 4 — Admin app
cd apps/admin && npm install && npm run dev
# → http://localhost:3002
```

Avvalambor `backend/.env` va har bir app uchun `.env.local` yarating (`.env.example` dan nusxa oling).

## 🌐 Deploy (production)

### 1️⃣ Backend → Render (+ Neon DB)

Neon DB (bepul PostgreSQL): [neon.tech](https://neon.tech) → loyihangizni yarating → Connection String (Pooled) nusxa oling.

1. GitHub'ga push qiling
2. [render.com](https://render.com) → New + → Web Service
3. Repo'ni tanlang, **Root Directory** = `backend`
4. Runtime: `Node`
5. Build: `npm install && npm run build && npx prisma db push --accept-data-loss`
6. Start: `npm start`
7. Environment:
   - `DATABASE_URL` — Neon pooled URL (muhim!)
   - `JWT_SECRET` — generate
   - `CORS_ORIGINS` — 3 ta Vercel URL, vergul bilan
   - `NODE_ENV` — `production`
8. Deploy → URL oling (masalan `https://educode-backend.onrender.com`)
9. Seed qilish (bir marta): Render Shell'da `npm run db:seed`

### 2️⃣ Har bir app → Vercel (alohida-alohida)

Har biri **alohida loyiha** sifatida Vercel'ga qo'shiladi:

```
Vercel dashboard → Import Project → GitHub repo
  ├─ Project 1: student    →  Root Directory: apps/student
  ├─ Project 2: teacher    →  Root Directory: apps/teacher
  └─ Project 3: admin      →  Root Directory: apps/admin
```

Har bir loyiha uchun **Environment Variable**:
```
NEXT_PUBLIC_API_URL = https://educode-backend.onrender.com
```

Vercel avtomatik `next build` ishlatadi — boshqa narsa kerak emas.

## 🔑 Demo hisoblar

| Email | Parol | Qaysi app'da |
|---|---|---|
| `student@edu.uz` | `1234` | student |
| `teacher@edu.uz` | `1234` | teacher |
| `admin@edu.uz` | `1234` | admin |

## 🏗 Arxitektura

```
┌──────────────────────────────────────────────┐
│  Vercel (3 ta alohida deployment)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ student. │  │ teacher. │  │ admin.   │    │
│  │ vercel   │  │ vercel   │  │ vercel   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
└───────┼──────────────┼──────────────┼────────┘
        │              │              │
        │        HTTPS REST API       │
        │       (Authorization:       │
        │        Bearer <JWT>)        │
        ▼              ▼              ▼
┌──────────────────────────────────────────────┐
│  Render (1 ta backend)                        │
│  ┌────────────────────────────────────────┐  │
│  │  Express + TypeScript + JWT + Prisma   │  │
│  └──────────────────┬─────────────────────┘  │
└─────────────────────┼────────────────────────┘
                      │
                      ▼ (PostgreSQL, TLS)
             ┌──────────────────┐
             │   Neon Postgres  │
             │   (serverless)   │
             └──────────────────┘
```

## 📖 Batafsil

Keyingi qadamlar, endpoint ro'yxati, ma'lumotlar modeli va arxitektura tafsilotlari uchun **[CLAUDE.md](./CLAUDE.md)** ni o'qing.

Backend API ro'yxati: **[backend/README.md](./backend/README.md)**
