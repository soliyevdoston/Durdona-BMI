'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Code2, Brain, Award, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-app">
      <nav className="border-b border-[#18181B]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-base-100 text-base-950 flex items-center justify-center font-semibold text-sm">E</div>
            <span className="font-medium text-base-100">EduCode</span>
            <span className="text-xs text-base-500">· Talaba paneli</span>
          </div>
          <Link href="/login" className="text-sm text-base-300 hover:text-base-100">Kirish →</Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-base-500 mb-6">
            TATU · Bitiruv malakaviy ishi · 2026
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold text-base-100 leading-[1.05] tracking-tight mb-6">
            AKT fanlarini amaliyot
            <br />orqali o'rganing.
          </h1>
          <p className="text-lg text-base-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Brauzerda kod yozing, tezkor AI yordamchi oling, o'z sur'atingizda o'ganing.
            Python, JavaScript, SQL va boshqa yo'nalishlarda kurslar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-primary flex items-center gap-2 px-6 py-3">
              Bepul boshlash <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="text-base-300 hover:text-base-100 px-4 py-3 text-sm">
              Demo: student@edu.uz / 1234
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-[#18181B]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-px bg-[#1E1E24] border border-[#1E1E24] rounded-xl overflow-hidden">
            {[
              { icon: BookOpen, label: 'Kurslar katalogi', desc: "Python, Web, SQL, DSA" },
              { icon: Code2, label: 'Kod muhiti', desc: "Brauzerdan kod yozish" },
              { icon: Brain, label: 'AI yordamchi', desc: 'Xatolarni izohlaydi' },
              { icon: Award, label: 'XP va nishonlar', desc: 'Gamifikatsiya tizimi' },
            ].map((f) => (
              <div key={f.label} className="bg-[#0F0F11] p-5">
                <f.icon className="w-5 h-5 text-base-400 mb-3" />
                <div className="text-sm font-medium text-base-100 mb-1">{f.label}</div>
                <div className="text-xs text-base-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#18181B] py-6 px-6">
        <div className="max-w-6xl mx-auto text-xs text-base-600 text-center">
          © 2026 · TATU · AKT fanlari uchun virtual sinf
        </div>
      </footer>
    </div>
  )
}
