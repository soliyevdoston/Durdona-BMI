import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Demo ma'lumotlar yuklanmoqda...")

  const hash = await bcrypt.hash('1234', 8)

  // ── ESKI MA'LUMOTLARNI TOZALASH ────────────
  await prisma.enrollment.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
  console.log("✓ Eski ma'lumotlar tozalandi")

  // ── ADMIN ──────────────────────────────────
  await prisma.user.create({
    data: { id: 'u-admin-1', name: 'Durdona Mahmudova', email: 'durdona@admin.uz', passwordHash: hash, role: 'admin', avatar: 'DM', xp: 0, level: 1, streak: 0, joinedAt: new Date('2024-01-01'), lastActive: new Date() },
  })
  console.log('✓ Admin: durdona@admin.uz')

  // ── O'QITUVCHI ─────────────────────────────
  await prisma.user.create({
    data: { id: 'u-teacher-1', name: 'Durdona Mahmudova', email: 'durdona@gmail.com', passwordHash: hash, role: 'teacher', avatar: 'DM', xp: 1240, level: 5, streak: 12, joinedAt: new Date('2024-09-01'), lastActive: new Date() },
  })
  console.log("✓ O'qituvchi: durdona@gmail.com")

  // ── TALABALAR ──────────────────────────────
  const studentsData = [
    { id: 'u-s-1', name: 'Durdona Mahmudova',  email: 'durdona@student.uz', avatar: 'DM', xp: 520,  level: 4, streak: 8  },
    { id: 'u-s-2', name: 'Nilufar Rashidova',  email: 'nilufar@edu.uz',     avatar: 'NR', xp: 310,  level: 3, streak: 3  },
    { id: 'u-s-3', name: 'Bobur Xasanov',      email: 'bobur@edu.uz',       avatar: 'BX', xp: 180,  level: 2, streak: 1  },
    { id: 'u-s-4', name: 'Shahlo Mirzayeva',   email: 'shahlo@edu.uz',      avatar: 'SM', xp: 720,  level: 4, streak: 15 },
    { id: 'u-s-5', name: 'Jasur Toshmatov',    email: 'jasur@edu.uz',       avatar: 'JT', xp: 430,  level: 3, streak: 6  },
    { id: 'u-s-6', name: 'Malika Yusupova',    email: 'malika@edu.uz',      avatar: 'MY', xp: 260,  level: 2, streak: 2  },
    { id: 'u-s-7', name: 'Sardor Nazarov',     email: 'sardor@edu.uz',      avatar: 'SN', xp: 890,  level: 5, streak: 20 },
    { id: 'u-s-8', name: 'Zulfiya Ergasheva',  email: 'zulfiya@edu.uz',     avatar: 'ZE', xp: 150,  level: 2, streak: 0  },
  ]

  for (const s of studentsData) {
    await prisma.user.create({
      data: { ...s, passwordHash: hash, role: 'student', joinedAt: new Date('2025-01-15'), lastActive: new Date() },
    })
  }
  console.log(`✓ ${studentsData.length} ta talaba qo'shildi`)

  // ── KURSLAR ────────────────────────────────
  const coursesData = [
    {
      id: 'c-python', title: "Python Dasturlash Asoslari", category: 'Dasturlash', difficulty: 'beginner',
      duration: '24 soat', rating: 4.8, thumbnail: 'python',
      description: "Python tilini noldan o'rganish. O'zgaruvchilar, sikllar, funksiyalar, OOP.",
      tags: ['Python', 'OOP', "Boshlang'ich"],
    },
    {
      id: 'c-web', title: "Web Dasturlash: HTML & CSS & JS", category: 'Web', difficulty: 'beginner',
      duration: '30 soat', rating: 4.7, thumbnail: 'web',
      description: "Zamonaviy web saytlar yaratish. HTML5, CSS3, JavaScript asoslari.",
      tags: ['HTML', 'CSS', 'JavaScript', 'Web'],
    },
    {
      id: 'c-db', title: "Ma'lumotlar Bazasi va SQL", category: 'Database', difficulty: 'intermediate',
      duration: '18 soat', rating: 4.6, thumbnail: 'database',
      description: "PostgreSQL va SQL so'rovlari. JOIN, GROUP BY, INDEX, tranzaksiyalar.",
      tags: ['SQL', 'PostgreSQL', 'Database'],
    },
  ]

  for (const c of coursesData) {
    await prisma.course.create({ data: { ...c, instructorId: 'u-teacher-1' } })
  }
  console.log(`✓ ${coursesData.length} ta kurs qo'shildi (o'qituvchi: Durdona)`)

  // ── DARSLAR ────────────────────────────────
  const allLessons: any[] = [
    // Python
    { id: 'l-py-1', courseId: 'c-python', title: "Python bilan tanishish",         duration: '15 daq', type: 'video',    order: 1, xpReward: 20 },
    { id: 'l-py-2', courseId: 'c-python', title: "O'zgaruvchilar va turlar",        duration: '20 daq', type: 'video',    order: 2, xpReward: 25 },
    { id: 'l-py-3', courseId: 'c-python', title: "Sikllar: for va while",           duration: '25 daq', type: 'video',    order: 3, xpReward: 30 },
    { id: 'l-py-4', courseId: 'c-python', title: "Funksiyalar (def)",               duration: '20 daq', type: 'practice', order: 4, xpReward: 35 },
    { id: 'l-py-5', courseId: 'c-python', title: "Ro'yxatlar va lug'atlar",         duration: '22 daq', type: 'video',    order: 5, xpReward: 30 },
    { id: 'l-py-6', courseId: 'c-python', title: "OOP: Klass va Obyektlar",         duration: '30 daq', type: 'video',    order: 6, xpReward: 40 },
    { id: 'l-py-7', courseId: 'c-python', title: "Amaliy mashq: Kalkulyator",       duration: '35 daq', type: 'practice', order: 7, xpReward: 50 },
    { id: 'l-py-8', courseId: 'c-python', title: "Yakuniy test",                    duration: '20 daq', type: 'quiz',     order: 8, xpReward: 40 },
    // Web
    { id: 'l-wb-1', courseId: 'c-web', title: "HTML asoslari",                      duration: '18 daq', type: 'video',    order: 1, xpReward: 20 },
    { id: 'l-wb-2', courseId: 'c-web', title: "CSS stillar va Flexbox",             duration: '22 daq', type: 'video',    order: 2, xpReward: 25 },
    { id: 'l-wb-3', courseId: 'c-web', title: "JavaScript kirish",                  duration: '28 daq', type: 'video',    order: 3, xpReward: 30 },
    { id: 'l-wb-4', courseId: 'c-web', title: "DOM bilan ishlash",                  duration: '25 daq', type: 'practice', order: 4, xpReward: 40 },
    { id: 'l-wb-5', courseId: 'c-web', title: "Responsive dizayn",                  duration: '20 daq', type: 'video',    order: 5, xpReward: 30 },
    { id: 'l-wb-6', courseId: 'c-web', title: "Amaliy loyiha: Portfolio",           duration: '40 daq', type: 'practice', order: 6, xpReward: 50 },
    // Database
    { id: 'l-db-1', courseId: 'c-db', title: "SQL asoslari: SELECT",                duration: '20 daq', type: 'video',    order: 1, xpReward: 20 },
    { id: 'l-db-2', courseId: 'c-db', title: "WHERE, ORDER BY, LIMIT",              duration: '18 daq', type: 'video',    order: 2, xpReward: 25 },
    { id: 'l-db-3', courseId: 'c-db', title: "JOIN turlari",                        duration: '30 daq', type: 'video',    order: 3, xpReward: 35 },
    { id: 'l-db-4', courseId: 'c-db', title: "GROUP BY va agregatsiya",             duration: '25 daq', type: 'practice', order: 4, xpReward: 35 },
    { id: 'l-db-5', courseId: 'c-db', title: "Jadval yaratish va o'zgartirish",     duration: '22 daq', type: 'video',    order: 5, xpReward: 30 },
  ]

  for (const l of allLessons) {
    await prisma.lesson.create({ data: l })
  }
  console.log(`✓ ${allLessons.length} ta dars qo'shildi`)

  // ── YOZILISHLAR ────────────────────────────
  const enrollments = [
    { userId: 'u-s-1', courseId: 'c-python', progress: 75,  completedLessons: 6 },
    { userId: 'u-s-1', courseId: 'c-web',    progress: 33,  completedLessons: 2 },
    { userId: 'u-s-2', courseId: 'c-python', progress: 50,  completedLessons: 4 },
    { userId: 'u-s-3', courseId: 'c-python', progress: 25,  completedLessons: 2 },
    { userId: 'u-s-3', courseId: 'c-db',     progress: 20,  completedLessons: 1 },
    { userId: 'u-s-4', courseId: 'c-python', progress: 100, completedLessons: 8 },
    { userId: 'u-s-4', courseId: 'c-web',    progress: 83,  completedLessons: 5 },
    { userId: 'u-s-4', courseId: 'c-db',     progress: 60,  completedLessons: 3 },
    { userId: 'u-s-5', courseId: 'c-web',    progress: 50,  completedLessons: 3 },
    { userId: 'u-s-5', courseId: 'c-python', progress: 62,  completedLessons: 5 },
    { userId: 'u-s-6', courseId: 'c-python', progress: 12,  completedLessons: 1 },
    { userId: 'u-s-7', courseId: 'c-python', progress: 100, completedLessons: 8 },
    { userId: 'u-s-7', courseId: 'c-web',    progress: 100, completedLessons: 6 },
    { userId: 'u-s-7', courseId: 'c-db',     progress: 80,  completedLessons: 4 },
    { userId: 'u-s-8', courseId: 'c-python', progress: 0,   completedLessons: 0 },
  ]

  for (const e of enrollments) {
    await prisma.enrollment.create({ data: { ...e, enrolledAt: new Date('2025-02-01') } })
  }
  console.log(`✓ ${enrollments.length} ta yozilish qo'shildi`)

  // ── TOPSHIRIQLAR ───────────────────────────
  const assignments = [
    { id: 'a-py-1', courseId: 'c-python', title: 'Python Kalkulyator',  type: 'coding',  maxGrade: 100, description: "4 amal bajara oladigan kalkulyator yozing." },
    { id: 'a-py-2', courseId: 'c-python', title: 'OOP: Bank hisobi',    type: 'project', maxGrade: 100, description: "Bank hisobi klasini yarating." },
    { id: 'a-wb-1', courseId: 'c-web',    title: 'Portfolio sayt',      type: 'project', maxGrade: 100, description: "Shaxsiy portfolio sayt yarating." },
    { id: 'a-db-1', courseId: 'c-db',     title: "SQL so'rovlar",       type: 'coding',  maxGrade: 100, description: "Berilgan DB dan 10 ta so'rov yozing." },
  ]

  for (const a of assignments) {
    await prisma.assignment.create({ data: { ...a, dueDate: new Date(Date.now() + 14 * 86400000) } })
  }
  console.log(`✓ ${assignments.length} ta topshiriq qo'shildi`)

  console.log('')
  console.log('========================================')
  console.log("  Barcha ma'lumotlar tayyor!")
  console.log('  Admin panel:    durdona@admin.uz   / 1234')
  console.log('  Teacher panel:  durdona@gmail.com  / 1234')
  console.log('  Student panel:  durdona@student.uz / 1234')
  console.log('========================================')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
