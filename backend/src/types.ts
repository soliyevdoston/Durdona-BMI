export type Role = 'student' | 'teacher' | 'admin' | 'super_admin'

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: Role
  avatar: string
  xp: number
  level: number
  streak: number
  joinedAt: string
}

export interface PublicUser extends Omit<User, 'passwordHash'> {}

export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  lessons: number
  enrolled: number
  rating: number
  thumbnail: string
  tags: string[]
  createdAt: string
}

export interface Enrollment {
  userId: string
  courseId: string
  progress: number
  completedLessons: number
  enrolledAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  duration: string
  type: 'video' | 'text' | 'quiz' | 'practice'
  order: number
  xpReward: number
  content?: string
}

export interface LessonProgress {
  userId: string
  lessonId: string
  completed: boolean
  completedAt?: string
}

export interface Assignment {
  id: string
  title: string
  courseId: string
  description: string
  dueDate: string
  maxGrade: number
  type: 'coding' | 'quiz' | 'project'
  createdAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  userId: string
  content: string
  status: 'submitted' | 'graded' | 'late'
  grade?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
}

export interface Notification {
  id: string
  userId: string
  type: 'assignment' | 'grade' | 'achievement' | 'system' | 'message'
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  category: string
}

export interface UserAchievement {
  userId: string
  achievementId: string
  earnedAt: string
}

export interface ActivityLog {
  id: string
  userId: string | null
  action: string
  meta?: Record<string, unknown>
  ip?: string
  createdAt: string
}

export interface AuthRequest extends Express.Request {
  user?: { id: string; role: Role; email: string }
}
