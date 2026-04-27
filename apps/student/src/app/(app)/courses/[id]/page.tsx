'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft, Play, Lock, CheckCircle2, Clock, BookOpen,
  Code2, FileQuestion, FileText, Brain, X, SkipForward,
  Map, ArrowRight, Sparkles
} from 'lucide-react'
import { api } from '@/lib/api'
import { useApi } from '@/lib/useApi'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

const TYPE_ICON: Record<string, any> = { video: Play, text: FileText, quiz: FileQuestion, practice: Code2 }
const TYPE_LABEL: Record<string, string> = { video: 'Video', text: 'Matn', quiz: 'Test', practice: 'Amaliyot' }
const TYPE_COLOR: Record<string, string> = { video: 'text-base-500', text: 'text-base-500', quiz: 'text-base-500', practice: 'text-base-500' }

// ─── Knowledge Space Theory — Diagnostic Questions ──────────────────────────
const DIAG_QUESTIONS = [
  { id: 1, lessonIdx: 0, topic: "Dasturlash asoslari",
    q: "Algoritm deganda nimani tushunasiz?",
    options: ["Kompyuter tili", "Muammoni yechishning qadam-baqadam rejasi", "Kod yozish muhiti", "Xato xabari"],
    correct: 1 },
  { id: 2, lessonIdx: 1, topic: "O'zgaruvchilar",
    q: "Python'da o'zgaruvchi e'lon qilishning to'g'ri usuli:",
    options: ["var x = 5", "int x = 5", "x = 5", "let x = 5"],
    correct: 2 },
  { id: 3, lessonIdx: 2, topic: "Shartli operatorlar",
    q: "if x > 0 sharti qachon True bo'ladi?",
    options: ["x nolga teng bo'lganda", "x noldan katta bo'lganda", "x manfiy bo'lganda", "Har doim"],
    correct: 1 },
  { id: 4, lessonIdx: 3, topic: "Sikllar",
    q: "for i in range(3) necha marta takrorlanadi?",
    options: ["1", "2", "3", "4"],
    correct: 2 },
  { id: 5, lessonIdx: 4, topic: "Funksiyalar",
    q: "Python'da funksiya yaratish uchun kalit so'z:",
    options: ["function", "fun", "def", "fn"],
    correct: 2 },
  { id: 6, lessonIdx: 5, topic: "Ma'lumot turlari",
    q: "type(3.14) qanday natija beradi?",
    options: ["int", "float", "str", "double"],
    correct: 1 },
  { id: 7, lessonIdx: 6, topic: "Ro'yxatlar (list)",
    q: "mylist = [10, 20, 30]; mylist[1] qiymati nima?",
    options: ["10", "20", "30", "Xato"],
    correct: 1 },
  { id: 8, lessonIdx: 7, topic: "Lug'atlar (dict)",
    q: "d = {'a': 1, 'b': 2} — bu qanday ma'lumot turi?",
    options: ["list", "tuple", "dict", "set"],
    correct: 2 },
  { id: 9, lessonIdx: 8, topic: "OOP asoslari",
    q: "Python'da class yaratishda __init__ metodining vazifasi:",
    options: ["Klassni o'chirish", "Ob'ekt yaratilganda ishga tushadi (konstruktor)", "Metodlarni chaqirish", "Merros olish"],
    correct: 1 },
  { id: 10, lessonIdx: 9, topic: "Xatolarni boshqarish",
    q: "try/except bloki asosan nima uchun ishlatiladi?",
    options: ["Sikllar uchun", "Xatolarni ushlash va boshqarish uchun", "Klasslar uchun", "Import qilish uchun"],
    correct: 1 },
]

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === 0) { setVal(0); return }
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setVal(start)
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return val
}

// ─── Diagnostic Quiz Overlay ─────────────────────────────────────────────────
function DiagnosticQuiz({
  onComplete,
  onSkip,
}: {
  onComplete: (skippable: Set<number>) => void
  onSkip: () => void
}) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const q = DIAG_QUESTIONS[current]
  const progress = ((current + (selected !== null ? 1 : 0)) / DIAG_QUESTIONS.length) * 100

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return
    setSelected(optIdx)
    const newAnswers = { ...answers, [q.id]: optIdx }
    setAnswers(newAnswers)

    setTimeout(() => {
      setTransitioning(true)
      setTimeout(() => {
        if (current < DIAG_QUESTIONS.length - 1) {
          setCurrent(c => c + 1)
          setSelected(null)
          setTransitioning(false)
        } else {
          const skippable = new Set<number>()
          DIAG_QUESTIONS.forEach(dq => {
            if (newAnswers[dq.id] === dq.correct) skippable.add(dq.lessonIdx)
          })
          setShowResult(true)
          setTransitioning(false)
          setTimeout(() => onComplete(skippable), 1800)
        }
      }, 300)
    }, 600)
  }

  const correctCount = Object.entries(answers).filter(([id, ans]) => {
    const dq = DIAG_QUESTIONS.find(q => q.id === Number(id))
    return dq && ans === dq.correct
  }).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onSkip} />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="card-elevated rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* Top progress bar */}
          <div className="h-0.5 bg-[#1A1A1F]">
            <div
              className="h-full diag-progress-fill rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#111113] border border-[#27272A] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-base-500" />
                </div>
                <div>
                  <div className="text-xs text-base-600">
                    Diagnostika · {current + 1}/{DIAG_QUESTIONS.length}
                  </div>
                  <div className="text-sm font-semibold text-base-200">{q.topic}</div>
                </div>
              </div>
              <button
                onClick={onSkip}
                className="w-7 h-7 rounded-lg bg-[#111113] border border-[#1E1E24] flex items-center justify-center hover:bg-[#1A1A1F] hover:border-[#27272A] transition-all duration-200"
              >
                <X className="w-3 h-3 text-base-600" />
              </button>
            </div>

            {/* Dot stepper */}
            <div className="flex items-center gap-1 mb-5">
              {DIAG_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-400 ${
                    i < current ? 'bg-[#3F3F46] flex-1' :
                    i === current ? 'bg-accent-500 flex-[2]' :
                    'bg-[#1A1A1F] flex-1'
                  }`}
                />
              ))}
            </div>

            {/* Result screen */}
            {showResult ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-[#111113] border border-[#27272A] flex items-center justify-center mx-auto mb-4 animate-bounce-once">
                  <CheckCircle2 className="w-8 h-8 text-base-400" />
                </div>
                <div className="text-3xl font-bold text-base-100 mb-1">
                  {correctCount}/{DIAG_QUESTIONS.length}
                </div>
                <p className="text-sm text-base-500 mb-2">Diagnostika tugallandi</p>
                <p className="text-xs text-base-600">Shaxsiy o'quv yo'lingiz tayyorlanmoqda...</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Question + options */
              <div
                key={current}
                className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
              >
                <p className="text-base font-medium text-base-100 leading-relaxed mb-5 animate-slide-up">
                  {q.q}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i
                    const isCorrect = isSelected && i === q.correct
                    const isWrong = isSelected && i !== q.correct
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`stagger-item animate-slide-up w-full text-left px-4 py-3 rounded-xl text-sm border transition-all duration-300 group
                          ${isCorrect ? 'answer-correct' :
                            isWrong ? 'answer-wrong' :
                            'border-[#27272A] text-base-300 hover:border-[#3F3F46] hover:bg-[#1A1A1F] hover:text-base-100 active:scale-[0.99]'}
                          disabled:cursor-default`}
                        style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                      >
                        <span className={`inline-block w-5 text-xs mr-2 transition-colors ${isCorrect ? 'text-base-400' : isWrong ? 'text-base-700' : 'text-base-700 group-hover:text-base-500'}`}>
                          {['A', 'B', 'C', 'D'][i]}.
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                <p className="text-xs text-base-700 mt-4 text-center">
                  Javobni tanlang — test avtomatik davom etadi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Diagnostic Intro Overlay ────────────────────────────────────────────────
function DiagnosticIntro({
  totalLessons,
  onStart,
  onSkip,
}: {
  totalLessons: number
  onStart: () => void
  onSkip: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="card-elevated rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-accent-600/50 to-transparent" />

          <div className="p-7">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#111113] border border-[#27272A] flex items-center justify-center mb-5 animate-float">
              <Sparkles className="w-6 h-6 text-base-400" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-base-100 mb-2">
              Adaptiv O'quv Yo'li
            </h2>
            <p className="text-sm text-base-500 leading-relaxed mb-6">
              Bilim darajangizni aniqlab, faqat kerakli darslarni ko'rsatamiz.
              Allaqachon bilganlaringizni o'tkazib yuborasiz — vaqtingizni tejang.
            </p>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {[
                { text: '10 ta qisqa savol — atigi 2 daqiqa', icon: Brain },
                { text: "Bilgan mavzularingiz aniqlanadi", icon: CheckCircle2 },
                { text: `${totalLessons} o'rniga faqat kerakli darslar`, icon: Map },
              ].map(({ text, icon: Icon }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 stagger-item animate-slide-in-left"
                  style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#111113] border border-[#1E1E24] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-base-600" />
                  </div>
                  <span className="text-sm text-base-400">{text}</span>
                </div>
              ))}
            </div>

            {/* Path preview */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#0D0D10] rounded-xl p-3 border border-[#1E1E24] text-center">
                <div className="text-xs text-base-700 mb-1">Standart yo'l</div>
                <div className="text-2xl font-bold text-base-700 line-through decoration-[#3F3F46]">{totalLessons}</div>
                <div className="text-xs text-base-700">dars</div>
              </div>
              <div className="path-card-personal rounded-xl p-3 text-center">
                <div className="text-xs text-base-500 mb-1">Sizning yo'lingiz</div>
                <div className="text-2xl font-bold text-base-100">?</div>
                <div className="text-xs text-base-600">dars</div>
              </div>
            </div>

            {/* CTAs */}
            <button
              onClick={onStart}
              className="w-full py-3 rounded-xl bg-[#1A1A1F] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#222229] text-sm font-semibold text-base-100 transition-all duration-200 flex items-center justify-center gap-2 group mb-2"
            >
              Diagnostikani Boshlash
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onSkip}
              className="w-full py-2 text-xs text-base-700 hover:text-base-500 transition-colors"
            >
              O'tkazib yuborish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Personalized path comparison card ───────────────────────────────────────
function PathComparisonCard({ standard, personal, saved }: { standard: number; personal: number; saved: number }) {
  const animPersonal = useCountUp(personal, 600)
  const animSaved = useCountUp(saved, 800)

  return (
    <div className="card border-[#1E1E24] overflow-hidden animate-slide-up">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-600/40 to-transparent" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Map className="w-4 h-4 text-base-500" />
          <span className="text-sm font-semibold text-base-100">Shaxsiy O'quv Yo'li</span>
          <div className="ml-auto badge bg-[#1A1A1F] border border-[#27272A] text-base-600 text-xs">
            <Sparkles className="w-2.5 h-2.5" /> AI tahlil
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Standard */}
          <div className="bg-[#0D0D10] rounded-xl p-3 border border-[#1E1E24] text-center">
            <div className="text-xs text-base-700 mb-2">Standart yo'l</div>
            <div className="text-2xl font-bold text-base-700 line-through decoration-[#3F3F46]">
              {standard}
            </div>
            <div className="text-xs text-base-700 mt-0.5">dars</div>
          </div>
          {/* Personal */}
          <div className="path-card-personal rounded-xl p-3 text-center animate-glow-pulse">
            <div className="text-xs text-base-500 mb-2">Sizning yo'lingiz</div>
            <div className="text-2xl font-bold text-base-100 animate-count-up">
              {animPersonal}
            </div>
            <div className="text-xs text-base-600 mt-0.5">dars</div>
          </div>
        </div>

        {/* Saved indicator */}
        <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0D0D10] border border-[#1E1E24]">
          <SkipForward className="w-3 h-3 text-base-600" />
          <span className="text-xs text-base-500">
            <span className="font-semibold text-base-300 animate-count-up">{animSaved}</span> ta mavzu o'tkaziladi — allaqachon bilasiz
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── In-lesson quiz questions ─────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { id: 1, q: 'Python\'da ro\'yxat (list) yaratishning to\'g\'ri usuli qaysi?',
    options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'], correct: 1 },
  { id: 2, q: 'range(5) funksiyasi qanday qiymatlar qaytaradi?',
    options: ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '0, 1, 2, 3, 4, 5', '1, 2, 3, 4'], correct: 1 },
  { id: 3, q: 'for i in range(3): print(i) — natija nima?',
    options: ['1 2 3', '0 1 2', '0 1 2 3', 'Xato'], correct: 1 },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id } = useParams()
  const { data: course, loading } = useApi(() => api.course(String(id)), [id])
  const lessons: any[] = course?.lessons || []

  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [quizActive] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Salom! Men bu kurs bo\'yicha AI yordamchiman. Savol bering.' },
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set())
  const [practiceCode, setPracticeCode] = useState('for i in range(1, 11):\n    print(f"{i} ** 2 = {i**2}")')
  const [practiceOutput, setPracticeOutput] = useState<string | null>(null)
  const [practiceRunning, setPracticeRunning] = useState(false)

  // Diagnostic state
  const [diagState, setDiagState] = useState<'idle' | 'running' | 'done'>('idle')
  const [skippableIdxs, setSkippableIdxs] = useState<Set<number>>(new Set())

  // Auto-enroll if not enrolled
  useEffect(() => {
    if (!id || !course) return
    if (!course.enrollment) {
      api.enroll(String(id)).catch(() => {})
    }
  }, [course, id])

  // Load saved diagnostic from localStorage
  useEffect(() => {
    if (!id) return
    const saved = localStorage.getItem(`diag_${id}`)
    if (saved) {
      try {
        setSkippableIdxs(new Set(JSON.parse(saved) as number[]))
        setDiagState('done')
      } catch {}
    }
  }, [id])

  // Auto-select first unlocked lesson
  useEffect(() => {
    if (lessons.length > 0 && !activeLesson) {
      const first = lessons.find((l: any) => !l.completed && !l.locked)
      setActiveLesson(first?.id || lessons[0].id)
    }
  }, [lessons, activeLesson])

  const diagComplete = (skippable: Set<number>) => {
    setSkippableIdxs(skippable)
    setDiagState('done')
    localStorage.setItem(`diag_${id}`, JSON.stringify([...skippable]))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-base-700 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  )

  if (!course) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-base-500">Kurs topilmadi</p>
    </div>
  )

  const currentLesson = lessons.find((l: any) => l.id === activeLesson)
  const completedCount = lessons.filter((l: any) => l.completed || localCompleted.has(l.id)).length
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiTyping) return
    const q = aiInput.trim()
    setAiChat(prev => [...prev, { role: 'user', text: q }])
    setAiInput('')
    setAiTyping(true)
    try {
      const { reply } = await api.aiChat(q)
      setAiChat(prev => [...prev, { role: 'ai', text: reply }])
    } catch {
      setAiChat(prev => [...prev, {
        role: 'ai',
        text: `"${q}" bo'yicha tushuntiraman. Bu konsept Python'da amaliyotda keng qo'llaniladi. Keyingi darsda ham ko'rib chiqamiz.`,
      }])
    }
    setAiTyping(false)
  }

  const handleCompleteLesson = async () => {
    if (!currentLesson || completing) return
    if (currentLesson.completed || localCompleted.has(currentLesson.id)) return
    setCompleting(true)
    try {
      await api.completeLesson(currentLesson.id)
      setLocalCompleted(prev => new Set([...prev, currentLesson.id]))
    } catch (e: any) {
      console.error('Lesson complete:', e.message)
    }
    setCompleting(false)
  }

  const runPracticeCode = async () => {
    setPracticeRunning(true)
    try {
      const { output, duration } = await api.runCode(practiceCode, 'python')
      setPracticeOutput(`${output}\n\n⏱ ${duration}ms`)
    } catch {
      setPracticeOutput("Backend ulanishda xatolik. Keyinroq urinib ko'ring.")
    }
    setPracticeRunning(false)
  }

  const submitQuiz = () => setQuizSubmitted(true)
  const quizScore = quizSubmitted ? QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.correct).length : 0

  const savedCount = skippableIdxs.size
  const personalCount = lessons.filter((_: any, idx: number) => !skippableIdxs.has(idx)).length

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Diagnostic intro overlay — shows immediately on course open */}
      {diagState === 'idle' && !loading && course && (
        <DiagnosticIntro
          totalLessons={lessons.length}
          onStart={() => setDiagState('running')}
          onSkip={() => setDiagState('done')}
        />
      )}

      {/* Diagnostic quiz overlay */}
      {diagState === 'running' && (
        <DiagnosticQuiz onComplete={diagComplete} onSkip={() => setDiagState('done')} />
      )}

      {/* Back */}
      <Link href="/courses"
        className="inline-flex items-center gap-2 text-sm text-base-600 hover:text-base-300 mb-5 transition-colors duration-200 group">
        <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Kurslar
      </Link>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* ─── Left: Lesson List ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-5">
            {/* Course header */}
            <div className="mb-5">
              <h2 className="font-bold text-base-100 text-lg mb-1">{course.title}</h2>
              <div className="flex items-center gap-3 text-xs text-base-500 mb-3">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{lessons.length} dars</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                <span className={getDifficultyColor(course.difficulty)}>{getDifficultyLabel(course.difficulty)}</span>
              </div>
              <div className="progress-bar mb-1.5">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-base-600">
                <span>{completedCount}/{lessons.length} dars</span>
                <span>{progress}% bajarildi</span>
              </div>
            </div>

            {/* Personalized path mini-badge */}
            {diagState === 'done' && savedCount > 0 && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-[#0D0D10] border border-[#1E1E24] flex items-center justify-between animate-slide-in-left">
                <div className="flex items-center gap-1.5 text-xs text-base-600">
                  <Map className="w-3 h-3" /> Shaxsiy yo'l
                </div>
                <div className="text-xs text-base-400 font-medium tabular-nums">
                  {personalCount} / {lessons.length}
                </div>
              </div>
            )}

            {/* Lessons */}
            <div className="space-y-0.5 max-h-[60vh] overflow-y-auto no-scrollbar">
              {lessons.map((lesson: any, idx: number) => {
                const Icon = TYPE_ICON[lesson.type] || Play
                const active = lesson.id === activeLesson
                const isSkippable = skippableIdxs.has(idx)
                return (
                  <button key={lesson.id}
                    onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                    disabled={lesson.locked}
                    className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-all duration-200
                      ${active
                        ? 'bg-[#1A1A1F] border border-[#27272A]'
                        : 'hover:bg-[#111113] border border-transparent'}
                      ${lesson.locked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      ${isSkippable && !lesson.completed && !active ? 'opacity-40' : ''}`}>

                    {/* Status icon */}
                    <div className="flex-shrink-0 relative">
                      {lesson.completed || localCompleted.has(lesson.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-base-500" />
                      ) : lesson.locked ? (
                        <Lock className="w-4 h-4 text-base-700" />
                      ) : isSkippable ? (
                        <SkipForward className="w-4 h-4 text-base-700" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${active ? 'border-accent-500 bg-accent-500/20 shadow-[0_0_8px_rgba(124,58,237,0.3)]' : 'border-base-700'}`}>
                          {active && (
                            <div className="absolute inset-0 rounded-full border-2 border-accent-500 animate-ping opacity-30" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate transition-colors duration-200 ${
                        active ? 'text-base-100' :
                        (lesson.completed || localCompleted.has(lesson.id)) ? 'text-base-600' :
                        isSkippable ? 'text-base-700' :
                        'text-base-300'}`}>
                        {idx + 1}. {lesson.title}
                      </div>
                      <div className="text-xs mt-0.5 flex items-center gap-1 text-base-700">
                        <Icon className="w-3 h-3" />
                        {isSkippable && !lesson.completed
                          ? "O'tkazilishi mumkin"
                          : `${TYPE_LABEL[lesson.type]} · ${lesson.duration}`}
                      </div>
                    </div>

                    <div className="text-xs text-base-800 flex-shrink-0 tabular-nums">
                      +{lesson.xpReward}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ─── Right: Content ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Personalized path comparison card */}
          {diagState === 'done' && savedCount > 0 && (
            <PathComparisonCard
              standard={lessons.length}
              personal={personalCount}
              saved={savedCount}
            />
          )}

          {currentLesson ? (
            <>
              {/* Lesson card */}
              <div className="card p-5 animate-slide-up">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className={`flex items-center gap-1.5 text-xs mb-2 ${TYPE_COLOR[currentLesson.type]}`}>
                      {(() => { const Icon = TYPE_ICON[currentLesson.type]; return <Icon className="w-3 h-3" /> })()}
                      {TYPE_LABEL[currentLesson.type]} · {currentLesson.duration}
                    </div>
                    <h1 className="text-xl font-bold text-base-100">{currentLesson.title}</h1>
                  </div>
                  <div className="badge-amber flex-shrink-0 animate-bounce-once">+{currentLesson.xpReward} XP</div>
                </div>

                {/* Video Player */}
                {currentLesson.videoUrl && (
                  <div className="bg-black rounded-xl aspect-video overflow-hidden mb-4 border border-[#1E1E24] animate-fade-in shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <iframe
                      className="w-full h-full"
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Video placeholder */}
                {currentLesson.type === 'video' && !currentLesson.videoUrl && (
                  <div className="bg-[#0D0D10] rounded-xl aspect-video flex flex-col items-center justify-center border border-[#1E1E24] mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#111113] border border-[#1E1E24] flex items-center justify-center mb-3">
                      <Play className="w-7 h-7 text-base-600 ml-1" />
                    </div>
                    <p className="text-sm text-base-600">Video hali yuklanmagan</p>
                  </div>
                )}

                {/* Text Content */}
                {currentLesson.type === 'text' && (
                  <div className="mb-4 space-y-4 text-sm text-base-400 leading-relaxed animate-fade-in">
                    <p>Bu darsda <strong className="text-base-200">{currentLesson.title}</strong> mavzusini batafsil ko'rib chiqamiz.</p>
                    <div className="bg-[#0D0D10] border border-[#1E1E24] rounded-xl p-4">
                      <p className="text-xs text-base-500 mb-3 uppercase tracking-wider">Asosiy tushunchalar</p>
                      <ul className="space-y-2 text-xs text-base-500">
                        {["O'rnatish jarayoni va muhit sozlash", "Asosiy interfeys va buyruqlar", "Birinchi loyiha yaratish", "Xatolarni aniqlash va tuzatish"].map((item, i) => (
                          <li key={i} className={`flex items-start gap-2 stagger-item animate-slide-in-left`}
                            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}>
                            <span className="text-base-700 mt-0.5">•</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p>Darsni diqqat bilan o'qib, har bir misolni o'zingizda sinab ko'ring. Amaliyot — eng yaxshi o'qituvchi.</p>
                  </div>
                )}

                {/* Practice */}
                {currentLesson.type === 'practice' && !quizActive && (
                  <div className="mb-4 animate-fade-in">
                    <div className="bg-[#0D0D10] rounded-xl border border-[#1E1E24] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E1E24]">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                        </div>
                        <span className="text-xs text-base-700 code-font">main.py</span>
                        <span className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">Python</span>
                      </div>
                      <div className="p-4">
                        <pre className="text-xs code-font text-base-400 leading-relaxed">
                          <span className="text-base-700"># Topshiriq: 1-10 gacha sonlarning kvadratlari</span>{'\n\n'}
                          <span className="text-sky-400">for</span>{' '}
                          <span className="text-base-200">i</span>{' '}
                          <span className="text-sky-400">in</span>{' '}
                          <span className="text-accent-400">range</span>
                          <span className="text-base-400">(1, 11):</span>{'\n'}
                          {'    '}<span className="text-base-700"># Sizning kodingiz</span>{'\n'}
                          {'    '}<span className="text-amber-400">pass</span>
                        </pre>
                      </div>
                      <div className="px-4 pb-4">
                        <textarea
                          value={practiceCode}
                          onChange={e => setPracticeCode(e.target.value)}
                          className="w-full h-24 bg-[#111113] border border-[#1E1E24] rounded-lg p-3 text-xs code-font text-emerald-400 resize-none focus:outline-none focus:border-[#27272A] transition-colors"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={runPracticeCode}
                            disabled={practiceRunning}
                            className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100"
                          >
                            {practiceRunning
                              ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <Play className="w-3 h-3" />}
                            {practiceRunning ? 'Bajarilmoqda...' : 'Ishga tushirish'}
                          </button>
                          <button
                            onClick={() => sendAiMessage()}
                            className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                          >
                            <Brain className="w-3 h-3" /> AI Tushuntirsin
                          </button>
                        </div>
                      </div>
                    </div>
                    {practiceOutput && (
                      <div className="mt-3 bg-[#0D0D10] rounded-xl border border-[#1A2A1A] p-4 animate-fade-in">
                        <div className="text-xs text-emerald-600 mb-2 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" /> Natija:
                        </div>
                        <pre className="text-xs code-font text-emerald-400/80 leading-relaxed whitespace-pre-wrap">{practiceOutput}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz */}
                {(currentLesson.type === 'quiz' || quizActive) && (
                  <div className="mb-4 space-y-4 animate-fade-in">
                    {!quizSubmitted ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-base-400 mb-1">
                          <FileQuestion className="w-4 h-4 text-base-600" />
                          <span>{QUIZ_QUESTIONS.length} ta savol</span>
                        </div>
                        {QUIZ_QUESTIONS.map((q, qi) => (
                          <div key={q.id} className={`card-elevated p-4 rounded-xl stagger-item animate-slide-up`}
                            style={{ animationDelay: `${qi * 80}ms`, animationFillMode: 'backwards' }}>
                            <p className="text-sm text-base-200 mb-3 font-medium">{q.id}. {q.q}</p>
                            <div className="space-y-2">
                              {q.options.map((opt, i) => (
                                <button key={i} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: i }))}
                                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all duration-200 border active:scale-[0.99] ${
                                    quizAnswers[q.id] === i
                                      ? 'bg-accent-600/10 border-accent-600/40 text-accent-300'
                                      : 'border-[#27272A] text-base-400 hover:border-[#3F3F46] hover:bg-[#111113] hover:text-base-200'
                                  }`}>
                                  <span className="text-base-700 mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button onClick={submitQuiz}
                          disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                          className="btn-primary px-6 py-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform">
                          Topshirish
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-10 animate-scale-in">
                        <div className={`text-5xl font-bold mb-2 ${quizScore === QUIZ_QUESTIONS.length ? 'text-base-200' : quizScore >= 2 ? 'text-base-300' : 'text-base-500'}`}>
                          {quizScore}/{QUIZ_QUESTIONS.length}
                        </div>
                        <p className="text-sm text-base-500 mb-4">
                          {quizScore === QUIZ_QUESTIONS.length ? 'Mukammal! Barcha javoblar to\'g\'ri' :
                            quizScore >= 2 ? 'Yaxshi natija! Biroz ko\'proq mashq qiling.' :
                            'Qayta urinib ko\'ring — siz uddalay olasiz!'}
                        </p>
                        <div className="badge-amber text-sm inline-flex animate-bounce-once">
                          +{Math.round(currentLesson.xpReward * (quizScore / QUIZ_QUESTIONS.length))} XP
                        </div>
                        <div className="mt-4">
                          <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}) }}
                            className="btn-secondary px-6 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                            Qayta urinish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete button */}
                {(() => {
                  const isDone = currentLesson.completed || localCompleted.has(currentLesson.id)
                  return (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={completing || isDone}
                      className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform mt-2 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {completing
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-300' : ''}`} />}
                      {isDone ? 'Bajarildi ✓' : completing ? 'Saqlanmoqda...' : `Darsni tugatish (+${currentLesson.xpReward} XP)`}
                    </button>
                  )
                })()}
              </div>

              {/* AI Chat */}
              <div className="card p-5 animate-slide-up" style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#0D0D10] border border-[#1E1E24] flex items-center justify-center">
                    <Brain className="w-4 h-4 text-base-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-base-200">AI Yordamchi</div>
                    <div className="text-xs text-base-700">Bu dars bo'yicha savol bering</div>
                  </div>
                </div>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto no-scrollbar">
                  {aiChat.map((msg, i) => (
                    <div key={i} className={`flex gap-2 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'ai' && (
                        <div className="w-7 h-7 rounded-lg bg-[#0D0D10] border border-[#1E1E24] flex items-center justify-center flex-shrink-0">
                          <Brain className="w-3.5 h-3.5 text-base-600" />
                        </div>
                      )}
                      <div className={`max-w-xs px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'ai' ? 'bg-[#111113] border border-[#1E1E24] text-base-300' : 'bg-accent-600/10 border border-accent-600/20 text-accent-300'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {aiTyping && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0D0D10] border border-[#1E1E24] flex items-center justify-center flex-shrink-0">
                        <Brain className="w-3.5 h-3.5 text-base-600" />
                      </div>
                      <div className="px-3 py-2.5 rounded-xl bg-[#111113] border border-[#1E1E24] flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1 h-1 rounded-full bg-accent-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !aiTyping && sendAiMessage()}
                    className="input text-xs flex-1" placeholder="Savol bering..." />
                  <button onClick={sendAiMessage} disabled={aiTyping}
                    className="btn-primary px-4 text-xs hover:scale-[1.04] active:scale-[0.96] transition-transform disabled:opacity-50 disabled:scale-100">
                    Yuborish
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card p-12 text-center animate-fade-in">
              <BookOpen className="w-12 h-12 text-base-800 mx-auto mb-3" />
              <p className="text-base-600">Darsni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
