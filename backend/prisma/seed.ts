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
    prisma.user.create({ data: { id: 'u-d1', name: "Durdona O'quvchi", email: 'durdona@student.uz', passwordHash: hash('1234'), role: 'student', avatar: 'DO', xp: 950, level: 5, streak: 8, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 'u-d2', name: 'Durdona Ustoz', email: 'durdona@gmail.com', passwordHash: hash('1234'), role: 'teacher', avatar: 'DU', xp: 5000, level: 8, streak: 30, joinedAt: new Date('2023-09-01') } }),
    prisma.user.create({ data: { id: 'u-d3', name: 'Durdona Admin', email: 'durdona@admin.uz', passwordHash: hash('1234'), role: 'admin', avatar: 'DA', joinedAt: new Date('2023-01-15') } }),
    prisma.user.create({ data: { id: 's-002', name: 'Nilufar Rashidova', email: 'nilufar@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'NR', xp: 780, level: 4, streak: 3, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-003', name: 'Bobur Xasanov', email: 'bobur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'BX', xp: 3200, level: 8, streak: 28, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-004', name: 'Shahlo Mirzayeva', email: 'shahlo@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SM', xp: 720, level: 4, streak: 15, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-005', name: 'Jasur Toshmatov', email: 'jasur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'JT', xp: 430, level: 3, streak: 6, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-006', name: 'Malika Yusupova', email: 'malika@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'MY', xp: 260, level: 2, streak: 2, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-007', name: 'Sardor Nazarov', email: 'sardor@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SN', xp: 890, level: 5, streak: 20, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-008', name: 'Zulfiya Ergasheva', email: 'zulfiya@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'ZE', xp: 150, level: 2, joinedAt: new Date('2024-09-01') } }),
  ])
  console.log(`  ✓ ${users.length} user yaratildi`)

  // COURSES — faqat maktab informatikasi
  const courses = await Promise.all([
    prisma.course.create({ data: { id: 'c-001', title: 'Kompyuter Savodxonligi', description: "Kompyuter qismlari, operatsion tizim, fayl tizimi va asosiy ko'nikmalar.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'beginner', duration: '16 soat', rating: 4.9, thumbnail: 'computer', tags: ['Kompyuter', 'Windows', 'Fayl tizimi'] } }),
    prisma.course.create({ data: { id: 'c-002', title: 'Ofis Dasturlari', description: "MS Word, Excel va PowerPoint bilan ishlash. Hujjat, jadval va taqdimot yaratish.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'beginner', duration: '20 soat', rating: 4.8, thumbnail: 'files', tags: ['Word', 'Excel', 'PowerPoint'] } }),
    prisma.course.create({ data: { id: 'c-003', title: 'Algoritmlar va Dasturlash Asoslari', description: "Algoritm tushunchasi, blok-sxema va Python dasturlash tili asoslari.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'beginner', duration: '24 soat', rating: 4.9, thumbnail: 'algo', tags: ['Algoritm', 'Python', 'Blok-sxema'] } }),
    prisma.course.create({ data: { id: 'c-004', title: 'Internet va Axborot Xavfsizligi', description: "Internet ishlash tamoyillari, elektron pochta, xavfsiz internet va kiber tahdidlardan himoya.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'beginner', duration: '14 soat', rating: 4.7, thumbnail: 'network', tags: ['Internet', 'Xavfsizlik', 'Tarmoq'] } }),
    prisma.course.create({ data: { id: 'c-005', title: "Ma'lumotlar Bazasi Asoslari", description: "Ma'lumotlar bazasi tushunchasi, MS Access va SQL so'rovlari bilan ishlash.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'intermediate', duration: '18 soat', rating: 4.7, thumbnail: 'database', tags: ['SQL', 'Access', "Ma'lumotlar bazasi"] } }),
    prisma.course.create({ data: { id: 'c-006', title: 'Web Texnologiyalar: HTML va CSS', description: "HTML tuzilishi, CSS uslublash va oddiy veb-sahifa yaratish asoslari.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'intermediate', duration: '20 soat', rating: 4.8, thumbnail: 'web', tags: ['HTML', 'CSS', 'Veb-sahifa'] } }),
  ])
  console.log(`  ✓ ${courses.length} kurs yaratildi`)

  // LESSONS
  const lessons = [
    // c-001: Kompyuter Savodxonligi
    { id: 'l-001', courseId: 'c-001', title: "Kompyuter nima? Asosiy qismlar", duration: '10 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/ExxFxD4OSZ0' },
    { id: 'l-002', courseId: 'c-001', title: "Operatsion tizim va ish stoli", duration: '12 daq', type: 'video', order: 2, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/GjNp0bBrjmU' },
    { id: 'l-003', courseId: 'c-001', title: "Fayllar va papkalar bilan ishlash", duration: '14 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/qrl0pHRXX0c' },
    { id: 'l-004', courseId: 'c-001', title: "Klaviatura va sichqoncha ko'nikmalari", duration: '10 daq', type: 'video', order: 4, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/sFr7EJiMTys' },
    { id: 'l-005', courseId: 'c-001', title: 'Kompyuter asoslari testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-006', courseId: 'c-001', title: "Printerlar va tashqi qurilmalar", duration: '12 daq', type: 'video', order: 6, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/1jsH_zBbud4' },
    // c-002: Ofis Dasturlari
    { id: 'l-011', courseId: 'c-002', title: "MS Word: Hujjat yaratish va formatlash", duration: '14 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/S-nM2RXnhPY' },
    { id: 'l-012', courseId: 'c-002', title: "MS Word: Jadval va rasmlar qo'shish", duration: '14 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/q0LQOT4nfxI' },
    { id: 'l-013', courseId: 'c-002', title: "MS Excel: Elektron jadval asoslari", duration: '16 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAI' },
    { id: 'l-014', courseId: 'c-002', title: "MS Excel: Formulalar va funksiyalar", duration: '18 daq', type: 'video', order: 4, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/yCTMeqRJHnA' },
    { id: 'l-015', courseId: 'c-002', title: 'Ofis dasturlari testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-016', courseId: 'c-002', title: "PowerPoint: Taqdimot yaratish", duration: '14 daq', type: 'video', order: 6, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/SKfXA8bO37s' },
    // c-003: Algoritmlar va Dasturlash
    { id: 'l-017', courseId: 'c-003', title: "Algoritm nima? Kundalik misollar", duration: '10 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/Q_itdXI3YeE' },
    { id: 'l-018', courseId: 'c-003', title: "Blok-sxema tuzish qoidalari", duration: '12 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/yRfU7BkV4RM' },
    { id: 'l-019', courseId: 'c-003', title: "Python kirish: o'rnatish va birinchi dastur", duration: '15 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/fU-3YmGTWyg' },
    { id: 'l-020', courseId: 'c-003', title: "Python: o'zgaruvchilar va ma'lumot turlari", duration: '18 daq', type: 'video', order: 4, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/cQT33yu9pY8' },
    { id: 'l-021', courseId: 'c-003', title: 'Algoritmlar testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-022', courseId: 'c-003', title: "Python: shartli operatorlar (if/else)", duration: '16 daq', type: 'video', order: 6, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/DZwmZ8Usvnk' },
    { id: 'l-023', courseId: 'c-003', title: "Python: sikllar (for, while)", duration: '18 daq', type: 'video', order: 7, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/6iF8Xb7Z3wQ' },
    { id: 'l-024', courseId: 'c-003', title: "Python: funksiyalar", duration: '20 daq', type: 'video', order: 8, xpReward: 25, videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I' },
    // c-004: Internet va Axborot Xavfsizligi
    { id: 'l-025', courseId: 'c-004', title: "Internet qanday ishlaydi?", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/x3c1ih2NJEg' },
    { id: 'l-026', courseId: 'c-004', title: "Brauzer va qidiruv tizimlari", duration: '10 daq', type: 'video', order: 2, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/DuSURHrZG6I' },
    { id: 'l-027', courseId: 'c-004', title: "Elektron pochta (e-mail) bilan ishlash", duration: '12 daq', type: 'video', order: 3, xpReward: 15, videoUrl: null },
    { id: 'l-028', courseId: 'c-004', title: "Axborot xavfsizligi: parollar va tahdidlar", duration: '14 daq', type: 'video', order: 4, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/aEmXK4b7GHk' },
    { id: 'l-029', courseId: 'c-004', title: 'Internet xavfsizligi testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-005: Ma'lumotlar Bazasi
    { id: 'l-030', courseId: 'c-005', title: "Ma'lumotlar bazasi nima?", duration: '10 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' },
    { id: 'l-031', courseId: 'c-005', title: "Jadval, ustun va qatorlar tushunchasi", duration: '12 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/9Pzj7Aj25lw' },
    { id: 'l-032', courseId: 'c-005', title: "SQL: SELECT so'rovi va shartlar", duration: '16 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/fuQzoHx2sG0' },
    { id: 'l-033', courseId: 'c-005', title: "SQL: Ma'lumot qo'shish va o'chirish", duration: '14 daq', type: 'video', order: 4, xpReward: 15, videoUrl: null },
    { id: 'l-034', courseId: 'c-005', title: "Ma'lumotlar bazasi testi", duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-006: Web Texnologiyalar
    { id: 'l-035', courseId: 'c-006', title: "HTML nima? Birinchi sahifa", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/Pa2T08n_UdA' },
    { id: 'l-036', courseId: 'c-006', title: "HTML: teglar va atributlar", duration: '14 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/salY_Sm6mv4' },
    { id: 'l-037', courseId: 'c-006', title: "CSS: selektorlar va xossalar", duration: '16 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/l1mER1bV0N0' },
    { id: 'l-038', courseId: 'c-006', title: "CSS: rang, shrift va joylashuv", duration: '16 daq', type: 'video', order: 4, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
    { id: 'l-039', courseId: 'c-006', title: 'Web texnologiyalar testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-040', courseId: 'c-006', title: "Loyiha: shaxsiy veb-sahifa yaratish", duration: '25 daq', type: 'video', order: 6, xpReward: 40, videoUrl: 'https://www.youtube.com/embed/0YFrGy_mzjY' },
  ]
  for (const l of lessons) await prisma.lesson.create({ data: l })
  console.log(`  ✓ ${lessons.length} dars yaratildi`)

  // ENROLLMENTS
  await Promise.all([
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-001', progress: 60, completedLessons: 4 } }),
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-003', progress: 37, completedLessons: 3 } }),
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-006', progress: 25, completedLessons: 2 } }),
    prisma.enrollment.create({ data: { userId: 's-002', courseId: 'c-001', progress: 40, completedLessons: 2 } }),
    prisma.enrollment.create({ data: { userId: 's-003', courseId: 'c-003', progress: 75, completedLessons: 6 } }),
    prisma.enrollment.create({ data: { userId: 's-004', courseId: 'c-002', progress: 20, completedLessons: 1 } }),
    prisma.enrollment.create({ data: { userId: 's-005', courseId: 'c-004', progress: 60, completedLessons: 3 } }),
  ])
  console.log('  ✓ enrollments yaratildi')

  // LESSON PROGRESS
  await Promise.all([
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-001', completed: true, completedAt: new Date('2024-09-05') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-002', completed: true, completedAt: new Date('2024-09-06') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-003', completed: true, completedAt: new Date('2024-09-07') } }),
    prisma.lessonProgress.create({ data: { userId: 'u-d1', lessonId: 'l-004', completed: true, completedAt: new Date('2024-09-08') } }),
  ])
  console.log('  ✓ lesson progress yaratildi')

  // ASSIGNMENTS
  await Promise.all([
    prisma.assignment.create({ data: { id: 'a-001', title: "Kompyuter qismlarini nomlash", courseId: 'c-001', description: "Berilgan kompyuter rasmidagi barcha qismlarni aniqlang va vazifalarini yozing.", dueDate: new Date('2026-05-10'), type: 'project' } }),
    prisma.assignment.create({ data: { id: 'a-002', title: "Excel: O'quvchilar bahosi jadvali", courseId: 'c-002', description: "Excel yordamida 10 ta o'quvchining baholarini kiritib, o'rtacha, eng yuqori va eng past bahoni hisoblang.", dueDate: new Date('2026-05-12'), type: 'coding' } }),
    prisma.assignment.create({ data: { id: 'a-003', title: "Algoritmlar testi", courseId: 'c-003', description: "Algoritmlar va blok-sxema bo'yicha test topshirig'i.", dueDate: new Date('2026-05-08'), type: 'quiz' } }),
    prisma.assignment.create({ data: { id: 'a-004', title: "Python: Kalkulyator dasturi", courseId: 'c-003', description: "Python da to'rt arifmetik amalni bajaradigan oddiy kalkulyator dasturi yozing.", dueDate: new Date('2026-05-15'), type: 'coding' } }),
    prisma.assignment.create({ data: { id: 'a-005', title: "HTML: Shaxsiy sahifa", courseId: 'c-006', description: "HTML va CSS yordamida o'zingiz haqingizda oddiy veb-sahifa yarating.", dueDate: new Date('2026-05-20'), type: 'project' } }),
  ])
  console.log('  ✓ topshiriqlar yaratildi')

  // SUBMISSIONS
  await Promise.all([
    prisma.submission.create({ data: { id: 'sub-001', assignmentId: 'a-003', userId: 'u-d1', content: '...', status: 'submitted' } }),
    prisma.submission.create({ data: { id: 'sub-002', assignmentId: 'a-004', userId: 'u-d1', content: '...', status: 'graded', grade: 90, feedback: "Juda yaxshi! Kalkulyator to'g'ri ishlaydi.", gradedAt: new Date('2026-04-16') } }),
    prisma.submission.create({ data: { id: 'sub-003', assignmentId: 'a-002', userId: 'u-d1', content: '...', status: 'graded', grade: 82, feedback: "Yaxshi ish, formulalar to'g'ri kiritilgan.", gradedAt: new Date('2026-04-11') } }),
  ])
  console.log('  ✓ submissions yaratildi')

  // NOTIFICATIONS
  await Promise.all([
    prisma.notification.create({ data: { userId: 'u-d1', type: 'achievement', title: 'Yangi yutuq!', body: "12 kunlik seriya nishoni olindi" } }),
    prisma.notification.create({ data: { userId: 'u-d1', type: 'grade', title: 'Baho keldi', body: "Python: Kalkulyator dasturi — 90/100" } }),
    prisma.notification.create({ data: { userId: 'u-d1', type: 'assignment', title: 'Yangi topshiriq', body: "HTML: Shaxsiy sahifa — 20-mayga qadar", read: true } }),
  ])
  console.log('  ✓ notifications yaratildi')

  // ACHIEVEMENTS
  const achs = [
    { id: 'ach-001', title: 'Birinchi Qadam', description: 'Birinchi darsni tugatdi', icon: 'rocket', xpReward: 50, category: 'progress' },
    { id: 'ach-002', title: '7 Kunlik Seriya', description: "7 kun ketma-ket o'qidi", icon: 'fire', xpReward: 100, category: 'streak' },
    { id: 'ach-003', title: '12 Kunlik Seriya', description: "12 kun ketma-ket o'qidi", icon: 'bolt', xpReward: 150, category: 'streak' },
    { id: 'ach-004', title: 'Dasturchi', description: '10 ta dasturlash topshiriqni bajardi', icon: 'code', xpReward: 200, category: 'coding' },
    { id: 'ach-005', title: 'Testchi', description: "20 ta testdan o'tdi", icon: 'check', xpReward: 150, category: 'quiz' },
    { id: 'ach-006', title: 'Loyiha Ustasi', description: '3 ta katta loyiha topshirdi', icon: 'hammer', xpReward: 500, category: 'project' },
    { id: 'ach-007', title: "AI do'stim", description: 'AI assistant bilan 50 ta suhbat', icon: 'bot', xpReward: 200, category: 'ai' },
    { id: 'ach-008', title: 'Mukammal Baho', description: "Bir topshiriqda 100/100 oldi", icon: 'percent', xpReward: 300, category: 'grade' },
  ]
  for (const a of achs) await prisma.achievement.create({ data: a })
  console.log(`  ✓ ${achs.length} yutuq yaratildi`)

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
