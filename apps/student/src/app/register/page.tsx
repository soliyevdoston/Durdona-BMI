'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const register = useAuthStore((s) => s.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password, role: 'student' })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <a href="https://educode-landing.vercel.app" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-base-100 text-base-950 flex items-center justify-center font-semibold">E</div>
            <span className="text-lg font-medium text-base-100">EduCode</span>
            <span className="text-xs text-base-500 ml-1">· Talaba</span>
          </a>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-semibold text-base-100 mb-1">Hisob yaratish</h1>
          <p className="text-sm text-base-500 mb-7">Talaba sifatida ro'yxatdan o'ting</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">To'liq ism</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Ism Familiya" required minLength={3} />
            </div>
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="email@edu.uz" required />
            </div>
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Parol</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-10" placeholder="Kamida 4 belgi" required minLength={4} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 font-semibold disabled:opacity-50">
              {loading ? 'Kutiling...' : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="text-center text-sm text-base-500 mt-6">
            Hisobingiz bormi? <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
