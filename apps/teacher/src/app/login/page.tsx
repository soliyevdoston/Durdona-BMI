'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('teacher@edu.uz')
  const [password, setPassword] = useState('1234')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Kirishda xatolik')
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
            <span className="text-xs text-base-500 ml-1">· O'qituvchi</span>
          </a>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-semibold text-base-100 mb-1">Tizimga kirish</h1>
          <p className="text-sm text-base-500 mb-7">O'qituvchi hisobingiz orqali kiring</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="email@edu.uz" required />
            </div>
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Parol</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" />Kirish</>}
            </button>
          </form>

          <p className="text-center text-sm text-base-500 mt-6">
            Hisob yo'qmi? <Link href="/register" className="text-accent-400 hover:text-accent-300 font-medium">Ro'yxatdan o'tish</Link>
          </p>
        </div>

        <p className="text-center text-xs text-base-700 mt-6">Demo: <code className="code-font text-base-500">student@edu.uz / 1234</code></p>
      </div>
    </div>
  )
}
