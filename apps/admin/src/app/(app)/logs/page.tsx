'use client'
import { useState } from 'react'
import { Search, Download, AlertTriangle, Info, CheckCircle2, XCircle, User, Server } from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

const LEVEL_CONFIG = {
  info:    { icon: Info,         color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  warn:    { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  error:   { icon: XCircle,      color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
}

function getLogLevel(action: string): keyof typeof LEVEL_CONFIG {
  const a = action.toLowerCase()
  if (a.includes('error') || a.includes('fail') || a.includes('xato')) return 'error'
  if (a.includes('warn') || a.includes('limit') || a.includes('urinish')) return 'warn'
  if (a.includes('login') || a.includes('register') || a.includes('create') || a.includes('lesson') || a.includes('enroll') || a.includes('code') || a.includes('ai')) return 'success'
  return 'info'
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'medium' })
  } catch {
    return iso
  }
}

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<'all' | keyof typeof LEVEL_CONFIG>('all')

  const { data } = useApi(() => api.systemLogs(100))
  const rawLogs: any[] = data || []

  const logs = rawLogs.map(l => ({
    id: l.id,
    action: l.action,
    user: l.user?.name || l.user?.email || 'Tizim',
    ip: l.ip || '—',
    time: l.createdAt,
    level: getLogLevel(l.action),
    type: l.action.split('.')[0] || 'system',
  }))

  const filtered = logs
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
          <p className="text-sm text-base-500 mt-1">{logs.length} ta yozuv · Real vaqt rejimida</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Yuklab olish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['info', 'success', 'warn', 'error'] as const).map(lv => {
          const cfg = LEVEL_CONFIG[lv]
          const count = logs.filter(l => l.level === lv).length
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
        {filtered.length === 0 ? (
          <p className="text-xs text-base-600 text-center py-8">Log yozuvlari topilmadi</p>
        ) : filtered.map(log => {
          const cfg = LEVEL_CONFIG[log.level]
          const Icon = cfg.icon
          return (
            <div key={log.id} className="flex items-center gap-3 p-3 border-b border-[#1E1E24] last:border-b-0 hover:bg-[#1A1A1F]/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.border} border flex-shrink-0`}>
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
                  {log.ip !== '—' && <span className="flex items-center gap-1"><Server className="w-3 h-3" />{log.ip}</span>}
                </div>
              </div>
              <div className="text-xs text-base-700 flex-shrink-0 code-font">
                {formatTime(log.time)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
