import { Router } from 'express'
import { prisma, log } from '../prisma'
import { requireAuth, requireRole } from '../auth'

const router = Router()

// Create lesson
router.post('/', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const { courseId, title, type, duration, xpReward, content, videoUrl } = req.body
  if (!courseId || !title || !type) return res.status(400).json({ error: 'courseId, title, type kerak' })
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) return res.status(404).json({ error: 'Kurs topilmadi' })
  if (course.instructorId !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'super_admin') {
    return res.status(403).json({ error: 'Bu kurs sizniki emas' })
  }
  const last = await prisma.lesson.findFirst({ where: { courseId }, orderBy: { order: 'desc' } })
  const lesson = await prisma.lesson.create({
    data: {
      courseId, title, type,
      duration: duration || '10 daqiqa',
      xpReward: xpReward || 20,
      order: (last?.order ?? 0) + 1,
      content: content || null,
      videoUrl: videoUrl || null,
    },
  })
  const allLessons = await prisma.lesson.findMany({ where: { courseId } })
  const totalMin = allLessons.reduce((s, l) => s + (parseInt(l.duration) || 0), 0)
  await prisma.course.update({ where: { id: courseId }, data: { duration: `${Math.ceil(totalMin / 60) || 1} soat` } })
  await log(req.user!.id, 'lesson.create', { lessonId: lesson.id, courseId })
  res.status(201).json(lesson)
})

// Update lesson
router.patch('/:id', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id }, include: { course: true } })
  if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' })
  if (lesson.course.instructorId !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'super_admin') {
    return res.status(403).json({ error: 'Bu kurs sizniki emas' })
  }
  const updated = await prisma.lesson.update({ where: { id: req.params.id }, data: req.body })
  await log(req.user!.id, 'lesson.update', { lessonId: lesson.id })
  res.json(updated)
})

// Delete lesson
router.delete('/:id', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id }, include: { course: true } })
  if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' })
  if (lesson.course.instructorId !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'super_admin') {
    return res.status(403).json({ error: 'Bu kurs sizniki emas' })
  }
  await prisma.lesson.delete({ where: { id: req.params.id } })
  await log(req.user!.id, 'lesson.delete', { lessonId: req.params.id })
  res.json({ ok: true })
})

router.post('/:id/complete', requireAuth, async (req, res) => {
  const lessonId = req.params.id
  const userId = req.user!.id

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson) return res.status(404).json({ error: 'Dars topilmadi' })

  const existing = await prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } })
  if (existing && existing.completed) {
    return res.json({ ok: true, alreadyCompleted: true })
  }

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() },
  })

  // XP va level
  const levels = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 7000]
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ error: 'User yo\'q' })
  const newXP = user.xp + lesson.xpReward
  let newLevel = 1
  for (let i = levels.length - 1; i >= 0; i--) {
    if (newXP >= levels[i]) { newLevel = i + 1; break }
  }
  await prisma.user.update({ where: { id: userId }, data: { xp: newXP, level: newLevel, lastActive: new Date() } })

  // Enrollment progress
  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } })
  const completedCount = await prisma.lessonProgress.count({
    where: { userId, completed: true, lesson: { courseId: lesson.courseId } },
  })
  const progress = Math.round((completedCount / totalLessons) * 100)
  await prisma.enrollment.updateMany({
    where: { userId, courseId: lesson.courseId },
    data: { progress, completedLessons: completedCount },
  })

  await log(userId, 'lesson.complete', { lessonId, xp: lesson.xpReward })
  res.json({ ok: true, xpEarned: lesson.xpReward, newXP, newLevel })
})

export default router
