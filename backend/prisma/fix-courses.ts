import fs from 'fs'
import path from 'path'

const file = path.join(__dirname, '../src/routes/courses.ts')
const lines = fs.readFileSync(file, 'utf8').split('\n')

// Barcha "router.get('/', " kabi yolg'iz qolgan qatorlarni o'chir
const fixed = lines.filter((line, i) => {
  const t = line.trim()
  // Faqat router.get boshlab, tugallanmagan (router yoki async so'zi yo'q pastki qatorda)
  if (t === "router.get('/'," || t === "router.get('/', ") {
    console.log(`✓ ${i + 1}-qator o'chirildi: ${JSON.stringify(line)}`)
    return false
  }
  return true
})

fs.writeFileSync(file, fixed.join('\n'), 'utf8')
console.log(`✓ Saqlandi. Jami: ${lines.length} → ${fixed.length} qator`)
