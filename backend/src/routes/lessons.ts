import { Router } from "express";
import { prisma, log } from "../prisma";
import { requireAuth, requireRole } from "../auth";
import OpenAI from "openai";
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
import mammoth from "mammoth";

const router = Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// base64 data URL dan matn chiqarish (PDF yoki DOCX)
async function extractTextFromDataUrl(dataUrl: string): Promise<string> {
  const [header, base64] = dataUrl.split(",");
  if (!base64) return "";
  const buffer = Buffer.from(base64, "base64");
  if (header.includes("pdf")) {
    const result = await pdfParse(buffer);
    return result.text.slice(0, 6000);
  }
  if (header.includes("word") || header.includes("officedocument")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.slice(0, 6000);
  }
  return "";
}

// Create lesson
router.post(
  "/",
  requireAuth,
  requireRole("teacher", "admin", "super_admin"),
  async (req, res) => {
    const {
      courseId,
      title,
      type,
      duration,
      xpReward,
      content,
      videoUrl,
      resourceUrl,
      resourceName,
      resourceType,
    } = req.body;
    if (!courseId || !title || !type)
      return res.status(400).json({ error: "courseId, title, type kerak" });
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });
    if (
      course.instructorId !== req.user!.id &&
      req.user!.role !== "admin" &&
      req.user!.role !== "super_admin"
    ) {
      return res.status(403).json({ error: "Bu kurs sizniki emas" });
    }
    const last = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });
    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        type,
        duration: duration || "10 daqiqa",
        xpReward: xpReward || 20,
        order: (last?.order ?? 0) + 1,
        content: content || null,
        videoUrl: videoUrl || null,
        resourceUrl: resourceUrl || null,
        resourceName: resourceName || null,
        resourceType: resourceType || null,
      },
    });
    const allLessons = await prisma.lesson.findMany({ where: { courseId } });
    const totalMin = allLessons.reduce(
      (s, l) => s + (parseInt(l.duration) || 0),
      0,
    );
    await prisma.course.update({
      where: { id: courseId },
      data: { duration: `${Math.ceil(totalMin / 60) || 1} soat` },
    });
    await log(req.user!.id, "lesson.create", { lessonId: lesson.id, courseId });
    res.status(201).json(lesson);
  },
);

// Update lesson
router.patch(
  "/:id",
  requireAuth,
  requireRole("teacher", "admin", "super_admin"),
  async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: true },
    });
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });
    if (
      lesson.course.instructorId !== req.user!.id &&
      req.user!.role !== "admin" &&
      req.user!.role !== "super_admin"
    ) {
      return res.status(403).json({ error: "Bu kurs sizniki emas" });
    }
    const allowed = [
      "title",
      "type",
      "duration",
      "xpReward",
      "content",
      "videoUrl",
      "resourceUrl",
      "resourceName",
      "resourceType",
      "order",
    ];
    const data: any = {};
    for (const k of allowed) {
      if (k in req.body) data[k] = req.body[k];
    }
    const updated = await prisma.lesson.update({
      where: { id: req.params.id },
      data,
    });
    await log(req.user!.id, "lesson.update", {
      lessonId: lesson.id,
      fields: Object.keys(data),
    });
    res.json(updated);
  },
);

// Delete lesson
router.delete(
  "/:id",
  requireAuth,
  requireRole("teacher", "admin", "super_admin"),
  async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: true },
    });
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });
    if (
      lesson.course.instructorId !== req.user!.id &&
      req.user!.role !== "admin" &&
      req.user!.role !== "super_admin"
    ) {
      return res.status(403).json({ error: "Bu kurs sizniki emas" });
    }
    await prisma.lesson.delete({ where: { id: req.params.id } });
    await log(req.user!.id, "lesson.delete", { lessonId: req.params.id });
    res.json({ ok: true });
  },
);

// Quiz savollari generatsiyasi — OpenAI orqali
router.post("/:id/generate-quiz", requireAuth, async (req, res) => {
  const lessonId = req.params.id;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });

  // Keshda bor bo'lsa qaytaramiz
  if (lesson.content) {
    try {
      const cached = JSON.parse(lesson.content);
      if (Array.isArray(cached) && cached.length > 0) {
        return res.json({ questions: cached, cached: true });
      }
    } catch {}
  }

  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY === "your-openai-api-key-here"
  ) {
    return res.status(503).json({ error: "OpenAI API kaliti sozlanmagan" });
  }

  // Kurs darslaridan manba matnni topamiz
  const courseLessons = await prisma.lesson.findMany({
    where: { courseId: lesson.courseId },
    orderBy: { order: "asc" },
  });

  let sourceText = "";

  // Avval o'sha darsning o'z resursini tekshiramiz
  if (lesson.resourceUrl) {
    sourceText = await extractTextFromDataUrl(lesson.resourceUrl);
  }

  // Agar yo'q bo'lsa, kurs darslaridagi resurslarni yig'amiz
  if (!sourceText) {
    for (const l of courseLessons) {
      if (l.resourceUrl) {
        const text = await extractTextFromDataUrl(l.resourceUrl);
        sourceText += text + "\n";
        if (sourceText.length > 5000) break;
      }
    }
  }

  // Agar hech qanday resurs bo'lmasa yoki OpenAI xatosi bo'lsa, fallback quiz berish
  let questions: any[] = [];

  if (sourceText.trim()) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `You are an educational quiz generator. Generate exactly 5 multiple-choice questions from the given text.

CRITICAL RULES:
- Detect the language of the input text automatically
- Write ALL questions AND all answer options in THE SAME language as the input text
- If the text is in English → all questions and answers must be in English
- If the text is in Russian → all questions and answers must be in Russian
- If the text is in Uzbek → all questions and answers must be in Uzbek
- Each question has exactly 4 options
- Only one option is correct
- Test understanding of key concepts

Return ONLY valid JSON array, no markdown, no explanation:
[{"id":1,"q":"Question?","options":["A","B","C","D"],"correct":0},...]

where "correct" is the 0-based index of the correct option.`,
          },
          {
            role: "user",
            content: sourceText.slice(0, 5000),
          },
        ],
      });

      const raw = completion.choices[0].message.content?.trim() || "[]";
      const cleaned = raw
        .replace(/^```json\n?/, "")
        .replace(/^```\n?/, "")
        .replace(/\n?```$/, "");
      questions = JSON.parse(cleaned);

      if (!Array.isArray(questions) || questions.length === 0) {
        questions = []; // Fallbackga yuboring
      }
    } catch (err: any) {
      console.error("OpenAI error:", err.message);
      // Fallback quiz ishlatamiz
      questions = [];
    }
  }

  // Agar AI quiz bo'lmasa, fallback quiz berish
  if (questions.length === 0) {
    questions = [
      {
        id: 1,
        q: `"${lesson.title}" mavzusining asosiy maqsadi nima?`,
        options: [
          "Mavzuni chuqur o'rganish va tushunchalarni tushuib olish",
          "Faqat test topshirish uchun",
          "Vaqtni o'tkazish uchun",
          "Boshqa kursga o'tish uchun",
        ],
        correct: 0,
      },
      {
        id: 2,
        q: "Bu darsni o'rganib, qanday ko'nikmalar orttirasiz?",
        options: [
          "Mavzuga tegishli bilim va amaliy ko'nikmalarni orttiramiz",
          "Computerni buzish usulini o'rganamiz",
          "Faqat oqish o'rganamiz",
          "Hech narsa o'rganmaymiz",
        ],
        correct: 0,
      },
      {
        id: 3,
        q: "Dars bilan ishlashda eng muhim narsa nima?",
        options: [
          "Ehtiyot bilan, diqqat bilan o'qish va amaliyot qilish",
          "Tezda o'tib ketish",
          "Faqat video ko'rish",
          "Boshqalarning javobini ko'chirish",
        ],
        correct: 0,
      },
      {
        id: 4,
        q: "Darsni bajarildi deb belgilashdan oldin nima qilish kerak?",
        options: [
          "Barcha ma'lumotlarni o'rganish va tushunish",
          "Testni topshirish",
          "O'qituvchiga yozish",
          "Boshqa talabalarni soʻrash",
        ],
        correct: 0,
      },
      {
        id: 5,
        q: "Agar dars davomida savol tug'ilsa, nima qilish kerak?",
        options: [
          "AI yordamchiga yoki o'qituvchiga murojaat qilish",
          "Yolg'on javob o'rni boshqalardan ko'chirish",
          "Darsni tashlab ketish",
          "Hech narsani qilmasdan kutish",
        ],
        correct: 0,
      },
    ];
  }

  // Keshga saqlaymiz
  await prisma.lesson.update({
    where: { id: lessonId },
    data: { content: JSON.stringify(questions) },
  });

  await log(req.user!.id, "quiz.generate", {
    lessonId,
    count: questions.length,
  });
  res.json({ questions, cached: false });
});

// Keshdan quiz savollarini olish
router.get("/:id/quiz", requireAuth, async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: req.params.id },
  });
  if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });
  if (lesson.content) {
    try {
      const questions = JSON.parse(lesson.content);
      if (Array.isArray(questions) && questions.length > 0) {
        return res.json({ questions });
      }
    } catch {}
  }
  res.json({ questions: [] });
});

router.post("/:id/complete", requireAuth, async (req, res) => {
  const lessonId = req.params.id;
  const userId = req.user!.id;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  if (existing && existing.completed) {
    return res.json({ ok: true, alreadyCompleted: true });
  }

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() },
  });

  // XP va level
  const levels = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 7000];
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User yo'q" });
  const newXP = user.xp + lesson.xpReward;
  let newLevel = 1;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (newXP >= levels[i]) {
      newLevel = i + 1;
      break;
    }
  }
  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXP, level: newLevel, lastActive: new Date() },
  });

  // Enrollment progress
  const totalLessons = await prisma.lesson.count({
    where: { courseId: lesson.courseId },
  });
  const completedCount = await prisma.lessonProgress.count({
    where: { userId, completed: true, lesson: { courseId: lesson.courseId } },
  });
  const progress = Math.round((completedCount / totalLessons) * 100);
  await prisma.enrollment.updateMany({
    where: { userId, courseId: lesson.courseId },
    data: { progress, completedLessons: completedCount },
  });

  await log(userId, "lesson.complete", { lessonId, xp: lesson.xpReward });
  res.json({ ok: true, xpEarned: lesson.xpReward, newXP, newLevel });
});

export default router;
