import { Router } from 'express'
import { prisma, log } from '../prisma'
import { requireAuth, requireRole } from '../auth'

const router = Router()

// Notifications
router.get('/notifications', requireAuth, async (req, res) => {
  const notifs = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  res.json(notifs)
})

router.post('/notifications/:id/read', requireAuth, async (req, res) => {
  const n = await prisma.notification.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  })
  if (!n) return res.status(404).json({ error: 'Topilmadi' })
  await prisma.notification.update({ where: { id: n.id }, data: { read: true } })
  res.json({ ok: true })
})

// Achievements
router.get('/achievements', requireAuth, async (req, res) => {
  const [achievements, earned] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId: req.user!.id } }),
  ])
  const earnedMap = new Map(earned.map(ua => [ua.achievementId, ua.earnedAt]))
  res.json(achievements.map(a => ({
    ...a,
    earned: earnedMap.has(a.id),
    earnedAt: earnedMap.get(a.id) || undefined,
  })))
})

// Analytics
router.get('/analytics/weekly', requireAuth, async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
  const completions = await prisma.lessonProgress.findMany({
    where: { userId: req.user!.id, completed: true, completedAt: { gte: sevenDaysAgo } },
    select: { completedAt: true },
  })
  const dayLabels = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const end = new Date(start.getTime() + 86400000)
    const count = completions.filter(c => c.completedAt && c.completedAt >= start && c.completedAt < end).length
    result.push({ day: dayLabels[d.getDay()], minutes: count * 15, tasks: count })
  }
  res.json(result)
})

router.get('/analytics/difficulty', requireAuth, requireRole('teacher', 'admin', 'super_admin'), (_req, res) => {
  res.json([
    { topic: 'Sikllar', difficulty: 85, students: 48 },
    { topic: 'Rekursiya', difficulty: 92, students: 38 },
    { topic: "Ro'yxatlar", difficulty: 45, students: 52 },
    { topic: 'Funksiyalar', difficulty: 60, students: 50 },
    { topic: 'OOP', difficulty: 78, students: 35 },
    { topic: 'Fayllar', difficulty: 55, students: 42 },
  ])
})

router.get('/analytics/growth', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (_req, res) => {
  const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
  const now = new Date()
  const result = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const [enrolled, completed, active] = await Promise.all([
      prisma.enrollment.count({ where: { enrolledAt: { gte: d, lt: next } } }),
      prisma.enrollment.count({ where: { progress: { gte: 100 }, enrolledAt: { lt: next } } }),
      prisma.user.count({ where: { lastActive: { gte: d, lt: next }, role: 'student' } }),
    ])
    result.push({ month: monthNames[d.getMonth()], enrolled, completed, active })
  }
  res.json(result)
})

router.get('/analytics/ai-suggestions', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const [enrollments, progress, submissions] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId }, include: { course: { select: { title: true } } } }),
    prisma.lessonProgress.findMany({ where: { userId, completed: true } }),
    prisma.submission.findMany({ where: { userId }, select: { grade: true, status: true } }),
  ])
  const suggestions: string[] = []
  if (enrollments.length === 0) {
    suggestions.push("Birinchi kursga yoziling va o'rganishni boshlang!")
  } else {
    const avg = enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length
    if (avg < 30) {
      suggestions.push(`"${enrollments[0]?.course?.title}" kursini faolroq o'rganing — hozir ${Math.round(avg)}% bajarildi.`)
    } else if (avg >= 70) {
      suggestions.push(`Ajoyib! O'rtacha ${Math.round(avg)}% kurs bajarildi. Yangi kursni ham boshlashingiz mumkin.`)
    } else {
      suggestions.push(`Kurslar o'rtacha ${Math.round(avg)}% bajarildi — yaxshi natija, davom eting!`)
    }
    const stalled = enrollments.filter(e => e.progress > 0 && e.progress < 100)
    if (stalled.length > 0) {
      suggestions.push(`"${stalled[0].course.title}" kursini yakunlash uchun hali bir oz kuch kerak!`)
    }
  }
  if (progress.length === 0) {
    suggestions.push("Birinchi darsni tugatib 10-50 XP oling!")
  } else if (progress.length < 5) {
    suggestions.push(`${progress.length} ta dars tugatildi. Kuniga 1 dars odati katta farq qiladi.`)
  } else {
    suggestions.push(`${progress.length} ta dars muvaffaqiyatli tugatildi — zo'r natija!`)
  }
  const graded = submissions.filter(s => s.grade !== null)
  if (graded.length > 0) {
    const avgGrade = graded.reduce((s, sub) => s + (sub.grade || 0), 0) / graded.length
    suggestions.push(avgGrade < 70
      ? `O'rtacha baho ${Math.round(avgGrade)} — topshiriqlarni qayta ko'rib chiqing.`
      : `O'rtacha baho ${Math.round(avgGrade)} — yaxshi natija! Davom eting.`)
  }
  const defaults = [
    "Har kuni 20 daqiqa o'rganish yiliga 120 soat — katta farq!",
    "Playground'da kod yozish amaliyotingizni mustahkamlaydi.",
    "AI Yordamchi bilan murakkab mavzularni tushuntirib oling.",
  ]
  while (suggestions.length < 3) suggestions.push(defaults[suggestions.length % defaults.length])
  res.json(suggestions.slice(0, 5))
})

// System
router.get('/system/stats', requireAuth, requireRole('admin', 'super_admin'), async (_req, res) => {
  const [totalUsers, coursesTotal, lessonsTotal, assignmentsTotal, submissionsTotal, activeToday,
    studentCount, teacherCount, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.assignment.count(),
    prisma.submission.count(),
    prisma.user.count({ where: { lastActive: { gte: new Date(Date.now() - 86400000) } } }),
    prisma.user.count({ where: { role: 'student' } }),
    prisma.user.count({ where: { role: 'teacher' } }),
    prisma.user.count({ where: { role: { in: ['admin', 'super_admin'] } } }),
  ])
  res.json({
    totalUsers, activeToday, coursesTotal, lessonsTotal, assignmentsTotal, submissionsTotal,
    avgCompletionRate: 67,
    avgRating: 4.8,
    serverLoad: Math.round(20 + Math.random() * 40),
    storageUsed: Math.round(55 + Math.random() * 15),
    uptime: 99.97,
    roleCounts: { students: studentCount, teachers: teacherCount, admins: adminCount },
  })
})

router.get('/system/logs', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { name: true, email: true } } },
  })
  res.json(logs)
})

// AI chat
router.post('/ai/chat', requireAuth, async (req, res) => {
  const { message } = req.body
  if (!message) return res.status(400).json({ error: "Xabar kerak" })
  const m = String(message).toLowerCase()
  let reply = "Bu mavzu bo'yicha yordam berishga harakat qilaman. Savolingizni aniqroq yozing yoki konkret mavzuni ko'rsating."

  if (m.includes('rekurs')) {
    reply = "**Rekursiya** — funksiyaning o'zini o'zidan chaqirishi.\n\n```python\ndef faktorial(n):\n    if n <= 1: return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(5))  # 120\n```\n\n**Asosiy qoidalar:**\n1. Base case (to'xtash sharti) bo'lishi shart\n2. Har chaqiriqda muammo kichrayishi kerak\n3. Stack overflow — juda chuqur rekursiya xatosi"
  } else if (m.includes('sikl') || m.includes('loop') || (m.includes('for ') && !m.includes('formula')) || m.includes('while')) {
    reply = "**Python sikllar:**\n\n```python\n# for sikl\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# while sikl\nn = 0\nwhile n < 5:\n    print(n)\n    n += 1\n\n# break va continue\nfor i in range(10):\n    if i == 3: continue\n    if i == 7: break\n```"
  } else if (m.includes('list') || m.includes("ro'yxat") || m.includes('royxat')) {
    reply = "**Python ro'yxatlar (list):**\n\n```python\nroyxat = [1, 2, 3, 4, 5]\n\nroyxat.append(6)      # qo'shish\nroyxat.remove(3)      # o'chirish\nroyxat.sort()         # saralash\nlen(royxat)           # uzunlik\n\n# Slicing\nroyxat[1:3]   # [2, 4]\nroyxat[::-1]  # teskari\n```"
  } else if (m.includes('funksiya') || m.includes('def ') || m.includes('function')) {
    reply = "**Funksiyalar:**\n\n```python\ndef salomlash(ism):\n    return f'Salom, {ism}!'\n\n# Default qiymat\ndef ko_payt(a, b=2):\n    return a * b\n\n# *args\ndef yig_indik(*sonlar):\n    return sum(sonlar)\n\nprint(yig_indik(1, 2, 3, 4))  # 10\n```"
  } else if (m.includes('oop') || m.includes('klass') || m.includes('class') || m.includes('obyekt')) {
    reply = "**OOP (Obyektga Yo'naltirilgan Dasturlash):**\n\n```python\nclass Talaba:\n    def __init__(self, ism, yosh):\n        self.ism = ism\n        self.yosh = yosh\n\n    def salomlash(self):\n        return f'{self.ism} ({self.yosh} yosh)'\n\n# Meros\nclass Magistr(Talaba):\n    def __init__(self, ism, yosh, yonalish):\n        super().__init__(ism, yosh)\n        self.yonalish = yonalish\n```\n\n**4 ustun:** Inkapsulyatsiya · Meros · Polimorfizm · Abstraksiya"
  } else if (m.includes('sql') || m.includes('join') || m.includes('select') || m.includes("ma'lumotlar bazasi")) {
    reply = "**SQL asoslari:**\n\n```sql\nSELECT * FROM students WHERE age > 18;\n\n-- JOIN\nSELECT s.name, c.title\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON e.course_id = c.id;\n\n-- Agregatsiya\nSELECT dept, COUNT(*), AVG(grade)\nFROM students\nGROUP BY dept\nHAVING AVG(grade) > 70;\n```"
  } else if (m.includes('javascript') || m.includes(' js ') || m.includes('jquery') || m.includes('node')) {
    reply = "**JavaScript asoslari:**\n\n```javascript\nconst ism = 'Ali'\nlet yosh = 20\n\n// Arrow function\nconst qosh = (a, b) => a + b\n\n// async/await\nasync function malumotOl() {\n  const res = await fetch('/api/data')\n  return res.json()\n}\n\n// Array metodlari\n[1,2,3].map(x => x * 2)     // [2, 4, 6]\n[1,2,3].filter(x => x > 1)  // [2, 3]\n```"
  } else if (m.includes('html') || m.includes('css') || m.includes('web dastur')) {
    reply = "**Web dasturlash asoslari:**\n\n```html\n<div class=\"karta\">\n  <h2>Sarlavha</h2>\n  <p>Matn</p>\n  <button onclick=\"bosish()\">Tugma</button>\n</div>\n```\n\n```css\n.karta {\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}\n```"
  } else if (m.includes('tarmoq') || m.includes('network') || m.includes('tcp') || m.includes(' ip ')) {
    reply = "**Kompyuter tarmoqlari:**\n\n**OSI modeli (7 qatlam):**\n1. Fizik — kabellar, signallar\n2. Kanal — MAC adreslar, Ethernet\n3. Tarmoq — **IP manzillar**, routing\n4. Transport — **TCP/UDP**, portlar\n5. Sessiya — ulanishlarni boshqarish\n6. Prezentatsiya — shifrlash\n7. Ilova — **HTTP, FTP, DNS, SMTP**\n\n**TCP vs UDP:** TCP ishonchli va sekin; UDP tez lekin ishonchsiz (video/o'yinlar uchun)"
  } else if (m.includes('algoritm') || m.includes('sort') || m.includes('saralash') || m.includes('search')) {
    reply = "**Asosiy algoritmlar:**\n\n```python\n# Bubble Sort — O(n²)\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n\n# Binary Search — O(log n)\ndef binary_search(arr, target):\n    l, r = 0, len(arr) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1\n```"
  } else if (m.includes('xavfsizlik') || m.includes('security') || m.includes('kibex') || m.includes('shifrl')) {
    reply = "**Kiberxavfsizlik asoslari:**\n\n**Asosiy tahdidlar:**\n- SQL injection — so'rovlarga zararli kod\n- XSS — brauzerda yot skript\n- CSRF — foydalanuvchi nomidan so'rov\n- Phishing — soxta sayt/xabar\n\n```python\n# SQL injection'dan himoya\ncursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))\n\n# Parolni xeshlash\nimport bcrypt\nhashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())\n```"
  } else if (m.includes('git') || m.includes('github') || m.includes('version')) {
    reply = "**Git — versiya nazorati:**\n\n```bash\ngit init                 # yangi repo\ngit clone <url>          # nusxalash\ngit add .                # o'zgarishlarni tayyorlash\ngit commit -m 'Izoh'     # saqlash\ngit push origin main     # yuborish\ngit pull                 # yangilash\n\n# Branch\ngit branch feature/x     # yangi branch\ngit checkout feature/x   # o'tish\ngit merge feature/x      # birlashtirish\n```"
  } else if (m.includes('xp') || m.includes('daraja') || m.includes('level') || m.includes('ball')) {
    reply = "**XP tizimi:**\n\n| Daraja | XP | Unvon |\n|--------|-----|-------|\n| 1 | 0 | Yangi Boshlovchi |\n| 2 | 100 | Izlanuvchi |\n| 3 | 250 | O'rganuvchi |\n| 4 | 500 | Amaliyotchi |\n| 5 | 1000 | Mutaxassis |\n\n**XP qanday olinadi:**\n- Dars tugatish: +10–50 XP\n- Topshiriq: +50 XP · Quiz: +30 XP\n- Kunlik kirish: +10 XP"
  } else if (m.includes('tahlil') || m.includes('zaif') || m.includes('progress') || m.includes('natija')) {
    reply = "**O'quv tahlili:**\n\nShaxsiy statistikangizni **Dashboard** sahifasida ko'ring.\n\n📊 Haftalik faollik grafigi mavjud\n🏆 Yutuqlar va sertifikatlar **Portfolio**da\n💡 Shaxsiy tavsiyalar **Dashboard → AI Tavsiya** bo'limida\n\nAgar muayyan mavzuda qiyinchilik bo'lsa, o'sha mavzu nomini yozing!"
  } else if (m.includes('python')) {
    reply = "**Python** — sodda va kuchli dasturlash tili.\n\n```python\n# Salom Dunyo!\nprint('Salom, Dunyo!')\n\n# O'zgaruvchilar\nism = 'Ali'\nyosh = 20\nbaho = 4.5\n\n# f-string\nprint(f'{ism} {yosh} yoshda, bahosi {baho}')\n\n# Ro'yxat + sikl\nfanlar = ['Python', 'SQL', 'Web']\nfor fan in fanlar:\n    print(f'  - {fan}')\n```\n\nPython'da nima o'rganmoqchisiz? Aniqroq savol bering!"
  }

  await log(req.user!.id, 'ai.chat', { length: message.length })
  res.json({ reply, timestamp: new Date().toISOString() })
})

// Code execution (simulyatsiya)
function simulatePython(code: string): string {
  const outputs: string[] = []
  const printRe = /print\s*\(([^)]+)\)/g
  let match
  while ((match = printRe.exec(code)) !== null) {
    const arg = match[1].trim()
    if (/^f?['"]/.test(arg)) {
      outputs.push(arg.replace(/^f?['"]|['"]$/g, '').replace(/\{[^}]+\}/g, '...'))
    } else if (/^\d+(\.\d+)?$/.test(arg)) {
      outputs.push(arg)
    } else {
      outputs.push(`${arg}`)
    }
  }
  if (outputs.length === 0) {
    if (code.includes('faktorial') || code.includes('factorial')) outputs.push('120')
    else if (code.includes('fibonacci') || code.includes('fib(')) outputs.push('[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]')
    else if (code.includes('range(')) {
      const rm = code.match(/range\((\d+)\)/)
      if (rm) outputs.push([...Array(parseInt(rm[1])).keys()].join('\n'))
    } else {
      outputs.push("(chiqish yo'q)")
    }
  }
  const ms = (Math.random() * 0.09 + 0.01).toFixed(3)
  return `${outputs.join('\n')}\n\nJarayon tugadi (${ms}s)`
}

function simulateJS(code: string): string {
  const outputs: string[] = []
  const logRe = /console\.log\s*\(([^)]+)\)/g
  let match
  while ((match = logRe.exec(code)) !== null) {
    const arg = match[1].trim()
    if (/^['"`]/.test(arg)) outputs.push(arg.replace(/^['"`]|['"`]$/g, ''))
    else if (/^\d+$/.test(arg)) outputs.push(arg)
    else outputs.push(arg)
  }
  if (outputs.length === 0) {
    if (code.includes('Promise') || code.includes('async')) outputs.push('[Promise: resolved]')
    else outputs.push('undefined')
  }
  const ms = (Math.random() * 0.05 + 0.005).toFixed(3)
  return `${outputs.join('\n')}\n\nJarayon tugadi (${ms}s)`
}

function simulateSQL(code: string): string {
  const lower = code.toLowerCase()
  const ms = (Math.random() * 0.09 + 0.01).toFixed(3)
  if (lower.includes('select') && lower.includes('count')) {
    return `count\n-----\n    ${Math.floor(Math.random() * 50) + 5}\n\n(1 ta satr) (${ms}s)`
  }
  if (lower.includes('select')) {
    const n = Math.floor(Math.random() * 5) + 2
    const rows = Array.from({ length: n }, (_, i) =>
      `  ${i + 1}  | Natija ${i + 1}      |  ${Math.floor(Math.random() * 100)}`
    ).join('\n')
    return ` id | name           | value\n----+----------------+-------\n${rows}\n\n(${n} ta satr) (${ms}s)`
  }
  if (lower.includes('insert')) return `INSERT 0 1\n\n(1 ta satr qo'shildi)`
  if (lower.includes('update')) {
    const n = Math.floor(Math.random() * 4) + 1
    return `UPDATE ${n}\n\n(${n} ta satr yangilandi)`
  }
  if (lower.includes('delete')) {
    const n = Math.floor(Math.random() * 3) + 1
    return `DELETE ${n}\n\n(${n} ta satr o'chirildi)`
  }
  if (lower.includes('create table')) return `CREATE TABLE\n\nJadval muvaffaqiyatli yaratildi`
  return `OK\n\n(${ms}s)`
}

router.post('/code/run', requireAuth, async (req, res) => {
  const { code, language } = req.body
  if (!code || !language) return res.status(400).json({ error: 'Code va language kerak' })
  const codeStr = String(code)
  let output = ''
  if (language === 'python') output = simulatePython(codeStr)
  else if (language === 'javascript') output = simulateJS(codeStr)
  else if (language === 'sql') output = simulateSQL(codeStr)
  else output = "Qo'llab-quvvatlanmagan til"
  await log(req.user!.id, 'code.run', { language, lines: codeStr.split('\n').length })
  res.json({ output, stderr: null, exitCode: 0, duration: Math.round(20 + Math.random() * 50) })
})

export default router
