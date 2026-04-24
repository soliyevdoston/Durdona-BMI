import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma, publicUser, log } from '../prisma'
import { requireAuth, requireRole } from '../auth'

const router = Router()

// List — only admin
router.get('/', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  const role = req.query.role as string | undefined
  const q = (req.query.q as string | undefined)?.toLowerCase()
  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] } : {}),
    },
    orderBy: { joinedAt: 'desc' },
  })
  res.json(users.map(publicUser))
})

// Students with analytics
router.get('/students', requireAuth, requireRole('teacher', 'admin', 'super_admin'), async (req, res) => {
  const teacherId = req.user!.id
  const role = req.user!.role

  let students: any[]
  if (role === 'teacher') {
    const myCourses = await prisma.course.findMany({ where: { instructorId: teacherId }, select: { id: true } })
    const courseIds = myCourses.map(c => c.id)
    students = await prisma.user.findMany({
      where: {
        role: 'student',
        enrollments: { some: { courseId: { in: courseIds } } },
      },
      include: {
        enrollments: { where: { courseId: { in: courseIds } } },
        submissions: {
          include: { assignment: true },
          where: { assignment: { courseId: { in: courseIds } } },
        },
      },
    })
  } else {
    students = await prisma.user.findMany({
      where: { role: 'student' },
      include: { enrollments: true, submissions: true },
    })
  }

  const enriched = await Promise.all(students.map(async (s) => {
    const courses = s.enrollments.map((e: any) => e.courseId)
    const avgProgress = s.enrollments.length > 0
      ? Math.round(s.enrollments.reduce((sum: number, e: any) => sum + e.progress, 0) / s.enrollments.length)
      : 0
    const totalTasks = await prisma.assignment.count({ where: { courseId: { in: courses } } })
    const completedTasks = s.submissions.filter((sub: any) => sub.status === 'graded').length

    const risk: 'low' | 'medium' | 'high' =
      s.streak === 0 || avgProgress < 20 ? 'high' :
      s.streak < 5 || avgProgress < 50 ? 'medium' : 'low'

    return {
      ...publicUser(s),
      progress: avgProgress,
      courses,
      completedTasks,
      totalTasks,
      lastActive: s.lastActive,
      risk,
      enrollments: undefined,
      submissions: undefined,
    }
  }))
  res.json(enriched)
})

router.post('/', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password || !role) return res.status(400).json({ error: "Hamma maydon majburiy" })
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) return res.status(409).json({ error: 'Bu email mavjud' })

  const avatar = String(name).split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const u = await prisma.user.create({
    data: {
      name, email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 8),
      role, avatar,
    },
  })
  await log(req.user!.id, 'user.create', { id: u.id, role: u.role })
  res.status(201).json(publicUser(u))
})

router.patch('/:id', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  const { name, email, role } = req.body
  const u = await prisma.user.update({
    where: { id: req.params.id },
    data: { ...(name && { name }), ...(email && { email }), ...(role && { role }) },
  }).catch(() => null)
  if (!u) return res.status(404).json({ error: 'Topilmadi' })
  await log(req.user!.id, 'user.update', { id: u.id })
  res.json(publicUser(u))
})

router.delete('/:id', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  if (req.params.id === req.user!.id) return res.status(400).json({ error: "O'zingizni o'chira olmaysiz" })
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    await log(req.user!.id, 'user.delete', { id: req.params.id })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Topilmadi' })
  }
})

export default router
