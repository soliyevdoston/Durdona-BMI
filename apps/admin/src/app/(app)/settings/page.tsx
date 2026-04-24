'use client'
import { useState } from 'react'
import { Save, Globe, Mail, Shield, Bell, Database, Palette, Languages } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('general')

  const TABS = [
    { id: 'general', label: 'Umumiy', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'appearance', label: 'Ko\'rinish', icon: Palette },
  ]

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Tizim Sozlamalari</h1>
          <p className="text-sm text-base-500 mt-1">Platforma konfiguratsiyasi</p>
        </div>
        <button onClick={save} className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saqlandi!' : 'Saqlash'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">
        {/* Sidebar */}
        <div className="card p-3 h-fit">
          <div className="space-y-0.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${tab === t.id ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' : 'text-base-400 hover:text-base-200 hover:bg-[#1A1A1F]'}`}>
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="card p-6 space-y-5">
          {tab === 'general' && (
            <>
              <h2 className="font-semibold text-base-100 text-lg">Umumiy Sozlamalar</h2>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Platforma Nomi</label>
                <input className="input" defaultValue="EduCode — AKT Virtual Classroom" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Domen</label>
                <input className="input" defaultValue="educode.uz" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Til</label>
                  <select className="input">
                    <option>O'zbek</option>
                    <option>Русский</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Vaqt zonasi</label>
                  <select className="input">
                    <option>Asia/Tashkent (UTC+5)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Tavsif</label>
                <textarea className="input min-h-[80px] resize-none" defaultValue="O'zbekiston Respublikasi uchun zamonaviy AKT ta'lim platformasi" />
              </div>
            </>
          )}

          {tab === 'email' && (
            <>
              <h2 className="font-semibold text-base-100 text-lg">Email Konfiguratsiya</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">SMTP Host</label>
                  <input className="input" defaultValue="smtp.sendgrid.net" />
                </div>
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Port</label>
                  <input className="input" defaultValue="587" />
                </div>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">From Email</label>
                <input className="input" defaultValue="noreply@educode.uz" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">API Key</label>
                <input className="input code-font" type="password" defaultValue="••••••••••••••••••" />
              </div>
              <button className="btn-secondary">Test Email Yuborish</button>
            </>
          )}

          {tab === 'security' && (
            <>
              <h2 className="font-semibold text-base-100 text-lg">Xavfsizlik Siyosati</h2>
              {[
                { label: 'Ikki bosqichli autentifikatsiya (2FA)', desc: 'Barcha admin hisoblar uchun majburiy', on: true },
                { label: 'Kuchli parol talabi', desc: 'Minimum 8 belgi, raqam va simvol', on: true },
                { label: 'Avtomatik chiqish', desc: '30 daqiqa faoliyatsizlikdan so\'ng', on: true },
                { label: 'Login urinishlarini cheklash', desc: '5 ta noto\'g\'ri urinishdan keyin blok', on: true },
                { label: 'IP oq ro\'yxat', desc: 'Faqat ishonchli IP manzillar', on: false },
                { label: 'Audit log saqlash', desc: 'Barcha tizim harakatlarini yozib olish', on: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1F]">
                  <div>
                    <div className="text-sm text-base-200">{s.label}</div>
                    <div className="text-xs text-base-500">{s.desc}</div>
                  </div>
                  <button className={`relative w-10 h-6 rounded-full transition-colors ${s.on ? 'bg-emerald-600' : 'bg-base-700'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${s.on ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </>
          )}

          {tab === 'notifications' && (
            <>
              <h2 className="font-semibold text-base-100 text-lg">Bildirishnoma Sozlamalari</h2>
              {[
                'Yangi foydalanuvchi ro\'yxatdan o\'tdi',
                'Server yukligi 80% dan oshdi',
                'Backup muvaffaqiyatli',
                'Xavfsizlik hodisasi',
                'Yangi kurs yaratildi',
                'To\'lov qabul qilindi',
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1F]">
                  <div className="text-sm text-base-200">{n}</div>
                  <div className="flex gap-3 text-xs">
                    <label className="flex items-center gap-1.5 text-base-400">
                      <input type="checkbox" defaultChecked className="rounded border-[#27272A] bg-[#0D0D10]" /> Email
                    </label>
                    <label className="flex items-center gap-1.5 text-base-400">
                      <input type="checkbox" defaultChecked className="rounded border-[#27272A] bg-[#0D0D10]" /> Push
                    </label>
                    <label className="flex items-center gap-1.5 text-base-400">
                      <input type="checkbox" className="rounded border-[#27272A] bg-[#0D0D10]" /> SMS
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'database' && (
            <>
              <h2 className="font-semibold text-base-100 text-lg">Database Sozlamalari</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">DB Host</label>
                  <input className="input" defaultValue="postgres.internal" />
                </div>
                <div>
                  <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Port</label>
                  <input className="input" defaultValue="5432" />
                </div>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Database Nomi</label>
                <input className="input" defaultValue="educode_production" />
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Connection Pool</label>
                <input className="input" type="number" defaultValue="100" />
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400">
                ✓ Database ulangan · PostgreSQL 16.2 · 248 ta aktiv ulanish
              </div>
            </>
          )}

          {tab === 'appearance' && (
            <>
              <h2 className="font-semibold text-base-100 text-lg">Ko'rinish Sozlamalari</h2>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Asosiy Rang (Accent)</label>
                <div className="flex gap-2">
                  {['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'].map(c => (
                    <button key={c} className="w-10 h-10 rounded-xl border-2 border-transparent hover:border-white/20"
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Tema</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Dark', 'Light', 'Auto'].map(t => (
                    <button key={t} className={`p-4 rounded-xl border text-sm font-medium transition-all
                      ${t === 'Dark' ? 'border-emerald-600/40 bg-emerald-600/10 text-emerald-400' : 'border-[#27272A] text-base-400 hover:border-[#3F3F46]'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Logo</label>
                <div className="border-2 border-dashed border-[#27272A] rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">EC</span>
                  </div>
                  <button className="text-xs text-emerald-400 hover:text-emerald-300">Yangi logo yuklash</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
