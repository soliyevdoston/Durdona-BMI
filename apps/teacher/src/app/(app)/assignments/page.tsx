'use client'
import { useState } from 'react'
import {
  Plus, Search, Eye, Clock, CheckCircle2, Users, ChevronRight,
  MoreVertical, Star, FileText, X, Send, AlertCircle
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { formatDate } from '@/lib/utils'

function NewAssignmentModal({ courses, onClose, onSuccess }: {
  courses: any[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState(courses[0]?.id || '')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [type, setType] = useState('coding')
  const [maxGrade, setMaxGrade] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!title || !courseId || !dueDate) { setError("Sarlavha, kurs va muddat majburiy"); return }
    setLoading(true); setError(null)
    try {
      await api.createAssignment({ title, courseId, description, dueDate, type, maxGrade })
      onSuccess(); onClose()
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative w-full max-w-lg card-elevated p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-base-100">Yangi Topshiriq</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-base-500 hover:text-base-200" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Sarlavha *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="Topshiriq nomi" />
          </div>
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Kurs *</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)} className="input">
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
              {courses.length === 0 && <option value="">Kurs yo'q</option>}
            </select>
          </div>
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Tavsif</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className="input h-20 resize-none" placeholder="Topshiriq vazifasi..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Turi</label>
              <select value={type} onChange={e => setType(e.target.value)} className="input">
                <option value="coding">Kod</option>
                <option value="quiz">Test</option>
                <option value="project">Loyiha</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Muddat *</label>
              <input value={dueDate} onChange={e => setDueDate(e.target.value)} className="input" type="date" />
            </div>
          </div>
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Maksimal ball</label>
            <input value={maxGrade} onChange={e => setMaxGrade(Number(e.target.value))}
              className="input" type="number" min={1} max={200} />
          </div>
        </div>
        {error && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">{error}</div>
        )}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={loading} className="btn-secondary flex-1 py-2.5">Bekor</button>
          <button onClick={handleSubmit} disabled={loading || !courseId}
            className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Yaratilmoqda...' : 'Yaratish'}
          </button>
        </div>
      </div>
    </div>
  )
}

function GradeModal({ assignment, onClose, onSuccess }: {
  assignment: any
  onClose: () => void
  onSuccess: () => void
}) {
  const { data: submissions, loading } = useApi(() => api.assignmentSubmissions(assignment.id))
  const [grades, setGrades] = useState<Record<string, { grade: string; feedback: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const handleGrade = async (subId: string) => {
    const g = grades[subId]
    if (!g?.grade) return
    setSaving(subId)
    try {
      await api.gradeSubmission(subId, Number(g.grade), g.feedback || undefined)
      onSuccess()
      setSaving(null)
    } catch (e: any) { alert(e.message); setSaving(null) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl card-elevated p-6 animate-slide-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-base-100">{assignment.title}</h2>
            <p className="text-xs text-base-500">{assignment.course}</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-base-500 hover:text-base-200" /></button>
        </div>
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {loading && <div className="text-center py-8 text-base-600 text-sm">Yuklanmoqda...</div>}
          {!loading && (!submissions || submissions.length === 0) && (
            <div className="text-center py-8 text-base-600 text-sm">Hali topshirilmagan</div>
          )}
          {(submissions || []).map((sub: any) => {
            const g = grades[sub.id] || { grade: sub.grade?.toString() || '', feedback: sub.feedback || '' }
            const isGraded = sub.status === 'graded'
            return (
              <div key={sub.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400">
                      {sub.user.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-base-200">{sub.user.name}</div>
                      <div className="text-xs text-base-500">{formatDate(sub.submittedAt)}</div>
                    </div>
                  </div>
                  {isGraded && (
                    <span className="badge badge-emerald">Baholangan: {sub.grade}/{assignment.maxGrade}</span>
                  )}
                </div>
                <div className="bg-[#0D0D10] border border-[#1E1E24] rounded-xl p-3 text-xs text-base-400 font-mono mb-3 max-h-24 overflow-y-auto">
                  {sub.content}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number" min={0} max={assignment.maxGrade}
                    value={g.grade}
                    onChange={e => setGrades(prev => ({ ...prev, [sub.id]: { ...g, grade: e.target.value } }))}
                    className="input w-24" placeholder={`/${assignment.maxGrade}`}
                    disabled={isGraded}
                  />
                  <input
                    value={g.feedback}
                    onChange={e => setGrades(prev => ({ ...prev, [sub.id]: { ...g, feedback: e.target.value } }))}
                    className="input flex-1" placeholder="Izoh (ixtiyoriy)"
                    disabled={isGraded}
                  />
                  {!isGraded && (
                    <button
                      onClick={() => handleGrade(sub.id)}
                      disabled={!g.grade || saving === sub.id}
                      className="btn-primary bg-sky-600 hover:bg-sky-700 px-4 py-2 text-xs flex items-center gap-1.5 disabled:opacity-50">
                      {saving === sub.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                      Baho
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function TeacherAssignmentsPage() {
  const [tab, setTab] = useState<'active' | 'grading' | 'completed'>('active')
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [grading, setGrading] = useState<any | null>(null)

  const { data, refetch } = useApi(() => api.teachingAssignments())
  const { data: coursesData } = useApi(() => api.myCourses())
  const myCourses: any[] = coursesData || []

  const DATA: any[] = (data || []).map((a: any) => ({
    ...a,
    status: a.graded >= a.submissions && a.submissions > 0 && a.graded > 0
      ? 'completed'
      : a.submissions > a.graded ? 'grading' : 'active',
  }))

  const filtered = DATA.filter(a => a.status === tab && a.title.toLowerCase().includes(search.toLowerCase()))
  const pendingGrade = DATA.filter(a => a.status === 'grading').length
  const active = DATA.filter(a => a.status === 'active').length

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-100">Topshiriqlar</h1>
          <p className="text-sm text-base-500 mt-1">{pendingGrade} baholash kutilmoqda · {active} faol</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="btn-primary bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yangi Topshiriq
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faol', value: active, icon: Clock, color: 'text-sky-400' },
          { label: 'Baholash', value: pendingGrade, icon: AlertCircle, color: 'text-amber-400' },
          { label: 'Tugatilgan', value: DATA.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: "O'rtacha Ball", value: DATA.filter(a => a.avgGrade > 0).length > 0
            ? Math.round(DATA.filter(a => a.avgGrade > 0).reduce((s, a) => s + a.avgGrade, 0) / DATA.filter(a => a.avgGrade > 0).length)
            : '—', icon: Star, color: 'text-accent-400' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-base-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grading Alert */}
      {pendingGrade > 0 && (
        <div className="card p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-base-200">Baholash kutilmoqda</div>
              <div className="text-xs text-base-500">{pendingGrade} ta topshiriq baholanmagan</div>
            </div>
            <button onClick={() => setTab('grading')} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Ko'rish <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-1 p-1 bg-[#111113] border border-[#1E1E24] rounded-xl">
          {[
            { id: 'active', label: `Faol (${active})` },
            { id: 'grading', label: `Baholash (${pendingGrade})` },
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

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-base-600 text-sm">
            Bu bo'limda topshiriqlar yo'q
          </div>
        )}
        {filtered.map((a: any) => (
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

            <div className="mb-4">
              <div className="flex justify-between text-xs text-base-500 mb-1.5">
                <span>{a.submissions}/{a.total || '—'} topshirildi</span>
                {a.total > 0 && <span>{Math.round((a.submissions / a.total) * 100)}%</span>}
              </div>
              <div className="progress-bar">
                <div className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${a.total > 0 ? (a.submissions / a.total) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-3">
                <span className="text-base-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDate(a.dueDate)}
                </span>
                <span className="text-base-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {a.total || 0}
                </span>
              </div>
              {a.avgGrade > 0 && (
                <div className={`font-medium ${a.avgGrade >= 85 ? 'text-emerald-400' : a.avgGrade >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  O'rt: {a.avgGrade}/100
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-[#1E1E24]">
              <button onClick={() => setGrading(a)}
                className="btn-ghost border border-[#27272A] flex-1 text-xs py-2 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" /> Ko'rish
              </button>
              <button onClick={() => setGrading(a)}
                className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 text-xs py-2 flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" /> Baholash
              </button>
            </div>
          </div>
        ))}
      </div>

      {showNew && (
        <NewAssignmentModal courses={myCourses} onClose={() => setShowNew(false)} onSuccess={refetch} />
      )}
      {grading && (
        <GradeModal assignment={grading} onClose={() => setGrading(null)} onSuccess={() => { refetch(); }} />
      )}
    </div>
  )
}
