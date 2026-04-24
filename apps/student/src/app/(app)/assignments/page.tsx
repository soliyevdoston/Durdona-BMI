'use client'
import { useState } from 'react'
import {
  Clock, CheckCircle2, AlertCircle, XCircle,
  Upload, Code2, FileQuestion, FolderGit2, ChevronRight,
  Calendar, Star
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { formatDate } from '@/lib/utils'

interface Assignment {
  id: string
  title: string
  course?: string
  description: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'late'
  grade?: number
  maxGrade: number
  type: 'coding' | 'quiz' | 'project'
}

const STATUS_CONFIG = {
  pending:   { label: 'Kutilmoqda', color: 'badge-amber', icon: Clock },
  submitted: { label: 'Topshirildi', color: 'badge-sky', icon: CheckCircle2 },
  graded:    { label: 'Baholandi', color: 'badge-emerald', icon: Star },
  late:      { label: 'Kechikdi', color: 'badge-rose', icon: XCircle },
}
const TYPE_CONFIG = {
  coding:  { label: 'Kod', icon: Code2, color: 'text-sky-400' },
  quiz:    { label: 'Test', icon: FileQuestion, color: 'text-amber-400' },
  project: { label: 'Loyiha', icon: FolderGit2, color: 'text-accent-400' },
}

function AssignmentCard({ a, onOpen }: { a: Assignment; onOpen: () => void }) {
  const st = STATUS_CONFIG[a.status]
  const tp = TYPE_CONFIG[a.type]
  const StIcon = st.icon
  const TpIcon = tp.icon
  const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000)

  return (
    <div className="card p-5 hover:border-[#3F3F46] transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-[#1A1A1F] flex items-center justify-center`}>
            <TpIcon className={`w-4 h-4 ${tp.color}`} />
          </div>
          <div>
            <div className="text-xs text-base-600">{tp.label} · {a.course}</div>
          </div>
        </div>
        <span className={`badge ${st.color} flex-shrink-0`}>
          <StIcon className="w-3 h-3" />
          {st.label}
        </span>
      </div>

      <h3 className="font-semibold text-base-100 mb-2 group-hover:text-accent-400 transition-colors">{a.title}</h3>
      <p className="text-xs text-base-500 leading-relaxed mb-4 line-clamp-2">{a.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-base-600">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.dueDate)}</span>
          {a.status === 'pending' && daysLeft > 0 && (
            <span className={`${daysLeft <= 2 ? 'text-rose-400' : 'text-base-500'}`}>
              {daysLeft} kun qoldi
            </span>
          )}
        </div>
        {a.status === 'graded' && a.grade !== undefined ? (
          <div className="flex items-center gap-1">
            <span className={`text-lg font-bold ${a.grade >= 90 ? 'text-emerald-400' : a.grade >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
              {a.grade}
            </span>
            <span className="text-xs text-base-600">/{a.maxGrade}</span>
          </div>
        ) : (
          <button onClick={onOpen}
            className="flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 transition-colors">
            {a.status === 'pending' ? 'Topshirish' : 'Ko\'rish'}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

function SubmitModal({ assignment, onClose }: { assignment: Assignment; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [text, setText] = useState('')
  const tp = TYPE_CONFIG[assignment.type]
  const TpIcon = tp.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card-elevated p-6 animate-slide-up shadow-card-hover">
        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1F] flex items-center justify-center">
                <TpIcon className={`w-5 h-5 ${tp.color}`} />
              </div>
              <div>
                <h2 className="font-semibold text-base-100">{assignment.title}</h2>
                <p className="text-xs text-base-500">{assignment.course} · {tp.label}</p>
              </div>
            </div>

            <p className="text-sm text-base-400 mb-4 leading-relaxed">{assignment.description}</p>

            {assignment.type === 'coding' && (
              <div className="mb-4">
                <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Kodingiz</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                  className="w-full h-40 bg-[#0D0D10] border border-[#27272A] rounded-xl p-3 text-xs code-font text-emerald-400 resize-none focus:outline-none focus:border-accent-600"
                  placeholder="# Kodingizni shu yerga kiriting..." />
              </div>
            )}

            {assignment.type === 'project' && (
              <div className="mb-4">
                <div className="border-2 border-dashed border-[#27272A] rounded-xl p-8 text-center hover:border-accent-600/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-base-700 mx-auto mb-2" />
                  <p className="text-sm text-base-500">Fayllarni yuklash uchun bosing</p>
                  <p className="text-xs text-base-700 mt-1">.zip, .pdf, .docx — max 50MB</p>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Izoh (ixtiyoriy)</label>
              <textarea className="input h-20 resize-none" placeholder="O'qituvchiga izoh..." />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1 py-2.5">Bekor</button>
              <button onClick={() => setSubmitted(true)} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Topshirish
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-base-100 mb-2">Topshirildi!</h2>
            <p className="text-sm text-base-500 mb-6">Ishingiz o'qituvchiga yuborildi. Baho kelganda xabardor qilinasiz.</p>
            <div className="badge-emerald inline-flex">+25 XP qo'shildi</div>
            <button onClick={onClose} className="btn-secondary w-full mt-4 py-2.5">Yopish</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | Assignment['status']>('all')
  const [selected, setSelected] = useState<Assignment | null>(null)

  const { data, loading } = useApi(() => api.myAssignments())
  const assignments: Assignment[] = data || []

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

  const pending = assignments.filter(a => a.status === 'pending').length
  const submitted = assignments.filter(a => a.status === 'submitted').length
  const graded = assignments.filter(a => a.status === 'graded').length
  const graded_list = assignments.filter(a => a.grade !== undefined)
  const avgGrade = graded_list.reduce((s, a) => s + (a.grade ?? 0), 0) / (graded_list.length || 1)

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-base-100">Topshiriqlar</h1>
        <p className="text-sm text-base-500 mt-1">Barcha topshiriqlar va ularning holati</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Kutilmoqda', value: pending, color: 'text-amber-400', icon: Clock },
          { label: 'Topshirildi', value: submitted, color: 'text-sky-400', icon: CheckCircle2 },
          { label: 'Baholandi', value: graded, color: 'text-emerald-400', icon: Star },
          { label: "O'rtacha Ball", value: avgGrade.toFixed(0), color: 'text-accent-400', icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-base-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Barchasi' },
          { id: 'pending', label: 'Kutilmoqda' },
          { id: 'submitted', label: 'Topshirildi' },
          { id: 'graded', label: 'Baholandi' },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${filter === f.id ? 'bg-accent-600/20 text-accent-400 border border-accent-600/30' : 'text-base-500 hover:text-base-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <AssignmentCard key={a.id} a={a} onOpen={() => setSelected(a)} />
        ))}
      </div>

      {selected && <SubmitModal assignment={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
