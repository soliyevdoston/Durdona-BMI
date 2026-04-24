# EduCode — AKT Virtual Sinf (Monorepo)

> TATU bitiruv malakaviy ishi, 2026. 4 ta mustaqil loyihadan iborat.

---

## 🏗 Arxitektura

```
Durdona BMI/
├── backend/              ←  Render'ga deploy (1 ta)
├── apps/
│   ├── student/          ←  Vercel deploy #1 (alohida)
│   ├── teacher/          ←  Vercel deploy #2 (alohida)
│   └── admin/            ←  Vercel deploy #3 (alohida)
├── README.md
└── CLAUDE.md
```

Har frontend app — **alohida Next.js loyihasi**. Barchasi bitta backend bilan gaplashadi.

```
Vercel #1 (student.vercel.app) ──┐
Vercel #2 (teacher.vercel.app) ──┼──→  Render (educode-backend.onrender.com)
Vercel #3 (admin.vercel.app)   ──┘
```

---

## 🛠 Texnologiyalar

| Qatlam | Stack |
|---|---|
| **Backend** | Node.js 20 · Express 4 · TypeScript · JWT · bcryptjs · CORS · Morgan |
| **Frontend (×3)** | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Zustand · Recharts · Lucide |
| **Ma'lumotlar** | In-memory (hozir) → PostgreSQL (keyingi bosqich) |
| **Auth** | JWT (access token, 7 kun) + role-based routing |
| **Hosting** | Render (backend) + Vercel (3 ta frontend) |

---

## 📁 Loyiha tuzilmasi

### backend/
```
backend/
├── package.json
├── tsconfig.json
├── render.yaml         ← Render blueprint
├── .env.example
├── README.md
└── src/
    ├── index.ts         ← Express app
    ├── auth.ts          ← JWT + requireAuth/requireRole middleware
    ├── db.ts            ← In-memory store + seed
    ├── types.ts         ← TypeScript interfaces
    └── routes/
        ├── auth.ts      ← login, register, me, logout
        ├── users.ts     ← CRUD (admin)
        ├── courses.ts   ← CRUD, enroll
        ├── lessons.ts   ← complete (XP beradi)
        ├── assignments.ts  ← submit, grade
        └── misc.ts      ← notifications, achievements, analytics, ai/chat, code/run
```

### apps/{student,teacher,admin}/
```
apps/<role>/
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vercel.json
├── .env.example           ← NEXT_PUBLIC_API_URL
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx           ← landing (yoki /login ga redirect)
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   └── (app)/             ← auth-protected route group
    │       ├── layout.tsx     ← sidebar + header
    │       └── (role-specific pages)
    └── lib/
        ├── api.ts             ← fetch wrapper, barcha endpoint'lar
        ├── store.ts           ← Zustand auth store
        ├── utils.ts
        └── data.ts            ← mock fallback (keyin o'chirish mumkin)
```

### Sahifalar ro'yxati

**Student app:**
- `/` landing
- `/login`, `/register`
- `/dashboard` — XP, kurslar, vazifalar, AI tip
- `/courses`, `/courses/[id]` — katalog va dars pleyer
- `/playground` — kod muhiti (Python/JS/SQL)
- `/assignments` — topshiriqlar
- `/portfolio` — yutuqlar, sertifikatlar
- `/ai` — AI chat

**Teacher app:**
- `/` redirect → login/dashboard
- `/login`, `/register`
- `/dashboard` — KPI, at-risk, chart'lar
- `/courses`, `/create-course` (3-step wizard)
- `/students` — talabalar jadvali
- `/assignments` — baholash
- `/analytics` — heatmap, radar, pie
- `/live` — jonli dars UI

**Admin app:**
- `/` redirect
- `/login`, `/register`
- `/dashboard`, `/users`, `/courses`, `/analytics`, `/system`, `/logs`, `/security`, `/settings`

---

## 🔌 Backend bilan ulanish

Har app'ning `src/lib/store.ts` dagi **`useAuthStore.login()`** funksiyasi `api.login()`ga murojaat qiladi. API `Bearer` token'ni qaytaradi, `localStorage`da saqlanadi va keyingi har bir so'rovda header'ga qo'shiladi.

```ts
// apps/student/src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
```

**Muhim:** Har rol uchun store'ning `login` chaqiruvida `expectedRole` yuboriladi — masalan, student app'dan teacher hisob bilan kirishga urinish rad etiladi.

### API endpoint'lar

Batafsil: `backend/README.md`. Qisqacha:

- `POST /api/auth/{login,register}` — token qaytaradi
- `GET /api/auth/me` — joriy foydalanuvchi
- `GET /api/courses` · `/mine` · `/:id` · `POST /enroll`
- `POST /api/lessons/:id/complete` — XP beradi
- `GET /api/assignments/{mine,teaching}` · `POST /submit` · `grade`
- `GET /api/users` · `/students` · `POST /api/users`
- `GET /api/{notifications,achievements,analytics/*,system/stats}`
- `POST /api/ai/chat` · `POST /api/code/run`

---

## 🚀 Lokalda ishga tushirish

**4 ta terminal:**

```bash
# 1. Backend
cd backend && npm install && npm run dev

# 2. Student app
cd apps/student && npm install && npm run dev     # 3000

# 3. Teacher app
cd apps/teacher && npm install && npm run dev     # 3001

# 4. Admin app
cd apps/admin && npm install && npm run dev       # 3002
```

Oldin `.env`lar:

```bash
# backend/.env
PORT=8080
JWT_SECRET=dev-secret-change-in-prod
CORS_ORIGINS=*

# apps/<role>/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🌐 Deploy

### Backend → Render

1. GitHub repo'ga push
2. render.com → **New +** → **Web Service**
3. Root Directory: `backend`
4. Env vars:
   - `JWT_SECRET` (auto-generate)
   - `CORS_ORIGINS` = 3 ta Vercel URL'i, vergul bilan
5. Deploy → URL oling

### 3 ta Vercel loyihasi

Har birida **Root Directory**ni belgilang:

| Loyiha | Root Directory | Env: NEXT_PUBLIC_API_URL |
|---|---|---|
| educode-student | `apps/student` | `https://educode-backend.onrender.com` |
| educode-teacher | `apps/teacher` | (xuddi shunday) |
| educode-admin | `apps/admin` | (xuddi shunday) |

Vercel'da **Framework Preset** avtomatik Next.js aniqlaydi. Boshqa sozlama shart emas.

---

## 🔑 Demo hisoblar

| Email | Parol | Rol | Qaysi app'ga |
|---|---|---|---|
| student@edu.uz | 1234 | student | student app |
| teacher@edu.uz | 1234 | teacher | teacher app |
| admin@edu.uz | 1234 | admin | admin app |

**Xavfsizlik:** Har app faqat o'z rolini qabul qiladi. Student app'ga teacher hisob bilan kirsangiz backend `403` qaytaradi.

---

## 📖 Pedagogik yondashuv

| Metodologiya | Amaldagi tatbiq |
|---|---|
| Microlearning | Darslar 8–25 daqiqa, lock/unlock |
| Practice-First (70/30) | `practice` tipidagi dars + playground |
| Immediate Feedback | Quiz javobidan keyin darhol izoh |
| Adaptive Learning | AI zaif joylarni aniqlaydi va tavsiya beradi |
| Gamifikatsiya | XP (10–50), 11 daraja, 10+ nishon, seriya (streak) |
| Personalized Paths | `/api/analytics/ai-suggestions` har talaba uchun |
| Active Learning | Quiz, playground, AI chat, jonli dars |
| Continuous Assessment | Har dars, test, topshiriqda baholash |

---

## 🛡 Xavfsizlik

- **JWT** token (7 kun TTL) · `localStorage`'da
- **bcrypt** (cost 8) parol hashlash
- **Role-based auth**: `requireAuth` + `requireRole('teacher', 'admin')`
- **CORS whitelist**: faqat 3 ta Vercel origin
- **Parol talabi**: minimum 4 belgi (production: 8+)

### Production uchun qo'shimchalar

- [ ] `express-rate-limit` — brute force himoya
- [ ] `helmet` — security headers
- [ ] HTTPS-only cookie (JWT'ni localStorage'dan chiqarish)
- [ ] 2FA adminlar uchun
- [ ] Refresh token rotation
- [ ] Prisma + PostgreSQL

---

## 📝 Development Log

### Sessiya 4 — 2026-04-24 (Neon PostgreSQL + Prisma)
- ✅ In-memory storage → **Prisma ORM + Neon PostgreSQL**
- ✅ `backend/prisma/schema.prisma` — 10 model (User, Course, Lesson, Enrollment, LessonProgress, Assignment, Submission, Notification, Achievement, UserAchievement, ActivityLog)
- ✅ `backend/prisma/seed.ts` — demo ma'lumotlarni DB'ga yuklash
- ✅ Barcha 6 ta route (auth, users, courses, lessons, assignments, misc) Prisma query'lariga o'tkazildi:
  - `db.users.find(u => u.id === x)` → `await prisma.user.findUnique({ where: { id } })`
  - `db.courses.filter(...)` → `await prisma.course.findMany({ where: {...} })`
  - Relations bilan JOIN — `include: { instructor: true, enrollments: true }`
  - Cascade delete — `onDelete: Cascade`
  - Indexlar — `@@index([role])`, `@@index([email])` va h.k.
- ✅ `npm run db:push` Neon DB'ga schema yuklandi
- ✅ `npm run db:seed` 12 user, 6 course, 10 lesson, 7 enrollment, 5 assignment, 3 submission, 3 notification, 8 achievement yuklandi
- ✅ Login, courses, achievements, users, system stats endpoint'lari Neon DB'dan real data qaytaradi
- ✅ `render.yaml` `prisma db push` ni build command'ga qo'shadi
- ✅ Prisma Studio: `npm run db:studio` — brauzerda DB tahrir qilish

### Sessiya 3 — 2026-04-24 (Monorepo va backend)
- ✅ Monorepo tuzilmasi: `backend/` + `apps/student,teacher,admin/`
- ✅ **Backend (Render-ready)**:
  - Express + TypeScript + JWT + bcrypt + CORS + Morgan
  - In-memory db.ts (12 user, 6 course, 10 lesson, 5 assignment, 8 achievement)
  - 7 ta route guruh: auth, users, courses, lessons, assignments, misc
  - `render.yaml` blueprint
  - Role-based middleware (`requireRole('admin', 'super_admin')`)
  - `/api/health` endpoint
- ✅ **3 ta frontend app (Vercel-ready)**:
  - Har biri mustaqil `package.json`, port 3000/3001/3002
  - `api.ts` — `NEXT_PUBLIC_API_URL` orqali ulanish
  - `store.ts` — Zustand + backend login, `expectedRole` tekshiruv
  - `(app)/` route group — protected sahifalar
  - Avtomatik rol tekshiruvi (student app'da teacher kira olmaydi)
  - `vercel.json` — deploy config
- ✅ Barcha sahifalar HTTP 200 qaytaradi, TypeScript xatosiz
- ✅ Login endpoint backend bilan to'g'ri ishlashi test qilindi
- ✅ Rol kesishi (teacher login student app'da) — backend 403 qaytaradi
- ✅ CSS: katak (grid) naqsh butun saytda, `bg-app` utility

### Sessiya 2 — 2026-04-24 (Dizayn tozalash)
- AI-yasama tomonlar olib tashlandi (emoji, mesh gradient, marketing badge'lar)
- `font-display` (Instrument Serif) qo'shildi
- "ICT" → "AKT" o'zgartirildi

### Sessiya 1 — 2026-04-23 (Monolit prototip)
- Next.js 14 + Tailwind monolit loyihasi
- 27 sahifa, 3 ta rol paneli
- Mock data bilan to'liq UI

---

## 📞 Yordam

Savollar uchun: `/ai` sahifasidagi AI yordamchiga murojaat qiling yoki CLAUDE.md'ni qayta o'qing.
