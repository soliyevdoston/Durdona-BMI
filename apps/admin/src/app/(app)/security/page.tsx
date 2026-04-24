'use client'
import { Shield, Lock, Key, AlertTriangle, CheckCircle2, Globe, Eye, UserX } from 'lucide-react'

const SECURITY_CHECKS = [
  { name: 'SSL Sertifikati', status: 'pass', detail: 'TLS 1.3 · 256-bit', icon: Lock },
  { name: '2FA majburiy', status: 'pass', detail: 'Adminlar uchun yoqilgan', icon: Key },
  { name: 'Parol siyosati', status: 'pass', detail: 'Kuchli (8+ belgi, simbol)', icon: Shield },
  { name: 'Rate Limiting', status: 'pass', detail: '100 req/min per IP', icon: Globe },
  { name: 'SQL Injection', status: 'pass', detail: 'Parameterized queries', icon: CheckCircle2 },
  { name: 'XSS Protection', status: 'pass', detail: 'CSP header faol', icon: Shield },
  { name: 'Brute Force', status: 'warn', detail: '5 urinishdan keyin bloklash', icon: AlertTriangle },
  { name: 'Backup Shifrlash', status: 'pass', detail: 'AES-256', icon: Lock },
]

const RECENT_INCIDENTS = [
  { id: 1, type: 'suspicious_login', user: 'unknown@203.45.87.12', detail: '5 ta noto\'g\'ri parol urinishi', severity: 'medium', time: '2s oldin', resolved: true },
  { id: 2, type: 'api_abuse', user: 'bot-user-42', detail: 'Rate limit oshirildi (200 req/min)', severity: 'high', time: '4s oldin', resolved: true },
  { id: 3, type: 'password_reset', user: 'malika@edu.uz', detail: 'Parol qayta tiklash so\'rovi', severity: 'low', time: '1k oldin', resolved: false },
  { id: 4, type: 'admin_action', user: 'admin@edu.uz', detail: 'Foydalanuvchi bloklandi', severity: 'low', time: '2k oldin', resolved: true },
]

const SEVERITY_COLOR = {
  low: 'text-sky-400',
  medium: 'text-amber-400',
  high: 'text-rose-400',
}

export default function SecurityPage() {
  const passed = SECURITY_CHECKS.filter(c => c.status === 'pass').length
  const total = SECURITY_CHECKS.length
  const score = Math.round((passed / total) * 100)

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-base-100">Xavfsizlik</h1>
        <p className="text-sm text-base-500 mt-1">Tizim xavfsizligi auditi va incidentlar</p>
      </div>

      {/* Security Score */}
      <div className="card p-6 border-emerald-500/20">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle cx="56" cy="56" r="50" stroke="#1E1E24" strokeWidth="8" fill="none" />
              <circle cx="56" cy="56" r="50" stroke="#10B981" strokeWidth="8" fill="none"
                strokeDasharray={`${(score / 100) * 314} 314`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400">{score}</div>
                <div className="text-xs text-base-600 text-center">/100</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-base-100">Xavfsizlik Holati: A+</h2>
            </div>
            <p className="text-sm text-base-500">
              {passed}/{total} tekshiruv o'tdi. Tizimingiz yaxshi himoyalangan.
            </p>
            <div className="flex gap-2 mt-3">
              <span className="badge-emerald">SSL A+</span>
              <span className="badge-emerald">OWASP Compliant</span>
              <span className="badge-emerald">GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Checks */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Xavfsizlik Tekshiruvlari</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {SECURITY_CHECKS.map(c => (
            <div key={c.name} className={`p-4 rounded-xl border flex items-start gap-3
              ${c.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${c.status === 'pass' ? 'bg-emerald-500/15' : 'bg-amber-500/15'}`}>
                {c.status === 'pass'
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400" />
                }
              </div>
              <div>
                <div className="text-sm font-medium text-base-200">{c.name}</div>
                <div className="text-xs text-base-500 mt-0.5">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">So'nggi Hodisalar</h2>
          <span className="badge bg-base-800 text-base-400 border border-base-700">{RECENT_INCIDENTS.length} ta</span>
        </div>
        <div className="space-y-2">
          {RECENT_INCIDENTS.map(i => (
            <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1F] hover:bg-[#222229] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#0D0D10] flex items-center justify-center">
                {i.type === 'suspicious_login' && <UserX className={`w-4 h-4 ${SEVERITY_COLOR[i.severity as keyof typeof SEVERITY_COLOR]}`} />}
                {i.type === 'api_abuse' && <Globe className={`w-4 h-4 ${SEVERITY_COLOR[i.severity as keyof typeof SEVERITY_COLOR]}`} />}
                {i.type === 'password_reset' && <Key className={`w-4 h-4 ${SEVERITY_COLOR[i.severity as keyof typeof SEVERITY_COLOR]}`} />}
                {i.type === 'admin_action' && <Shield className={`w-4 h-4 ${SEVERITY_COLOR[i.severity as keyof typeof SEVERITY_COLOR]}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-base-200 truncate">{i.detail}</div>
                <div className="text-xs text-base-600">{i.user} · {i.time}</div>
              </div>
              {i.resolved ? (
                <span className="badge-emerald text-xs">Hal qilingan</span>
              ) : (
                <span className="badge-amber text-xs">Kutilmoqda</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-5 border-accent-600/20">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-accent-400" />
          <h2 className="section-title">AI Xavfsizlik Tavsiyalari</h2>
        </div>
        <div className="space-y-2 text-sm text-base-400">
          <div className="flex gap-2 p-3 rounded-xl bg-[#1A1A1F]">
            <div className="w-5 h-5 rounded-full bg-accent-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-accent-400">1</div>
            <p>Barcha o'qituvchilar uchun 2FA majburiy qilish tavsiya etiladi. Ayni paytda faqat adminlar uchun yoqilgan.</p>
          </div>
          <div className="flex gap-2 p-3 rounded-xl bg-[#1A1A1F]">
            <div className="w-5 h-5 rounded-full bg-accent-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-accent-400">2</div>
            <p>Parol muddati 90 kundan ortiq bo'lgan 34 ta foydalanuvchi aniqlandi. Parol yangilash so'rovi yuborilsin.</p>
          </div>
          <div className="flex gap-2 p-3 rounded-xl bg-[#1A1A1F]">
            <div className="w-5 h-5 rounded-full bg-accent-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-accent-400">3</div>
            <p>203.45.87.12 IP manzilidan g'ayrioddiy faoliyat aniqlandi. Bu IP ni qora ro'yxatga qo'shishni ko'rib chiqing.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
