'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Save, Eye, Plus, Video, FileText, Code2, FileQuestion,
  GripVertical, Trash2, CheckCircle2, Upload, Image, Tag, X
} from 'lucide-react'
import { api } from '@/lib/api'

type LessonType = 'video' | 'text' | 'quiz' | 'practice'

interface DraftLesson {
  id: string
  title: string
  type: LessonType
  duration: string
}

const LESSON_TYPES: { id: LessonType; label: string; icon: any; color: string }[] = [
  { id: 'video', label: 'Video Dars', icon: Video, color: 'text-sky-400' },
  { id: 'text', label: 'Matn Dars', icon: FileText, color: 'text-base-400' },
  { id: 'practice', label: 'Amaliy Mashq', icon: Code2, color: 'text-emerald-400' },
  { id: 'quiz', label: 'Test', icon: FileQuestion, color: 'text-amber-400' },
]

export default function CreateCoursePage() {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [lessons, setLessons] = useState<DraftLesson[]>([
    { id: '1', title: 'Kirish', type: 'video', duration: '10' },
  ])
  const [published, setPublished] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }
  const removeTag = (t: string) => setTags(tags.filter(tag => tag !== t))

  const addLesson = (type: LessonType) => {
    setLessons([...lessons, { id: Date.now().toString(), title: 'Yangi dars', type, duration: '10' }])
  }
  const removeLesson = (id: string) => setLessons(lessons.filter(l => l.id !== id))
  const updateLesson = (id: string, field: keyof DraftLesson, value: string) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  if (published) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-base-100 mb-2">Kurs yaratildi!</h1>
        <p className="text-base-500 mb-8">Kursingiz muvaffaqiyatli yaratildi va o'quvchilar uchun mavjud</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/courses" className="btn-secondary px-6">Kurslarga</Link>
          <button onClick={() => { setPublished(false); setStep(1); setTitle(''); setDescription(''); setCategory(''); setLessons([{ id: '1', title: 'Kirish', type: 'video', duration: '10' }]); setCreatedCourseId(null) }}
            className="btn-primary bg-sky-600 hover:bg-sky-700 px-6">Yana yaratish</button>
        </div>
        {createdCourseId && (
          <p className="mt-4 text-xs text-base-600">Kurs ID: <span className="text-base-400 font-mono">{createdCourseId}</span></p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-base-500 hover:text-base-300">
          <ChevronLeft className="w-4 h-4" /> Orqaga
        </Link>
        <div className="flex gap-2">
          <button className="btn-ghost border border-[#27272A] flex items-center gap-2">
            <Eye className="w-4 h-4" /> Ko'rib chiqish
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Save className="w-4 h-4" /> Saqlash
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-base-100">Yangi Kurs Yaratish</h1>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: 'Asosiy' },
          { n: 2, label: 'Darslar' },
          { n: 3, label: 'Nashr' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${step >= s.n ? 'bg-sky-600 text-white' : 'bg-[#1A1A1F] text-base-600 border border-[#27272A]'}`}>
              {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
            </div>
            <span className={`text-xs ${step >= s.n ? 'text-base-200' : 'text-base-600'}`}>{s.label}</span>
            {i < 2 && <div className={`flex-1 h-px ${step > s.n ? 'bg-sky-600' : 'bg-[#27272A]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="card p-6 space-y-5 animate-fade-in">
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Kurs Nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="input" placeholder="Masalan: Python Asoslari" />
          </div>
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Tavsif *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px] resize-none" placeholder="Kurs haqida qisqa tavsif..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Kategoriya *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                <option value="">Tanlang...</option>
                <option value="Dasturlash">Dasturlash</option>
                <option value="Web">Web Dasturlash</option>
                <option value="Database">Ma'lumotlar Bazasi</option>
                <option value="Tarmoq">Tarmoqlar</option>
                <option value="Security">Xavfsizlik</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Qiyinlik</label>
              <div className="flex gap-2">
                {[
                  { id: 'beginner', label: 'Boshlang\'ich' },
                  { id: 'intermediate', label: 'O\'rta' },
                  { id: 'advanced', label: 'Murakkab' },
                ].map(d => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all border
                      ${difficulty === d.id ? 'bg-sky-600/15 border-sky-600/40 text-sky-400' : 'bg-[#1A1A1F] border-[#27272A] text-base-400 hover:border-[#3F3F46]'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Teglar</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map(t => (
                <span key={t} className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Tag className="w-3 h-3" /> {t}
                  <button onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input flex-1" placeholder="Teg qo'shish (Enter)" />
              <button onClick={addTag} className="btn-secondary px-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-base-500 uppercase tracking-wider mb-2 block">Kurs Rasmi</label>
            <div className="border-2 border-dashed border-[#27272A] rounded-xl p-6 text-center hover:border-sky-600/40 transition-colors cursor-pointer">
              <Image className="w-8 h-8 text-base-700 mx-auto mb-2" />
              <p className="text-sm text-base-500">Rasm yuklash</p>
              <p className="text-xs text-base-700 mt-0.5">JPG, PNG — max 5MB</p>
            </div>
          </div>
          <button onClick={() => setStep(2)} disabled={!title || !description || !category}
            className="btn-primary bg-sky-600 hover:bg-sky-700 w-full py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
            Davom etish
          </button>
        </div>
      )}

      {/* Step 2: Lessons */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base-100">Dars qo'shish</h2>
              <span className="text-xs text-base-500">{lessons.length} dars</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LESSON_TYPES.map((lt) => (
                <button key={lt.id} onClick={() => addLesson(lt.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1A1A1F] border border-[#27272A] hover:border-sky-600/30 transition-all group">
                  <lt.icon className={`w-5 h-5 ${lt.color}`} />
                  <span className="text-xs text-base-400 group-hover:text-base-200">{lt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lesson List */}
          <div className="card p-5">
            <h3 className="font-semibold text-base-100 mb-4">Dasturlar Ro'yxati</h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const lt = LESSON_TYPES.find(l => l.id === lesson.type)!
                const LIcon = lt.icon
                return (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1F] border border-[#27272A] hover:border-[#3F3F46] transition-colors group">
                    <GripVertical className="w-4 h-4 text-base-700 cursor-move" />
                    <div className="text-xs font-bold text-base-600 w-6">{idx + 1}</div>
                    <div className={`w-8 h-8 rounded-lg bg-[#0D0D10] flex items-center justify-center`}>
                      <LIcon className={`w-4 h-4 ${lt.color}`} />
                    </div>
                    <input value={lesson.title} onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                      className="flex-1 bg-transparent text-sm text-base-200 focus:outline-none" placeholder="Dars nomi" />
                    <div className="flex items-center gap-1">
                      <input value={lesson.duration} onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
                        className="w-12 bg-[#0D0D10] border border-[#27272A] rounded px-2 py-1 text-xs text-base-300 text-center focus:outline-none focus:border-sky-600" />
                      <span className="text-xs text-base-600">daq</span>
                    </div>
                    <button onClick={() => removeLesson(lesson.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-base-700 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Orqaga</button>
            <button onClick={() => setStep(3)} disabled={lessons.length === 0}
              className="btn-primary bg-sky-600 hover:bg-sky-700 flex-1 py-3 font-semibold disabled:opacity-40">
              Davom etish
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Publish */}
      {step === 3 && (
        <div className="card p-6 space-y-5 animate-fade-in">
          <h2 className="font-semibold text-base-100 mb-4">Yakuniy Ko'rib Chiqish</h2>

          <div className="bg-[#1A1A1F] rounded-xl p-5">
            <h3 className="font-bold text-lg text-base-100 mb-2">{title || 'Nomsiz kurs'}</h3>
            <p className="text-sm text-base-500 mb-3">{description || 'Tavsif kiritilmagan'}</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {tags.map(t => <span key={t} className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">{t}</span>)}
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#27272A]">
              <div>
                <div className="text-xs text-base-600">Darslar</div>
                <div className="text-lg font-bold text-base-100">{lessons.length}</div>
              </div>
              <div>
                <div className="text-xs text-base-600">Davomiyligi</div>
                <div className="text-lg font-bold text-base-100">
                  {Math.round(lessons.reduce((s, l) => s + Number(l.duration), 0) / 60)} soat
                </div>
              </div>
              <div>
                <div className="text-xs text-base-600">Qiyinlik</div>
                <div className="text-lg font-bold text-base-100">
                  {difficulty === 'beginner' ? 'Boshlang\'ich' : difficulty === 'intermediate' ? 'O\'rta' : 'Murakkab'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Upload className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-300">
              <p className="font-medium mb-1">Nashr etishdan oldin:</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-400/80">
                <li>Barcha darslarda kontent borligini tekshiring</li>
                <li>Kurs tavsifi aniq va tushunarli bo'lsin</li>
                <li>Test savollari va javoblari to'g'riligini qayta ko'ring</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} disabled={publishing} className="btn-secondary flex-1 py-3">Orqaga</button>
            <button
              onClick={async () => {
                setPublishing(true); setPublishError(null)
                try {
                  const THUMB: Record<string, string> = {
                    'Dasturlash': 'python', 'Web': 'web', 'Database': 'database',
                    'Tarmoq': 'network', 'Security': 'security',
                  }
                  const course = await api.createCourse({
                    title, description, category,
                    difficulty,
                    tags,
                    duration: `${Math.ceil(lessons.reduce((s, l) => s + Number(l.duration), 0) / 60) || 1} soat`,
                    thumbnail: THUMB[category] || 'python',
                  })
                  setCreatedCourseId(course.id)
                  for (let i = 0; i < lessons.length; i++) {
                    const l = lessons[i]
                    await api.createLesson({
                      courseId: course.id,
                      title: l.title,
                      type: l.type,
                      duration: `${l.duration} daqiqa`,
                      xpReward: 20,
                    })
                  }
                  setPublished(true)
                } catch (e: any) { setPublishError(e.message) }
                setPublishing(false)
              }}
              disabled={publishing}
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex-1 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-70">
              {publishing
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <CheckCircle2 className="w-4 h-4" />}
              {publishing ? 'Yaratilmoqda...' : 'Nashr etish'}
            </button>
            {publishError && (
              <div className="w-full text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 mt-1">{publishError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
