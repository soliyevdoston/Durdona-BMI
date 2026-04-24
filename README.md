# EduCode — AKT Virtual Sinf (Monorepo)

TATU bitiruv malakaviy ishi, 2026.
**5 ta mustaqil loyiha:** 1 ta backend (Render + Neon) + 4 ta frontend app (Vercel).

## 📁 Struktura

```
Durdona BMI/
├── backend/              → Render (Node + Express + Prisma + Neon Postgres)
└── apps/
    ├── landing/          → Vercel deploy #1 (port 3000) — asosiy kirish sahifasi
    ├── student/          → Vercel deploy #2 (port 3001) — talaba paneli
    ├── teacher/          → Vercel deploy #3 (port 3002) — o'qituvchi paneli
    └── admin/            → Vercel deploy #4 (port 3003) — admin paneli
```

**Foydalanuvchi oqimi:**
1. `landing` sahifasiga kiradi (asosiy URL)
2. 3 ta rol kartochkasidan mosini bosadi
3. Tegishli panel app'iga o'tadi (ichida login + dashboard)

## 🚀 Lokalda ishga tushirish (5 terminal)

```bash
# Terminal 1 — Backend (Render'dagisini ishlatish tavsiya etiladi,
# lekin lokalda ham ishga tushirish mumkin)
cd backend
cp .env.example .env                 # DATABASE_URL ga Neon URL
npm install
npm run db:push                      # Schema'ni Neon'ga yuklash
npm run db:seed                      # Demo ma'lumotlar
npm run dev                          # → :8080

# Terminal 2 — Landing
cd apps/landing && npm install && npm run dev     # → :3000

# Terminal 3 — Student
cd apps/student && npm install && npm run dev     # → :3001

# Terminal 4 — Teacher
cd apps/teacher && npm install && npm run dev     # → :3002

# Terminal 5 — Admin
cd apps/admin && npm install && npm run dev       # → :3003
```

Asosiy kirish: **http://localhost:3000** — landing sahifadan rol tanlaydi.

## 🌐 Deploy (production)

### Backend → Render + Neon

**Live URL:** `https://educode-backend.onrender.com`

Batafsil: [backend/README.md](./backend/README.md)

### 4 ta Vercel loyihasi

Har biri **alohida Vercel loyiha** sifatida deploy qilinadi:

| Loyiha | Root Directory | Env variables |
|---|---|---|
| educode-landing | `apps/landing` | `NEXT_PUBLIC_STUDENT_URL`, `NEXT_PUBLIC_TEACHER_URL`, `NEXT_PUBLIC_ADMIN_URL` |
| educode-student | `apps/student` | `NEXT_PUBLIC_API_URL=https://educode-backend.onrender.com` |
| educode-teacher | `apps/teacher` | `NEXT_PUBLIC_API_URL=https://educode-backend.onrender.com` |
| educode-admin | `apps/admin` | `NEXT_PUBLIC_API_URL=https://educode-backend.onrender.com` |

**Deploy tartibi:**
1. Avval student/teacher/admin'ni deploy qiling → URL'larni oling
2. Keyin landing'ni deploy qiling va env var'larga 3 ta URL'ni kiriting
3. Render'da `CORS_ORIGINS`'ni 4 ta URL bilan yangilang

## 🔑 Demo hisoblar

| Email | Parol | Qaysi panel'da |
|---|---|---|
| `student@edu.uz` | `1234` | student |
| `teacher@edu.uz` | `1234` | teacher |
| `admin@edu.uz` | `1234` | admin |

## 🏗 Arxitektura

```
                   ┌─────────────────────┐
                   │  Foydalanuvchi      │
                   └──────────┬──────────┘
                              ▼
           ┌─────────────────────────────────┐
           │  landing.vercel.app (tanlov)    │
           └──┬──────────────┬──────────────┬┘
              │              │              │
              ▼              ▼              ▼
          ┌──────┐       ┌──────┐       ┌──────┐
          │stud. │       │teach.│       │admin.│
          │vercel│       │vercel│       │vercel│
          └──┬───┘       └──┬───┘       └──┬───┘
             │              │              │
             └──────────────┼──────────────┘
                            ▼ REST + JWT
                  ┌──────────────────┐
                  │ educode-backend  │
                  │ (Render)         │
                  └────────┬─────────┘
                           │
                           ▼ PostgreSQL
                  ┌──────────────────┐
                  │  Neon Postgres   │
                  └──────────────────┘
```

## 📖 Batafsil

- [CLAUDE.md](./CLAUDE.md) — to'liq arxitektura, modul hujjat
- [backend/README.md](./backend/README.md) — API reference
