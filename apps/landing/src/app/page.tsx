'use client'
import {
  BookOpen, Code2, Brain, BarChart3, Shield, Users,
  ArrowRight, Check, GraduationCap, UserCog, ShieldCheck,
  Terminal, Globe, Database, Network, Cpu
} from 'lucide-react'

const STUDENT_URL = process.env.NEXT_PUBLIC_STUDENT_URL || 'http://localhost:3001'
const TEACHER_URL = process.env.NEXT_PUBLIC_TEACHER_URL || 'http://localhost:3002'
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3003'

const STATS = [
  { label: 'Faol talaba', value: '1 240' },
  { label: 'Kurs', value: '24' },
  { label: 'Dars moduli', value: '486' },
  { label: "O'rtacha baho", value: '4.8 / 5' },
]

const FEATURES = [
  { icon: Brain, title: "AI o'qituvchi yordamchi", desc: "Talabaning kodidagi xatolarni tahlil qiladi, tushuntirib beradi va mos tavsiya beradi.", color: 'text-accent-400', bg: 'bg-accent-600/10' },
  { icon: Code2, title: 'Brauzerdagi kod muhiti', desc: "Python, JavaScript, SQL. Hech narsa o'rnatmasdan brauzerdan kod yozib ishga tushirish.", color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { icon: BarChart3, title: 'Didaktik tahlil', desc: "O'qituvchi har bir talabaning kuchli/zaif joylarini va sinfdagi qiyin mavzularni ko'radi.", color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: BookOpen, title: "Adaptiv sur'at", desc: "Tizim talabaning oxirgi javoblariga qarab qiyinlikni moslaydi.", color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Shield, title: 'Rol asosida xavfsizlik', desc: "Har rol o'z panelidan kiradi, JWT token, role-based access control.", color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: Users, title: 'Jonli dars', desc: "Video, chat, ekran ulashish. Qo'shimcha Zoom kerak emas.", color: 'text-violet-400', bg: 'bg-violet-500/10' },
]

const COURSES_PREVIEW = [
  { icon: Terminal, title: 'Python dasturlash', level: "Boshlang'ich", students: 342 },
  { icon: Globe, title: 'Web: HTML, CSS, JS', level: "Boshlang'ich", students: 521 },
  { icon: Database, title: "SQL va ma'lumotlar bazasi", level: "O'rta", students: 198 },
  { icon: Network, title: 'Kompyuter tarmoqlari', level: "O'rta", students: 145 },
  { icon: Cpu, title: "Algoritmlar va DSA", level: 'Murakkab', students: 89 },
  { icon: Shield, title: 'Kiberxavfsizlik asoslari', level: 'Murakkab', students: 112 },
]

const ROLES = [
  {
    role: 'Talaba',
    desc: 'Kurslarni ko\'ring, amaliyot qiling, AI yordamchi bilan mashg\'ulot olib boring.',
    icon: GraduationCap,
    accent: 'accent',
    url: STUDENT_URL,
    items: ['Kurs katalogi', 'Kod muhiti', 'AI yordamchi', 'XP va nishonlar', 'Portfolio'],
  },
  {
    role: "O'qituvchi",
    desc: 'Kurs yarating, talabalar taraqqiyotini kuzating, topshiriqlarni baholang.',
    icon: UserCog,
    accent: 'sky',
    url: TEACHER_URL,
    items: ['Kurs yaratish', 'Talabalar monitoringi', 'Didaktik tahlil', 'Baholash', 'Jonli dars'],
  },
  {
    role: 'Admin',
    desc: 'Tizim holatini kuzating, foydalanuvchilarni boshqaring, xavfsizlikni nazorat qiling.',
    icon: ShieldCheck,
    accent: 'emerald',
    url: ADMIN_URL,
    items: ['Foydalanuvchilar', 'Tizim monitoringi', 'Loglar', 'Xavfsizlik', 'Sozlamalar'],
  },
]

const ACCENT: Record<string, { text: string; bg: string; border: string; hover: string }> = {
  accent:  { text: 'text-accent-400',  bg: 'bg-accent-600/10',  border: 'border-accent-600/20',  hover: 'hover:border-accent-600/40' },
  sky:     { text: 'text-sky-400',     bg: 'bg-sky-600/10',     border: 'border-sky-600/20',     hover: 'hover:border-sky-600/40' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-600/20', hover: 'hover:border-emerald-600/40' },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-base-950/85 backdrop-blur-sm border-b border-[#18181B]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-base-100 text-base-950 flex items-center justify-center font-semibold text-sm">E</div>
            <span className="font-medium text-base-100">EduCode</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-base-400">
            <a href="#imkoniyatlar" className="hover:text-base-200 transition-colors">Imkoniyatlar</a>
            <a href="#kurslar" className="hover:text-base-200 transition-colors">Kurslar</a>
            <a href="#panellar" className="hover:text-base-200 transition-colors">Panellar</a>
          </div>
          <a href="#panellar" className="btn-primary text-sm">Boshlash</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-base-500 mb-8">
            TATU · Bitiruv malakaviy ishi · 2026
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.05] tracking-tight text-base-100">
            AKT fanlarini
            <br />
            amaliyot orqali o'rganing.
          </h1>
          <p className="text-lg text-base-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Brauzerda kod yozish, tezkor AI izohlari va har talabaning sur'atiga
            moslashadigan interaktiv dars tizimi. Nazariya qisqa, amaliyot ko'p.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#panellar" className="group inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
              Panelni tanlang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="#imkoniyatlar" className="text-base-300 hover:text-base-100 px-4 py-3 text-sm">
              Batafsil
            </a>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1E1E24] border border-[#1E1E24] rounded-xl overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#0F0F11] px-4 py-5 text-center">
                <div className="text-2xl font-semibold text-base-100 tabular-nums">{s.value}</div>
                <div className="text-xs text-base-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="imkoniyatlar" className="py-24 px-6 border-t border-[#18181B]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.18em] text-base-500 mb-3">Imkoniyatlar</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-base-100 mb-4 leading-tight">
              Oddiy LMS emas, o'quv muhiti.
            </h2>
            <p className="text-base-400 leading-relaxed">
              Platforma PowerPoint va test o'rniga amaliy mashg'ulot va real vaqtda
              javob-izohlar atrofida qurilgan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:border-[#3F3F46] transition-colors duration-200">
                <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-medium text-base-100 mb-2">{f.title}</h3>
                <p className="text-sm text-base-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="py-24 px-6 border-t border-[#18181B] bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-base-500 mb-3">Pedagogik yondashuv</div>
              <h2 className="text-3xl md:text-4xl font-semibold text-base-100 mb-6 leading-tight">
                70% amaliyot, 30% nazariya.
              </h2>
              <p className="text-base-400 mb-8 leading-relaxed">
                Nazariya qisqa — amaliyot davomida mustahkamlanadi. Har mavzudan keyin darhol
                kod yoziladi, so'ng qoidalar izohlanadi.
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Mikro-darslar', desc: "8–15 daqiqalik fokuslangan modullar" },
                  { title: 'Tezkor izoh', desc: 'Har javobga bir zumda tushuntirish' },
                  { title: 'Adaptiv qiyinlik', desc: "Sizning sur'atingizga moslashadi" },
                  { title: 'Davomiy baholash', desc: "Yakuniy imtihon o'rniga doimiy monitoring" },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4 pb-4 border-b border-[#1E1E24] last:border-0 last:pb-0">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-base-200 mb-0.5">{item.title}</div>
                      <div className="text-sm text-base-500">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-accent-600/15 border border-accent-600/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-accent-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-base-100">AI yordamchi</div>
                  <div className="text-xs text-base-500">Python · Sikllar darsi</div>
                </div>
              </div>
              <div className="bg-[#0D0D10] border border-[#1E1E24] rounded-lg p-4 text-xs code-font leading-6 mb-3">
                <div className="text-base-600 mb-1">{'# Sizning yechimingiz:'}</div>
                <div className="text-base-300">{'for i in range(10):'}</div>
                <div className="text-base-300 pl-4">{'print(i * i)'}</div>
              </div>
              <p className="text-sm text-base-400 leading-relaxed mb-3">
                Kod to'g'ri ishlayapti. Ko'pincha pythonchilar buni qisqaroq yozadi:
              </p>
              <div className="bg-[#0D0D10] border border-[#1E1E24] rounded-lg p-4 text-xs code-font leading-6 mb-4">
                <div className="text-base-600 mb-1">{'# Qisqaroq usul:'}</div>
                <div className="text-sky-400">{'kvadratlar = [i*i for i in range(10)]'}</div>
              </div>
              <p className="text-xs text-base-500 leading-relaxed">
                Bunga <span className="code-font bg-[#1A1A1F] px-1.5 py-0.5 rounded text-base-300">list comprehension</span> deyiladi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="kurslar" className="py-24 px-6 border-t border-[#18181B]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-base-500 mb-3">Katalog</div>
              <h2 className="text-3xl md:text-4xl font-semibold text-base-100 leading-tight">Kurslar.</h2>
            </div>
            <p className="text-sm text-base-500 max-w-sm">
              Dasturlash, web, ma'lumotlar bazasi, tarmoqlar va xavfsizlik —
              AKT sohasining asosiy yo'nalishlari.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1E1E24] border border-[#1E1E24] rounded-xl overflow-hidden">
            {COURSES_PREVIEW.map((c) => (
              <div key={c.title} className="group bg-[#0F0F11] p-6 hover:bg-[#131316] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center mb-5">
                  <c.icon className="w-4 h-4 text-base-300" />
                </div>
                <h3 className="font-medium text-base-100 mb-3 group-hover:text-white">{c.title}</h3>
                <div className="flex items-center justify-between text-xs text-base-500">
                  <span>{c.level}</span>
                  <span className="tabular-nums">{c.students} talaba</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES — ASOSIY QISM */}
      <section id="panellar" className="py-24 px-6 border-t border-[#18181B] bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.18em] text-base-500 mb-3">Panellar</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-base-100 leading-tight mb-3">
              Qaysi rolda kirasiz?
            </h2>
            <p className="text-base-400">
              Har bir foydalanuvchi turi uchun alohida ishchi muhit. Quyidagilardan mosini tanlang.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {ROLES.map((r) => {
              const a = ACCENT[r.accent]
              return (
                <a key={r.role} href={r.url}
                  className={`card p-7 flex flex-col transition-all duration-200 ${a.hover} group`}>
                  <div className={`w-12 h-12 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-5`}>
                    <r.icon className={`w-6 h-6 ${a.text}`} />
                  </div>
                  <h3 className="text-xl font-medium text-base-100 mb-2">{r.role}</h3>
                  <p className="text-sm text-base-500 mb-6 leading-relaxed">{r.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {r.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-base-400">
                        <span className="text-base-700 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className={`flex items-center justify-between pt-4 border-t border-[#1E1E24] ${a.text} font-medium`}>
                    <span className="text-sm">Panelga kirish</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              )
            })}
          </div>

          <div className="mt-10 text-center text-xs text-base-600">
            Demo hisoblar har panel'da: <span className="code-font text-base-500">student@edu.uz · teacher@edu.uz · admin@edu.uz</span> · parol: <span className="code-font">1234</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#18181B] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-base-800 text-base-300 flex items-center justify-center font-semibold">E</div>
            <span>EduCode — AKT Virtual Sinf</span>
          </div>
          <div>© 2026 · Toshkent Axborot Texnologiyalari Universiteti</div>
        </div>
      </footer>
    </div>
  )
}
