/**
 * "Kompyuter Tarmoqlari" kursini DB ga qo'shadi (mavjud bo'lmasa).
 * Idempotent — bir necha marta ishga tushirsangiz takror yaratmaydi.
 *
 * Ishga tushirish:
 *   cd backend && npx tsx prisma/add-network-course.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const COURSE_ID = 'c-007'
const INSTRUCTOR_ID = 'u-d2' // Durdona Ustoz

const LESSONS = [
  { id: 'l-101', title: "Kompyuter tarmoqlari haqida umumiy ma'lumot", duration: '12 daq', type: 'video', xpReward: 10 },
  { id: 'l-102', title: 'Tarmoq turlari: LAN, MAN, WAN', duration: '14 daq', type: 'video', xpReward: 15 },
  { id: 'l-103', title: 'Tarmoq topologiyalari', duration: '14 daq', type: 'video', xpReward: 15 },
  { id: 'l-104', title: 'IP manzil va MAC manzil', duration: '16 daq', type: 'video', xpReward: 20 },
  { id: 'l-105', title: 'OSI modeli va uning qatlamlari', duration: '18 daq', type: 'video', xpReward: 25 },
  { id: 'l-106', title: 'TCP/IP protokollari', duration: '16 daq', type: 'video', xpReward: 20 },
  { id: 'l-107', title: "Tarmoq qurilmalari: router, switch, hub", duration: '14 daq', type: 'video', xpReward: 15 },
  { id: 'l-108', title: 'Kompyuter tarmoqlari testi', duration: '10 daq', type: 'quiz', xpReward: 30 },
]

async function main() {
  console.log('→ "Kompyuter Tarmoqlari" kursi qo\'shilmoqda...')

  // O'qituvchi mavjudligini tekshiramiz
  const instructor = await prisma.user.findUnique({ where: { id: INSTRUCTOR_ID } })
  if (!instructor) {
    console.error(`✗ O'qituvchi ${INSTRUCTOR_ID} topilmadi. Avval seed.ts ni ishga tushiring.`)
    process.exit(1)
  }

  // Kurs mavjudligini tekshiramiz
  const existing = await prisma.course.findUnique({ where: { id: COURSE_ID } })
  if (existing) {
    console.log(`  ✓ Kurs allaqachon mavjud: ${existing.title}`)
  } else {
    await prisma.course.create({
      data: {
        id: COURSE_ID,
        title: 'Kompyuter Tarmoqlari',
        description: "Kompyuter tarmoqlari asoslari: LAN/WAN, IP manzillar, OSI modeli, TCP/IP, tarmoq qurilmalari.",
        instructorId: INSTRUCTOR_ID,
        category: 'Informatika',
        difficulty: 'intermediate',
        duration: '16 soat',
        rating: 4.8,
        thumbnail: 'network',
        tags: ['Tarmoq', 'OSI', 'TCP/IP', 'IP manzil'],
      },
    })
    console.log('  ✓ Kurs yaratildi')
  }

  // Darslarni qo'shamiz (upsert — qayta ishga tushirilsa takror yaratmaydi)
  let added = 0, skipped = 0
  for (let i = 0; i < LESSONS.length; i++) {
    const l = LESSONS[i]
    const exists = await prisma.lesson.findUnique({ where: { id: l.id } })
    if (exists) {
      skipped++
      continue
    }
    await prisma.lesson.create({
      data: {
        id: l.id,
        courseId: COURSE_ID,
        title: l.title,
        duration: l.duration,
        type: l.type,
        order: i + 1,
        xpReward: l.xpReward,
        // videoUrl va resourceUrl bo'sh — o'qituvchi keyin yuklaydi
      },
    })
    added++
  }
  console.log(`  ✓ ${added} ta yangi dars qo'shildi, ${skipped} ta darsni o'tkazib yuborildi`)
  console.log('✓ Tayyor! O\'qituvchi panelida darsga PDF/Word qo\'llanma va video URL qo\'shing.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
