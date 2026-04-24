import { Router } from 'express'
import { prisma, publicUser, log } from '../prisma'
import { requireAuth, requireRole } from '../auth'

const router = Router()

// Barcha kurslar (joriy foydalanuvchi bilan progress qo'shilgan)
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
      enrollments: { where: { userId } },
      _count: { select: { lessons: true, enrollments: true } },
    },
  })
  const enriched = courses.map(c => {
    const enr = c.enrollments[0]
    return {
      ...c,
      instructor: c.instructor.name,
      instructorAvatar: c.instructor.avatar,
      lessons: c._count.lessons,
      enrolled: c._count.enrollments,
      progress: enr?.progress ?? 0,
      completedLessons: enr?.completedLessons ?? 0,
      isEnrolled: !!enr,
      enrollments: undefined,
      _count: undefined,
    }
  })
  res.json(enriched)
})

// Mening kurslarim
router.get('/mine', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const role = req.user!.role

  if (role === 'teacher' || role === 'admin' || role === 'super_admin') {
    const mine = await prisma.course.findMany({
      where: { instructorId: userId },
      include: { _count: { select: { lessons: true, enrollments: true } } },
    })
    return res.json(mine.map(c => ({
      ...c,
      lessons: c._count.lessons,
      enrolled: c._count.enrollments,
      studentsCount: c._count.enrollments,
      _count: undefined,
    })))
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: true,
          _count: { select: { lessons: true } },
        },
      },
    },
  })
  res.json(enrollments.map(e => ({
    ...e.course,
    instructor: e.course.instructor.name,
    instructorAvatar: e.course.instructor.avatar,
    lessons: e.course._count.lessons,
    progress: e.progress,
    completedLessons: e.completedLessons,
  })))
})

// Kurs detaylari (darslar ro'yxati bilan)
router.get('/:id', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      instructor: true,
      lessons: { orderBy: { order: 'asc' }, include: { progress: { where: { userId } } } },
      enrollments: { where: { userId } },
    },
  })
  if (!course) return res.status(404).json({ error: 'Kurs topilmadi' })

  const enrichedLessons = course.lessons.map((l, idx) => {
    const progress = l.progress[0]
    const prevCompleted = idx === 0 || course.lessons[idx - 1].progress[0]?.completed
    return {
      ...l,
      completed: !!progress?.completed,
      locked: !prevCompleted,
      progress: undefined,
    }
  })

  res.json({
    ...course,
    instructor: publicUser(course.instructor),
    lessons: enrichedLessons,
    enrollment: course.enrollments[0] || null,
    enrollments: undefined,
  })
})

// Enroll
router.post('/:id/enroll', requireAuth, async (req, res) => {
  const courseId = req.params.id
  const userId = req.user!.id

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) return res.status(404).json({ error: 'Kurs topilmadi' })

  const existing = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } })
  if (existing) return res.status(409).json({ error: 'Allaqachon yozilgansiz' })

  await prisma.enrollment.create({ data: { userId, courseId } })
  await log(userId, 'course.enroll', { courseId })
  res.status(201).json({ ok: true })
})

// Create
router.post('/', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const { title, description, category, difficulty, tags, duration } = req.body
  if (!title || !description || !category) return res.status(400).json({ error: "Title, description, category majburiy" })

  const course = await prisma.course.create({
    data: {
      title, description,
      instructorId: req.user!.id,
      category,
      difficulty: difficulty || 'beginner',
      duration: duration || '0 soat',
      tags: tags || [],
    },
  })
  await log(req.user!.id, 'course.create', { courseId: course.id })
  res.status(201).json(course)
})

// Update
router.patch('/:id', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } })
  if (!course) return res.status(404).json({ error: 'Kurs topilmadi' })
  if (course.instructorId !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'super_admin') {
    return res.status(403).json({ error: "Bu kurs sizniki emas" })
  }
  const updated = await prisma.course.update({ where: { id: req.params.id }, data: req.body })
  await log(req.user!.id, 'course.update', { courseId: course.id })
  res.json(updated)
})

// Delete
router.delete('/:id', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } })
    await log(req.user!.id, 'course.delete', { courseId: req.params.id })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Kurs topilmadi' })
  }
})

export default router
