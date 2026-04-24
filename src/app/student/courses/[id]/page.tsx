'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft, Play, Lock, CheckCircle2, Clock, BookOpen, Users,
  Star, Code2, FileQuestion, FileText, Zap, Brain, ChevronDown, ChevronUp
} from 'lucide-react'
import { COURSES, LESSONS } from '@/lib/data'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

const TYPE_ICON = { video: Play, text: FileText, quiz: FileQuestion, practice: Code2 }
const TYPE_LABEL = { video: 'Video', text: 'Matn', quiz: 'Test', practice: 'Amaliyot' }
const TYPE_COLOR = { video: 'text-sky-400', text: 'text-base-400', quiz: 'text-amber-400', practice: 'text-emerald-400' }

const QUIZ_QUESTIONS = [
  {
    id: 1,
    q: 'Python\'da ro\'yxat (list) yaratishning to\'g\'ri usuli qaysi?',
    options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
    correct: 1,
  },
  {
    id: 2,
    q: 'range(5) funksiyasi qanday qiymatlar qaytaradi?',
    options: ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '0, 1, 2, 3, 4, 5', '1, 2, 3, 4'],
    correct: 1,
  },
  {
    id: 3,
    q: 'for i in range(3): print(i) — natija nima?',
    options: ['1 2 3', '0 1 2', '0 1 2 3', 'Xato'],
    correct: 1,
  },
]

export default function CourseDetailPage() {
  const { id } = useParams()
  const course = COURSES.find(c => c.id === id)
  const lessons = LESSONS.filter(l => l.courseId === id)
  const [activeLesson, setActiveLesson] = useState<string | null>(lessons.find(l => !l.completed && !l.locked)?.id || null)
  const [quizActive, setQuizActive] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [aiChat, setAiChat] = useState<{role: 'user'|'ai'; text: string}[]>([
    { role: 'ai', text: 'Salom! Men bu kurs bo\'yicha AI yordamchiman. Savol bering.' },
  ])
  const [aiInput, setAiInput] = useState('')

  if (!course) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-base-500">Kurs topilmadi</p>
    </div>
  )

  const currentLesson = lessons.find(l => l.id === activeLesson)
  const completedCount = lessons.filter(l => l.completed).length
  const progress = Math.round((completedCount / lessons.length) * 100)

  const sendAiMessage = () => {
    if (!aiInput.trim()) return
    const q = aiInput.trim()
    setAiChat(prev => [...prev, { role: 'user', text: q }])
    setAiInput('')
    setTimeout(() => {
      const responses = [
        `"${q}" haqida tushuntiraman. Python\'da bu juda muhim konsept bo\'lib, amaliyotda keng qo\'llaniladi. Masalan: \`for i in range(10): print(i)\``,
        `Ajoyib savol! Bu mavzuni tushunish uchun avval asosiy tushunchalarni ko\'rib chiqamiz. Sizning xatolaringizni tahlil qilsam, asosiy muammo sintaksisda.`,
        `Bu haqida ko\'proq ma\'lumot olish uchun keyingi darsni ham ko\'ring. Men sizning o\'qish tempingizni kuzatib turibman va siz juda yaxshi ilgarilamoqdasiz!`,
      ]
      setAiChat(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }])
    }, 800)
  }

  const submitQuiz = () => {
    setQuizSubmitted(true)
  }

  const quizScore = quizSubmitted
    ? QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.correct).length
    : 0

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Back */}
      <Link href="/student/courses" className="inline-flex items-center gap-2 text-sm text-base-500 hover:text-base-300 mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kurslar
      </Link>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left: Lesson List */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-5">
            {/* Course Header */}
            <div className="mb-5">
              <h2 className="font-bold text-base-100 text-lg mb-1">{course.title}</h2>
              <div className="flex items-center gap-3 text-xs text-base-500 mb-3">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} dars</span>
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

            {/* Lessons */}
            <div className="space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
              {lessons.map((lesson, idx) => {
                const Icon = TYPE_ICON[lesson.type]
                const active = lesson.id === activeLesson
                return (
                  <button key={lesson.id}
                    onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                    disabled={lesson.locked}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200
                      ${active ? 'bg-accent-600/10 border border-accent-600/30' : 'hover:bg-[#1A1A1F]'}
                      ${lesson.locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : lesson.locked ? (
                        <Lock className="w-4 h-4 text-base-600" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${active ? 'border-accent-500 bg-accent-500/20' : 'border-base-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate ${active ? 'text-accent-300' : lesson.completed ? 'text-base-500' : 'text-base-300'}`}>
                        {idx + 1}. {lesson.title}
                      </div>
                      <div className={`text-xs mt-0.5 flex items-center gap-1 ${TYPE_COLOR[lesson.type]}`}>
                        <Icon className="w-3 h-3" />
                        {TYPE_LABEL[lesson.type]} · {lesson.duration}
                      </div>
                    </div>
                    <div className="text-xs text-amber-500 flex-shrink-0">+{lesson.xpReward}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-2 space-y-5">
          {currentLesson ? (
            <>
              {/* Lesson Header */}
              <div className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className={`flex items-center gap-1.5 text-xs mb-2 ${TYPE_COLOR[currentLesson.type]}`}>
                      {(() => { const Icon = TYPE_ICON[currentLesson.type]; return <Icon className="w-3 h-3" /> })()}
                      {TYPE_LABEL[currentLesson.type]} · {currentLesson.duration}
                    </div>
                    <h1 className="text-xl font-bold text-base-100">{currentLesson.title}</h1>
                  </div>
                  <div className="badge-amber flex-shrink-0">+{currentLesson.xpReward} XP</div>
                </div>

                {/* Video Placeholder */}
                {currentLesson.type === 'video' && (
                  <div className="bg-[#0D0D10] rounded-xl aspect-video flex flex-col items-center justify-center border border-[#1E1E24] relative overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-sky-600/5" />
                    <div className="w-16 h-16 rounded-full bg-accent-600/20 border border-accent-600/30 flex items-center justify-center mb-3">
                      <Play className="w-7 h-7 text-accent-400 ml-1" />
                    </div>
                    <p className="text-sm text-base-500">Video dars — {currentLesson.duration}</p>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-xs text-base-600">
                        <div className="flex-1 h-1 bg-[#27272A] rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-accent-600 rounded-full" />
                        </div>
                        <span>0:00 / {currentLesson.duration}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                {currentLesson.type === 'text' && (
                  <div className="prose prose-invert prose-sm max-w-none mb-4">
                    <div className="space-y-4 text-sm text-base-400 leading-relaxed">
                      <p>Bu darsda <strong className="text-base-200">{currentLesson.title}</strong> mavzusini batafsil ko'rib chiqamiz.</p>
                      <div className="bg-[#1A1A1F] border border-[#27272A] rounded-xl p-4">
                        <p className="text-xs text-accent-400 mb-2">Asosiy tushunchalar:</p>
                        <ul className="space-y-2 text-xs text-base-400">
                          <li className="flex items-start gap-2"><span className="text-accent-500">•</span>O'rnatish jarayoni va muhit sozlash</li>
                          <li className="flex items-start gap-2"><span className="text-accent-500">•</span>Asosiy interfeys va buyruqlar</li>
                          <li className="flex items-start gap-2"><span className="text-accent-500">•</span>Birinchi loyiha yaratish</li>
                          <li className="flex items-start gap-2"><span className="text-accent-500">•</span>Xatolarni aniqlash va tuzatish</li>
                        </ul>
                      </div>
                      <p>Darsni diqqat bilan o'qib, har bir misolni o'zingizda sinab ko'ring. Amaliyot — eng yaxshi o'qituvchi.</p>
                    </div>
                  </div>
                )}

                {/* Practice */}
                {currentLesson.type === 'practice' && !quizActive && (
                  <div className="mb-4">
                    <div className="bg-[#0D0D10] rounded-xl border border-[#1E1E24] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E1E24]">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500" />
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-xs text-base-600 code-font">main.py</span>
                        <span className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">Python</span>
                      </div>
                      <div className="p-4">
                        <pre className="text-xs code-font text-base-300 leading-relaxed">
                          <span className="text-base-600"># Topshiriq: Sikllar yordamida yechim yozing</span>{'\n'}
                          <span className="text-base-600"># 1-10 gacha bo\'lgan sonlarning kvadratlarini chiqaring</span>{'\n\n'}
                          <span className="text-sky-400">for</span>{' '}
                          <span className="text-base-200">i</span>{' '}
                          <span className="text-sky-400">in</span>{' '}
                          <span className="text-accent-400">range</span>
                          <span className="text-base-400">(1, 11):</span>{'\n'}
                          {'    '}
                          <span className="text-base-600"># Sizning kodingiz shu yerda</span>{'\n'}
                          {'    '}
                          <span className="text-amber-400">pass</span>
                        </pre>
                      </div>
                      <div className="px-4 pb-4">
                        <textarea
                          className="w-full h-24 bg-[#1A1A1F] border border-[#27272A] rounded-lg p-3 text-xs code-font text-emerald-400 resize-none focus:outline-none focus:border-accent-600"
                          placeholder="Kodingizni shu yerda yozing..."
                          defaultValue={`for i in range(1, 11):\n    print(f"{i} ** 2 = {i**2}")`}
                        />
                        <div className="flex gap-2 mt-2">
                          <button className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5">
                            <Play className="w-3 h-3" /> Ishga tushirish
                          </button>
                          <button className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
                            <Brain className="w-3 h-3" /> AI Tushuntirsin
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Output */}
                    <div className="mt-3 bg-[#0D0D10] rounded-xl border border-emerald-500/20 p-4">
                      <div className="text-xs text-emerald-400 mb-2 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Natija:
                      </div>
                      <pre className="text-xs code-font text-emerald-300 leading-relaxed">
                        {`1 ** 2 = 1\n4 ** 2 = 16\n9 ** 2 = 81\n... (va hokazo)`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {(currentLesson.type === 'quiz' || quizActive) && (
                  <div className="mb-4 space-y-4">
                    {!quizSubmitted ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-base-300 mb-2">
                          <FileQuestion className="w-4 h-4 text-amber-400" />
                          <span>{QUIZ_QUESTIONS.length} ta savol</span>
                        </div>
                        {QUIZ_QUESTIONS.map((q) => (
                          <div key={q.id} className="card-elevated p-4 rounded-xl">
                            <p className="text-sm text-base-200 mb-3 font-medium">{q.id}. {q.q}</p>
                            <div className="space-y-2">
                              {q.options.map((opt, i) => (
                                <button key={i} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: i }))}
                                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all duration-200 border ${quizAnswers[q.id] === i ? 'bg-accent-600/15 border-accent-600/50 text-accent-300' : 'border-[#27272A] text-base-400 hover:border-[#3F3F46] hover:text-base-200'}`}>
                                  <span className="text-base-600 mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button onClick={submitQuiz}
                          disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                          className="btn-primary px-6 py-2 disabled:opacity-40 disabled:cursor-not-allowed">
                          Topshirish
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className={`text-5xl font-bold mb-2 ${quizScore === QUIZ_QUESTIONS.length ? 'text-emerald-400' : quizScore >= 2 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {quizScore}/{QUIZ_QUESTIONS.length}
                        </div>
                        <p className="text-base-400 mb-4">
                          {quizScore === QUIZ_QUESTIONS.length ? '🎉 Mukammal! Barcha javoblar to\'g\'ri!' :
                            quizScore >= 2 ? '👍 Yaxshi! Biroz ko\'proq mashq qiling.' :
                            '💪 Qayta urinib ko\'ring. Siz uddalay olasiz!'}
                        </p>
                        <div className="badge-amber text-sm">+{currentLesson.xpReward * (quizScore / QUIZ_QUESTIONS.length)} XP</div>
                        <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}) }}
                          className="btn-secondary mt-4 px-6">Qayta urinish</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete button */}
                <button className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Darsni tugatish (+{currentLesson.xpReward} XP)
                </button>
              </div>

              {/* AI Chat */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent-600/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-accent-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-base-200">AI Yordamchi</div>
                    <div className="text-xs text-base-600">Bu dars bo'yicha savol bering</div>
                  </div>
                </div>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto no-scrollbar">
                  {aiChat.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'ai' && (
                        <div className="w-7 h-7 rounded-lg bg-accent-600/20 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-3.5 h-3.5 text-accent-400" />
                        </div>
                      )}
                      <div className={`max-w-xs px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'ai' ? 'bg-[#1A1A1F] text-base-300' : 'bg-accent-600/15 text-accent-300'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendAiMessage()}
                    className="input text-xs flex-1" placeholder="Savol bering..." />
                  <button onClick={sendAiMessage} className="btn-primary px-4 text-xs">
                    Yuborish
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <BookOpen className="w-12 h-12 text-base-700 mx-auto mb-3" />
              <p className="text-base-500">Darsni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
