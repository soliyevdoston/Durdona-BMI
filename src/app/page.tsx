'use client'
import Link from 'next/link'
import {
  BookOpen, Code2, Brain, BarChart3, Shield, Users,
  Zap, ChevronRight, Star, PlayCircle, Check, ArrowRight,
  Cpu, Globe, Database, Network, Terminal, Award
} from 'lucide-react'

const STATS = [
  { label: 'Faol Talaba', value: '1,247+' },
  { label: 'Kurs', value: '24' },
  { label: 'Dars', value: '486+' },
  { label: 'O\'rtacha Reyting', value: '4.9★' },
]

const FEATURES = [
  { icon: Brain, title: 'AI O\'qituvchi Yordamchi', desc: 'Shaxsiy AI yordamchi xatolaringizni tahlil qiladi, zaif joylarni aniqlaydi va individual tavsiyalar beradi.', color: 'text-accent-400', bg: 'bg-accent-600/10' },
  { icon: Code2, title: 'Brauzer Kod Muhiti', desc: 'Python, JavaScript, SQL va boshqa tillarda to\'g\'ridan-to\'g\'ri brauzerda kod yozing va sinab ko\'ring.', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { icon: BarChart3, title: 'Aqlli Tahlil', desc: 'Real vaqt rejimida o\'qish tahlili, zaif mavzular xaritasi va AI tomonidan beriladigan tavsiyalar.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Zap, title: 'Adaptiv O\'qish', description: 'Tizim sizning darajangizga moslashib, mos qiyinlikdagi materiallarni avtomatik tanlaydi.', color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Tizim sizning darajangizga moslashib, mos qiyinlikdagi materiallarni avtomatik tanlaydi.' },
  { icon: Award, title: 'Gamifikatsiya', desc: 'XP, darajalar, nishonlar va reytinglar orqali o\'qishni qiziqarli va motivatsiyali jarayonga aylantiring.', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: Users, title: 'Jonli Sinfxona', desc: 'Video darslar, real vaqt chat, ekran ulashish va interaktiv Q&A sessiyalari bilan jonli ta\'lim.', color: 'text-violet-400', bg: 'bg-violet-500/10' },
]

const COURSES_PREVIEW = [
  { icon: Terminal, title: 'Python Dasturlash', level: 'Boshlang\'ich', students: 342, color: 'from-blue-600 to-cyan-600' },
  { icon: Globe, title: 'Web Dasturlash', level: 'Boshlang\'ich', students: 521, color: 'from-orange-600 to-amber-600' },
  { icon: Database, title: 'SQL & Ma\'lumotlar Bazasi', level: 'O\'rta', students: 198, color: 'from-emerald-600 to-teal-600' },
  { icon: Network, title: 'Kompyuter Tarmoqlari', level: 'O\'rta', students: 145, color: 'from-violet-600 to-purple-600' },
  { icon: Cpu, title: 'Algoritmlar & DSA', level: 'Murakkab', students: 89, color: 'from-rose-600 to-pink-600' },
  { icon: Shield, title: 'Kiberxavfsizlik', level: 'Murakkab', students: 112, color: 'from-slate-600 to-zinc-600' },
]

const TESTIMONIALS = [
  { name: 'Azizbek K.', role: 'Talaba', text: 'AI yordamchi tufayli Python darslarini ancha tez o\'zlashtirib oldim. Kod xatolarimni avvalidan tushuntirishi ajoyib!', rating: 5, avatar: 'AK' },
  { name: 'Malika T.', role: 'Talaba', text: 'Gamifikatsiya tizimi o\'qishni juda motivatsiyali qildi. Har kuni yangi nishon olish uchun kirishni xohlayman.', rating: 5, avatar: 'MT' },
  { name: 'Jasur R.', role: 'Talaba', text: 'Brauzerda kod yozish imkoniyati juda qulay. Hech nima o\'rnatmasdan dars boshlash mumkin.', rating: 5, avatar: 'JR' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-950 overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-[#1E1E24]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base-100 text-lg">EduCode</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-base-400">
            <a href="#features" className="hover:text-base-100 transition-colors">Imkoniyatlar</a>
            <a href="#courses" className="hover:text-base-100 transition-colors">Kurslar</a>
            <a href="#about" className="hover:text-base-100 transition-colors">Haqida</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Kirish</Link>
            <Link href="/register" className="btn-primary text-sm">Boshlash</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-600/10 border border-accent-600/20 text-accent-400 text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            AI bilan kuchaytirilgan ta'lim platformasi
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.08] tracking-tight">
            <span className="text-gradient">ICT ni yangi</span>
            <br />
            <span className="text-gradient-accent">usulda o'rganing</span>
          </h1>

          <p className="text-xl text-base-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI yordamchi, interaktiv kod muhiti va adaptiv o'qish tizimi bilan dasturlash, tarmoqlar va
            ma'lumotlar bazasini professional darajada o'rganing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="group flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-accent-600/25">
              Bepul Boshlash
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login"
              className="flex items-center gap-2 bg-[#1A1A1F] hover:bg-[#222229] border border-[#27272A] text-base-200 font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200">
              <PlayCircle className="w-5 h-5 text-accent-400" />
              Demo ko'rish
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {STATS.map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className="text-2xl font-bold text-base-100">{s.value}</div>
                <div className="text-sm text-base-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-100 mb-4">Zamonaviy ta'lim texnologiyalari</h2>
            <p className="text-base-400 text-lg max-w-2xl mx-auto">
              Eng ilg'or pedagogik metodologiyalar va sun'iy intellekt birlashtirilgan platforma
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:border-[#3F3F46] transition-all duration-300 group">
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-base-100 mb-2">{f.title}</h3>
                <p className="text-sm text-base-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0D0D10]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge-accent mb-6">Pedagogik Model</div>
              <h2 className="text-4xl font-bold text-base-100 mb-6">70% Amaliyot,<br />30% Nazariya</h2>
              <p className="text-base-400 text-lg mb-8 leading-relaxed">
                Zamonaviy "Practice-First" metodologiyasiga asoslanib, har bir mavzuda avval amaliy
                tajriba ortiriladi, so'ngra nazariy bilim mustahkamlanadi.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Mikrodarsllar', desc: '8-15 daqiqalik qisqa, aniq darslar', icon: '⚡' },
                  { title: 'Tezkor Fikr-mulohaza', desc: 'Har bir javobga darhol tushuntirish', icon: '💬' },
                  { title: 'Adaptiv Qiyinlik', desc: 'Sizning tempingizga moslashadi', icon: '🎯' },
                  { title: 'Doimiy Baholash', desc: 'Yakuniy imtihon o\'rniga davomiy monitoring', icon: '📊' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 card rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-base-200">{item.title}</div>
                      <div className="text-sm text-base-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-base-100">AI Yordamchi</div>
                    <div className="text-xs text-base-500">Python - Sikllar darsi</div>
                  </div>
                </div>
                <div className="bg-[#1A1A1F] rounded-xl p-4 text-sm code-font text-emerald-400">
                  <div className="text-base-500 mb-2"># Sizning kodingiz:</div>
                  <div>{'for i in range(10):'}</div>
                  <div className="pl-4">{'print(i * i)'}</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-500 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-base-300 leading-relaxed">
                    Kodingiz to'g'ri ishlayapti! Lekin samaradorlikni oshirish uchun <span className="text-accent-400 code-font">list comprehension</span> ishlatishni ko'rib chiqing:
                  </p>
                </div>
                <div className="bg-[#1A1A1F] rounded-xl p-4 text-sm code-font text-sky-400">
                  <div className="text-base-500 mb-2"># Tavsiya etilgan:</div>
                  <div>{'kvadratlar = [i*i for i in range(10)]'}</div>
                  <div className="text-base-500 mt-1">{'# 2x tezroq va pythonic'}</div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="badge-emerald">+15 XP</div>
                  <div className="badge-sky">Yangi Usul O'rgandingiz</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-100 mb-4">Kurslar Katalogi</h2>
            <p className="text-base-400">ICT sohasining barcha yo'nalishlarini qamrab olgan kurslar</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES_PREVIEW.map((c) => (
              <div key={c.title} className="card p-6 hover:border-[#3F3F46] transition-all duration-300 group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-base-100 mb-2 group-hover:text-accent-400 transition-colors">{c.title}</h3>
                <div className="flex items-center justify-between text-sm text-base-500">
                  <span>{c.level}</span>
                  <span>{c.students} talaba</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-accent-400">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <span className="ml-1 text-base-500">4.9</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/register" className="btn-secondary inline-flex items-center gap-2 px-6 py-3">
              Barcha kurslarni ko'rish
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="about" className="py-24 px-6 bg-[#0D0D10]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-100 mb-4">Har bir rol uchun maxsus panel</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: 'Talaba', icon: '👨‍💻', color: 'border-accent-600/30 hover:border-accent-600/60', items: ['Shaxsiy o\'quv yo\'li', 'XP & Darajalar tizimi', 'AI yordamchi', 'Kod muхiti', 'Portfolio', 'Yutuqlar va nishonlar'], link: '/login', cta: 'Talaba sifatida kirish' },
              { role: 'O\'qituvchi', icon: '👩‍🏫', color: 'border-sky-600/30 hover:border-sky-600/60', items: ['Kurs yaratish vositasi', 'Talabalar monitoringi', 'AI tavsiyalari', 'Avtomatik baholash', 'Tahlil va hisobotlar', 'Jonli darslar'], link: '/login', cta: 'O\'qituvchi sifatida kirish' },
              { role: 'Admin', icon: '⚙️', color: 'border-emerald-600/30 hover:border-emerald-600/60', items: ['Tizim boshqaruvi', 'Foydalanuvchi menejment', 'Keng tahlil', 'Server monitoring', 'Kontent moderatsiya', 'Xavfsizlik audit'], link: '/login', cta: 'Admin sifatida kirish' },
            ].map((r) => (
              <div key={r.role} className={`card p-8 border ${r.color} transition-colors duration-300`}>
                <div className="text-4xl mb-4">{r.icon}</div>
                <h3 className="text-xl font-bold text-base-100 mb-6">{r.role}</h3>
                <ul className="space-y-3 mb-8">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-base-400">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={r.link} className="btn-secondary w-full text-center block">
                  {r.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-100 mb-4">Talabalar fikri</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-base-400 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-base-200">{t.name}</div>
                    <div className="text-xs text-base-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 via-transparent to-sky-600/5" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-base-100 mb-4">Bugunoq boshlang</h2>
              <p className="text-base-400 text-lg mb-8">Ro'yxatdan o'tish bepul. Karta kerak emas.</p>
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-200 shadow-lg shadow-accent-600/25">
                Bepul Boshlash
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="mt-6 text-sm text-base-500">
                Demo: student@edu.uz / teacher@edu.uz / admin@edu.uz — parol: 1234
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E1E24] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-base-300">EduCode</span>
          </div>
          <div className="text-sm text-base-600">
            © 2026 EduCode — ICT Virtual Classroom Platform
          </div>
          <div className="text-sm text-base-600">
            TATU — Axborot va Kommunikatsiya Texnologiyalari
          </div>
        </div>
      </footer>
    </div>
  )
}
