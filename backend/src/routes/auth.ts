import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma, publicUser, log } from '../prisma'
import { signToken, requireAuth } from '../auth'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password, expectedRole } = req.body as { email?: string; password?: string; expectedRole?: string }
  if (!email || !password) return res.status(400).json({ error: "Email va parol kerak" })

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return res.status(401).json({ error: "Bunday foydalanuvchi topilmadi" })

  const ok = bcrypt.compareSync(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: "Parol noto'g'ri" })

  if (expectedRole && user.role !== expectedRole && user.role !== 'super_admin') {
    return res.status(403).json({ error: `Bu hisob ${expectedRole} paneliga mos emas` })
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastActive: new Date() } })
  await log(user.id, 'auth.login', { role: user.role }, req.ip)

  const token = signToken({ id: user.id, email: user.email, role: user.role as any })
  res.json({ token, user: publicUser(user) })
})

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body as { name?: string; email?: string; password?: string; role?: string }
  if (!name || !email || !password) return res.status(400).json({ error: "Ism, email, parol kerak" })
  if (password.length < 4) return res.status(400).json({ error: 'Parol kamida 4 belgi' })

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) return res.status(409).json({ error: 'Bu email bilan foydalanuvchi bor' })

  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 8),
      role: (role || 'student'),
      avatar,
    },
  })
  await log(newUser.id, 'auth.register', { role: newUser.role }, req.ip)

  const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role as any })
  res.status(201).json({ token, user: publicUser(newUser) })
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
  res.json(publicUser(user))
})

router.post('/logout', requireAuth, async (req, res) => {
  await log(req.user!.id, 'auth.logout', {}, req.ip)
  res.json({ ok: true })
})

export default router
