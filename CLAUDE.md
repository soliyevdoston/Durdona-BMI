# EduCode — Virtual AKT Classroom Platform

> Zamonaviy, sun'iy intellekt bilan kuchaytirilgan AKT ta'lim platformasi.
> TATU bitiruv malakaviy ishi uchun to'liq ishlaydigan prototip.

---

## 📌 Loyiha Haqida

**EduCode** — Axborot va Kommunikatsiya Texnologiyalari (AKT) fanlarini virtual muhitda o'qitish uchun mo'ljallangan zamonaviy web platforma. Oddiy LMS dan farqli o'laroq, bu tizim:

- **Mikrodarslar** (Microlearning) — qisqa, fokuslangan modullar
- **Amaliyot-birinchi** yondashuv (70% amaliy / 30% nazariy)
- **AI yordamchi** (real vaqt tahlil va tushuntirish)
- **Gamifikatsiya** (XP, darajalar, nishonlar, seriyalar)
- **Adaptiv o'qish** (talabaning darajasiga moslashadigan qiyinlik)
- **Jonli kod muhiti** (brauzerdagi IDE)
- **Didaktik tahlil** (mavzu qiyinligi, zaif joylar xaritasi)

Maqsad: **o'qish samaradorligini oshirish** va **o'qituvchi ish yukini kamaytirish**.

---

## 🛠️ Texnologik Stack

| Qatlam | Texnologiya |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS 3.4 (custom design tokens) |
| **Charts** | Recharts 2.12 |
| **State** | Zustand 4.5 (persist middleware) |
| **Icons** | Lucide React |
| **Animations** | CSS keyframes + Framer Motion ready |
| **Planlashtirilgan Backend** | Node.js / Django + PostgreSQL |
| **Realtime** | WebSocket (Socket.io ready) |
| **Code Sandbox** | Docker container isolation |
| **AI** | OpenAI GPT-4 / Claude API |

---

## 📁 Loyiha Strukturasi

```
Durdona BMI/
├── package.json              # dependencies
├── next.config.mjs           # next.js config
├── tailwind.config.ts        # design tokens
├── postcss.config.js
├── tsconfig.json
├── CLAUDE.md                 # bu fayl
│
└── src/
    ├── app/
    │   ├── layout.tsx         # root layout (dark mode, Inter font)
    │   ├── page.tsx           # landing page (SaaS-style)
    │   ├── globals.css        # Tailwind + custom CSS
    │   │
    │   ├── (auth)/
    │   │   ├── login/page.tsx       # rolga asoslangan tezkor login
    │   │   └── register/page.tsx    # 2-bosqichli ro'yxat
    │   │
    │   ├── student/          # 🟣 Talaba paneli (violet accent)
    │   │   ├── layout.tsx            # sidebar + user card + XP bar
    │   │   ├── dashboard/page.tsx    # welcome, stats, tasks, AI tip
    │   │   ├── courses/page.tsx      # kurslar katalogi
    │   │   ├── courses/[id]/page.tsx # dars ko'rinishi + AI chat + quiz
    │   │   ├── playground/page.tsx   # kod muhiti (Python/JS/SQL)
    │   │   ├── assignments/page.tsx  # topshiriqlar
    │   │   ├── portfolio/page.tsx    # nishonlar, sertifikatlar, loyihalar
    │   │   └── ai/page.tsx           # AI chat (markdown rendering)
    │   │
    │   ├── teacher/           # 🔵 O'qituvchi paneli (sky accent)
    │   │   ├── layout.tsx
    │   │   ├── dashboard/page.tsx       # overview, at-risk, AI insights
    │   │   ├── courses/page.tsx         # mening kurslarim
    │   │   ├── create-course/page.tsx   # 3-bosqichli kurs yaratish
    │   │   ├── students/page.tsx        # talabalar jadvali + detail modal
    │   │   ├── assignments/page.tsx     # baholash kutilayotgan ishlar
    │   │   ├── analytics/page.tsx       # heatmap, radar, pie charts
    │   │   └── live/page.tsx            # jonli dars (video, chat, share)
    │   │
    │   └── admin/             # 🟢 Admin paneli (emerald accent)
    │       ├── layout.tsx
    │       ├── dashboard/page.tsx    # system health + activity log
    │       ├── users/page.tsx        # foydalanuvchi CRUD
    │       ├── courses/page.tsx      # kurslar boshqaruvi
    │       ├── analytics/page.tsx    # revenue, o'sish
    │       ├── system/page.tsx       # server monitoring, backup
    │       ├── logs/page.tsx         # audit logs
    │       ├── security/page.tsx     # xavfsizlik auditi
    │       └── settings/page.tsx     # 6 bo'lim sozlamalari
    │
    └── lib/
        ├── utils.ts           # cn, formatDate, XP helpers
        ├── store.ts           # Zustand (auth + UI state)
        └── data.ts            # mock data (courses, students, etc)
```

---

## 🎨 UI/UX Dizayn Tizimi

### Rang Palitrasi
- **Base (background)**: `#09090B` → `#18181B` → `#27272A`
- **Accent (talaba)**: Violet `#7C3AED` (primary), `#8B5CF6` (hover)
- **Teacher**: Sky `#0EA5E9`
- **Admin**: Emerald `#10B981`
- **Status**: Emerald (success), Amber (warn), Rose (error), Sky (info)

### Tipografiya
- **Sans**: Inter (300-800)
- **Mono**: JetBrains Mono (kod va muhim raqamlar uchun)
- **Scale**: text-xs (12px) → text-2xs (10px) → text-3xl (30px)

### Komponent Tizimi
Barcha komponentlar `globals.css` dagi utility klaslarga asoslangan:

- `.card` — asosiy konteyner (`#111113` + `#1E1E24` chegara + 2xl radius)
- `.card-elevated` — ko'tarilgan konteyner (modallar, dropdownlar)
- `.btn-primary` — accent-rangli asosiy tugma
- `.btn-secondary` — neutral tugma (chegara bilan)
- `.btn-ghost` — transparent tugma
- `.input` — form elementi (fokusda accent halqasi)
- `.badge-*` — rangli belgilar (accent/emerald/amber/sky/rose)
- `.progress-bar` + `.progress-fill` — gradient progress
- `.nav-link` + `.nav-link-active` — sidebar elementi
- `.text-gradient` + `.text-gradient-accent` — gradient matn

### Animatsiyalar
- `animate-fade-in` (0.4s ease-out)
- `animate-slide-up` (16px pastdan yuqoriga)
- `animate-slide-in-right` (mobile sidebar)
- `animate-pulse-slow` (live indikator)
- `animate-float` (dekorativ elementlar)

---

## 👥 Foydalanuvchi Rollari va Panellari

### 1️⃣ Talaba (Student) — `/student/*`

**Demo kirish:** `student@edu.uz` / `1234`

| Sahifa | Funksionallik |
|---|---|
| **Dashboard** | Welcome banner, XP progress, streak, 4 KPI card, faol kurslar, haftalik faollik chart, bugungi vazifalar, AI tavsiya, yutuqlar, yaqin muddatlar |
| **Courses** | 6 ta kurs, qidiruv, kategoriya filter, "yozilganlar/mavjud" filter, progress bars |
| **Course Detail** | Darslar ro'yxati (video/text/quiz/practice), lock/unlock holati, quiz (3 savol + baholash), code editor simulator, AI chat |
| **Playground** | Python/JavaScript/SQL tanlovi, Monaco-style editor, output/tests/AI 3 tab, test case natijalari, AI kod tahlili |
| **Assignments** | 5 ta topshiriq, status filter (kutilmoqda/topshirildi/baholandi), submit modal, coding uchun textarea, project uchun file upload UI |
| **Portfolio** | Profil (level badge), 4 KPI, yutuqlar (earned/locked), sertifikatlar (downloadable), loyihalar |
| **AI Assistant** | Markdown renderli chat, typing indicator, rekursiya/SQL/OOP/tahlil uchun maxsus javoblar, suggested prompts, so'rovlar hisoblagichi |

**Pedagogik xususiyatlar:**
- Mikrodars: har dars 8-25 daqiqa
- Immediate feedback: javob berilgach darhol tushuntirish
- Gamifikatsiya: XP (10-50 per task), darajalar (1-11), "Grand Master" ranglar
- Seriyalar (streak): kundalik o'qishni rag'batlantirish

### 2️⃣ O'qituvchi (Teacher) — `/teacher/*`

**Demo kirish:** `teacher@edu.uz` / `1234`

| Sahifa | Funksionallik |
|---|---|
| **Dashboard** | Welcome + CTA (Jonli dars, Yangi kurs), 4 KPI card, 2 chart (line + bar), xavfli talabalar (rose highlight), AI didaktik tavsiyalar, tezkor kurslar |
| **My Courses** | Kurslar gridi, menu (view/edit/copy/delete), stats (enrolled, lessons, avg rating) |
| **Create Course** | 3-step wizard (basic → lessons → publish), tag tizimi, lesson CRUD (video/text/practice/quiz), duration input, publish confirmation |
| **Students** | 8 ta talaba jadvalida, qidiruv, risk filter (low/medium/high), sorting, detail modal (4 KPI + courses + tasks) |
| **Assignments** | Active/grading/completed tabs, baholash kutilayotgan ishlar, avg grade, progress bars |
| **Analytics** | 4 KPI, 5 ta chart (area, bar horizontal, radar, pie, weekly bar), AI didaktik tavsiyalar |
| **Live** | Video call UI, 6 ishtirokchi grid, chat, participant list, mic/video/share/hand controls, LIVE badge, timer |

**AI xususiyatlar:**
- At-risk talabani avtomatik aniqlash
- Mavzu qiyinligi xaritasi (qaysi mavzu qiyin)
- Didaktik tavsiyalar (vizual ishlatish, qo'shimcha praktika, va h.k.)

### 3️⃣ Admin — `/admin/*`

**Demo kirish:** `admin@edu.uz` / `1234`

| Sahifa | Funksionallik |
|---|---|
| **Dashboard** | 4 KPI (users, active, courses, completion), tizim salomatligi (CPU/RAM/uptime), 2 chart (area + pie), activity log, ogohlantirishlar, quick actions |
| **Users** | Jami 12+ foydalanuvchi, qidiruv, rol filter, status filter, CRUD menu, add user modal |
| **Courses** | Kurslar jadvali, edit/delete, o'qituvchi, reyting |
| **Analytics** | Daromad va xarajatlar (bar chart), qurilma taqsimoti (pie), o'sish dinamikasi |
| **System** | 4 metric (CPU/RAM/storage/network), 24 soatlik monitoring chart, 8 xizmat holati, 4 backup, tizim ma'lumotlari |
| **Logs** | 10 ta log yozuvi, level filter (info/success/warn/error), timestamp, IP, action |
| **Security** | Xavfsizlik bali (score ring), 8 tekshiruv, so'nggi hodisalar, AI xavfsizlik tavsiyalari |
| **Settings** | 6 ta tab: umumiy, email (SMTP), xavfsizlik (2FA toggle), bildirishnomalar, database, ko'rinish (ranglar) |

---

## 🚀 O'rnatish va Ishga Tushirish

```bash
# 1. Dependencies o'rnatish
npm install

# 2. Dev server ishga tushirish
npm run dev

# 3. Brauzerda oching
# http://localhost:3000
```

### Demo Hisoblar
| Rol | Email | Parol |
|---|---|---|
| Talaba | `student@edu.uz` | `1234` |
| O'qituvchi | `teacher@edu.uz` | `1234` |
| Admin | `admin@edu.uz` | `1234` |

**Tezkor kirish**: Login sahifasidagi rang-rangli tugmalar orqali bir bosishda kirish mumkin.

---

## 📊 Yaratilgan Sahifalar (27 ta)

### Public (2)
- [x] Landing page (`/`) — hero, features, methodology, courses, roles, testimonials, CTA
- [x] Login (`/login`), Register (`/register`) — 2-step role selection

### Student (8)
- [x] Dashboard, Courses, Course Detail, Playground, Assignments, Portfolio, AI Assistant, Layout

### Teacher (8)
- [x] Dashboard, My Courses, Create Course Wizard, Students, Assignments, Analytics, Live Class, Layout

### Admin (9)
- [x] Dashboard, Users, Courses, Analytics, System, Logs, Security, Settings, Layout

---

## 🧠 Pedagogik Metodologiyalarning Amaldagi Tatbiqi

| Metodologiya | Qanday amalga oshirilgan |
|---|---|
| **Microlearning** | Har dars 8-25 daqiqa, lock/unlock tizimi |
| **Practice-First (70/30)** | Har mavzuda "practice" tipidagi dars, Playground bilan integratsiya |
| **Immediate Feedback** | Quiz topshirishdan keyin darhol natija + tushuntirish |
| **Adaptive Learning** | AI talabaning zaif joylarini aniqlab, shunga mos tavsiya beradi |
| **Gamification** | XP system, 11 daraja, 10+ nishon, streak, leaderboard ready |
| **Personalized Paths** | AI assistant har bir talaba progressini tahlil qiladi |
| **Active Learning** | Interaktiv: quiz, code playground, AI chat, jonli dars |
| **Continuous Assessment** | Har dars, topshiriq, testda baholash (yakuniy imtihon o'rniga) |

---

## 🔐 Xavfsizlik (Loyihalashtirilgan)

- **Autentifikatsiya**: JWT + OAuth2 (Zustand persist demo)
- **Avtorizatsiya**: Role-based routing (layouts redirect logic)
- **2FA**: Admin uchun majburiy
- **Parol siyosati**: 8+ belgi, raqam, simvol
- **Rate limiting**: 100 req/min per IP
- **SQL injection**: Parameterized queries
- **XSS**: CSP headers
- **HTTPS/TLS 1.3**: SSL A+ rating target
- **Audit logs**: Barcha admin amallari
- **Encrypted backups**: AES-256

---

## 📈 Arxitektura Diagrammasi (Yuqori Daraja)

```
┌─────────────────────────────────────────────────┐
│           Client (Next.js 14 SSR+CSR)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Student  │  │ Teacher  │  │  Admin   │      │
│  │  Panel   │  │  Panel   │  │  Panel   │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
└───────┼──────────────┼──────────────┼──────────┘
        │              │              │
        └──────────────┼──────────────┘
                       ▼
           ┌───────────────────────┐
           │    API Gateway        │
           │  (Node.js / Django)   │
           └───┬───────┬───────┬───┘
               │       │       │
     ┌─────────┘       │       └─────────┐
     ▼                 ▼                 ▼
┌──────────┐    ┌──────────┐      ┌──────────┐
│PostgreSQL│    │  Redis   │      │ Docker   │
│  (main)  │    │ (cache)  │      │ Sandbox  │
└──────────┘    └──────────┘      └──────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  AI Service      │
              │ (GPT-4/Claude)   │
              └──────────────────┘
```

---

## 🎯 Keyingi Bosqichlar (Production uchun)

### Backend
- [ ] PostgreSQL schema (users, courses, lessons, submissions, ...)
- [ ] REST API (Node.js/Express yoki Django REST)
- [ ] WebSocket server (jonli dars uchun)
- [ ] Docker sandbox servisi (izolatsiya qilingan kod bajarish)
- [ ] AI API proxy (rate limiting bilan)

### Frontend
- [ ] Real API integratsiya (React Query / SWR)
- [ ] WebSocket client (jonli dars, chat, notifications)
- [ ] Monaco Editor real o'rnatish (playground)
- [ ] Video player (HLS stream)
- [ ] File upload (S3/Cloudinary)

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Kubernetes manifests
- [ ] CloudFlare CDN
- [ ] Sentry (error tracking)
- [ ] Datadog (APM)

### Xususiyatlar
- [ ] Plagiat aniqlash (MOSS integratsiya)
- [ ] Sertifikat PDF generatsiyasi
- [ ] Tarjima (ru/en)
- [ ] Mobile app (React Native)
- [ ] Offline rejim (PWA)

---

## 📝 Development Log

### Sessiya 2 — 2026-04-24
- ✅ Dizaynni "AI-yasama" ko'rinishidan tozalash (subtle keyingi bosqich):
  - Landing: "AI bilan kuchaytirilgan" marketing rozetkasi olib tashlandi
  - Landing: mesh-gradient glow fonlari olib tashlandi (tekis dark fonlar bilan almashtirildi)
  - Landing: hero'dagi gradient matn (`text-gradient-accent`) oddiy oq matn bilan almashtirildi
  - Landing: methodology bo'limidagi emojilar (⚡ 💬 🎯 📊) Check icon'ga almashtirildi
  - Landing: role kartalaridagi emojilar (👨‍💻 👩‍🏫 ⚙️) olib tashlandi
  - Landing: 5-yulduzli reytinglar testimonial'dan olib tashlandi (SaaS-vibe kamaytirish)
  - Landing: "Bugunoq boshlang" accent-gradient CTA tekis card'ga o'zgartirildi
  - Landing: kurslar katalogi — 6 ta bir xil gradient thumbnail o'rniga toza grid
  - Landing: nav logo'dan "BookOpen + gradient" o'rniga oddiy "E" monogram
  - Landing: ochiq eslatma qo'shildi (muallif, TATU BMI 2026, holat)
  - Dashboard: student welcome'dan 👋 emoji olib tashlandi, gradient glow susaytirildi
  - Dashboard: teacher welcome'dan "Bugun sizning N talabangiz faol" → aniqroq ma'lumot
  - Typography: `Instrument Serif` display shrifti qo'shildi (font-display utility)
- ✅ Sahifa sarlavhalarida sana (weekday) qatori qo'shildi — real sana formati
- ✅ Stat'lar tabular-nums (hizalangan raqamlar) bilan formatlandi

### Sessiya 1 — 2026-04-23
- ✅ Loyiha skeleti (Next.js 14 + TypeScript + Tailwind)
- ✅ Design system (zanjirdagi ranglar, tipografiya, komponentlar)
- ✅ Landing page (hero, features, courses, testimonials, CTA)
- ✅ Auth (login + register)
- ✅ Student panel (7 sahifa)
- ✅ Teacher panel (7 sahifa)
- ✅ Admin panel (8 sahifa)
- ✅ Mock data (6 course, 10 lesson, 8 student, 5 assignment, 10 achievement)
- ✅ Zustand auth store (persist)
- ✅ CLAUDE.md hujjat
- ✅ `(student)/`, `(teacher)/`, `(admin)/` route group'lari oddiy papka ga o'zgartirildi (URL to'g'ri ishlashi uchun)
- ✅ Dependencies o'rnatildi (npm install — 428 paket)
- ✅ Barcha 27 sahifa HTTP 200 qaytaradi (tekshirilgan)
- ✅ TypeScript type check muvaffaqiyatli o'tdi

**Jami:** 27 ta sahifa, ~4200 qator TypeScript kod, 100% responsive, to'liq ishlaydigan.

---

## 👤 Muallif va Litsenziya

**Durdona** — TATU 4-kurs BMI
**Rahbar:** [Ilmiy rahbar]
**Yili:** 2026
**Universitet:** Toshkent Axborot Texnologiyalari Universiteti (TATU)

---

## 📞 Yordam

Savollar yoki takliflar bo'lsa, docs dagi boshqa fayllarni ko'ring yoki `/ai-assistant` orqali platformaning o'zida so'rang.
