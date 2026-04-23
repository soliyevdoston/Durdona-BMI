'use client'
import { useState } from 'react'
import { Plus, Search, Filter, Eye, Clock, CheckCircle2, Users, ChevronRight, MoreVertical, Star, FileText } from 'lucide-react'
import { ASSIGNMENTS, STUDENTS } from '@/lib/data'
import { formatDate } from '@/lib/utils'

const TEACHER_ASSIGNMENTS = [
  { id: 'ta-1', title: 'Python: Kalkulyator yaratish', course: 'Python Asoslari', dueDate: '2026-04-25', submissions: 18, total: 25, avgGrade: 82, status: 'active' },
  { id: 'ta-2', title: 'SQL: Ma\'lumotlar Bazasini Loyihalash', course: 'SQL & DB', dueDate: '2026-04-28', submissions: 12, total: 20, avgGrade: 0, status: 'active' },
  { id: 'ta-3', title: 'HTML/CSS: Portfolio Sayti', course: 'Web Dasturlash', dueDate: '2026-04-22', submissions: 35, total: 42, avgGrade: 88, status: 'grading' },
  { id: 'ta-4', title: 'Python: Ro\'yxatlar Qo\'llash', course: 'Python Asoslari', dueDate: '2026-04-15', submissions: 25, total: 25, avgGrade: 86, status: 'completed' },
  { id: 'ta-5', title: 'Tarmoq: Protokollar Testi', course: 'Kompyuter Tarmoqlari', dueDate: '2026-04-10', submissions: 15, total: 18, avgGrade: 74, status: 'completed' },
]

const PENDING_SUBMISSIONS = [
  { studentId: 's-001', name: 'Azizbek Karimov', avatar: 'AK', submittedAt: '2026-04-22T14:30', assignment: 'Python: Kalkulyator' },
  { studentId: 's-003', name: 'Jasur Raxmatullayev', avatar: 'JR', submittedAt: '2026-04-22T16:15', assignment: 'Python: Kalkulyator' },
  { studentId: 's-005', name: 'Bobur Xolmatov', avatar: 'BX', submittedAt: '2026-04-23T09:45', assignment: 'Python: Kalkulyator' },
]

export default function TeacherAssignmentsPage() {
  const [tab, setTab] = useState<'active' | 'grading' | 'completed'>('active')
  const [search, setSearch] = useState('')

  const filtered = TEACHER_ASSIGNMENTS.filter(a => a.status === tab && a.title.toLowerCase().includes(search.toLowerCase()))
  const grading = TEACHER_ASSIGNMENTS.filter(a => a.status === 'grading').length
  const active = TEACHER_ASSIGNMENTS.filter(a => a.status === 'active').length

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Topshiriqlar</h1>
          <p className="text-sm text-base-500 mt-1">{grading} baholash kutilmoqda · {active} faol</p>
        </div>
        <button className="btn-primary bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yangi Topshiriq
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faol', value: active, icon: Clock, color: 'text-sky-400' },
          { label: 'Baholash', value: grading, icon: FileText, color: 'text-amber-400' },
          { label: "Tugatilgan", value: TEACHER_ASSIGNMENTS.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: "O'rtacha Ball", value: '83.5', icon: Star, color: 'text-accent-400' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-base-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Submissions Alert */}
      {PENDING_SUBMISSIONS.length > 0 && (
        <div className="card p-5 border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-base-200">Baholash Kutilmoqda</div>
                <div className="text-xs text-base-500">{PENDING_SUBMISSIONS.length} ta yangi topshiriq</div>
              </div>
            </div>
            <button className="text-xs text-amber-400 hover:text-amber-300">Barchasini ko'rish</button>
          </div>
          <div className="space-y-2">
            {PENDING_SUBMISSIONS.map((s) => (
              <div key={s.studentId} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1F] hover:bg-[#222229] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400">
                    {s.avatar}
                  </div>
                  <div>
                    <div className="text-sm text-base-200">{s.name}</div>
                    <div className="text-xs text-base-600">{s.assignment}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-base-500">{formatDate(s.submittedAt)}</span>
                  <button className="btn-primary bg-sky-600 hover:bg-sky-700 text-xs py-1.5 px-3 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Baholash
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-1 p-1 bg-[#111113] border border-[#1E1E24] rounded-xl">
          {[
            { id: 'active', label: `Faol (${active})` },
            { id: 'grading', label: `Baholash (${grading})` },
            { id: 'completed', label: 'Tugatilgan' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id ? 'bg-[#1A1A1F] text-base-100' : 'text-base-500 hover:text-base-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Qidirish..." />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="card p-5 hover:border-sky-600/30 transition-all group">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="text-xs text-base-600 mb-1">{a.course}</div>
                <h3 className="font-semibold text-base-100 group-hover:text-sky-400 transition-colors">{a.title}</h3>
              </div>
              <button className="text-base-600 hover:text-base-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-base-500 mb-1.5">
                <span>{a.submissions}/{a.total} topshirildi</span>
                <span>{Math.round((a.submissions / a.total) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(a.submissions / a.total) * 100}%` }} />
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-base-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDate(a.dueDate)}
                </span>
                <span className="text-base-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {a.total}
                </span>
              </div>
              {a.avgGrade > 0 && (
                <div className={`font-medium ${a.avgGrade >= 85 ? 'text-emerald-400' : a.avgGrade >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  O'rt: {a.avgGrade}/100
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-[#1E1E24]">
              <button className="btn-ghost border border-[#27272A] flex-1 text-xs py-2 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" /> Ko'rish
              </button>
              <button className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 text-xs py-2 flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" /> Baholash
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
