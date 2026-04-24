/**
 * Neon DB'ga boshlang'ich ma'lumot yuklash.
 * `npm run db:seed` yoki `npm run db:push && npm run db:seed`
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const hash = (p: string) => bcrypt.hashSync(p, 8)

async function main() {
  console.log('→ DB seeding boshlandi...')

  // Mavjud ma'lumotni tozalash (order muhim — relations)
  await prisma.activityLog.deleteMany()
  await prisma.userAchievement.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.lessonProgress.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
  console.log('  ✓ tozalandi')

  // USERS
  const users = await Promise.all([
    prisma.user.create({ data: { id: 'u-001', name: 'Azizbek Karimov', email: 'student@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'AK', xp: 1420, level: 6, streak: 12, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 'u-002', name: 'Dilnoza Yusupova', email: 'teacher@edu.uz', passwordHash: hash('1234'), role: 'teacher', avatar: 'DY', xp: 8500, level: 9, streak: 45, joinedAt: new Date('2023-09-01') } }),
    prisma.user.create({ data: { id: 'u-003', name: 'Sardor Nazarov', email: 'admin@edu.uz', passwordHash: hash('1234'), role: 'admin', avatar: 'SN', joinedAt: new Date('2023-01-15') } }),
    prisma.user.create({ data: { id: 's-002', name: 'Malika Tursunova', email: 'malika@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'MT', xp: 780, level: 4, streak: 3, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-003', name: 'Jasur Raxmatullayev', email: 'jasur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'JR', xp: 3200, level: 8, streak: 28, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-004', name: 'Zulfiya Nazarova', email: 'zulfiya@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'ZN', xp: 210, level: 2, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-005', name: 'Bobur Xolmatov', email: 'bobur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'BX', xp: 1100, level: 5, streak: 7, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-006', name: 'Nilufar Ergasheva', email: 'nilufar@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'NE', xp: 490, level: 3, streak: 1, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-007', name: 'Sherzod Umarov', email: 'sherzod@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SU', xp: 2600, level: 7, streak: 19, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-008', name: 'Dilorom Hasanova', email: 'dilorom@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'DH', xp: 80, level: 1, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 'u-t2', name: 'Bobur Toshmatov', email: 'bobur.t@edu.uz', passwordHash: hash('1234'), role: 'teacher', avatar: 'BT', joinedAt: new Date('2023-10-15') } }),
    prisma.user.create({ data: { id: 'u-t3', name: 'Laziz Abdullayev', email: 'laziz@edu.uz', passwordHash: hash('1234'), role: 'teacher', avatar: 'LA', joinedAt: new Date('2024-02-20') } }),
  ])
  console.log(`  ✓ ${users.length} user yaratildi`)

  // COURSES
  const courses = await Promise.all([
    prisma.course.create({ data: { id: 'c-001', title: "Python Dasturlash Asoslari", description: "Python dasturlash tilini noldan o'rganish. Amaliy loyihalar va real kod yozish.", instructorId: 'u-002', category: 'Dasturlash', difficulty: 'beginner', duration: '24 soat', rating: 4.9, thumbnail: 'python', tags: ['Python', 'OOP', 'Algoritm'] } }),
    prisma.course.create({ data: { id: 'c-002', title: 'Web Dasturlash: HTML, CSS, JS', description: 'Zamonaviy web saytlar yaratish. Responsive dizayn va interaktiv sahifalar.', instructorId: 'u-t2', category: 'Web', difficulty: 'beginner', duration: '30 soat', rating: 4.8, thumbnail: 'web', tags: ['HTML', 'CSS', 'JavaScript', 'DOM'] } }),
    prisma.course.create({ data: { id: 'c-003', title: "Ma'lumotlar Bazasi: SQL", description: "PostgreSQL va MySQL bilan ishlash. Murakkab so'rovlar, optimizatsiya.", instructorId: 'u-t3', category: 'Database', difficulty: 'intermediate', duration: '20 soat', rating: 4.7, thumbnail: 'database', tags: ['SQL', 'PostgreSQL'] } }),
    prisma.course.create({ data: { id: 'c-004', title: 'Kompyuter Tarmoqlari', description: "TCP/IP, OSI modeli, protokollar va tarmoq xavfsizligi asoslari.", instructorId: 'u-002', category: 'Tarmoq', difficulty: 'intermediate', duration: '18 soat', rating: 4.6, thumbnail: 'network', tags: ['TCP/IP', 'OSI'] } }),
    prisma.course.create({ data: { id: 'c-005', title: "Algoritmlar va Ma'lumotlar Tuzilmasi", description: "Saralash, qidirish, graflar, daraxtlar. Murakkablik tahlili.", instructorId: 'u-t3', category: 'Dasturlash', difficulty: 'advanced', duration: '32 soat', rating: 4.9, thumbnail: 'algo', tags: ['DSA', 'Big-O'] } }),
    prisma.course.create({ data: { id: 'c-006', title: 'Kiberxavfsizlik Asoslari', description: "Axborot xavfsizligi, shifrlash, hujumlar va mudofaa usullari.", instructorId: 'u-t2', category: 'Security', difficulty: 'advanced', duration: '28 soat', rating: 4.8, thumbnail: 'security', tags: ['Kriptografiya', 'Pentesting'] } }),
  ])
  console.log(`  ✓ ${courses.length} kurs yaratildi`)

  // LESSONS (Python kursi uchun)
  const lessons = [
    { id: 'l-001', courseId: 'c-001', title: "Python nima va nima uchun?", duration: '8 daq', type: 'video', order: 1, xpReward: 10 },
    { id: 'l-002', courseId: 'c-001', title: "O'rnatish va muhit sozlash", duration: '12 daq', type: 'text', order: 2, xpReward: 10 },
    { id: 'l-003', courseId: 'c-001', title: 'Birinchi dastur: Hello World', duration: '15 daq', type: 'practice', order: 3, xpReward: 20 },
    { id: 'l-004', courseId: 'c-001', title: "O'zgaruvchilar va ma'lumot turlari", duration: '20 daq', type: 'video', order: 4, xpReward: 15 },
    { id: 'l-005', courseId: 'c-001', title: 'Mavzu 1 testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30 },
    { id: 'l-006', courseId: 'c-001', title: 'Shartli operatorlar (if/else)', duration: '18 daq', type: 'video', order: 6, xpReward: 15 },
    { id: 'l-007', courseId: 'c-001', title: 'Sikllar: for va while', duration: '22 daq', type: 'practice', order: 7, xpReward: 25 },
    { id: 'l-008', courseId: 'c-001', title: 'Funksiyalar', duration: '25 daq', type: 'video', order: 8, xpReward: 20 },
    { id: 'l-009', courseId: 'c-001', title: "Ro'yxatlar (Lists)", duration: '20 daq', type: 'practice', order: 9, xpReward: 25 },
    { id: 'l-010', courseId: 'c-001', title: "Lug'atlar (Dictionaries)", duration: '20 daq', type: 'video', order: 10, xpReward: 20 },
  ]
  for (const l of lessons) await prisma.lesson.create({ data: l })
  console.log(`  ✓ ${lessons.length} dars yaratildi`)

  // Lesson count update
  await prisma.course.update({ where: { id: 'c-001' }, data: {} })

  // ENROLLMENTS
  await Promise.all([
    prisma.enrollment.create({ data: { userId: 'u-001', courseId: 'c-001', progress: 65, completedLessons: 31 } }),
    prisma.enrollment.create({ data: { userId: 'u-001', courseId: 'c-002', progress: 30, completedLessons: 18 } }),
    prisma.enrollment.create({ data: { userId: 'u-001', courseId: 'c-003', progress: 10, completedLessons: 4 } }),
    prisma.enrollment.create({ data: { userId: 's-002', courseId: 'c-001', progress: 45, completedLessons: 22 } }),
    prisma.enrollment.create({ data: { userId: 's-003', courseId: 'c-001', progress: 89, completedLessons: 43 } }),
    prisma.enrollment.create({ data: { userId: 's-004', courseId: 'c-001', progress: 18, completedLessons: 9 } }),
    prisma.enrollment.create({ data: { userId: 's-005', courseId: 'c-002', progress: 58, completedLessons: 35 } }),
  ])
  console.log('  ✓ enrollments yaratildi')

  // LESSON PROGRESS
  await Promise.all([
    prisma.lessonProgress.create({ data: { userId: 'u-001', lessonId: 'l-001', completed: true, completedAt: new Date('2024-09-05') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-001', lessonId: 'l-002', completed: true, completedAt: new Date('2024-09-06') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-001', lessonId: 'l-003', completed: true, completedAt: new Date('2024-09-07') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-001', lessonId: 'l-004', completed: true, completedAt: new Date('2024-09-08') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-001', lessonId: 'l-005', completed: true, completedAt: new Date('2024-09-09') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-001', lessonId: 'l-006', completed: true, completedAt: new Date('2024-09-12') } }),
  ])
  console.log('  ✓ lesson progress yaratildi')

  // ASSIGNMENTS
  const assignments = await Promise.all([
    prisma.assignment.create({ data: { id: 'a-001', title: 'Python: Kalkulyator yaratish', courseId: 'c-001', description: "Arifmetik amallarni bajaradigan konsol kalkulyator yarating.", dueDate: new Date('2026-04-25'), type: 'coding' } }),
    prisma.assignment.create({ data: { id: 'a-002', title: 'HTML/CSS: Portfolio sahifasi', courseId: 'c-002', description: "O'z portfoliongizni yarating. Responsive dizayn majburiy.", dueDate: new Date('2026-04-28'), type: 'project' } }),
    prisma.assignment.create({ data: { id: 'a-003', title: 'SQL: Oxirgi test', courseId: 'c-003', description: "SQL bo'yicha yakuniy test.", dueDate: new Date('2026-04-20'), type: 'quiz' } }),
    prisma.assignment.create({ data: { id: 'a-004', title: "Python: Ro'yxatlar va Funksiyalar", courseId: 'c-001', description: "Ro'yxatlar va funksiyalar mavzusida amaliy topshiriq.", dueDate: new Date('2026-04-15'), type: 'coding' } }),
    prisma.assignment.create({ data: { id: 'a-005', title: 'Tarmoqlar: Protokollar testi', courseId: 'c-004', description: "Tarmoq protokollari bo'yicha test.", dueDate: new Date('2026-04-10'), type: 'quiz' } }),
  ])
  console.log(`  ✓ ${assignments.length} topshiriq yaratildi`)

  // SUBMISSIONS
  await Promise.all([
    prisma.submission.create({ data: { id: 'sub-001', assignmentId: 'a-003', userId: 'u-001', content: '...', status: 'submitted' } }),
    prisma.submission.create({ data: { id: 'sub-002', assignmentId: 'a-004', userId: 'u-001', content: '...', status: 'graded', grade: 92, feedback: "A'lo! Juda yaxshi kod.", gradedAt: new Date('2026-04-16') } }),
    prisma.submission.create({ data: { id: 'sub-003', assignmentId: 'a-005', userId: 'u-001', content: '...', status: 'graded', grade: 78, feedback: "Yaxshi, ba'zi javoblar noto'g'ri.", gradedAt: new Date('2026-04-11') } }),
  ])
  console.log('  ✓ submissions yaratildi')

  // NOTIFICATIONS
  await Promise.all([
    prisma.notification.create({ data: { userId: 'u-001', type: 'achievement', title: 'Yangi yutuq!', body: "12 kunlik seriya nishoni olindi" } }),
    prisma.notification.create({ data: { userId: 'u-001', type: 'grade', title: 'Baho keldi', body: "Python: Ro'yxatlar — 92/100" } }),
    prisma.notification.create({ data: { userId: 'u-001', type: 'assignment', title: 'Yangi topshiriq', body: 'Kalkulyator yaratish — 25-aprelga qadar', read: true } }),
  ])
  console.log('  ✓ notifications yaratildi')

  // ACHIEVEMENTS
  const achs = [
    { id: 'ach-001', title: 'Birinchi Qadam', description: 'Birinchi darsni tugatdi', icon: 'rocket', xpReward: 50, category: 'progress' },
    { id: 'ach-002', title: '7 Kunlik Seriya', description: "7 kun ketma-ket o'qidi", icon: 'fire', xpReward: 100, category: 'streak' },
    { id: 'ach-003', title: '12 Kunlik Seriya', description: "12 kun ketma-ket o'qidi", icon: 'bolt', xpReward: 150, category: 'streak' },
    { id: 'ach-004', title: 'Kod Yozuvchi', description: '10 ta kod topshiriqni bajardi', icon: 'code', xpReward: 200, category: 'coding' },
    { id: 'ach-005', title: 'Testchi', description: "20 ta testdan o'tdi", icon: 'check', xpReward: 150, category: 'quiz' },
    { id: 'ach-006', title: 'Loyiha Ustasi', description: '3 ta katta loyiha topshirdi', icon: 'hammer', xpReward: 500, category: 'project' },
    { id: 'ach-007', title: "AI do'stim", description: 'AI assistant bilan 50 ta suhbat', icon: 'bot', xpReward: 200, category: 'ai' },
    { id: 'ach-008', title: 'Mukammal Baho', description: 'Bitta darsda 100/100 oldi', icon: 'percent', xpReward: 300, category: 'grade' },
  ]
  for (const a of achs) await prisma.achievement.create({ data: a })
  console.log(`  ✓ ${achs.length} yutuq yaratildi`)

  // User achievements
  await Promise.all([
    prisma.userAchievement.create({ data: { userId: 'u-001', achievementId: 'ach-001', earnedAt: new Date('2024-09-05') } }),
    prisma.userAchievement.create({ data: { userId: 'u-001', achievementId: 'ach-002', earnedAt: new Date('2024-09-12') } }),
    prisma.userAchievement.create({ data: { userId: 'u-001', achievementId: 'ach-003', earnedAt: new Date('2026-04-23') } }),
    prisma.userAchievement.create({ data: { userId: 'u-001', achievementId: 'ach-004', earnedAt: new Date('2025-01-15') } }),
    prisma.userAchievement.create({ data: { userId: 'u-001', achievementId: 'ach-005', earnedAt: new Date('2025-02-20') } }),
  ])
  console.log('  ✓ user achievements yaratildi')

  console.log('✓ Seeding muvaffaqiyatli tugadi!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
