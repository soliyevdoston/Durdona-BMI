'use client'
import { useState } from 'react'
import { Search, Filter, Download, AlertTriangle, Info, CheckCircle2, XCircle, User, Server } from 'lucide-react'

const LOGS = [
  { id: 1, level: 'info', type: 'auth', user: 'azizbek@edu.uz', action: 'Tizimga kirdi', ip: '192.168.1.24', time: '2026-04-23 14:32:18' },
  { id: 2, level: 'success', type: 'course', user: 'dilnoza@edu.uz', action: 'Yangi kurs yaratdi: Data Structures', ip: '10.0.0.5', time: '2026-04-23 14:15:42' },
  { id: 3, level: 'warn', type: 'system', user: 'system', action: 'Xotira 70% ga yetdi', ip: 'localhost', time: '2026-04-23 14:00:00' },
  { id: 4, level: 'error', type: 'api', user: 'system', action: 'AI Service 500ms+ kechikdi', ip: 'ai-service', time: '2026-04-23 13:45:22' },
  { id: 5, level: 'info', type: 'assignment', user: 'malika@edu.uz', action: 'Topshiriq yubordi: Python Kalkulyator', ip: '192.168.1.35', time: '2026-04-23 13:30:15' },
  { id: 6, level: 'success', type: 'backup', user: 'system', action: 'Avtomatik backup muvaffaqiyatli', ip: 'localhost', time: '2026-04-23 03:00:00' },
  { id: 7, level: 'warn', type: 'auth', user: 'unknown', action: 'Noto\'g\'ri parol urinishi (5x)', ip: '203.45.87.12', time: '2026-04-23 02:15:33' },
  { id: 8, level: 'info', type: 'user', user: 'admin@edu.uz', action: 'Foydalanuvchini blokladi: spam-bot-01', ip: '10.0.0.1', time: '2026-04-23 01:42:18' },
  { id: 9, level: 'success', type: 'deploy', user: 'system', action: 'Versiya v2.4.0 o\'rnatildi', ip: 'deploy-server', time: '2026-04-22 23:30:00' },
  { id: 10, level: 'error', type: 'payment', user: 'bobur@edu.uz', action: 'To\'lov muvaffaqiyatsiz: Insufficient funds', ip: '192.168.1.42', time: '2026-04-22 22:15:40' },
]

const LEVEL_CONFIG = {
  info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  warn: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  error: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
}

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<'all' | keyof typeof LEVEL_CONFIG>('all')

  const filtered = LOGS
    .filter(l => level === 'all' || l.level === level)
    .filter(l =>
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Tizim Loglari</h1>
          <p className="text-sm text-base-500 mt-1">{LOGS.length} ta yozuv · Real vaqt rejimida</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Yuklab olish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['info', 'success', 'warn', 'error'] as const).map(lv => {
          const cfg = LEVEL_CONFIG[lv]
          const count = LOGS.filter(l => l.level === lv).length
          const Icon = cfg.icon
          return (
            <div key={lv} className={`card p-4 border ${cfg.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${cfg.color}`} />
                <span className="text-xs text-base-500 uppercase tracking-wider">{lv}</span>
              </div>
              <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Logs qidirish..." />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value as any)} className="input w-auto">
          <option value="all">Barcha darajalar</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Logs */}
      <div className="card overflow-hidden">
        {filtered.map(log => {
          const cfg = LEVEL_CONFIG[log.level as keyof typeof LEVEL_CONFIG]
          const Icon = cfg.icon
          return (
            <div key={log.id} className="flex items-center gap-3 p-3 border-b border-[#1E1E24] last:border-b-0 hover:bg-[#1A1A1F]/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.border} border`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`badge ${cfg.bg} ${cfg.color} border ${cfg.border} text-xs uppercase`}>
                    {log.level}
                  </span>
                  <span className="badge bg-base-800 text-base-500 border border-base-700 text-xs">{log.type}</span>
                  <span className="text-xs text-base-400 truncate">{log.action}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-base-600">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.user}</span>
                  <span className="flex items-center gap-1"><Server className="w-3 h-3" />{log.ip}</span>
                </div>
              </div>
              <div className="text-xs text-base-700 flex-shrink-0 code-font">
                {log.time}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
