'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { DEMO_USERS } from '@/lib/data'

const QUICK_LOGINS = [
  { label: 'Talaba', email: 'student@edu.uz', color: 'border-accent-600/40 hover:border-accent-600 hover:bg-accent-600/5', badge: 'bg-accent-600/10 text-accent-400' },
  { label: 'O\'qituvchi', email: 'teacher@edu.uz', color: 'border-sky-600/40 hover:border-sky-600 hover:bg-sky-600/5', badge: 'bg-sky-600/10 text-sky-400' },
  { label: 'Admin', email: 'admin@edu.uz', color: 'border-emerald-600/40 hover:border-emerald-600 hover:bg-emerald-600/5', badge: 'bg-emerald-600/10 text-emerald-400' },
]

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const user = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      setError('Email yoki parol noto\'g\'ri')
      setLoading(false)
      return
    }

    const { password: _, ...userData } = user
    setUser(userData)

    const routes: Record<string, string> = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard',
      super_admin: '/admin/dashboard',
    }
    router.push(routes[userData.role])
  }

  const quickLogin = (email: string) => {
    setEmail(email)
    setPassword('1234')
    setError('')
  }

  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center shadow-lg shadow-accent-600/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-base-100">EduCode</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-base-100 mb-1">Xush kelibsiz</h1>
          <p className="text-sm text-base-500 mb-8">Hisobingizga kirish uchun ma'lumotlarni kiriting</p>

          {/* Quick login */}
          <div className="mb-6">
            <p className="text-xs text-base-600 mb-3 uppercase tracking-wider">Tezkor Kirish (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_LOGINS.map((q) => (
                <button key={q.email} onClick={() => quickLogin(q.email)}
                  className={`p-2.5 rounded-xl border text-center transition-all duration-200 ${q.color}`}>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${q.badge}`}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E1E24]" />
            </div>
            <div className="relative flex justify-center text-xs text-base-600">
              <span className="bg-[#111113] px-3">yoki qo'lda kiriting</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="email@edu.uz"
                required
              />
            </div>
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Parol</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500 hover:text-base-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Kirish
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-500 mt-6">
            Hisob yo'qmi?{' '}
            <Link href="/register" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-base-700 mt-6">
          Demo parol barcha rollar uchun: <span className="text-base-500 code-font">1234</span>
        </p>
      </div>
    </div>
  )
}
