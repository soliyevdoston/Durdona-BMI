'use client'
import Link from 'next/link'
import {
  BookOpen, Code2, Brain, BarChart3, Shield, Users,
  ChevronRight, PlayCircle, Check, ArrowRight,
  Cpu, Globe, Database, Network, Terminal, Award
} from 'lucide-react'

const STATS = [
  { label: 'Faol talaba', value: '1 240' },
  { label: 'Kurs', value: '24' },
  { label: 'Dars moduli', value: '486' },
  { label: "O'rtacha baho", value: '4.8 / 5' },
]

const FEATURES = [
  { icon: Brain, title: "AI o'qituvchi yordamchi", desc: "Talabaning kodidagi xatolarni tahlil qiladi, tushuntirib beradi va mos tavsiya beradi. Tayyor javob bermaydi — o'zi tushunishga yo'naltiradi.", color: 'text-accent-400', bg: 'bg-accent-600/10' },
  { icon: Code2, title: 'Brauzerdagi kod muhiti', desc: "Python, JavaScript, SQL. Hech narsa o'rnatmasdan, brauzerning o'zidan kod yozib ishga tushirish mumkin.", color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { icon: BarChart3, title: 'Didaktik tahlil', desc: "O'qituvchi har bir talabaning kuchli/zaif joylarini va umumiy sinfdagi qiyin mavzularni vizual ko'radi.", color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: BookOpen, title: 'Adaptiv sur\'at', desc: "Tizim talabaning oxirgi javoblariga qarab qiyinlikni moslaydi. Hammaga bir xil tempda yurish shart emas.", color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Award, title: 'XP va darajalar', desc: "Har bir bajarilgan topshiriq, seriya, muvaffaqiyat XP beradi. Ichki motivatsiya uchun, emas raqobat uchun.", color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: Users, title: 'Jonli dars', desc: "Video, chat, ekran ulashish. Qo'l ko'tarish va savol-javoblar. Qo'shimcha Zoom link kerak emas.", color: 'text-violet-400', bg: 'bg-violet-500/10' },
]

const COURSES_PREVIEW = [
  { icon: Terminal, title: 'Python dasturlash', level: "Boshlang'ich", students: 342 },
  { icon: Globe, title: 'Web: HTML, CSS, JS', level: "Boshlang'ich", students: 521 },
  { icon: Database, title: 'SQL va ma\'lumotlar bazasi', level: "O'rta", students: 198 },
  { icon: Network, title: 'Kompyuter tarmoqlari', level: "O'rta", students: 145 },
  { icon: Cpu, title: "Algoritmlar va DSA", level: 'Murakkab', students: 89 },
  { icon: Shield, title: 'Kiberxavfsizlik asoslari', level: 'Murakkab', students: 112 },
]

const TESTIMONIALS = [
  { name: 'Azizbek K.', role: '4-kurs, TATU', text: 'Avval Python\'da nega xato chiqayotganini tushunmasdim. AI izohi bilan bir haftada ko\'p narsa oydinlashdi.', avatar: 'AK' },
  { name: 'Malika T.', role: '3-kurs', text: 'Kod yozishni boshlash eng qiyin qismi edi. Brauzerdan yozilishi o\'rnatish jarayonini olib tashladi.', avatar: 'MT' },
  { name: 'Dilnoza Y.', role: "O'qituvchi", text: 'Har bir talabaning qayerda qiynalayotganini ko\'rish imkonini beradi. Avvallari buni qo\'lda aniqlash mumkin emas edi.', avatar: 'DY' },
]

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
            <a href="#features" className="hover:text-base-200 transition-colors">Imkoniyatlar</a>
            <a href="#courses" className="hover:text-base-200 transition-colors">Kurslar</a>
            <a href="#rollar" className="hover:text-base-200 transition-colors">Rollar</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-base-300 hover:text-base-100">Kirish</Link>
            <Link href="/register" className="btn-primary text-sm">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-base-500 mb-8">
            TATU · Bitiruv malakaviy ishi, 2026
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.05] tracking-tight text-base-100">
            AKT fanlarini
            <br />
            amaliyot orqali o'rganing.
          </h1>

          <p className="text-lg text-base-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Brauzerda kod yozish, tezkor izohlar va har bir talabaning sur'atiga
            moslashadigan interaktiv dars tizimi. Nazariya qisqa, amaliyot ko'p.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="group inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
              Bepul boshlash
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-2 text-base-300 hover:text-base-100 font-medium px-5 py-3 text-sm transition-colors">
              <PlayCircle className="w-4 h-4" />
              Demo hisobga kirish
            </Link>
          </div>

          {/* Stats strip */}
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
      <section id="features" className="py-24 px-6 border-t border-[#18181B]">
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
              <p className="text-base-400 text-base mb-8 leading-relaxed">
                Nazariya qisqa — amaliyot davomida mustahkamlanadi. Har mavzudan keyin
                darhol kod yoziladi, so'ng qoidalar izohlanadi. Bu "eslab qolish"
                emas, "tushunish" orqali o'rganish usuli.
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Mikro-darslar', desc: "8–15 daqiqalik fokuslangan modullar" },
                  { title: 'Tezkor izoh', desc: 'Har javobga bir zumda tushuntirish' },
                  { title: 'Adaptiv qiyinlik', desc: "Sizning sur'atingizga moslashadi" },
                  { title: 'Davomiy baholash', desc: "Yakuniy imtihon o'rniga doimiy monitoring" },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4 pb-4 border-b border-[#1E1E24] last:border-0 last:pb-0">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium text-base-200 mb-0.5">{item.title}</div>
                      <div className="text-sm text-base-500">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example card — less "glow", more realistic */}
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
                Hozir majburiy emas — keyingi darsda chuqurroq tushuntiramiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-24 px-6 border-t border-[#18181B]">
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
              <div key={c.title} className="group bg-[#0F0F11] p-6 hover:bg-[#131316] transition-colors cursor-pointer">
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

          <div className="mt-8 flex justify-center">
            <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-base-300 hover:text-base-100 border-b border-base-700 hover:border-base-400 pb-0.5 transition-colors">
              Kurslarning to'liq ro'yxatini ko'rish
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="rollar" className="py-24 px-6 border-t border-[#18181B] bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="text-xs uppercase tracking-[0.18em] text-base-500 mb-3">Rollar</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-base-100 leading-tight">
              Har bir rol uchun alohida panel.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                role: 'Talaba',
                sub: 'O\'rganuvchi, amaliyotchi',
                items: ["Shaxsiy o'quv yo'li", 'XP va darajalar', 'AI yordamchi', 'Kod muhiti', 'Portfolio', 'Yutuqlar'],
                cta: 'Talaba sifatida kirish',
              },
              {
                role: "O'qituvchi",
                sub: 'Kurs tuzadi, progress kuzatadi',
                items: ['Kurs yaratish vositasi', 'Talabalar monitoringi', 'AI tavsiyalar', 'Avtomatik baholash', 'Tahlil va hisobotlar', 'Jonli darslar'],
                cta: "O'qituvchi sifatida kirish",
              },
              {
                role: 'Admin',
                sub: 'Tizim barqarorligi uchun',
                items: ['Tizim boshqaruvi', 'Foydalanuvchi menejment', 'Keng tahlil', 'Server monitoring', 'Kontent moderatsiya', 'Xavfsizlik audit'],
                cta: 'Admin sifatida kirish',
              },
            ].map((r) => (
              <div key={r.role} className="card p-7 flex flex-col">
                <div>
                  <h3 className="text-xl font-medium text-base-100">{r.role}</h3>
                  <div className="text-xs text-base-500 mt-1">{r.sub}</div>
                </div>
                <ul className="space-y-2.5 mt-6 mb-8 flex-1">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-base-400">
                      <span className="text-base-700 mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="text-sm text-base-200 hover:text-white inline-flex items-center gap-1 border-b border-base-700 hover:border-base-400 pb-0.5 w-fit transition-colors">
                  {r.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 border-t border-[#18181B]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <div className="text-xs uppercase tracking-[0.18em] text-base-500 mb-3">Fikrlar</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-base-100 leading-tight">
              Foydalanuvchilardan.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card p-6 flex flex-col">
                <blockquote className="text-sm text-base-300 leading-relaxed mb-6 flex-1">
                  "{t.text}"
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-[#1E1E24]">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1F] border border-[#27272A] flex items-center justify-center text-xs font-medium text-base-300">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm text-base-200">{t.name}</div>
                    <div className="text-xs text-base-600">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#18181B]">
        <div className="max-w-3xl mx-auto">
          <div className="card p-10">
            <h2 className="text-3xl font-semibold text-base-100 mb-4 leading-tight">Sinab ko'rishni boshlang.</h2>
            <p className="text-base-400 mb-8 leading-relaxed max-w-lg">
              Ro'yxatdan o'tish bepul, karta talab qilinmaydi. Quyidagi demo hisoblar
              orqali platformaning ichini ko'rish mumkin.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
                Boshlash
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-xs text-base-500 font-mono leading-relaxed">
                student@edu.uz &nbsp;·&nbsp; teacher@edu.uz &nbsp;·&nbsp; admin@edu.uz
                <div className="text-base-700">parol: 1234</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#18181B] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-base-800 text-base-300 flex items-center justify-center font-semibold">E</div>
            <span>EduCode — AKT Virtual Classroom</span>
          </div>
          <div>© 2026 · Toshkent Axborot Texnologiyalari Universiteti</div>
        </div>
      </footer>
    </div>
  )
}
