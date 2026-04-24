'use client'
import { useState } from 'react'
import {
  Search, Filter, MessageSquare, Mail, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Flame, Star, ChevronRight, ArrowUpDown
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { formatDate } from '@/lib/utils'

interface Student {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  progress: number
  streak: number
  lastActive: string
  risk: 'low' | 'medium' | 'high'
  courses: string[]
  completedTasks: number
  totalTasks: number
}

const RISK_CONFIG = {
  low: { label: 'Past', color: 'badge-emerald' },
  medium: { label: 'O\'rta', color: 'badge-amber' },
  high: { label: 'Yuqori', color: 'badge-rose' },
}

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | Student['risk']>('all')
  const [selected, setSelected] = useState<Student | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'xp'>('progress')

  const { data, loading } = useApi(() => api.students())
  const { data: allCourses } = useApi(() => api.courses())
  const STUDENTS: Student[] = data || []

  const filtered = STUDENTS
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => filter === 'all' || s.risk === filter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'progress') return b.progress - a.progress
      return b.xp - a.xp
    })

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-base-100">Talabalar</h1>
        <p className="text-sm text-base-500 mt-1">{STUDENTS.length} ta talaba · {STUDENTS.filter(s => s.risk === 'high').length} xavfli</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami Talabalar', value: STUDENTS.length, color: 'text-sky-400' },
          { label: 'Yuqori Natija', value: STUDENTS.filter(s => s.progress >= 70).length, color: 'text-emerald-400' },
          { label: "O'rta Natija", value: STUDENTS.filter(s => s.progress >= 40 && s.progress < 70).length, color: 'text-amber-400' },
          { label: 'Xavfli Talaba', value: STUDENTS.filter(s => s.risk === 'high').length, color: 'text-rose-400' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="text-xs text-base-500 uppercase tracking-wider mb-2">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Talaba qidirish..." />
        </div>
        <div className="flex gap-2">
          {(['all', 'low', 'medium', 'high'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border
                ${filter === f ? 'bg-sky-600/15 text-sky-400 border-sky-600/40' : 'bg-[#1A1A1F] text-base-400 border-[#27272A] hover:text-base-200'}`}>
              {f === 'all' ? 'Barchasi' : RISK_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E24] bg-[#0D0D10]">
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">
                  <button onClick={() => setSortBy('name')} className="flex items-center gap-1 hover:text-base-300">
                    Talaba <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Daraja</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">
                  <button onClick={() => setSortBy('progress')} className="flex items-center gap-1 hover:text-base-300">
                    Progress <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Vazifalar</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Seriya</th>
                <th className="text-left px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Holat</th>
                <th className="text-right px-4 py-3 text-xs text-base-500 uppercase tracking-wider font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-[#1E1E24] hover:bg-[#1A1A1F]/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
                        ${s.risk === 'high' ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400' :
                          s.risk === 'medium' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400' :
                          'bg-sky-500/20 border border-sky-500/30 text-sky-400'}`}>
                        {s.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-base-200">{s.name}</div>
                        <div className="text-xs text-base-600">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span className="text-sm text-base-200 font-medium">{s.level}</span>
                      <span className="text-xs text-base-600">({s.xp} XP)</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="progress-bar w-20">
                        <div className={`h-full rounded-full ${s.progress >= 70 ? 'bg-emerald-500' : s.progress >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-base-400 font-medium">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-base-300">{s.completedTasks}/{s.totalTasks}</span>
                  </td>
                  <td className="px-4 py-4">
                    {s.streak > 0 ? (
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <Flame className="w-3.5 h-3.5" />
                        {s.streak} kun
                      </div>
                    ) : (
                      <span className="text-xs text-base-700">Yo'q</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge ${RISK_CONFIG[s.risk].color} text-xs`}>
                      {s.risk === 'high' && <AlertTriangle className="w-3 h-3" />}
                      {s.risk === 'low' && <CheckCircle2 className="w-3 h-3" />}
                      {RISK_CONFIG[s.risk].label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelected(s)}
                        className="p-1.5 rounded-lg hover:bg-[#222229] text-base-500 hover:text-base-200 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-2xl card-elevated shadow-card-hover animate-slide-up overflow-hidden">
            <div className="p-6 border-b border-[#27272A]">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold
                  ${selected.risk === 'high' ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400' :
                    selected.risk === 'medium' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400' :
                    'bg-sky-500/20 border border-sky-500/30 text-sky-400'}`}>
                  {selected.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-base-100">{selected.name}</h2>
                  <p className="text-sm text-base-500">{selected.email}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Daraja', value: selected.level, color: 'text-amber-400' },
                  { label: 'XP', value: selected.xp.toLocaleString(), color: 'text-sky-400' },
                  { label: 'Progress', value: `${selected.progress}%`, color: 'text-emerald-400' },
                  { label: 'Seriya', value: `${selected.streak}k`, color: 'text-rose-400' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-[#0D0D10]">
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-base-600 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Yozilgan Kurslar</div>
                <div className="space-y-2">
                  {selected.courses.map(cid => {
                    const course = (allCourses || []).find((c: any) => c.id === cid)
                    if (!course) return null
                    return (
                      <div key={cid} className="flex items-center justify-between p-3 rounded-xl bg-[#0D0D10]">
                        <div className="text-sm text-base-200">{course.title}</div>
                        <div className="text-xs text-base-500">{course.category}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-base-500 uppercase tracking-wider mb-2">Vazifalar</div>
                <div className="progress-bar h-2 mb-2">
                  <div className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${(selected.completedTasks / selected.totalTasks) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs text-base-500">
                  <span>{selected.completedTasks} bajarildi</span>
                  <span>{selected.totalTasks - selected.completedTasks} kutilmoqda</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5">
                  <MessageSquare className="w-4 h-4" /> Xabar yuborish
                </button>
                <button className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 flex items-center justify-center gap-2 py-2.5">
                  <TrendingUp className="w-4 h-4" /> Tahlil ko'rish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
