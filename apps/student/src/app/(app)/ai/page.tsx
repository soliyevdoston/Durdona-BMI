'use client'
import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Sparkles, Code2, BookOpen, Lightbulb, Bot, User as UserIcon, Zap, MessageSquare } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'

const SUGGESTED = [
  { icon: Code2, text: 'Python\'da rekursiyani tushuntirib bering', color: 'text-sky-400' },
  { icon: BookOpen, text: 'SQL JOIN turlari qanday?', color: 'text-emerald-400' },
  { icon: Lightbulb, text: 'OOP prinsiplarini misollarda', color: 'text-amber-400' },
  { icon: Brain, text: 'Mening zaif joylarimni tahlil qiling', color: 'text-accent-400' },
]

const AI_RESPONSES: Record<string, string> = {
  default: "Bu savol bo'yicha batafsil tushuntirish beraman. Keling, qadam-baqadam ko'rib chiqamiz.\n\nBirinchidan, asosiy tushunchalarni aniqlab olaylik. Keyin esa amaliy misol ko'ramiz va sizning tushunchangizni mustahkamlaymiz.\n\nSavolingiz bo'yicha yana nimani bilmoqchisiz?",
  recursive: "**Rekursiya** — bu funksiyaning o'zini o'zidan chaqirishi.\n\n```python\ndef faktorial(n):\n    if n <= 1:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(5))  # 120\n```\n\n**Muhim nuqtalar:**\n1. **Base case** — to'xtash sharti bo'lishi shart\n2. **Recursive case** — masalani kichraytirish\n3. Stack overflow'dan ehtiyot bo'ling\n\nHar rekursiv yechim iterativ (sikl) yechimga ega. Rekursiya kod o'qilishini yaxshilaydi, lekin xotira ko'p ishlatadi.",
  sql: "**SQL JOIN turlari:**\n\n• **INNER JOIN** — ikkala jadvalda mos keluvchi qatorlar\n• **LEFT JOIN** — chap jadvaldagi barcha qatorlar + o'ng mos keladigan\n• **RIGHT JOIN** — o'ng jadvaldagi barcha + chap mos keladigan\n• **FULL OUTER JOIN** — ikkala jadvaldagi barcha qatorlar\n\n```sql\nSELECT t.ism, k.kurs_nomi\nFROM talabalar t\nLEFT JOIN kurslar k\n  ON t.kurs_id = k.id;\n```\n\nKunning amaliyotida **INNER** va **LEFT JOIN** eng ko'p ishlatiladi.",
  oop: "**OOP prinsiplari (4 ta asosiy):**\n\n1. **Inkapsulyatsiya** — ma'lumotni yashirish\n2. **Merros** (Inheritance) — klasslar hierarchy'si\n3. **Polimorfizm** — bir metodning turli shakllari\n4. **Abstraksiya** — murakkablikni yashirish\n\n```python\nclass Hayvon:\n    def __init__(self, ism):\n        self.ism = ism\n    def ovoz(self):\n        pass\n\nclass It(Hayvon):\n    def ovoz(self):\n        return f\"{self.ism}: Vov-vov!\"\n```\n\nHar bir prinsip kodni toza, qayta ishlatiladigan va kengaytiriladigan qiladi.",
  analiz: "**Sizning o'qish profilingiz tahlili:**\n\n✅ **Kuchli tomonlar:**\n• Sikllar va shartli operatorlar — 95%\n• Ro'yxatlar bilan ishlash — 89%\n• Funksiyalar yaratish — 87%\n\n⚠️ **Rivojlantirish kerak:**\n• **Rekursiya** — 54% (o'rtacha)\n• **OOP klasslari** — 48% (zaif)\n• **Istisnolar** (try/except) — 61%\n\n📊 **Tavsiyalar:**\n1. Keyingi 5 darsni rekursiyaga ajrating\n2. Kichik OOP loyihasi qiling (Bank tizimi, masalan)\n3. Xatolar bilan ishlashni ko'proq mashq qiling\n\n💡 **Yaqin maqsad:** Python kursini 85%+ bilan tugatish",
}

function detectResponse(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('rekurs')) return AI_RESPONSES.recursive
  if (lower.includes('sql') || lower.includes('join')) return AI_RESPONSES.sql
  if (lower.includes('oop') || lower.includes('klass')) return AI_RESPONSES.oop
  if (lower.includes('tahlil') || lower.includes('zaif')) return AI_RESPONSES.analiz
  return AI_RESPONSES.default
}

interface Message {
  role: 'user' | 'ai'
  content: string
  time: string
}

function renderMarkdown(text: string) {
  const parts = text.split('```')
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const [lang, ...codeLines] = part.split('\n')
      return (
        <pre key={i} className="my-3 bg-[#0D0D10] border border-[#27272A] rounded-xl p-3 overflow-x-auto">
          <div className="text-xs text-base-600 mb-1 code-font">{lang || 'code'}</div>
          <code className="text-xs code-font text-emerald-400 leading-relaxed">{codeLines.join('\n')}</code>
        </pre>
      )
    }
    return (
      <div key={i}>
        {part.split('\n').map((line, j) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={j} className="font-semibold text-base-100 my-2">{line.replace(/\*\*/g, '')}</p>
          }
          const formatted = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
          return line.trim() ? (
            <p key={j} className="text-sm leading-relaxed my-1"
              dangerouslySetInnerHTML={{ __html: formatted }} />
          ) : <br key={j} />
        })}
      </div>
    )
  })
}

export default function AIAssistantPage() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Salom, ${user?.name.split(' ')[0]}! 👋\n\nMen sizning shaxsiy AI o'qituvchi yordamchingizman. Men sizga quyidagilarda yordam bera olaman:\n\n• Tushunchalarni tushuntirish\n• Kod xatolarini tahlil qilish\n• Shaxsiy tavsiyalar berish\n• O'quv yo'lingizni optimallashtirish\n\nSavol bering yoki quyidagi tavsiyalardan birini tanlang.`,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = async (text?: string) => {
    const message = (text ?? input).trim()
    if (!message) return
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', content: message, time: now }])
    setInput('')
    setTyping(true)

    try {
      const { reply } = await api.aiChat(message)
      setMessages(prev => [...prev, {
        role: 'ai',
        content: reply,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      // Backend mavjud emas bo'lsa, lokal javob
      setMessages(prev => [...prev, {
        role: 'ai',
        content: detectResponse(message),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      }])
    }
    setTyping(false)
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-600 to-sky-600 flex items-center justify-center shadow-lg shadow-accent-600/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-base-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-100">AI Yordamchi</h1>
            <p className="text-xs text-base-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Faol · ChatGPT-4 asosida
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-accent">
            <Sparkles className="w-3 h-3" />
            Premium
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col card overflow-hidden">
        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                ${msg.role === 'ai'
                  ? 'bg-gradient-to-br from-accent-600 to-sky-600 shadow-lg shadow-accent-600/20'
                  : 'bg-[#1A1A1F] border border-[#27272A]'}`}>
                {msg.role === 'ai'
                  ? <Bot className="w-4 h-4 text-white" />
                  : <span className="text-xs font-bold text-base-400">{user?.avatar}</span>
                }
              </div>
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`px-4 py-2.5 rounded-2xl ${msg.role === 'ai'
                  ? 'bg-[#1A1A1F] text-base-200 rounded-tl-sm'
                  : 'bg-accent-600/15 text-accent-200 rounded-tr-sm border border-accent-600/20'}`}>
                  <div className="text-sm">
                    {renderMarkdown(msg.content)}
                  </div>
                </div>
                <span className="text-xs text-base-700 mt-1 px-2">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-600 to-sky-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#1A1A1F]">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-5 py-3 border-t border-[#1E1E24]">
            <div className="text-xs text-base-600 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tavsiya etilgan savollar:
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {SUGGESTED.map((s, i) => (
                <button key={i} onClick={() => send(s.text)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1A1A1F] hover:bg-[#222229] border border-[#27272A] hover:border-accent-600/30 text-left transition-all duration-200 group">
                  <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                  <span className="text-xs text-base-400 group-hover:text-base-200">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[#1E1E24] flex-shrink-0">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={1}
                className="w-full bg-[#1A1A1F] border border-[#27272A] rounded-2xl px-4 py-3 pr-12 text-sm text-base-100 placeholder-base-600 focus:outline-none focus:border-accent-600 focus:ring-1 focus:ring-accent-600/30 resize-none"
                placeholder="Savolingizni yozing... (Shift+Enter — yangi qator)"
                style={{ maxHeight: '120px' }}
              />
              <span className="absolute right-3 bottom-2.5 text-xs text-base-700">
                {input.length}/500
              </span>
            </div>
            <button onClick={() => send()} disabled={!input.trim() || typing}
              className="btn-primary p-3 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-base-700">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> 42 / 100 so'rov bu oyda
            </span>
            <span>AI javoblari to'g'riligini tekshiring</span>
          </div>
        </div>
      </div>
    </div>
  )
}
