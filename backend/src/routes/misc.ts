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
router.get('/analytics/weekly', requireAuth, (_req, res) => {
  res.json([
    { day: 'Du', minutes: 45, tasks: 3 },
    { day: 'Se', minutes: 90, tasks: 6 },
    { day: 'Ch', minutes: 30, tasks: 2 },
    { day: 'Pa', minutes: 120, tasks: 8 },
    { day: 'Ju', minutes: 75, tasks: 5 },
    { day: 'Sh', minutes: 60, tasks: 4 },
    { day: 'Ya', minutes: 0, tasks: 0 },
  ])
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

router.get('/analytics/growth', requireAuth, requireRole('teacher', 'admin', 'super_admin'), (_req, res) => {
  res.json([
    { month: 'Sen', enrolled: 45, completed: 12, active: 38 },
    { month: 'Okt', enrolled: 52, completed: 18, active: 44 },
    { month: 'Noy', enrolled: 61, completed: 25, active: 50 },
    { month: 'Dek', enrolled: 58, completed: 30, active: 45 },
    { month: 'Yan', enrolled: 70, completed: 38, active: 58 },
    { month: 'Fev', enrolled: 78, completed: 45, active: 65 },
    { month: 'Mar', enrolled: 85, completed: 52, active: 72 },
    { month: 'Apr', enrolled: 92, completed: 58, active: 78 },
  ])
})

router.get('/analytics/ai-suggestions', requireAuth, (_req, res) => {
  res.json([
    "Rekursiya mavzusida qiyinchilik sezilmoqda. Vizual animatsiyalar bilan tushuntirilsa samarali bo'ladi.",
    "Jasur Raxmatullayev juda tez ilgarilamoqda — murakkabiroq vazifalar tavsiya etiladi.",
    "Zulfiya 5 kun dars ko'rmadi. Unga motivatsion xabar yuborish foydali bo'lishi mumkin.",
    "Sikllar mavzusidagi test natijalari o'rtacha 58%. Qo'shimcha praktika kerak.",
    "Haftalik aktiv o'quvchilar soni 12% o'sdi — gamifikatsiya strategiyasi ishlayapti.",
  ])
})

// System
router.get('/system/stats', requireAuth, requireRole('admin', 'super_admin'), async (_req, res) => {
  const [totalUsers, coursesTotal, lessonsTotal, assignmentsTotal, submissionsTotal, activeToday] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.assignment.count(),
    prisma.submission.count(),
    prisma.user.count({ where: { lastActive: { gte: new Date(Date.now() - 86400000) } } }),
  ])
  res.json({
    totalUsers, activeToday, coursesTotal, lessonsTotal, assignmentsTotal, submissionsTotal,
    avgCompletionRate: 67,
    avgRating: 4.8,
    serverLoad: Math.round(20 + Math.random() * 40),
    storageUsed: Math.round(55 + Math.random() * 15),
    uptime: 99.97,
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

// AI chat (shablon — keyin OpenAI/Claude ulashish mumkin)
router.post('/ai/chat', requireAuth, async (req, res) => {
  const { message } = req.body
  if (!message) return res.status(400).json({ error: "Xabar kerak" })
  const lower = String(message).toLowerCase()
  let reply = "Bu savol bo'yicha batafsil tushuntirish beraman. Keling, qadam-baqadam ko'rib chiqamiz."
  if (lower.includes('rekurs')) {
    reply = "**Rekursiya** — bu funksiyaning o'zini o'zidan chaqirishi.\n\n```python\ndef faktorial(n):\n    if n <= 1: return 1\n    return n * faktorial(n - 1)\n```\n\n**Muhim:** Base case (to'xtash sharti) bo'lishi shart."
  } else if (lower.includes('sql') || lower.includes('join')) {
    reply = "**SQL JOIN turlari:**\n- INNER JOIN — mos keluvchilar\n- LEFT JOIN — chapdagi barchasi + mos o'ngdagi\n- RIGHT JOIN — o'ngdagi barchasi + mos chapdagi\n- FULL OUTER JOIN — ikkala jadvaldagi barchasi"
  } else if (lower.includes('oop') || lower.includes('klass')) {
    reply = "**OOP 4 prinsipi:**\n1. Inkapsulyatsiya\n2. Merros (Inheritance)\n3. Polimorfizm\n4. Abstraksiya"
  } else if (lower.includes('tahlil') || lower.includes('zaif')) {
    reply = "**Profil tahlili:**\n\n✅ Kuchli: Sikllar 95%, Ro'yxatlar 89%\n⚠️ Zaif: Rekursiya 54%, OOP 48%\n\n📊 Tavsiya: Keyingi 5 dars rekursiyaga"
  }
  await log(req.user!.id, 'ai.chat', { length: message.length })
  res.json({ reply, timestamp: new Date().toISOString() })
})

// Code execution (simulyatsiya)
router.post('/code/run', requireAuth, async (req, res) => {
  const { code, language } = req.body
  if (!code || !language) return res.status(400).json({ error: 'Code va language kerak' })
  const outputs: Record<string, string> = {
    python: `Maksimum son: 9\n\nJarayon tugadi (0.023s)`,
    javascript: `[Promise: resolved]\nJarayon tugadi (0.015s)`,
    sql: `3 ta satr topildi (0.042s)`,
  }
  await log(req.user!.id, 'code.run', { language, lines: String(code).split('\n').length })
  res.json({
    output: outputs[language] || "Qo'llab-quvvatlanmagan til",
    stderr: null,
    exitCode: 0,
    duration: Math.round(20 + Math.random() * 50),
  })
})

export default router
