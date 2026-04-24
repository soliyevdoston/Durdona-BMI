import { Router } from 'express'
import { prisma, log } from '../prisma'
import { requireAuth } from '../auth'

const router = Router()

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
