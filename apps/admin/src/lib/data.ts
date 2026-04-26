import type { User } from './store'

export const DEMO_USERS: Record<string, User & { password: string }> = {
  student: {
    id: 'u-001',
    name: 'Azizbek Karimov',
    email: 'student@edu.uz',
    password: '1234',
    role: 'student',
    avatar: 'AK',
    xp: 1420,
    level: 6,
    streak: 12,
    joinedAt: '2024-09-01',
  },
  teacher: {
    id: 'u-002',
    name: 'Dilnoza Yusupova',
    email: 'teacher@edu.uz',
    password: '1234',
    role: 'teacher',
    avatar: 'DY',
    xp: 8500,
    level: 9,
    streak: 45,
    joinedAt: '2023-09-01',
  },
  admin: {
    id: 'u-003',
    name: 'Sardor Nazarov',
    email: 'admin@edu.uz',
    password: '1234',
    role: 'admin',
    avatar: 'SN',
    xp: 0,
    level: 1,
    streak: 0,
    joinedAt: '2023-01-15',
  },
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  lessons: number
  enrolled: number
  rating: number
  progress?: number
  thumbnail: string
  tags: string[]
  completedLessons?: number
}

export const COURSES: Course[] = [
  {
    id: 'c-001',
    title: 'Python Dasturlash Asoslari',
    description: 'Python dasturlash tilini noldan o\'rganish. Amaliy loyihalar va real kod yozish.',
    instructor: 'Dilnoza Yusupova',
    instructorAvatar: 'DY',
    category: 'Dasturlash',
    difficulty: 'beginner',
    duration: '24 soat',
    lessons: 48,
    enrolled: 342,
    rating: 4.9,
    progress: 65,
    completedLessons: 31,
    thumbnail: 'python',
    tags: ['Python', 'OOP', 'Algoritm'],
  },
  {
    id: 'c-002',
    title: 'Web Dasturlash: HTML, CSS, JS',
    description: 'Zamonaviy web saytlar yaratish. Responsive dizayn va interaktiv sahifalar.',
    instructor: 'Bobur Toshmatov',
    instructorAvatar: 'BT',
    category: 'Web',
    difficulty: 'beginner',
    duration: '30 soat',
    lessons: 60,
    enrolled: 521,
    rating: 4.8,
    progress: 30,
    completedLessons: 18,
    thumbnail: 'web',
    tags: ['HTML', 'CSS', 'JavaScript', 'DOM'],
  },
  {
    id: 'c-003',
    title: 'Ma\'lumotlar Bazasi: SQL',
    description: 'PostgreSQL va MySQL bilan ishlash. Murakkab so\'rovlar, optimizatsiya.',
    instructor: 'Laziz Abdullayev',
    instructorAvatar: 'LA',
    category: 'Database',
    difficulty: 'intermediate',
    duration: '20 soat',
    lessons: 40,
    enrolled: 198,
    rating: 4.7,
    progress: 10,
    completedLessons: 4,
    thumbnail: 'database',
    tags: ['SQL', 'PostgreSQL', 'Normalizatsiya'],
  },
  {
    id: 'c-004',
    title: 'Kompyuter Tarmoqlari',
    description: 'TCP/IP, OSI modeli, protokollar va tarmoq xavfsizligi asoslari.',
    instructor: 'Dilnoza Yusupova',
    instructorAvatar: 'DY',
    category: 'Tarmoq',
    difficulty: 'intermediate',
    duration: '18 soat',
    lessons: 36,
    enrolled: 145,
    rating: 4.6,
    progress: 0,
    completedLessons: 0,
    thumbnail: 'network',
    tags: ['TCP/IP', 'OSI', 'Cisco', 'Security'],
  },
  {
    id: 'c-005',
    title: 'Algoritmlar va Ma\'lumotlar Tuzilmasi',
    description: 'Saralash, qidirish, graflar, daraxtlar. Murakkablik tahlili.',
    instructor: 'Kamola Mirzayeva',
    instructorAvatar: 'KM',
    category: 'Dasturlash',
    difficulty: 'advanced',
    duration: '32 soat',
    lessons: 64,
    enrolled: 89,
    rating: 4.9,
    progress: 0,
    completedLessons: 0,
    thumbnail: 'algo',
    tags: ['DSA', 'Big-O', 'LeetCode'],
  },
  {
    id: 'c-006',
    title: 'Kiberxavfsizlik Asoslari',
    description: 'Axborot xavfsizligi, shifrlash, hujumlar va mudofaa usullari.',
    instructor: 'Temur Holmatov',
    instructorAvatar: 'TH',
    category: 'Security',
    difficulty: 'advanced',
    duration: '28 soat',
    lessons: 56,
    enrolled: 112,
    rating: 4.8,
    progress: 0,
    completedLessons: 0,
    thumbnail: 'security',
    tags: ['Kriptografiya', 'Pentesting', 'OWASP'],
  },
]

export interface Lesson {
  id: string
  courseId: string
  title: string
  duration: string
  type: 'video' | 'text' | 'quiz' | 'practice'
  completed: boolean
  locked: boolean
  xpReward: number
}

export const LESSONS: Lesson[] = [
  { id: 'l-001', courseId: 'c-001', title: 'Python nima va nima uchun?', duration: '8 daq', type: 'video', completed: true, locked: false, xpReward: 10 },
  { id: 'l-002', courseId: 'c-001', title: 'O\'rnatish va muhit sozlash', duration: '12 daq', type: 'text', completed: true, locked: false, xpReward: 10 },
  { id: 'l-003', courseId: 'c-001', title: 'Birinchi dastur: Hello World', duration: '15 daq', type: 'practice', completed: true, locked: false, xpReward: 20 },
  { id: 'l-004', courseId: 'c-001', title: 'O\'zgaruvchilar va ma\'lumot turlari', duration: '20 daq', type: 'video', completed: true, locked: false, xpReward: 15 },
  { id: 'l-005', courseId: 'c-001', title: 'Mavzu 1 testi', duration: '10 daq', type: 'quiz', completed: true, locked: false, xpReward: 30 },
  { id: 'l-006', courseId: 'c-001', title: 'Shartli operatorlar (if/else)', duration: '18 daq', type: 'video', completed: true, locked: false, xpReward: 15 },
  { id: 'l-007', courseId: 'c-001', title: 'Sikllar: for va while', duration: '22 daq', type: 'practice', completed: false, locked: false, xpReward: 25 },
  { id: 'l-008', courseId: 'c-001', title: 'Funksiyalar', duration: '25 daq', type: 'video', completed: false, locked: true, xpReward: 20 },
  { id: 'l-009', courseId: 'c-001', title: 'Ro\'yxatlar (Lists)', duration: '20 daq', type: 'practice', completed: false, locked: true, xpReward: 25 },
  { id: 'l-010', courseId: 'c-001', title: 'Lug\'atlar (Dictionaries)', duration: '20 daq', type: 'video', completed: false, locked: true, xpReward: 20 },
]

export interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'late'
  grade?: number
  maxGrade: number
  description: string
  type: 'coding' | 'quiz' | 'project'
}

export const ASSIGNMENTS: Assignment[] = [
  { id: 'a-001', title: 'Python: Kalkulyator yaratish', course: 'Python Asoslari', dueDate: '2026-04-25', status: 'pending', maxGrade: 100, description: 'Arifmetik amallarni bajaradigan konsol kalkulyator yarating.', type: 'coding' },
  { id: 'a-002', title: 'HTML/CSS: Portfolio sahifasi', course: 'Web Dasturlash', dueDate: '2026-04-28', status: 'pending', maxGrade: 100, description: 'O\'z portfoliongizni yarating. Responsive dizayn majburiy.', type: 'project' },
  { id: 'a-003', title: 'SQL: Oxirgi test', course: 'Ma\'lumotlar Bazasi', dueDate: '2026-04-20', status: 'submitted', maxGrade: 100, description: 'SQL bo\'yicha yakuniy test.', type: 'quiz' },
  { id: 'a-004', title: 'Python: Ro\'yxatlar va Funksiyalar', course: 'Python Asoslari', dueDate: '2026-04-15', status: 'graded', grade: 92, maxGrade: 100, description: 'Ro\'yxatlar va funksiyalar mavzusida amaliy topshiriq.', type: 'coding' },
  { id: 'a-005', title: 'Tarmoqlar: Protokollar testi', course: 'Kompyuter Tarmoqlari', dueDate: '2026-04-10', status: 'graded', grade: 78, maxGrade: 100, description: 'Tarmoq protokollari bo\'yicha test.', type: 'quiz' },
]

export interface Student {
  id: string
  name: string
  avatar: string
  email: string
  level: number
  xp: number
  progress: number
  streak: number
  lastActive: string
  risk: 'low' | 'medium' | 'high'
  courses: string[]
  completedTasks: number
  totalTasks: number
}

export const STUDENTS: Student[] = [
  { id: 's-001', name: 'Azizbek Karimov', avatar: 'AK', email: 'aziz@edu.uz', level: 6, xp: 1420, progress: 72, streak: 12, lastActive: '2026-04-23', risk: 'low', courses: ['c-001', 'c-002'], completedTasks: 18, totalTasks: 25 },
  { id: 's-002', name: 'Malika Tursunova', avatar: 'MT', email: 'malika@edu.uz', level: 4, xp: 780, progress: 45, streak: 3, lastActive: '2026-04-22', risk: 'medium', courses: ['c-001', 'c-003'], completedTasks: 11, totalTasks: 25 },
  { id: 's-003', name: 'Jasur Raxmatullayev', avatar: 'JR', email: 'jasur@edu.uz', level: 8, xp: 3200, progress: 89, streak: 28, lastActive: '2026-04-23', risk: 'low', courses: ['c-001', 'c-002', 'c-004'], completedTasks: 22, totalTasks: 25 },
  { id: 's-004', name: 'Zulfiya Nazarova', avatar: 'ZN', email: 'zulfiya@edu.uz', level: 2, xp: 210, progress: 18, streak: 0, lastActive: '2026-04-18', risk: 'high', courses: ['c-001'], completedTasks: 4, totalTasks: 25 },
  { id: 's-005', name: 'Bobur Xolmatov', avatar: 'BX', email: 'bobur@edu.uz', level: 5, xp: 1100, progress: 58, streak: 7, lastActive: '2026-04-23', risk: 'low', courses: ['c-002', 'c-004'], completedTasks: 15, totalTasks: 25 },
  { id: 's-006', name: 'Nilufar Ergasheva', avatar: 'NE', email: 'nilufar@edu.uz', level: 3, xp: 490, progress: 32, streak: 1, lastActive: '2026-04-21', risk: 'medium', courses: ['c-001', 'c-002'], completedTasks: 8, totalTasks: 25 },
  { id: 's-007', name: 'Sherzod Umarov', avatar: 'SU', email: 'sherzod@edu.uz', level: 7, xp: 2600, progress: 80, streak: 19, lastActive: '2026-04-23', risk: 'low', courses: ['c-001', 'c-003', 'c-005'], completedTasks: 20, totalTasks: 25 },
  { id: 's-008', name: 'Dilorom Hasanova', avatar: 'DH', email: 'dilorom@edu.uz', level: 1, xp: 80, progress: 8, streak: 0, lastActive: '2026-04-14', risk: 'high', courses: ['c-001'], completedTasks: 2, totalTasks: 25 },
]

export interface Notification {
  id: string
  type: 'assignment' | 'grade' | 'achievement' | 'system' | 'message'
  title: string
  body: string
  time: string
  read: boolean
}

export const NOTIFICATIONS: Notification[] = [
  { id: 'n-001', type: 'achievement', title: 'Yangi yutuq!', body: '"12 kunlik seriya" nishoni olindi', time: '2026-04-23T10:00:00', read: false },
  { id: 'n-002', type: 'grade', title: 'Baho keldi', body: 'Python: Ro\'yxatlar — 92/100', time: '2026-04-22T15:30:00', read: false },
  { id: 'n-003', type: 'assignment', title: 'Yangi topshiriq', body: 'Kalkulyator yaratish — 25-aprelga qadar', time: '2026-04-22T09:00:00', read: true },
  { id: 'n-004', type: 'message', title: 'O\'qituvchi xabari', body: 'Dilnoza: Keyingi dars 26-aprel, 14:00', time: '2026-04-21T18:00:00', read: true },
]

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
  xpReward: number
  category: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-001', title: 'Birinchi Qadam', description: 'Birinchi darsni tugatdi', icon: 'rocket', earned: true, earnedAt: '2024-09-05', xpReward: 50, category: 'progress' },
  { id: 'ach-002', title: '7 Kunlik Seriya', description: '7 kun ketma-ket o\'qidi', icon: 'fire', earned: true, earnedAt: '2024-09-12', xpReward: 100, category: 'streak' },
  { id: 'ach-003', title: '12 Kunlik Seriya', description: '12 kun ketma-ket o\'qidi', icon: 'bolt', earned: true, earnedAt: '2026-04-23', xpReward: 150, category: 'streak' },
  { id: 'ach-004', title: 'Kod Yozuvchi', description: '10 ta kod topshiriqni bajardi', icon: 'code', earned: true, earnedAt: '2025-01-15', xpReward: 200, category: 'coding' },
  { id: 'ach-005', title: 'Testchi', description: '20 ta testdan o\'tdi', icon: 'check', earned: true, earnedAt: '2025-02-20', xpReward: 150, category: 'quiz' },
  { id: 'ach-006', title: 'Loyiha Ustasi', description: '3 ta katta loyiha topshirdi', icon: 'hammer', earned: false, xpReward: 500, category: 'project' },
  { id: 'ach-007', title: 'AI do\'stim', description: 'AI assistant bilan 50 ta suhbat', icon: 'bot', earned: false, xpReward: 200, category: 'ai' },
  { id: 'ach-008', title: 'Mukammal Baho', description: 'Bitta darsda 100/100 oldi', icon: 'percent', earned: false, xpReward: 300, category: 'grade' },
  { id: 'ach-009', title: 'O\'qimishli', description: '5 ta kursga yozildi', icon: 'book', earned: false, xpReward: 250, category: 'enrollment' },
  { id: 'ach-010', title: 'Birinchi Kurs', description: 'Birinchi kursni to\'liq tugatdi', icon: 'graduation', earned: false, xpReward: 1000, category: 'completion' },
]

export const ANALYTICS_DATA = {
  weeklyActivity: [
    { day: 'Du', minutes: 45, tasks: 3 },
    { day: 'Se', minutes: 90, tasks: 6 },
    { day: 'Ch', minutes: 30, tasks: 2 },
    { day: 'Pa', minutes: 120, tasks: 8 },
    { day: 'Ju', minutes: 75, tasks: 5 },
    { day: 'Sh', minutes: 60, tasks: 4 },
    { day: 'Ya', minutes: 0, tasks: 0 },
  ],
  topicDifficulty: [
    { topic: 'Sikllar', difficulty: 85, students: 48 },
    { topic: 'Rekursiya', difficulty: 92, students: 38 },
    { topic: 'Ro\'yxatlar', difficulty: 45, students: 52 },
    { topic: 'Funksiyalar', difficulty: 60, students: 50 },
    { topic: 'OOP', difficulty: 78, students: 35 },
    { topic: 'Fayllar', difficulty: 55, students: 42 },
  ],
  studentProgress: [
    { month: 'Sen', enrolled: 45, completed: 12, active: 38 },
    { month: 'Okt', enrolled: 52, completed: 18, active: 44 },
    { month: 'Noy', enrolled: 61, completed: 25, active: 50 },
    { month: 'Dek', enrolled: 58, completed: 30, active: 45 },
    { month: 'Yan', enrolled: 70, completed: 38, active: 58 },
    { month: 'Fev', enrolled: 78, completed: 45, active: 65 },
    { month: 'Mar', enrolled: 85, completed: 52, active: 72 },
    { month: 'Apr', enrolled: 92, completed: 58, active: 78 },
  ],
  systemStats: {
    totalUsers: 1247,
    activeToday: 342,
    coursesTotal: 24,
    lessonsTotal: 486,
    assignmentsTotal: 1823,
    avgCompletionRate: 67,
    avgRating: 4.8,
    serverLoad: 34,
    storageUsed: 68,
    uptime: 99.97,
  },
}

export const AI_SUGGESTIONS = [
  "Rekursiya mavzusida qiyinchilik sezilmoqda. Vizual animatsiyalar bilan tushuntirilsa samarali bo'ladi.",
  "Jasur Raxmatullayev juda tez ilgarilamoqda — murakkabiroq vazifalar tavsiya etiladi.",
  "Zulfiya 5 kun dars ko'rmadi. Unga motivatsion xabar yuborish foydali bo'lishi mumkin.",
  "Sikllar mavzusidagi test natijalari o'rtacha 58%. Qo'shimcha praktika kerak.",
  "Haftalik aktiv o'quvchilar soni 12% o'sdi — gamifikatsiya strategiyasi ishlayapti.",
]

export const CODE_EXAMPLES = {
  python: `# Python - Ro'yxatlarni qayta ishlash
def toping_maksimum(royxat):
    if len(royxat) == 0:
        return None

    maksimum = royxat[0]
    for element in royxat:
        if element > maksimum:
            maksimum = element

    return maksimum

# Sinov
sonlar = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
natija = toping_maksimum(sonlar)
print(f"Maksimum son: {natija}")  # 9
`,
  javascript: `// JavaScript - Async/Await misoli
async function foydalanuvchiMalumoti(id) {
  try {
    const javob = await fetch(\`/api/users/\${id}\`);

    if (!javob.ok) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    const malumot = await javob.json();
    return malumot;

  } catch (xato) {
    console.error('Xato:', xato.message);
    return null;
  }
}

// Ishlatish
foydalanuvchiMalumoti(42).then(user => {
  console.log('Foydalanuvchi:', user?.name);
});
`,
  sql: `-- SQL - Murakkab so'rov
SELECT
    t.nomi AS talaba_ismi,
    k.sarlavha AS kurs,
    AVG(b.ball) AS o_rtacha_ball,
    COUNT(b.id) AS topshiriqlar_soni,
    RANK() OVER (
        PARTITION BY k.id
        ORDER BY AVG(b.ball) DESC
    ) AS o_rin
FROM talabalar t
JOIN yozilishlar y ON t.id = y.talaba_id
JOIN kurslar k ON y.kurs_id = k.id
LEFT JOIN baholar b ON t.id = b.talaba_id
WHERE y.sana >= '2024-09-01'
GROUP BY t.id, t.nomi, k.id, k.sarlavha
HAVING COUNT(b.id) > 0
ORDER BY k.sarlavha, o_rtacha_ball DESC;
`,
}
