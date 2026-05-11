'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft, Plus, Video, FileText, Code2, FileQuestion,
  Trash2, CheckCircle2, Upload, Play, Clock, Users, BookOpen,
  GripVertical, ExternalLink, Pencil, Paperclip, X
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

const MAX_RESOURCE_BYTES = 20 * 1024 * 1024 // 20MB

function getYouTubeId(url: string): string | null {
  const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\n]{11})/)
  return m ? m[1] : null
}

// YouTube URL'larini iframe uchun embed shakliga keltirish
function toEmbedUrl(url: string): string {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : url
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Faylni o\'qib bo\'lmadi'))
    reader.readAsDataURL(file)
  })
}

type FormState = {
  title: string
  type: LessonType
  duration: string
  videoUrl: string
  resourceName: string
  resourceFile: File | null
  resourceUrl: string | null // mavjud darsni tahrirlashda bor data URL
  resourceType: string | null
  resourceCleared: boolean // tahrir vaqtida foydalanuvchi faylni o'chirdi
}

const EMPTY_FORM: FormState = {
  title: '', type: 'video', duration: '15',
  videoUrl: '',
  resourceName: '', resourceFile: null,
  resourceUrl: null, resourceType: null, resourceCleared: false,
}

export default function TeacherCourseDetailPage() {
  const { id } = useParams()
  const { data: course, loading, refetch } = useApi(() => api.course(String(id)))
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const lessons: any[] = course?.lessons || []

  const resetForm = () => {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setError(null)
    setShowForm(false)
  }

  const openCreate = () => {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  const openEdit = (lesson: any) => {
    setForm({
      title: lesson.title || '',
      type: (lesson.type as LessonType) || 'video',
      duration: String(parseInt(lesson.duration) || 15),
      videoUrl: lesson.videoUrl || '',
      resourceName: lesson.resourceName || '',
      resourceFile: null,
      resourceUrl: lesson.resourceUrl || null,
      resourceType: lesson.resourceType || null,
      resourceCleared: false,
    })
    setEditingId(lesson.id)
    setError(null)
    setShowForm(true)
  }

  const onPickFile = async (file: File) => {
    if (file.size > MAX_RESOURCE_BYTES) {
      setError(`Fayl juda katta. Maksimum ${Math.round(MAX_RESOURCE_BYTES / 1024 / 1024)} MB`)
      return
    }
    setForm(prev => ({
      ...prev,
      resourceName: file.name,
      resourceFile: file,
      resourceType: file.type || 'application/octet-stream',
      resourceCleared: false,
    }))
    setError(null)
  }

  const clearFile = () => {
    setForm(prev => ({
      ...prev,
      resourceName: '',
      resourceFile: null,
      resourceUrl: null,
      resourceType: null,
      resourceCleared: true,
    }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) return setError("Dars nomi kiritilmagan")
    setSaving(true); setError(null)
    try {
      // Yangi fayl tanlangan bo'lsa, base64 ga o'tkazamiz
      let resourceUrl: string | null | undefined = undefined
      let resourceName: string | null | undefined = undefined
      let resourceType: string | null | undefined = undefined

      if (form.resourceFile) {
        resourceUrl = await readFileAsDataURL(form.resourceFile)
        resourceName = form.resourceFile.name
        resourceType = form.resourceFile.type || 'application/octet-stream'
      } else if (form.resourceCleared) {
        // Foydalanuvchi faylni olib tashladi
        resourceUrl = null
        resourceName = null
        resourceType = null
      }
      // Aks holda undefined — backend o'zgartirmaydi

      if (editingId) {
        const patch: any = {
          title: form.title.trim(),
          type: form.type,
          duration: `${form.duration} daqiqa`,
          videoUrl: form.videoUrl || null,
        }
        if (resourceUrl !== undefined) {
          patch.resourceUrl = resourceUrl
          patch.resourceName = resourceName
          patch.resourceType = resourceType
        }
        await api.updateLesson(editingId, patch)
      } else {
        await api.createLesson({
          courseId: String(id),
          title: form.title.trim(),
          type: form.type,
          duration: `${form.duration} daqiqa`,
          xpReward: 20,
          videoUrl: form.videoUrl || undefined,
          resourceUrl: resourceUrl || undefined,
          resourceName: resourceName || undefined,
          resourceType: resourceType || undefined,
        })
      }
      resetForm()
      refetch()
    } catch (e: any) {
      setError(e.message || 'Saqlashda xatolik')
    }
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

  const hasResource = !!form.resourceFile || (!!form.resourceUrl && !form.resourceCleared)

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
          onClick={openCreate}
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

      {/* Add / Edit Lesson Form */}
      {showForm && (
        <div className="card p-5 border-sky-600/30 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base-100">
              {editingId ? 'Darsni Tahrirlash' : "Yangi Dars Qo'shish"}
            </h2>
            <button onClick={resetForm} className="btn-ghost p-1.5">✕</button>
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

          {/* 1. Resurs yuklash */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <label className="text-xs text-amber-400 mb-2 block font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> 1. Dars Qo'llanmasi (PDF yoki Word)
            </label>
            {hasResource ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-emerald-500/5 border-emerald-500/30 text-emerald-400 text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate flex-1">{form.resourceName}</span>
                {form.resourceFile && (
                  <span className="text-xs text-base-500">
                    {(form.resourceFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
                <button onClick={clearFile} type="button"
                  className="p-1 rounded hover:bg-rose-500/10 text-base-500 hover:text-rose-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm w-full
                  bg-[#1A1A1F] border-[#27272A] hover:border-amber-500/40 text-base-400 hover:text-base-200">
                <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Qo'llanma faylini tanlang (PDF, DOC, DOCX)</span>
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) onPickFile(f)
                    // Inputni resetlash — bir xil faylni qayta tanlash uchun
                    e.currentTarget.value = ''
                  }} />
              </label>
            )}
            <p className="text-xs text-base-600 mt-1.5">
              O'quvchilar bu faylni o'z darsida ko'rib, yuklab olishlari mumkin (maks. 20 MB)
            </p>
          </div>

          {/* 2. Video URL (faqat video uchun) */}
          {form.type === 'video' && (
            <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4">
              <label className="text-xs text-sky-400 mb-2 block font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> 2. Video Manzili (YouTube URL)
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
            <button onClick={resetForm} className="btn-secondary flex-1">Bekor qilish</button>
            <button onClick={handleSave} disabled={saving || !form.title.trim()}
              className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editingId ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
              {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : "Dars Qo'shish"}
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
            <button onClick={openCreate}
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
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`text-xs ${TYPE_COLOR[lesson.type as LessonType] || 'text-base-500'}`}>
                        {TYPE_LABEL[lesson.type as LessonType]}
                      </span>
                      <span className="text-xs text-base-600">{lesson.duration}</span>
                      {lesson.videoUrl && (
                        <a href={toEmbedUrl(lesson.videoUrl)} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-0.5">
                          <ExternalLink className="w-2.5 h-2.5" /> Video
                        </a>
                      )}
                      {lesson.resourceName && (
                        <span className="text-xs text-amber-400 flex items-center gap-0.5 max-w-[200px] truncate">
                          <Paperclip className="w-2.5 h-2.5 flex-shrink-0" />
                          {lesson.resourceName}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-amber-400/70 badge-amber flex-shrink-0">+{lesson.xpReward} XP</span>

                  <button onClick={() => openEdit(lesson)}
                    className="p-1.5 rounded-lg hover:bg-sky-500/10 text-base-700 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

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
