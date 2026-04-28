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
    // Durdona demo hisoblar
    prisma.user.create({ data: { id: 'u-d1', name: 'Durdona Talaba', email: 'durdona@student.uz', passwordHash: hash('1234'), role: 'student', avatar: 'DT', xp: 950, level: 5, streak: 8, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 'u-d2', name: 'Durdona Ustoz', email: 'durdona@gmail.com', passwordHash: hash('1234'), role: 'teacher', avatar: 'DU', xp: 5000, level: 8, streak: 30, joinedAt: new Date('2023-09-01') } }),
    prisma.user.create({ data: { id: 'u-d3', name: 'Durdona Admin', email: 'durdona@admin.uz', passwordHash: hash('1234'), role: 'admin', avatar: 'DA', joinedAt: new Date('2023-01-15') } }),
    // Talabalar
    prisma.user.create({ data: { id: 's-002', name: 'Nilufar Rashidova', email: 'nilufar@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'NR', xp: 780, level: 4, streak: 3, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-003', name: 'Bobur Xasanov', email: 'bobur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'BX', xp: 3200, level: 8, streak: 28, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-004', name: 'Shahlo Mirzayeva', email: 'shahlo@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SM', xp: 720, level: 4, streak: 15, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-005', name: 'Jasur Toshmatov', email: 'jasur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'JT', xp: 430, level: 3, streak: 6, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-006', name: 'Malika Yusupova', email: 'malika@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'MY', xp: 260, level: 2, streak: 2, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-007', name: 'Sardor Nazarov', email: 'sardor@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SN', xp: 890, level: 5, streak: 20, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-008', name: 'Zulfiya Ergasheva', email: 'zulfiya@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'ZE', xp: 150, level: 2, joinedAt: new Date('2024-09-01') } }),
  ])
  console.log(`  ✓ ${users.length} user yaratildi`)

  // COURSES
  const courses = await Promise.all([
    prisma.course.create({ data: { id: 'c-001', title: "Python Dasturlash Asoslari", description: "Python dasturlash tilini noldan o'rganish. Amaliy loyihalar va real kod yozish.", instructorId: 'u-d2', category: 'Dasturlash', difficulty: 'beginner', duration: '24 soat', rating: 4.9, thumbnail: 'python', tags: ['Python', 'OOP', 'Algoritm'] } }),
    prisma.course.create({ data: { id: 'c-002', title: 'Web Dasturlash: HTML, CSS, JS', description: 'Zamonaviy web saytlar yaratish. Responsive dizayn va interaktiv sahifalar.', instructorId: 'u-d2', category: 'Web', difficulty: 'beginner', duration: '30 soat', rating: 4.8, thumbnail: 'web', tags: ['HTML', 'CSS', 'JavaScript', 'DOM'] } }),
    prisma.course.create({ data: { id: 'c-003', title: "Ma'lumotlar Bazasi: SQL", description: "PostgreSQL va MySQL bilan ishlash. Murakkab so'rovlar, optimizatsiya.", instructorId: 'u-d2', category: 'Database', difficulty: 'intermediate', duration: '20 soat', rating: 4.7, thumbnail: 'database', tags: ['SQL', 'PostgreSQL'] } }),
    prisma.course.create({ data: { id: 'c-004', title: 'Kompyuter Tarmoqlari', description: "TCP/IP, OSI modeli, protokollar va tarmoq xavfsizligi asoslari.", instructorId: 'u-d2', category: 'Tarmoq', difficulty: 'intermediate', duration: '18 soat', rating: 4.6, thumbnail: 'network', tags: ['TCP/IP', 'OSI'] } }),
    prisma.course.create({ data: { id: 'c-005', title: "Algoritmlar va Ma'lumotlar Tuzilmasi", description: "Saralash, qidirish, graflar, daraxtlar. Murakkablik tahlili.", instructorId: 'u-d2', category: 'Dasturlash', difficulty: 'advanced', duration: '32 soat', rating: 4.9, thumbnail: 'algo', tags: ['DSA', 'Big-O'] } }),
    prisma.course.create({ data: { id: 'c-006', title: 'Kiberxavfsizlik Asoslari', description: "Axborot xavfsizligi, shifrlash, hujumlar va mudofaa usullari.", instructorId: 'u-d2', category: 'Security', difficulty: 'advanced', duration: '28 soat', rating: 4.8, thumbnail: 'security', tags: ['Kriptografiya', 'Pentesting'] } }),
  ])
  console.log(`  ✓ ${courses.length} kurs yaratildi`)

  // LESSONS — barcha 6 kurs uchun real YouTube video URL'lar bilan
  const lessons = [
    // c-001: Python Dasturlash Asoslari
    { id: 'l-001', courseId: 'c-001', title: "Python nima va nima uchun?", duration: '8 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/fU-3YmGTWyg' },
    { id: 'l-002', courseId: 'c-001', title: "O'rnatish va muhit sozlash", duration: '12 daq', type: 'video', order: 2, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/YYXdXT2l-Gg' },
    { id: 'l-003', courseId: 'c-001', title: 'Birinchi dastur: Hello World', duration: '15 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/BCoaT2mnX2M' },
    { id: 'l-004', courseId: 'c-001', title: "O'zgaruvchilar va ma'lumot turlari", duration: '20 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/cQT33yu9pY8' },
    { id: 'l-005', courseId: 'c-001', title: 'Mavzu 1 testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-006', courseId: 'c-001', title: 'Shartli operatorlar (if/else)', duration: '18 daq', type: 'video', order: 6, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/DZwmZ8Usvnk' },
    { id: 'l-007', courseId: 'c-001', title: 'Sikllar: for va while', duration: '22 daq', type: 'video', order: 7, xpReward: 25, videoUrl: 'https://www.youtube.com/embed/6iF8Xb7Z3wQ' },
    { id: 'l-008', courseId: 'c-001', title: 'Funksiyalar', duration: '25 daq', type: 'video', order: 8, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I' },
    { id: 'l-009', courseId: 'c-001', title: "Ro'yxatlar (Lists)", duration: '20 daq', type: 'video', order: 9, xpReward: 25, videoUrl: 'https://www.youtube.com/embed/KWKWswDfAb0' },
    { id: 'l-010', courseId: 'c-001', title: "Lug'atlar (Dictionaries)", duration: '20 daq', type: 'video', order: 10, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/daefaLgNkw0' },
    // c-002: Web Dasturlash: HTML, CSS, JS
    { id: 'l-011', courseId: 'c-002', title: 'HTML asoslari: teg va atributlar', duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/Pa2T08n_UdA' },
    { id: 'l-012', courseId: 'c-002', title: 'CSS: selektorlar va xossalar', duration: '15 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/l1mER1bV0N0' },
    { id: 'l-013', courseId: 'c-002', title: 'Flexbox va Grid layout', duration: '20 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/9zA8cB-54SA' },
    { id: 'l-014', courseId: 'c-002', title: 'JavaScript: asosiy tushunchalar', duration: '18 daq', type: 'video', order: 4, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c' },
    { id: 'l-015', courseId: 'c-002', title: 'DOM manipulyatsiya', duration: '22 daq', type: 'video', order: 5, xpReward: 25, videoUrl: 'https://www.youtube.com/embed/y17RuWkWdn8' },
    { id: 'l-016', courseId: 'c-002', title: 'Web loyiha: portfolio sahifasi', duration: '30 daq', type: 'video', order: 6, xpReward: 40, videoUrl: 'https://www.youtube.com/embed/0YFrGy_mzjY' },
    // c-003: Ma'lumotlar Bazasi: SQL
    { id: 'l-017', courseId: 'c-003', title: "SQL nima? Ma'lumotlar bazasi asoslari", duration: '10 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' },
    { id: 'l-018', courseId: 'c-003', title: 'SELECT so\'rovi va filtrlar', duration: '15 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/9Pzj7Aj25lw' },
    { id: 'l-019', courseId: 'c-003', title: 'JOIN turlari: INNER, LEFT, RIGHT', duration: '20 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/G3lJAxg1cy8' },
    { id: 'l-020', courseId: 'c-003', title: 'Jadvallar yaratish va o\'zgartirish', duration: '18 daq', type: 'video', order: 4, xpReward: 25, videoUrl: 'https://www.youtube.com/embed/fuQzoHx2sG0' },
    { id: 'l-021', courseId: 'c-003', title: 'SQL testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-004: Kompyuter Tarmoqlari
    { id: 'l-022', courseId: 'c-004', title: 'OSI modeli: 7 qatlam', duration: '14 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/vv4y_uOneC0' },
    { id: 'l-023', courseId: 'c-004', title: 'TCP/IP protokol to\'plami', duration: '16 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/2QGgEk20RXM' },
    { id: 'l-024', courseId: 'c-004', title: 'IP manzillash va subnetting', duration: '20 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/Pb6R1QCGMPY' },
    { id: 'l-025', courseId: 'c-004', title: 'Tarmoq xavfsizligi asoslari', duration: '18 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/KjN64N6-_Sk' },
    { id: 'l-026', courseId: 'c-004', title: 'Tarmoqlar testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-005: Algoritmlar va Ma'lumotlar Tuzilmasi
    { id: 'l-027', courseId: 'c-005', title: "Big-O notatsiya va murakkablik tahlili", duration: '15 daq', type: 'video', order: 1, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/D6xkbGLQesk' },
    { id: 'l-028', courseId: 'c-005', title: 'Saralash algoritmlari: Bubble, Selection', duration: '20 daq', type: 'video', order: 2, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/dkcdOmkiHRI' },
    { id: 'l-029', courseId: 'c-005', title: 'Binary Search algoritmi', duration: '18 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/P3YID7liBug' },
    { id: 'l-030', courseId: 'c-005', title: 'Stack va Queue tuzilmalari', duration: '22 daq', type: 'video', order: 4, xpReward: 25, videoUrl: 'https://www.youtube.com/embed/A3ZUpyrnCbM' },
    { id: 'l-031', courseId: 'c-005', title: "DSA testi", duration: '10 daq', type: 'quiz', order: 5, xpReward: 35, videoUrl: null },
    // c-006: Kiberxavfsizlik Asoslari
    { id: 'l-032', courseId: 'c-006', title: "Kiberxavfsizlikka kirish", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/z5nc9MDbvkw' },
    { id: 'l-033', courseId: 'c-006', title: "Shifrlash asoslari: simmetrik va asimmetrik", duration: '18 daq', type: 'video', order: 2, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/o_g-M7UBqI8' },
    { id: 'l-034', courseId: 'c-006', title: "OWASP Top 10 zaifliklar", duration: '20 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/rCEN1DpcNcc' },
    { id: 'l-035', courseId: 'c-006', title: "Parollar va autentifikatsiya", duration: '16 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/nS36NgJL8-w' },
    { id: 'l-036', courseId: 'c-006', title: "Xavfsizlik testi", duration: '10 daq', type: 'quiz', order: 5, xpReward: 35, videoUrl: null },
  ]
  for (const l of lessons) await prisma.lesson.create({ data: l })
  console.log(`  ✓ ${lessons.length} dars yaratildi`)

  // Lesson count update
  await prisma.course.update({ where: { id: 'c-001' }, data: {} })

  // ENROLLMENTS
  await Promise.all([
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-001', progress: 60, completedLessons: 6 } }),
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-002', progress: 33, completedLessons: 2 } }),
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-003', progress: 20, completedLessons: 1 } }),
    prisma.enrollment.create({ data: { userId: 's-002', courseId: 'c-001', progress: 40, completedLessons: 4 } }),
    prisma.enrollment.create({ data: { userId: 's-003', courseId: 'c-001', progress: 80, completedLessons: 8 } }),
    prisma.enrollment.create({ data: { userId: 's-004', courseId: 'c-001', progress: 10, completedLessons: 1 } }),
    prisma.enrollment.create({ data: { userId: 's-005', courseId: 'c-002', progress: 50, completedLessons: 3 } }),
  ])
  console.log('  ✓ enrollments yaratildi')

  // LESSON PROGRESS
  await Promise.all([
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-001', completed: true, completedAt: new Date('2024-09-05') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-002', completed: true, completedAt: new Date('2024-09-06') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-003', completed: true, completedAt: new Date('2024-09-07') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-004', completed: true, completedAt: new Date('2024-09-08') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-005', completed: true, completedAt: new Date('2024-09-09') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-006', completed: true, completedAt: new Date('2024-09-12') } }),
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
    prisma.submission.create({ data: { id: 'sub-001', assignmentId: 'a-003', userId: 'u-d1', content: '...', status: 'submitted' } }),
    prisma.submission.create({ data: { id: 'sub-002', assignmentId: 'a-004', userId: 'u-d1', content: '...', status: 'graded', grade: 92, feedback: "A'lo! Juda yaxshi kod.", gradedAt: new Date('2026-04-16') } }),
    prisma.submission.create({ data: { id: 'sub-003', assignmentId: 'a-005', userId: 'u-d1', content: '...', status: 'graded', grade: 78, feedback: "Yaxshi, ba'zi javoblar noto'g'ri.", gradedAt: new Date('2026-04-11') } }),
  ])
  console.log('  ✓ submissions yaratildi')

  // NOTIFICATIONS
  await Promise.all([
    prisma.notification.create({ data: { userId: 'u-d1', type: 'achievement', title: 'Yangi yutuq!', body: "12 kunlik seriya nishoni olindi" } }),
    prisma.notification.create({ data: { userId: 'u-d1', type: 'grade', title: 'Baho keldi', body: "Python: Ro'yxatlar — 92/100" } }),
    prisma.notification.create({ data: { userId: 'u-d1', type: 'assignment', title: 'Yangi topshiriq', body: 'Kalkulyator yaratish — 25-aprelga qadar', read: true } }),
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
    prisma.userAchievement.create({ data: { userId: 'u-d1', achievementId: 'ach-001', earnedAt: new Date('2024-09-05') } }),
    prisma.userAchievement.create({ data: { userId: 'u-d1', achievementId: 'ach-002', earnedAt: new Date('2024-09-12') } }),
    prisma.userAchievement.create({ data: { userId: 'u-d1', achievementId: 'ach-003', earnedAt: new Date('2026-04-23') } }),
    prisma.userAchievement.create({ data: { userId: 'u-d1', achievementId: 'ach-004', earnedAt: new Date('2025-01-15') } }),
    prisma.userAchievement.create({ data: { userId: 'u-d1', achievementId: 'ach-005', earnedAt: new Date('2025-02-20') } }),
  ])
  console.log('  ✓ user achievements yaratildi')

  console.log('✓ Seeding muvaffaqiyatli tugadi!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
