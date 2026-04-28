# EduCode Backend

Express + TypeScript API server. **Neon PostgreSQL** + **Prisma ORM**.

## Lokalda ishga tushirish

```bash
cd backend
npm install

# .env faylini yarating (.env.example dan nusxa oling)
cp .env.example .env
# .env ichida DATABASE_URL ga Neon URL'ini kiriting

# 1. Schema'ni DB'ga yuklash
npm run db:push

# 2. Boshlang'ich ma'lumot (seed)
npm run db:seed

# 3. Server ishga tushirish
npm run dev
```

Server: `http://localhost:8080` · Health: `http://localhost:8080/api/health`

## Scriptlar

| Script | Vazifa |
|---|---|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Prisma generate + TypeScript compile |
| `npm start` | Production server |
| `npm run db:push` | Schema'ni DB'ga yuklash (migration'siz) |
| `npm run db:seed` | Demo ma'lumotlar bilan to'ldirish |
| `npm run db:studio` | Prisma Studio (brauzerda DB ko'rish) |

## Railway'ga deploy qilish

### 1. Neon DB URL oling

[neon.tech](https://neon.tech) → loyihangiz → **Connection String** (Pooled)

### 2. Railway.app

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Repo'ni tanlang, **Root Directory** = `backend`
3. Railway avtomatik `Dockerfile` va `railway.json` ni topadi
4. **Variables** (Settings → Variables):
   - `DATABASE_URL` = Neon pooled URL
   - `JWT_SECRET` = random 32+ belgili string
   - `CORS_ORIGINS` = Vercel URL'laringiz (vergul bilan)
   - `NODE_ENV` = `production`
   - `PORT` = `8080`
5. **Deploy** → URL oling

### Seed faqat bir marta

Dastlabki deploy'dan keyin (seed uchun) Railway shell orqali:
```bash
npm run db:seed
```

## Database tuzilmasi

```prisma
User ──┬── Course (instructor)
       ├── Enrollment ── Course
       ├── LessonProgress ── Lesson ── Course
       ├── Submission ── Assignment ── Course
       ├── Notification
       ├── UserAchievement ── Achievement
       └── ActivityLog
```

Schema: `backend/prisma/schema.prisma`

## API Endpoint'lar

### Auth (ochiq)
- `POST /api/auth/login` → `{ token, user }`
- `POST /api/auth/register`
- `GET /api/auth/me` *[auth]*
- `POST /api/auth/logout` *[auth]*

### Kurslar
- `GET /api/courses` *[auth]*
- `GET /api/courses/mine` *[auth]*
- `GET /api/courses/:id` *[auth]*
- `POST /api/courses/:id/enroll` *[auth]*
- `POST /api/courses` *[teacher/admin]*
- `PATCH /api/courses/:id` *[teacher/admin]*
- `DELETE /api/courses/:id` *[teacher/admin]*

### Darslar
- `POST /api/lessons/:id/complete` *[auth]* — XP va progress yangilaydi

### Topshiriqlar
- `GET /api/assignments/mine` *[auth]*
- `GET /api/assignments/teaching` *[teacher]*
- `POST /api/assignments/:id/submit` *[auth]*
- `POST /api/assignments/submissions/:id/grade` *[teacher]*
- `POST /api/assignments` *[teacher]*

### Foydalanuvchilar
- `GET /api/users?role=&q=` *[admin]*
- `GET /api/users/students` *[teacher/admin]*
- `POST /api/users` *[admin]*
- `PATCH /api/users/:id` *[admin]*
- `DELETE /api/users/:id` *[admin]*

### Boshqalari
- `GET /api/notifications` · `POST /api/notifications/:id/read`
- `GET /api/achievements`
- `GET /api/analytics/{weekly,difficulty,growth,ai-suggestions}`
- `GET /api/system/{stats,logs}` *[admin]*
- `POST /api/ai/chat` *[auth]*
- `POST /api/code/run` *[auth]*
- `GET /api/health` (ochiq — Railway health check)

## Demo hisoblar (seed'dan keyin)

| Email | Parol | Rol |
|---|---|---|
| `durdona@student.uz` | `1234` | student |
| `durdona@gmail.com` | `1234` | teacher |
| `durdona@admin.uz` | `1234` | admin |

## Arxitektura

```
backend/
├── prisma/
│   ├── schema.prisma      # DB model tuzilmasi
│   └── seed.ts            # Boshlang'ich ma'lumotlar
└── src/
    ├── index.ts           # Express server
    ├── auth.ts            # JWT sign/verify + requireAuth/requireRole
    ├── prisma.ts          # Prisma client singleton + helpers
    └── routes/
        ├── auth.ts        # login, register, me, logout
        ├── users.ts       # CRUD (admin only)
        ├── courses.ts     # CRUD + enroll
        ├── lessons.ts     # complete (XP beradi)
        ├── assignments.ts # submit, grade
        └── misc.ts        # notifications, achievements, analytics, AI, code
```

## Keyingi bosqichlar

- [ ] Prisma migrate (schema versiyasini tracking qilish)
- [ ] Redis cache (serverless cold start'ni kamaytirish)
- [ ] Rate limiting (`express-rate-limit`)
- [ ] Helmet (security headers)
- [ ] OpenAI/Claude API (`/api/ai/chat` ni real AI'ga ulash)
- [ ] Docker sandbox (`/api/code/run` — real execution)
- [ ] S3 — fayl yuklash
- [ ] WebSocket — jonli dars
