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
    prisma.user.create({ data: { id: 'u-d1', name: "Durdona O'quvchi", email: 'durdona@student.uz', passwordHash: hash('1234'), role: 'student', avatar: 'DO', xp: 950, level: 5, streak: 8, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 'u-d2', name: 'Durdona Ustoz', email: 'durdona@gmail.com', passwordHash: hash('1234'), role: 'teacher', avatar: 'DU', xp: 5000, level: 8, streak: 30, joinedAt: new Date('2023-09-01') } }),
    prisma.user.create({ data: { id: 'u-d3', name: 'Durdona Admin', email: 'durdona@admin.uz', passwordHash: hash('1234'), role: 'admin', avatar: 'DA', joinedAt: new Date('2023-01-15') } }),
    // O'quvchilar
    prisma.user.create({ data: { id: 's-002', name: 'Nilufar Rashidova', email: 'nilufar@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'NR', xp: 780, level: 4, streak: 3, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-003', name: 'Bobur Xasanov', email: 'bobur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'BX', xp: 3200, level: 8, streak: 28, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-004', name: 'Shahlo Mirzayeva', email: 'shahlo@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SM', xp: 720, level: 4, streak: 15, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-005', name: 'Jasur Toshmatov', email: 'jasur@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'JT', xp: 430, level: 3, streak: 6, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-006', name: 'Malika Yusupova', email: 'malika@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'MY', xp: 260, level: 2, streak: 2, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-007', name: 'Sardor Nazarov', email: 'sardor@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'SN', xp: 890, level: 5, streak: 20, joinedAt: new Date('2024-09-01') } }),
    prisma.user.create({ data: { id: 's-008', name: 'Zulfiya Ergasheva', email: 'zulfiya@edu.uz', passwordHash: hash('1234'), role: 'student', avatar: 'ZE', xp: 150, level: 2, joinedAt: new Date('2024-09-01') } }),
  ])
  console.log(`  ✓ ${users.length} user yaratildi`)

  // COURSES — maktab fanlari
  const courses = await Promise.all([
    prisma.course.create({ data: { id: 'c-001', title: 'Matematika: Algebra va Geometriya', description: "Tenglamalar, funksiyalar va geometrik shakllar. Maktab matematikasini puxta o'rganish.", instructorId: 'u-d2', category: 'Matematika', difficulty: 'beginner', duration: '20 soat', rating: 4.9, thumbnail: 'math', tags: ['Algebra', 'Geometriya', 'Tenglamalar'] } }),
    prisma.course.create({ data: { id: 'c-002', title: 'Fizika: Mexanika va Elektr', description: "Harakat qonunlari, energiya va elektr toki. Fizika hodisalarini tushunish va masalalar yechish.", instructorId: 'u-d2', category: 'Tabiiy fanlar', difficulty: 'intermediate', duration: '18 soat', rating: 4.7, thumbnail: 'physics', tags: ['Mexanika', 'Elektr', 'Energiya'] } }),
    prisma.course.create({ data: { id: 'c-003', title: "Kimyo: Moddalar va Reaksiyalar", description: "Kimyoviy elementlar, birikmalar va reaksiyalar. Davriy jadval va laboratoriya ishlari.", instructorId: 'u-d2', category: 'Tabiiy fanlar', difficulty: 'intermediate', duration: '16 soat', rating: 4.6, thumbnail: 'chemistry', tags: ['Elementlar', 'Reaksiyalar', 'Davriy jadval'] } }),
    prisma.course.create({ data: { id: 'c-004', title: "Biologiya: Tirik Tabiat", description: "Hujayra tuzilishi, o'simliklar, hayvonlar va ekotizimlar. Tirik organizmlar hayoti.", instructorId: 'u-d2', category: 'Tabiiy fanlar', difficulty: 'beginner', duration: '14 soat', rating: 4.8, thumbnail: 'biology', tags: ['Hujayra', "O'simliklar", 'Hayvonlar'] } }),
    prisma.course.create({ data: { id: 'c-005', title: 'Informatika: Kompyuter va Algoritmlar', description: "Kompyuter qurilmalari, dasturiy ta'minot, internet va algoritmlar asoslari.", instructorId: 'u-d2', category: 'Informatika', difficulty: 'beginner', duration: '20 soat', rating: 4.9, thumbnail: 'computer', tags: ['Kompyuter', 'Algoritm', 'Internet'] } }),
    prisma.course.create({ data: { id: 'c-006', title: "Ona tili va Adabiyot", description: "O'zbek tili grammatikasi, imlo qoidalari va adabiy asarlar tahlili.", instructorId: 'u-d2', category: 'Gumanitar fanlar', difficulty: 'beginner', duration: '18 soat', rating: 4.7, thumbnail: 'language', tags: ["O'zbek tili", 'Grammatika', 'Adabiyot'] } }),
  ])
  console.log(`  ✓ ${courses.length} kurs yaratildi`)

  // LESSONS — barcha 6 kurs uchun maktab mavzulari
  const lessons = [
    // c-001: Matematika: Algebra va Geometriya
    { id: 'l-001', courseId: 'c-001', title: "Algebra: O'zgaruvchilar va ifodalar", duration: '10 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI' },
    { id: 'l-002', courseId: 'c-001', title: 'Tenglamalar yechish usullari', duration: '14 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/9ITsXICV2u0' },
    { id: 'l-003', courseId: 'c-001', title: "Funksiyalar tushunchasi va grafigi", duration: '16 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/kvGsIo1TmsM' },
    { id: 'l-004', courseId: 'c-001', title: 'Kasrlar va foizlar', duration: '12 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw' },
    { id: 'l-005', courseId: 'c-001', title: 'Algebra testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-006', courseId: 'c-001', title: "Geometriya: Shakllar va perimetr", duration: '15 daq', type: 'video', order: 6, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/302eJ3TzJQU' },
    { id: 'l-007', courseId: 'c-001', title: "Ko'rsatkichli ifodalar", duration: '12 daq', type: 'video', order: 7, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/XZRQhkii0h0' },
    { id: 'l-008', courseId: 'c-001', title: 'Tengsizliklar va yechimlar', duration: '14 daq', type: 'video', order: 8, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/VgDe_D8ojxw' },
    { id: 'l-009', courseId: 'c-001', title: 'Koordinatlar sistemasi', duration: '13 daq', type: 'video', order: 9, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/9Uc62CuQjc4' },
    { id: 'l-010', courseId: 'c-001', title: 'Matematika yakuniy testi', duration: '10 daq', type: 'quiz', order: 10, xpReward: 40, videoUrl: null },
    // c-002: Fizika: Mexanika va Elektr
    { id: 'l-011', courseId: 'c-002', title: "Mexanika: Harakat va tezlik", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/ZM8ECpBuQYE' },
    { id: 'l-012', courseId: 'c-002', title: "Kuch, massa va tezlanish (Newton qonunlari)", duration: '15 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/2eKVjjKu5LI' },
    { id: 'l-013', courseId: 'c-002', title: 'Energiya turlari va saqlanish qonuni', duration: '16 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/2S6e11NBwiw' },
    { id: 'l-014', courseId: 'c-002', title: 'Issiqlik va temperatura', duration: '14 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/vqDbMEdLiCs' },
    { id: 'l-015', courseId: 'c-002', title: 'Mexanika testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    { id: 'l-016', courseId: 'c-002', title: 'Elektr toki va kuchlanish', duration: '15 daq', type: 'video', order: 6, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/u4oB5KynR6Y' },
    // c-003: Kimyo: Moddalar va Reaksiyalar
    { id: 'l-017', courseId: 'c-003', title: "Atom tuzilishi va kimyoviy elementlar", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/IDMkqUFi4tA' },
    { id: 'l-018', courseId: 'c-003', title: "Davriy jadval — qanday o'qish kerak", duration: '14 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/0RRVV4Diomg' },
    { id: 'l-019', courseId: 'c-003', title: 'Kimyoviy reaksiyalar va tenglamalar', duration: '16 daq', type: 'video', order: 3, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/JM_RMm9DFa0' },
    { id: 'l-020', courseId: 'c-003', title: "Kislota va ishqorlar (pH muhit)", duration: '14 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/o0B4iiT7q6w' },
    { id: 'l-021', courseId: 'c-003', title: 'Kimyo testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-004: Biologiya: Tirik Tabiat
    { id: 'l-022', courseId: 'c-004', title: "Biologiyaga kirish: Tirik tabiat nima?", duration: '10 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/QnQe0xW_JY4' },
    { id: 'l-023', courseId: 'c-004', title: "Hujayra tuzilishi va vazifalari", duration: '14 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/8IlzKri08kk' },
    { id: 'l-024', courseId: 'c-004', title: "O'simliklar dunyosi va fotosintez", duration: '15 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/dPMblFgCK1Q' },
    { id: 'l-025', courseId: 'c-004', title: "Hayvonlar sistemasi va tur xilma-xilligi", duration: '14 daq', type: 'video', order: 4, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/bxRInDnRHU4' },
    { id: 'l-026', courseId: 'c-004', title: 'Biologiya testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-005: Informatika: Kompyuter va Algoritmlar
    { id: 'l-027', courseId: 'c-005', title: "Kompyuter qismlari va ularning vazifalari", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: 'https://www.youtube.com/embed/ExxFxD4OSZ0' },
    { id: 'l-028', courseId: 'c-005', title: "Operatsion tizim nima va qanday ishlaydi?", duration: '14 daq', type: 'video', order: 2, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/GjNp0bBrjmU' },
    { id: 'l-029', courseId: 'c-005', title: "Internet va tarmoqlar asoslari", duration: '13 daq', type: 'video', order: 3, xpReward: 15, videoUrl: 'https://www.youtube.com/embed/x3c1ih2NJEg' },
    { id: 'l-030', courseId: 'c-005', title: "Algoritm tushunchasi va blok-sxema", duration: '15 daq', type: 'video', order: 4, xpReward: 20, videoUrl: 'https://www.youtube.com/embed/Q_itdXI3YeE' },
    { id: 'l-031', courseId: 'c-005', title: 'Informatika testi', duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
    // c-006: Ona tili va Adabiyot
    { id: 'l-032', courseId: 'c-006', title: "O'zbek tili: Fonetika va orfografiya", duration: '12 daq', type: 'video', order: 1, xpReward: 10, videoUrl: null },
    { id: 'l-033', courseId: 'c-006', title: "So'z turkumlari: ot, sifat, fe'l", duration: '15 daq', type: 'video', order: 2, xpReward: 15, videoUrl: null },
    { id: 'l-034', courseId: 'c-006', title: "Gap bo'laklari va sintaksis", duration: '14 daq', type: 'video', order: 3, xpReward: 15, videoUrl: null },
    { id: 'l-035', courseId: 'c-006', title: "Adabiy asarlar tahlili: Badiiy san'atlar", duration: '16 daq', type: 'video', order: 4, xpReward: 20, videoUrl: null },
    { id: 'l-036', courseId: 'c-006', title: "Ona tili testi", duration: '10 daq', type: 'quiz', order: 5, xpReward: 30, videoUrl: null },
  ]
  for (const l of lessons) await prisma.lesson.create({ data: l })
  console.log(`  ✓ ${lessons.length} dars yaratildi`)

  // ENROLLMENTS
  await Promise.all([
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-001', progress: 60, completedLessons: 6 } }),
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-002', progress: 33, completedLessons: 2 } }),
    prisma.enrollment.create({ data: { userId: 'u-d1', courseId: 'c-005', progress: 20, completedLessons: 1 } }),
    prisma.enrollment.create({ data: { userId: 's-002', courseId: 'c-001', progress: 40, completedLessons: 4 } }),
    prisma.enrollment.create({ data: { userId: 's-003', courseId: 'c-001', progress: 80, completedLessons: 8 } }),
    prisma.enrollment.create({ data: { userId: 's-004', courseId: 'c-004', progress: 10, completedLessons: 1 } }),
    prisma.enrollment.create({ data: { userId: 's-005', courseId: 'c-005', progress: 50, completedLessons: 3 } }),
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

  // ASSIGNMENTS — maktab fanlariga mos topshiriqlar
  const assignments = await Promise.all([
    prisma.assignment.create({ data: { id: 'a-001', title: 'Matematika: Tenglamalar to\'plami', courseId: 'c-001', description: "Chiziqli va kvadrat tenglamalarni yechib, yechimlarni ko'rsating.", dueDate: new Date('2026-05-10'), type: 'coding' } }),
    prisma.assignment.create({ data: { id: 'a-002', title: "Fizika: Mexanika masalalari", courseId: 'c-002', description: "Newton qonunlari asosida berilgan masalalarni yeching.", dueDate: new Date('2026-05-12'), type: 'project' } }),
    prisma.assignment.create({ data: { id: 'a-003', title: 'Kimyo: Elementlar testi', courseId: 'c-003', description: "Kimyoviy elementlar va davriy jadval bo'yicha test.", dueDate: new Date('2026-05-08'), type: 'quiz' } }),
    prisma.assignment.create({ data: { id: 'a-004', title: "Informatika: Algoritm tuzish", courseId: 'c-005', description: "Kundalik hayotdagi jarayon uchun blok-sxema va algoritm tuzing.", dueDate: new Date('2026-05-05'), type: 'coding' } }),
    prisma.assignment.create({ data: { id: 'a-005', title: "Biologiya: Hujayra taqdimoti", courseId: 'c-004', description: "Hujayra tuzilishi bo'yicha qisqacha taqdimot tayyorlang.", dueDate: new Date('2026-05-15'), type: 'project' } }),
  ])
  console.log(`  ✓ ${assignments.length} topshiriq yaratildi`)

  // SUBMISSIONS
  await Promise.all([
    prisma.submission.create({ data: { id: 'sub-001', assignmentId: 'a-003', userId: 'u-d1', content: '...', status: 'submitted' } }),
    prisma.submission.create({ data: { id: 'sub-002', assignmentId: 'a-004', userId: 'u-d1', content: '...', status: 'graded', grade: 92, feedback: "A'lo! Algoritm to'g'ri tuzilgan.", gradedAt: new Date('2026-04-16') } }),
    prisma.submission.create({ data: { id: 'sub-003', assignmentId: 'a-005', userId: 'u-d1', content: '...', status: 'graded', grade: 78, feedback: "Yaxshi, ba'zi qismlarni to'ldirishn kerak.", gradedAt: new Date('2026-04-11') } }),
  ])
  console.log('  ✓ submissions yaratildi')

  // NOTIFICATIONS
  await Promise.all([
    prisma.notification.create({ data: { userId: 'u-d1', type: 'achievement', title: 'Yangi yutuq!', body: "12 kunlik seriya nishoni olindi" } }),
    prisma.notification.create({ data: { userId: 'u-d1', type: 'grade', title: 'Baho keldi', body: "Informatika: Algoritm tuzish — 92/100" } }),
    prisma.notification.create({ data: { userId: 'u-d1', type: 'assignment', title: 'Yangi topshiriq', body: 'Matematika: Tenglamalar to\'plami — 10-mayga qadar', read: true } }),
  ])
  console.log('  ✓ notifications yaratildi')

  // ACHIEVEMENTS
  const achs = [
    { id: 'ach-001', title: 'Birinchi Qadam', description: 'Birinchi darsni tugatdi', icon: 'rocket', xpReward: 50, category: 'progress' },
    { id: 'ach-002', title: '7 Kunlik Seriya', description: "7 kun ketma-ket o'qidi", icon: 'fire', xpReward: 100, category: 'streak' },
    { id: 'ach-003', title: '12 Kunlik Seriya', description: "12 kun ketma-ket o'qidi", icon: 'bolt', xpReward: 150, category: 'streak' },
    { id: 'ach-004', title: "Topshiriq Bajarguvchi", description: '10 ta topshiriqni bajardi', icon: 'code', xpReward: 200, category: 'coding' },
    { id: 'ach-005', title: 'Testchi', description: "20 ta testdan o'tdi", icon: 'check', xpReward: 150, category: 'quiz' },
    { id: 'ach-006', title: 'Loyiha Ustasi', description: '3 ta katta loyiha topshirdi', icon: 'hammer', xpReward: 500, category: 'project' },
    { id: 'ach-007', title: "AI do'stim", description: 'AI assistant bilan 50 ta suhbat', icon: 'bot', xpReward: 200, category: 'ai' },
    { id: 'ach-008', title: 'Mukammal Baho', description: "Bir topshiriqda 100/100 oldi", icon: 'percent', xpReward: 300, category: 'grade' },
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
