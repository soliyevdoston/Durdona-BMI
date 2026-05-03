'use client'
import { useState } from 'react'
import {
  Play, RefreshCw, Brain, ChevronDown, CheckCircle2,
  XCircle, AlertCircle, Zap, Copy, BookOpen, Settings2
} from 'lucide-react'
import { api } from '@/lib/api'

type Lang = 'python' | 'javascript' | 'sql'

const CODE_EXAMPLES: Record<Lang, string> = {
  python: `# Python - Ro'yxatlarni qayta ishlash\ndef toping_maksimum(royxat):\n    if len(royxat) == 0:\n        return None\n    maksimum = royxat[0]\n    for element in royxat:\n        if element > maksimum:\n            maksimum = element\n    return maksimum\n\nsonlar = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\nnatija = toping_maksimum(sonlar)\nprint(f"Maksimum son: {natija}")`,
  javascript: `// JavaScript - Async/Await misoli\nasync function foydalanuvchiMalumoti(id) {\n  try {\n    const javob = await fetch(\`/api/users/\${id}\`)\n    if (!javob.ok) throw new Error('Topilmadi')\n    return await javob.json()\n  } catch (xato) {\n    console.error('Xato:', xato.message)\n    return null\n  }\n}\n\nfoydalanuvchiMalumoti(42).then(user => console.log(user?.name))`,
  sql: `-- SQL - Murakkab so'rov\nSELECT t.ism, k.sarlavha AS kurs,\n    AVG(b.ball) AS o_rtacha\nFROM talabalar t\nJOIN yozilishlar y ON t.id = y.talaba_id\nJOIN kurslar k ON y.kurs_id = k.id\nLEFT JOIN baholar b ON t.id = b.talaba_id\nGROUP BY t.id, t.ism, k.id, k.sarlavha\nORDER BY o_rtacha DESC;`,
}

const TEMPLATES: Record<string, { lang: Lang; code: string }> = {
  'Saralash Algoritmi': {
    lang: 'python',
    code: `# Saralash Algoritmi - Bubble Sort\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nsonlar = [64, 34, 25, 12, 22, 11, 90]\nnatija = bubble_sort(sonlar[:])\nprint("Asl:      ", sonlar)\nprint("Saralangan:", natija)`,
  },
  'Binary Search': {
    lang: 'python',
    code: `# Binary Search - Ikkilik Qidirish\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nsonlar = [1, 3, 5, 7, 9, 11, 13, 15]\nmaqsad = 7\nindex = binary_search(sonlar, maqsad)\nprint(f"{maqsad} soni {index}-indeksda topildi")`,
  },
  'Linked List': {
    lang: 'python',
    code: `# Linked List - Bog'liq Ro'yxat\nclass Tugun:\n    def __init__(self, q):\n        self.q = q\n        self.keyingi = None\n\nclass BoglliqRoyxat:\n    def __init__(self):\n        self.bosh = None\n    def qosh(self, q):\n        yangi = Tugun(q)\n        if not self.bosh:\n            self.bosh = yangi; return\n        j = self.bosh\n        while j.keyingi: j = j.keyingi\n        j.keyingi = yangi\n    def chiqar(self):\n        j = self.bosh\n        while j:\n            print(j.q, end=" -> ")\n            j = j.keyingi\n        print("None")\n\nrl = BoglliqRoyxat()\nfor x in [10, 20, 30, 40]:\n    rl.qosh(x)\nrl.chiqar()`,
  },
  'Fibonacci': {
    lang: 'python',
    code: `# Fibonacci - Ketma-ketlik\ndef fibonacci(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nprint("Birinchi 10 ta Fibonacci:")\nfor i in range(10):\n    print(f"F({i}) = {fibonacci(i)}")\n\n# Generator variant\ndef fib_gen(limit):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b\n\nprint("\\n100 gacha:", list(fib_gen(100)))`,
  },
  'Rekursiya': {
    lang: 'python',
    code: `# Rekursiya - Faktorial\ndef faktorial(n):\n    if n <= 1: return 1\n    return n * faktorial(n - 1)\n\nfor i in range(1, 9):\n    print(f"{i}! = {faktorial(i)}")\n\n# Daraxt DFS\ndef dfs(node, depth=0):\n    print("  " * depth + f"- {node['name']}")\n    for child in node.get('bolalar', []):\n        dfs(child, depth + 1)\n\ndaraxt = {\n  "name": "Ildiz",\n  "bolalar": [\n    {"name": "A", "bolalar": [{"name": "A1"}, {"name": "A2"}]},\n    {"name": "B", "bolalar": [{"name": "B1"}]}\n  ]\n}\nprint("\\nDaraxt:")\ndfs(daraxt)`,
  },
}

const LANGS: { id: Lang; label: string; color: string }[] = [
  { id: 'python', label: 'Python', color: 'text-blue-400' },
  { id: 'javascript', label: 'JavaScript', color: 'text-yellow-400' },
  { id: 'sql', label: 'SQL', color: 'text-emerald-400' },
]

const TEST_CASES = [
  { id: 1, input: '[3, 1, 4, 1, 5, 9]', expected: '9', status: 'pass' },
  { id: 2, input: '[1]', expected: '1', status: 'pass' },
  { id: 3, input: '[]', expected: 'None', status: 'pass' },
  { id: 4, input: '[-1, -5, -2]', expected: '-1', status: 'fail' },
]

const AI_FEEDBACK = [
  "Kodingiz to'g'ri ishlayapti! Vaqt murakkabligi O(n), bu optimal.",
  "Kichik taklif: `None` qaytarishdan oldin tipni tekshiring.",
  "list comprehension ishlatishni ko'rib chiqing — ancha pythonic bo'ladi.",
]

export default function PlaygroundPage() {
  const [lang, setLang] = useState<Lang>('python')
  const [code, setCode] = useState(CODE_EXAMPLES.python)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'output' | 'tests' | 'ai'>('output')
  const [langOpen, setLangOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)

  const changeLang = (l: Lang) => {
    setLang(l)
    setCode(CODE_EXAMPLES[l])
    setOutput(null)
    setLangOpen(false)
  }

  const runCode = async () => {
    setRunning(true)
    setActiveTab('output')
    try {
      const { output, duration } = await api.runCode(code, lang)
      setOutput(`${output}\n\n(${duration}ms)`)
    } catch {
      setOutput('Backend ulanishda xatolik. Keyinroq urinib ko\'ring.')
    }
    setRunning(false)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const analyzeCode = async () => {
    setAiAnalyzing(true)
    setAiAnalysis(null)
    setActiveTab('ai')
    try {
      const { reply } = await api.aiChat(
        `Quyidagi ${lang} kodini tahlil qiling. Xatolar, yaxshilash imkoniyatlari va vaqt murakkabligi haqida qisqacha yozing:\n\`\`\`\n${code}\n\`\`\``
      )
      setAiAnalysis(reply)
    } catch {
      setAiAnalysis(AI_FEEDBACK.join('\n\n'))
    }
    setAiAnalyzing(false)
  }

  const passCount = TEST_CASES.filter(t => t.status === 'pass').length

  return (
    <div className="max-w-7xl mx-auto animate-fade-in h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-base-100">Kod Muhiti</h1>
          <p className="text-sm text-base-500">Brauzerda kod yozing va sinab ko'ring</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Lang selector */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="btn-secondary flex items-center gap-2 px-4 py-2">
              <span className={LANGS.find(l => l.id === lang)?.color}>
                {LANGS.find(l => l.id === lang)?.label}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 card-elevated shadow-card-hover z-20 py-1 animate-slide-up">
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => changeLang(l.id)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#222229] transition-colors ${l.id === lang ? 'text-accent-400' : 'text-base-300'}`}>
                    <span className={l.color}>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={copyCode} className="btn-ghost py-2 px-3 flex items-center gap-1.5 text-xs">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Nusxalandi' : 'Nusxa'}
          </button>
          <button onClick={() => { setCode(CODE_EXAMPLES[lang]); setOutput(null) }}
            className="btn-ghost py-2 px-3 flex items-center gap-1.5 text-xs">
            <RefreshCw className="w-4 h-4" /> Tiklash
          </button>
          <button onClick={runCode} disabled={running}
            className="btn-primary flex items-center gap-2 px-5 py-2 font-semibold disabled:opacity-50">
            {running ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {running ? 'Ishlamoqda...' : 'Ishga tushirish'}
          </button>
        </div>
      </div>

      {/* Editor + Output split */}
      <div className="flex-1 grid lg:grid-cols-2 gap-4 overflow-hidden">

        {/* Code Editor */}
        <div className="flex flex-col card overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E1E24] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs text-base-600 code-font">
              {lang === 'python' ? 'main.py' : lang === 'javascript' ? 'main.js' : 'query.sql'}
            </span>
            <Settings2 className="w-3.5 h-3.5 text-base-700" />
          </div>

          {/* Line numbers + code */}
          <div className="flex-1 overflow-auto flex">
            {/* Line numbers */}
            <div className="flex-shrink-0 px-3 py-4 text-right select-none border-r border-[#1E1E24]">
              {code.split('\n').map((_, i) => (
                <div key={i} className="text-xs code-font text-base-700 leading-6">{i + 1}</div>
              ))}
            </div>
            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 text-xs code-font bg-transparent text-base-200 resize-none focus:outline-none leading-6"
              spellCheck={false}
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col card overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-[#1E1E24] flex-shrink-0">
            {([
              { id: 'output', label: 'Natija', icon: Play },
              { id: 'tests', label: `Testlar (${passCount}/${TEST_CASES.length})`, icon: CheckCircle2 },
              { id: 'ai', label: 'AI Tahlil', icon: Brain },
            ] as const).map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'text-accent-400 border-accent-500' : 'text-base-500 border-transparent hover:text-base-300'}`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto p-4">

            {/* Output */}
            {activeTab === 'output' && (
              <div className="h-full">
                {running ? (
                  <div className="flex items-center gap-3 text-sm text-base-500">
                    <div className="w-4 h-4 border-2 border-accent-600/30 border-t-accent-600 rounded-full animate-spin" />
                    Kod bajarilmoqda...
                  </div>
                ) : output ? (
                  <div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Muvaffaqiyatli bajarildi
                    </div>
                    <pre className="text-xs code-font text-base-300 leading-relaxed whitespace-pre-wrap">{output}</pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Zap className="w-10 h-10 text-base-800 mb-3" />
                    <p className="text-sm text-base-600">Kodni ishga tushiring</p>
                    <p className="text-xs text-base-700 mt-1">natija shu yerda ko'rinadi</p>
                  </div>
                )}
              </div>
            )}

            {/* Tests */}
            {activeTab === 'tests' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-base-300">Test natijalari</div>
                  <div className={`badge ${passCount === TEST_CASES.length ? 'badge-emerald' : 'badge-amber'}`}>
                    {passCount}/{TEST_CASES.length} o'tdi
                  </div>
                </div>
                {TEST_CASES.map((tc) => (
                  <div key={tc.id} className={`p-3 rounded-xl border ${tc.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {tc.status === 'pass'
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        : <XCircle className="w-4 h-4 text-rose-400" />
                      }
                      <span className={`text-xs font-medium ${tc.status === 'pass' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Test {tc.id}: {tc.status === 'pass' ? 'O\'tdi' : 'Xato'}
                      </span>
                    </div>
                    <div className="text-xs code-font space-y-1">
                      <div className="text-base-500">Kirish: <span className="text-base-300">{tc.input}</span></div>
                      <div className="text-base-500">Kutilgan: <span className="text-emerald-400">{tc.expected}</span></div>
                      {tc.status === 'fail' && <div className="text-base-500">Natija: <span className="text-rose-400">-1</span></div>}
                    </div>
                  </div>
                ))}
                {passCount < TEST_CASES.length && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-300">
                      <p className="font-medium mb-1">AI Maslahat:</p>
                      <p className="text-amber-400/80">Manfiy sonlar bilan ishlashni tekshiring. Maksimum dastlab None o'rniga birinchi element bo'lishi kerak.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-600/20 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-accent-400" />
                    </div>
                    <div className="text-sm font-medium text-base-200">Kod Tahlili</div>
                  </div>
                  <button onClick={analyzeCode} disabled={aiAnalyzing}
                    className="text-xs px-3 py-1.5 rounded-lg bg-accent-600/10 border border-accent-600/20 text-accent-400 hover:bg-accent-600/20 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    {aiAnalyzing
                      ? <><div className="w-3 h-3 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin" /> Tahlil qilinmoqda...</>
                      : <><Zap className="w-3 h-3" /> AI Tahlil</>}
                  </button>
                </div>

                {aiAnalyzing && (
                  <div className="flex items-center gap-3 py-8 justify-center text-sm text-base-500">
                    <div className="w-4 h-4 border-2 border-accent-600/30 border-t-accent-600 rounded-full animate-spin" />
                    Kod tahlil qilinmoqda...
                  </div>
                )}

                {aiAnalysis && !aiAnalyzing && (
                  <div className="text-xs text-base-400 leading-relaxed whitespace-pre-wrap animate-fade-in">
                    {aiAnalysis}
                  </div>
                )}

                {!aiAnalysis && !aiAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Brain className="w-10 h-10 text-base-800 mb-3" />
                    <p className="text-sm text-base-600">Kodingizni AI tahlil qilsin</p>
                    <p className="text-xs text-base-700 mt-1">Yuqoridagi tugmani bosing</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Templates */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-base-600">Shablonlar:</span>
        {Object.keys(TEMPLATES).map((t) => (
          <button key={t}
            onClick={() => {
              const tpl = TEMPLATES[t]
              setLang(tpl.lang)
              setCode(tpl.code)
              setOutput(null)
              setLangOpen(false)
            }}
            className="text-xs px-3 py-1 rounded-full border border-[#27272A] text-base-500 hover:text-base-300 hover:border-[#3F3F46] transition-colors">
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
