/**
 * API client — backend bilan ulanish.
 * NEXT_PUBLIC_API_URL env var orqali backend manzilini o'zgartiring.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://educode-backend.onrender.com'

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

async function request<T = any>(path: string, options: { method?: Method; body?: any } = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('edu-token') : null
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Server xatosi' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  if (res.status === 204) return {} as T
  return res.json()
}

export const api = {
  // Auth
  login: (email: string, password: string, expectedRole?: string) =>
    request<{ token: string; user: any }>('/api/auth/login', { method: 'POST', body: { email, password, expectedRole } }),
  register: (data: { name: string; email: string; password: string; role: string }) =>
    request<{ token: string; user: any }>('/api/auth/register', { method: 'POST', body: data }),
  me: () => request<any>('/api/auth/me'),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  // Courses
  courses: () => request<any[]>('/api/courses'),
  myCourses: () => request<any[]>('/api/courses/mine'),
  course: (id: string) => request<any>(`/api/courses/${id}`),
  enroll: (id: string) => request(`/api/courses/${id}/enroll`, { method: 'POST' }),
  createCourse: (data: any) => request('/api/courses', { method: 'POST', body: data }),
  updateCourse: (id: string, data: any) => request(`/api/courses/${id}`, { method: 'PATCH', body: data }),
  deleteCourse: (id: string) => request(`/api/courses/${id}`, { method: 'DELETE' }),

  // Lessons
  completeLesson: (id: string) => request<any>(`/api/lessons/${id}/complete`, { method: 'POST' }),
  createLesson: (data: any) => request('/api/lessons', { method: 'POST', body: data }),
  updateLesson: (id: string, data: any) => request(`/api/lessons/${id}`, { method: 'PATCH', body: data }),
  deleteLesson: (id: string) => request(`/api/lessons/${id}`, { method: 'DELETE' }),

  // Assignments
  myAssignments: () => request<any[]>('/api/assignments/mine'),
  teachingAssignments: () => request<any[]>('/api/assignments/teaching'),
  submitAssignment: (id: string, content: string) =>
    request(`/api/assignments/${id}/submit`, { method: 'POST', body: { content } }),
  gradeSubmission: (id: string, grade: number, feedback?: string) =>
    request(`/api/assignments/submissions/${id}/grade`, { method: 'POST', body: { grade, feedback } }),
  createAssignment: (data: any) => request('/api/assignments', { method: 'POST', body: data }),
  deleteAssignment: (id: string) => request(`/api/assignments/${id}`, { method: 'DELETE' }),
  assignmentSubmissions: (id: string) => request<any[]>(`/api/assignments/${id}/submissions`),

  // Users
  users: (params?: { role?: string; q?: string }) => {
    const q = new URLSearchParams(params as any).toString()
    return request<any[]>(`/api/users${q ? '?' + q : ''}`)
  },
  students: () => request<any[]>('/api/users/students'),
  createUser: (data: any) => request('/api/users', { method: 'POST', body: data }),
  updateUser: (id: string, data: any) => request(`/api/users/${id}`, { method: 'PATCH', body: data }),
  deleteUser: (id: string) => request(`/api/users/${id}`, { method: 'DELETE' }),

  // Misc
  notifications: () => request<any[]>('/api/notifications'),
  markNotificationRead: (id: string) => request(`/api/notifications/${id}/read`, { method: 'POST' }),
  achievements: () => request<any[]>('/api/achievements'),
  weekly: () => request<any[]>('/api/analytics/weekly'),
  difficulty: () => request<any[]>('/api/analytics/difficulty'),
  growth: () => request<any[]>('/api/analytics/growth'),
  aiSuggestions: () => request<string[]>('/api/analytics/ai-suggestions'),
  systemStats: () => request<any>('/api/system/stats'),
  systemLogs: (limit = 50) => request<any[]>(`/api/system/logs?limit=${limit}`),
  aiChat: (message: string) => request<{ reply: string }>('/api/ai/chat', { method: 'POST', body: { message } }),
  runCode: (code: string, language: string) =>
    request<{ output: string; exitCode: number; duration: number }>('/api/code/run', { method: 'POST', body: { code, language } }),
}

export const API_URL = BASE_URL
