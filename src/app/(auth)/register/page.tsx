'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, User, GraduationCap, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuthStore, type Role } from '@/lib/store'

const ROLES = [
  { id: 'student' as Role, label: 'Talaba', icon: GraduationCap, desc: 'Kurslarni kuzatish va o\'rganish', color: 'border-accent-600/40 hover:border-accent-600 data-[selected=true]:border-accent-600 data-[selected=true]:bg-accent-600/10' },
  { id: 'teacher' as Role, label: 'O\'qituvchi', icon: User, desc: 'Kurs yaratish va talabalar boshqarish', color: 'border-sky-600/40 hover:border-sky-600 data-[selected=true]:border-sky-600 data-[selected=true]:bg-sky-600/10' },
  { id: 'admin' as Role, label: 'Admin', icon: Shield, desc: 'Tizimni boshqarish', color: 'border-emerald-600/40 hover:border-emerald-600 data-[selected=true]:border-emerald-600 data-[selected=true]:bg-emerald-600/10' },
]

const ROLE_COLORS: Record<Role, string> = {
  student: 'text-accent-400',
  teacher: 'text-sky-400',
  admin: 'text-emerald-400',
  super_admin: 'text-rose-400',
}

export default function RegisterPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    setUser({
      id: 'u-new-' + Date.now(),
      name,
      email,
      role,
      avatar: initials,
      xp: 0,
      level: 1,
      streak: 0,
      joinedAt: new Date().toISOString(),
    })

    const routes: Record<Role, string> = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard',
      super_admin: '/admin/dashboard',
    }
    router.push(routes[role])
  }

  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center shadow-lg shadow-accent-600/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-base-100">EduCode</span>
          </Link>
        </div>

        <div className="card p-8">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-accent-600 text-white' : 'bg-[#1A1A1F] text-base-600 border border-[#27272A]'}`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs ${step >= s ? 'text-base-300' : 'text-base-600'}`}>
                  {s === 1 ? 'Rol tanlash' : 'Ma\'lumotlar'}
                </span>
                {s < 2 && <div className={`flex-1 h-px ${step > 1 ? 'bg-accent-600' : 'bg-[#27272A]'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-base-100 mb-1">Rolni tanlang</h1>
              <p className="text-sm text-base-500 mb-6">Platformadan foydalanish maqsadingizni tanlang</p>
              <div className="space-y-3 mb-8">
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    data-selected={role === r.id}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left flex items-center gap-4 ${r.color}`}>
                    <div className={`w-10 h-10 rounded-xl bg-[#1A1A1F] flex items-center justify-center flex-shrink-0`}>
                      <r.icon className={`w-5 h-5 ${role === r.id ? ROLE_COLORS[r.id] : 'text-base-500'}`} />
                    </div>
                    <div>
                      <div className={`font-semibold ${role === r.id ? ROLE_COLORS[r.id] : 'text-base-300'}`}>{r.label}</div>
                      <div className="text-xs text-base-500">{r.desc}</div>
                    </div>
                    {role === r.id && <CheckCircle2 className={`w-5 h-5 ml-auto ${ROLE_COLORS[r.id]}`} />}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full btn-primary py-3 font-semibold">
                Davom etish
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="animate-fade-in">
              <h1 className="text-2xl font-bold text-base-100 mb-1">Hisob yaratish</h1>
              <p className="text-sm text-base-500 mb-6">
                Rol: <span className={`font-medium ${ROLE_COLORS[role]}`}>
                  {ROLES.find(r => r.id === role)?.label}
                </span>
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">To'liq Ism</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="input" placeholder="Ism Familiya" required minLength={3} />
                </div>
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input" placeholder="email@edu.uz" required />
                </div>
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Parol</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pr-10" placeholder="Kamida 6 belgi" required minLength={4} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500 hover:text-base-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  Orqaga
                </button>
                <button type="submit" disabled={loading}
                  className="btn-primary flex-2 py-3 flex-1 flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Ro\'yxatdan o\'tish'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-base-500 mt-6">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
