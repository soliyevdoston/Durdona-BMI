import { Router } from 'express'
import { prisma, log } from '../prisma'
import { requireAuth, requireRole } from '../auth'

const router = Router()

// Talaba topshiriqlari
router.get('/mine', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const enrollments = await prisma.enrollment.findMany({ where: { userId }, select: { courseId: true } })
  const courseIds = enrollments.map(e => e.courseId)

  const assignments = await prisma.assignment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { title: true } },
      submissions: { where: { userId } },
    },
  })

  const now = new Date()
  const enriched = assignments.map(a => {
    const sub = a.submissions[0]
    let status: string = sub?.status || (new Date(a.dueDate) < now ? 'late' : 'pending')
    return {
      ...a,
      course: a.course.title,
      status,
      grade: sub?.grade,
      submissions: undefined,
    }
  })
  res.json(enriched)
})

// O'qituvchi topshiriqlari
router.get('/teaching', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const teacherId = req.user!.id
  const courses = req.user!.role === 'teacher'
    ? await prisma.course.findMany({ where: { instructorId: teacherId }, select: { id: true } })
    : await prisma.course.findMany({ select: { id: true } })
  const courseIds = courses.map(c => c.id)

  const assignments = await prisma.assignment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { title: true, _count: { select: { enrollments: true } } } },
      submissions: true,
    },
  })

  const enriched = assignments.map(a => {
    const graded = a.submissions.filter(s => s.status === 'graded')
    const avg = graded.length > 0
      ? Math.round(graded.reduce((s, g) => s + (g.grade ?? 0), 0) / graded.length) : 0
    return {
      ...a,
      course: a.course.title,
      submissions: a.submissions.length,
      graded: graded.length,
      total: a.course._count.enrollments,
      avgGrade: avg,
    }
  })
  res.json(enriched)
})

// Submit
router.post('/:id/submit', requireAuth, async (req, res) => {
  const assignment = await prisma.assignment.findUnique({ where: { id: req.params.id } })
  if (!assignment) return res.status(404).json({ error: 'Topshiriq topilmadi' })
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'Kontent kerak' })

  const existing = await prisma.submission.findFirst({
    where: { assignmentId: req.params.id, userId: req.user!.id },
  })
  if (existing) return res.status(409).json({ error: 'Allaqachon topshirilgan' })

  const sub = await prisma.submission.create({
    data: {
      assignmentId: req.params.id,
      userId: req.user!.id,
      content,
      status: 'submitted',
    },
  })
  await log(req.user!.id, 'assignment.submit', { assignmentId: req.params.id })
  res.status(201).json(sub)
})

// Grade
router.post('/submissions/:id/grade', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const { grade, feedback } = req.body
  if (typeof grade !== 'number') return res.status(400).json({ error: 'Grade kerak (raqam)' })

  const sub = await prisma.submission.findUnique({
    where: { id: req.params.id },
    include: { assignment: true },
  })
  if (!sub) return res.status(404).json({ error: 'Topshirish topilmadi' })

  const updated = await prisma.submission.update({
    where: { id: sub.id },
    data: { grade, feedback, status: 'graded', gradedAt: new Date() },
  })

  await prisma.notification.create({
    data: {
      userId: sub.userId,
      type: 'grade',
      title: 'Baho keldi',
      body: `Topshiriq: ${grade}/${sub.assignment.maxGrade}`,
    },
  })

  await log(req.user!.id, 'assignment.grade', { submissionId: sub.id, grade })
  res.json(updated)
})

// Create assignment
router.post('/', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const { title, courseId, description, dueDate, maxGrade, type } = req.body
  if (!title || !courseId || !dueDate) return res.status(400).json({ error: 'Title, courseId, dueDate kerak' })

  const a = await prisma.assignment.create({
    data: {
      title, courseId,
      description: description || '',
      dueDate: new Date(dueDate),
      maxGrade: maxGrade || 100,
      type: type || 'coding',
    },
  })
  await log(req.user!.id, 'assignment.create', { id: a.id })
  res.status(201).json(a)
})

export default router
