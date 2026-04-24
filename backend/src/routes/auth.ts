import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db, publicUser, log } from '../db'
import { signToken, requireAuth } from '../auth'
import type { Role } from '../types'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password, expectedRole } = req.body as { email?: string; password?: string; expectedRole?: Role }
  if (!email || !password) return res.status(400).json({ error: "Email va parol kerak" })

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return res.status(401).json({ error: "Bunday foydalanuvchi topilmadi" })

  const ok = bcrypt.compareSync(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: "Parol noto'g'ri" })

  if (expectedRole && user.role !== expectedRole && user.role !== 'super_admin') {
    return res.status(403).json({ error: `Bu hisob ${expectedRole} paneliga mos emas` })
  }

  log(user.id, 'auth.login', { role: user.role }, req.ip)
  const token = signToken({ id: user.id, email: user.email, role: user.role })
  res.json({ token, user: publicUser(user) })
})

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body as { name?: string; email?: string; password?: string; role?: Role }
  if (!name || !email || !password) return res.status(400).json({ error: "Ism, email, parol kerak" })
  if (password.length < 4) return res.status(400).json({ error: 'Parol kamida 4 belgi' })

  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (exists) return res.status(409).json({ error: 'Bu email bilan foydalanuvchi bor' })

  const id = 'u-' + Date.now()
  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const newUser = {
    id, name, email,
    passwordHash: bcrypt.hashSync(password, 8),
    role: role || 'student' as Role,
    avatar, xp: 0, level: 1, streak: 0,
    joinedAt: new Date().toISOString(),
  }
  db.users.push(newUser)
  log(id, 'auth.register', { role: newUser.role }, req.ip)

  const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role })
  res.status(201).json({ token, user: publicUser(newUser) })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.users.find(u => u.id === req.user!.id)
  if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
  res.json(publicUser(user))
})

router.post('/logout', requireAuth, (req, res) => {
  log(req.user!.id, 'auth.logout', {}, req.ip)
  res.json({ ok: true })
})

export default router
