/**
 * In-memory data store.
 * Ma'lumotlar server qayta ishga tushganda tiklanadi (seed'dan).
 * PostgreSQL'ga ko'chirish uchun bu modulni almashtirish kifoya —
 * route'larda faqat `db.*` ishlatilgan.
 */

import bcrypt from 'bcryptjs'
import {
  User, Course, Enrollment, Lesson, LessonProgress,
  Assignment, Submission, Notification, Achievement, UserAchievement, ActivityLog,
} from './types'

interface DB {
  users: User[]
  courses: Course[]
  enrollments: Enrollment[]
  lessons: Lesson[]
  lessonProgress: LessonProgress[]
  assignments: Assignment[]
  submissions: Submission[]
  notifications: Notification[]
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  logs: ActivityLog[]
}

const passwordHash = (p: string) => bcrypt.hashSync(p, 8)
const now = () => new Date().toISOString()

export const db: DB = {
  users: [
    {
      id: 'u-001', name: 'Azizbek Karimov', email: 'student@edu.uz',
      passwordHash: passwordHash('1234'), role: 'student',
      avatar: 'AK', xp: 1420, level: 6, streak: 12, joinedAt: '2024-09-01',
    },
    {
      id: 'u-002', name: 'Dilnoza Yusupova', email: 'teacher@edu.uz',
      passwordHash: passwordHash('1234'), role: 'teacher',
      avatar: 'DY', xp: 8500, level: 9, streak: 45, joinedAt: '2023-09-01',
    },
    {
      id: 'u-003', name: 'Sardor Nazarov', email: 'admin@edu.uz',
      passwordHash: passwordHash('1234'), role: 'admin',
      avatar: 'SN', xp: 0, level: 1, streak: 0, joinedAt: '2023-01-15',
    },
    { id: 's-002', name: 'Malika Tursunova', email: 'malika@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'MT', xp: 780, level: 4, streak: 3, joinedAt: '2024-09-01' },
    { id: 's-003', name: 'Jasur Raxmatullayev', email: 'jasur@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'JR', xp: 3200, level: 8, streak: 28, joinedAt: '2024-09-01' },
    { id: 's-004', name: 'Zulfiya Nazarova', email: 'zulfiya@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'ZN', xp: 210, level: 2, streak: 0, joinedAt: '2024-09-01' },
    { id: 's-005', name: 'Bobur Xolmatov', email: 'bobur@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'BX', xp: 1100, level: 5, streak: 7, joinedAt: '2024-09-01' },
    { id: 's-006', name: 'Nilufar Ergasheva', email: 'nilufar@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'NE', xp: 490, level: 3, streak: 1, joinedAt: '2024-09-01' },
    { id: 's-007', name: 'Sherzod Umarov', email: 'sherzod@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'SU', xp: 2600, level: 7, streak: 19, joinedAt: '2024-09-01' },
    { id: 's-008', name: 'Dilorom Hasanova', email: 'dilorom@edu.uz', passwordHash: passwordHash('1234'), role: 'student', avatar: 'DH', xp: 80, level: 1, streak: 0, joinedAt: '2024-09-01' },
    { id: 'u-t2', name: 'Bobur Toshmatov', email: 'bobur.t@edu.uz', passwordHash: passwordHash('1234'), role: 'teacher', avatar: 'BT', xp: 0, level: 1, streak: 0, joinedAt: '2023-10-15' },
    { id: 'u-t3', name: 'Laziz Abdullayev', email: 'laziz@edu.uz', passwordHash: passwordHash('1234'), role: 'teacher', avatar: 'LA', xp: 0, level: 1, streak: 0, joinedAt: '2024-02-20' },
  ],

  courses: [
    { id: 'c-001', title: "Python Dasturlash Asoslari", description: "Python dasturlash tilini noldan o'rganish. Amaliy loyihalar va real kod yozish.", instructorId: 'u-002', category: 'Dasturlash', difficulty: 'beginner', duration: '24 soat', lessons: 48, enrolled: 342, rating: 4.9, thumbnail: 'python', tags: ['Python', 'OOP', 'Algoritm'], createdAt: '2024-08-20' },
    { id: 'c-002', title: 'Web Dasturlash: HTML, CSS, JS', description: 'Zamonaviy web saytlar yaratish. Responsive dizayn va interaktiv sahifalar.', instructorId: 'u-t2', category: 'Web', difficulty: 'beginner', duration: '30 soat', lessons: 60, enrolled: 521, rating: 4.8, thumbnail: 'web', tags: ['HTML', 'CSS', 'JavaScript', 'DOM'], createdAt: '2024-08-25' },
    { id: 'c-003', title: "Ma'lumotlar Bazasi: SQL", description: 'PostgreSQL va MySQL bilan ishlash. Murakkab so\'rovlar, optimizatsiya.', instructorId: 'u-t3', category: 'Database', difficulty: 'intermediate', duration: '20 soat', lessons: 40, enrolled: 198, rating: 4.7, thumbnail: 'database', tags: ['SQL', 'PostgreSQL'], createdAt: '2024-09-01' },
    { id: 'c-004', title: 'Kompyuter Tarmoqlari', description: "TCP/IP, OSI modeli, protokollar va tarmoq xavfsizligi asoslari.", instructorId: 'u-002', category: 'Tarmoq', difficulty: 'intermediate', duration: '18 soat', lessons: 36, enrolled: 145, rating: 4.6, thumbnail: 'network', tags: ['TCP/IP', 'OSI'], createdAt: '2024-09-10' },
    { id: 'c-005', title: "Algoritmlar va Ma'lumotlar Tuzilmasi", description: "Saralash, qidirish, graflar, daraxtlar. Murakkablik tahlili.", instructorId: 'u-t3', category: 'Dasturlash', difficulty: 'advanced', duration: '32 soat', lessons: 64, enrolled: 89, rating: 4.9, thumbnail: 'algo', tags: ['DSA', 'Big-O'], createdAt: '2024-10-01' },
    { id: 'c-006', title: 'Kiberxavfsizlik Asoslari', description: "Axborot xavfsizligi, shifrlash, hujumlar va mudofaa usullari.", instructorId: 'u-t2', category: 'Security', difficulty: 'advanced', duration: '28 soat', lessons: 56, enrolled: 112, rating: 4.8, thumbnail: 'security', tags: ['Kriptografiya', 'Pentesting'], createdAt: '2024-10-15' },
  ],

  enrollments: [
    { userId: 'u-001', courseId: 'c-001', progress: 65, completedLessons: 31, enrolledAt: '2024-09-05' },
    { userId: 'u-001', courseId: 'c-002', progress: 30, completedLessons: 18, enrolledAt: '2024-10-01' },
    { userId: 'u-001', courseId: 'c-003', progress: 10, completedLessons: 4, enrolledAt: '2025-01-15' },
    { userId: 's-002', courseId: 'c-001', progress: 45, completedLessons: 22, enrolledAt: '2024-09-10' },
    { userId: 's-003', courseId: 'c-001', progress: 89, completedLessons: 43, enrolledAt: '2024-09-02' },
    { userId: 's-004', courseId: 'c-001', progress: 18, completedLessons: 9, enrolledAt: '2024-10-15' },
    { userId: 's-005', courseId: 'c-002', progress: 58, completedLessons: 35, enrolledAt: '2024-10-01' },
  ],

  lessons: [
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
  ],

  lessonProgress: [
    { userId: 'u-001', lessonId: 'l-001', completed: true, completedAt: '2024-09-05' },
    { userId: 'u-001', lessonId: 'l-002', completed: true, completedAt: '2024-09-06' },
    { userId: 'u-001', lessonId: 'l-003', completed: true, completedAt: '2024-09-07' },
    { userId: 'u-001', lessonId: 'l-004', completed: true, completedAt: '2024-09-08' },
    { userId: 'u-001', lessonId: 'l-005', completed: true, completedAt: '2024-09-09' },
    { userId: 'u-001', lessonId: 'l-006', completed: true, completedAt: '2024-09-12' },
  ],

  assignments: [
    { id: 'a-001', title: 'Python: Kalkulyator yaratish', courseId: 'c-001', description: "Arifmetik amallarni bajaradigan konsol kalkulyator yarating.", dueDate: '2026-04-25', maxGrade: 100, type: 'coding', createdAt: '2026-04-10' },
    { id: 'a-002', title: 'HTML/CSS: Portfolio sahifasi', courseId: 'c-002', description: "O'z portfoliongizni yarating. Responsive dizayn majburiy.", dueDate: '2026-04-28', maxGrade: 100, type: 'project', createdAt: '2026-04-12' },
    { id: 'a-003', title: 'SQL: Oxirgi test', courseId: 'c-003', description: "SQL bo'yicha yakuniy test.", dueDate: '2026-04-20', maxGrade: 100, type: 'quiz', createdAt: '2026-04-05' },
    { id: 'a-004', title: "Python: Ro'yxatlar va Funksiyalar", courseId: 'c-001', description: "Ro'yxatlar va funksiyalar mavzusida amaliy topshiriq.", dueDate: '2026-04-15', maxGrade: 100, type: 'coding', createdAt: '2026-04-01' },
    { id: 'a-005', title: 'Tarmoqlar: Protokollar testi', courseId: 'c-004', description: "Tarmoq protokollari bo'yicha test.", dueDate: '2026-04-10', maxGrade: 100, type: 'quiz', createdAt: '2026-03-25' },
  ],

  submissions: [
    { id: 'sub-001', assignmentId: 'a-003', userId: 'u-001', content: '...', status: 'submitted', submittedAt: '2026-04-19T10:00:00Z' },
    { id: 'sub-002', assignmentId: 'a-004', userId: 'u-001', content: '...', status: 'graded', grade: 92, feedback: "A'lo! Juda yaxshi kod.", submittedAt: '2026-04-14T15:00:00Z', gradedAt: '2026-04-16T09:00:00Z' },
    { id: 'sub-003', assignmentId: 'a-005', userId: 'u-001', content: '...', status: 'graded', grade: 78, feedback: "Yaxshi, ba'zi javoblar noto'g'ri.", submittedAt: '2026-04-09T12:00:00Z', gradedAt: '2026-04-11T10:00:00Z' },
  ],

  notifications: [
    { id: 'n-001', userId: 'u-001', type: 'achievement', title: 'Yangi yutuq!', body: "\"12 kunlik seriya\" nishoni olindi", read: false, createdAt: '2026-04-23T10:00:00Z' },
    { id: 'n-002', userId: 'u-001', type: 'grade', title: 'Baho keldi', body: "Python: Ro'yxatlar — 92/100", read: false, createdAt: '2026-04-22T15:30:00Z' },
    { id: 'n-003', userId: 'u-001', type: 'assignment', title: 'Yangi topshiriq', body: 'Kalkulyator yaratish — 25-aprelga qadar', read: true, createdAt: '2026-04-22T09:00:00Z' },
  ],

  achievements: [
    { id: 'ach-001', title: 'Birinchi Qadam', description: 'Birinchi darsni tugatdi', icon: 'rocket', xpReward: 50, category: 'progress' },
    { id: 'ach-002', title: '7 Kunlik Seriya', description: "7 kun ketma-ket o'qidi", icon: 'fire', xpReward: 100, category: 'streak' },
    { id: 'ach-003', title: '12 Kunlik Seriya', description: "12 kun ketma-ket o'qidi", icon: 'bolt', xpReward: 150, category: 'streak' },
    { id: 'ach-004', title: 'Kod Yozuvchi', description: '10 ta kod topshiriqni bajardi', icon: 'code', xpReward: 200, category: 'coding' },
    { id: 'ach-005', title: 'Testchi', description: "20 ta testdan o'tdi", icon: 'check', xpReward: 150, category: 'quiz' },
    { id: 'ach-006', title: 'Loyiha Ustasi', description: '3 ta katta loyiha topshirdi', icon: 'hammer', xpReward: 500, category: 'project' },
    { id: 'ach-007', title: "AI do'stim", description: 'AI assistant bilan 50 ta suhbat', icon: 'bot', xpReward: 200, category: 'ai' },
    { id: 'ach-008', title: 'Mukammal Baho', description: 'Bitta darsda 100/100 oldi', icon: 'percent', xpReward: 300, category: 'grade' },
  ],

  userAchievements: [
    { userId: 'u-001', achievementId: 'ach-001', earnedAt: '2024-09-05' },
    { userId: 'u-001', achievementId: 'ach-002', earnedAt: '2024-09-12' },
    { userId: 'u-001', achievementId: 'ach-003', earnedAt: '2026-04-23' },
    { userId: 'u-001', achievementId: 'ach-004', earnedAt: '2025-01-15' },
    { userId: 'u-001', achievementId: 'ach-005', earnedAt: '2025-02-20' },
  ],

  logs: [
    { id: 'log-1', userId: 'u-001', action: 'login', ip: '192.168.1.24', createdAt: now() },
    { id: 'log-2', userId: 'u-002', action: 'course.create', meta: { courseId: 'c-005' }, ip: '10.0.0.5', createdAt: now() },
    { id: 'log-3', userId: null, action: 'system.backup', meta: { size: '2.4GB' }, ip: 'localhost', createdAt: now() },
  ],
}

// Public view helpers
export const publicUser = (u: User) => {
  const { passwordHash, ...pub } = u
  return pub
}

export const log = (userId: string | null, action: string, meta?: Record<string, unknown>, ip?: string) => {
  db.logs.unshift({
    id: 'log-' + Date.now(), userId, action, meta, ip, createdAt: now(),
  })
  if (db.logs.length > 500) db.logs.length = 500
}
