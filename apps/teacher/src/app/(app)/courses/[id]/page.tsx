'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft, Plus, Video, FileText, Code2, FileQuestion,
  Trash2, CheckCircle2, Upload, Play, Clock, Users, BookOpen,
  GripVertical, ExternalLink, Image as ImageIcon
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'

type LessonType = 'video' | 'text' | 'quiz' | 'practice'

const TYPE_ICON: Record<LessonType, any> = {
  video: Video, text: FileText, quiz: FileQuestion, practice: Code2,
}
const TYPE_LABEL: Record<LessonType, string> = {
  video: 'Video', text: 'Matn', quiz: 'Test', practice: 'Amaliyot',
}
const TYPE_COLOR: Record<LessonType, string> = {
  video: 'text-sky-400', text: 'text-base-400', quiz: 'text-amber-400', practice: 'text-emerald-400',
}

function getYouTubeId(url: string): string | null {
  const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\n]{11})/)
  return m ? m[1] : null
}

const EMPTY_FORM = {
  title: '', type: 'video' as LessonType, duration: '15',
  videoUrl: '', resourceName: '', resourceFile: null as File | null,
}

export default function TeacherCourseDetailPage() {
  const { id } = useParams()
  const { data: course, loading, refetch } = useApi(() => api.course(String(id)))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const lessons: any[] = course?.lessons || []

  const handleAdd = async () => {
    if (!form.title.trim()) return setError("Dars nomi kiritilmagan")
    setSaving(true); setError(null)
    try {
      await api.createLesson({
        courseId: String(id),
        title: form.title.trim(),
        type: form.type,
        duration: `${form.duration} daqiqa`,
        xpReward: 20,
        videoUrl: form.videoUrl || undefined,
      })
      setForm({ ...EMPTY_FORM })
      setShowForm(false)
      refetch()
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async (lessonId: string, title: string) => {
    if (!confirm(`"${title}" darsini o'chirishni tasdiqlaysizmi?`)) return
    setDeleting(lessonId)
    try { await api.deleteLesson(lessonId); refetch() } catch (e: any) { alert(e.message) }
    setDeleting(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-1.5">{[0,1,2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-base-700 animate-pulse" style={{ animationDelay: `${i*150}ms` }} />
      ))}</div>
    </div>
  )

  if (!course) return <div className="flex items-center justify-center h-64"><p className="text-base-500">Kurs topilmadi</p></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/courses" className="btn-ghost p-2">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-base-100 truncate">{course.title}</h1>
          <p className="text-xs text-base-500 mt-0.5">{course.category} · {course.difficulty}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(null) }}
          className="btn-primary bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Dars qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen, label: 'Darslar', value: lessons.length },
          { icon: Users,    label: "O'quvchilar", value: course.enrolled ?? 0 },
          { icon: Clock,    label: 'Davomiyligi', value: course.duration },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <s.icon className="w-4 h-4 text-base-500 flex-shrink-0" />
            <div>
              <div className="text-lg font-bold text-base-100">{s.value}</div>
              <div className="text-xs text-base-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lesson Form */}
      {showForm && (
        <div className="card p-5 border-sky-600/30 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base-100">Yangi Dars Qo'shish</h2>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5">✕</button>
          </div>

          {/* Dars turi */}
          <div>
            <label className="text-xs text-base-500 mb-2 block uppercase tracking-wider">Dars Turi</label>
            <div className="grid grid-cols-4 gap-2">
              {(['video','text','practice','quiz'] as LessonType[]).map(t => {
                const Icon = TYPE_ICON[t]
                return (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all
                      ${form.type === t ? 'bg-sky-600/10 border-sky-600/40 text-sky-400' : 'bg-[#1A1A1F] border-[#27272A] text-base-400 hover:border-[#3F3F46]'}`}>
                    <Icon className="w-4 h-4" /> {TYPE_LABEL[t]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Nomi va davomiyligi */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-base-500 mb-1.5 block">Dars Nomi *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="input" placeholder="Masalan: Kirish va asosiy tushunchalar" />
            </div>
            <div>
              <label className="text-xs text-base-500 mb-1.5 block">Davomiyligi (daq)</label>
              <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="input text-center" type="number" min="1" max="180" />
            </div>
          </div>

          {/* 1. Resurs yuklash — BIRINCHI */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <label className="text-xs text-amber-400 mb-2 block font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> 1. Dars Resursi (PDF yoki Word)
            </label>
            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm w-full
              ${form.resourceName
                ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400'
                : 'bg-[#1A1A1F] border-[#27272A] hover:border-amber-500/40 text-base-400 hover:text-base-200'}`}>
              {form.resourceName
                ? <><CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span className="truncate">{form.resourceName}</span></>
                : <><FileText className="w-4 h-4 text-amber-400 flex-shrink-0" /><span>Resurs faylini tanlang (PDF, DOC, DOCX)</span></>
              }
              <input type="file" accept=".pdf,.doc,.docx" className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) setForm(prev => ({ ...prev, resourceName: f.name, resourceFile: f }))
                }} />
            </label>
            <p className="text-xs text-base-600 mt-1.5">O'quvchilar bu faylni yuklab olishlari mumkin bo'ladi</p>
          </div>

          {/* 2. Video URL — IKKINCHI (faqat video uchun) */}
          {form.type === 'video' && (
            <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4">
              <label className="text-xs text-sky-400 mb-2 block font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> 2. Video Manzili (URL)
              </label>
              <input
                value={form.videoUrl}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                className="input"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {form.videoUrl && getYouTubeId(form.videoUrl) && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeId(form.videoUrl)}/mqdefault.jpg`}
                    alt="preview"
                    className="w-24 h-14 rounded-lg object-cover border border-[#27272A]"
                  />
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> YouTube video aniqlandi
                  </p>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Bekor qilish</button>
            <button onClick={handleAdd} disabled={saving || !form.title.trim()}
              className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Saqlanmoqda...' : 'Dars Qo\'shish'}
            </button>
          </div>
        </div>
      )}

      {/* Lessons List */}
      <div className="card p-5">
        <h2 className="font-semibold text-base-100 mb-4">Darslar ({lessons.length})</h2>
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-base-700 mx-auto mb-3" />
            <p className="text-sm text-base-500">Hali dars yo'q</p>
            <button onClick={() => setShowForm(true)}
              className="mt-3 text-xs text-sky-400 hover:text-sky-300 transition-colors">
              + Birinchi darsni qo'shing
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson: any, idx: number) => {
              const Icon = TYPE_ICON[lesson.type as LessonType] || Video
              const ytId = lesson.videoUrl ? getYouTubeId(lesson.videoUrl) : null
              return (
                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1F] border border-[#27272A] hover:border-[#3F3F46] transition-colors group">
                  <GripVertical className="w-4 h-4 text-base-700 flex-shrink-0" />
                  <div className="text-xs font-bold text-base-600 w-5 flex-shrink-0">{idx + 1}</div>

                  {/* Thumbnail yoki icon */}
                  {ytId ? (
                    <img src={`https://img.youtube.com/vi/${ytId}/default.jpg`} alt=""
                      className="w-10 h-7 rounded object-cover flex-shrink-0 border border-[#27272A]" />
                  ) : (
                    <div className="w-10 h-7 rounded bg-[#0D0D10] flex items-center justify-center flex-shrink-0 border border-[#27272A]">
                      <Icon className={`w-3.5 h-3.5 ${TYPE_COLOR[lesson.type as LessonType] || 'text-base-500'}`} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-base-100 truncate">{lesson.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs ${TYPE_COLOR[lesson.type as LessonType] || 'text-base-500'}`}>
                        {TYPE_LABEL[lesson.type as LessonType]}
                      </span>
                      <span className="text-xs text-base-600">{lesson.duration}</span>
                      {lesson.videoUrl && (
                        <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-0.5">
                          <ExternalLink className="w-2.5 h-2.5" /> URL
                        </a>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-amber-400/70 badge-amber flex-shrink-0">+{lesson.xpReward} XP</span>

                  <button onClick={() => handleDelete(lesson.id, lesson.title)}
                    disabled={deleting === lesson.id}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-700 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
