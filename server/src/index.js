import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { createId, readDb, writeDb } from './db.js';
import { loginHandler, requireAuth, requireRole } from './auth.js';
import { fileURLToPath } from 'node:url';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/auth/login', loginHandler);

app.get('/api/courses', requireAuth, (_req, res) => {
  const db = readDb();
  res.json(db.courses);
});

const examSchema = z.object({
  courseId: z.string(), examNumber: z.string(), title: z.string().min(3),
  duration: z.coerce.number().int().positive(), fullMarks: z.coerce.number().positive(),
  examType: z.enum(['MCQ', 'CQ']), examDate: z.string(), startTime: z.string(), endTime: z.string(),
  sections: z.array(z.object({ name: z.string(), marksPerQuestion: z.coerce.number().positive() })).min(1)
});

app.get('/api/exams', requireAuth, (_req, res) => {
  const db = readDb();
  res.json(db.exams.map((e) => ({ ...e, questionCount: db.questions.filter((q) => q.examId === e.id).length })));
});

app.post('/api/exams', requireAuth, requireRole('admin', 'teacher'), (req, res) => {
  const parsed = examSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const db = readDb();
  const exam = { id: createId('exam'), published: false, createdAt: new Date().toISOString(), ...parsed.data };
  db.exams.push(exam);
  writeDb(db);
  return res.status(201).json(exam);
});

app.patch('/api/exams/:id/publish', requireAuth, requireRole('admin', 'teacher'), (req, res) => {
  const db = readDb();
  const exam = db.exams.find((e) => e.id === req.params.id);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  exam.published = !exam.published;
  writeDb(db);
  res.json(exam);
});

app.delete('/api/exams/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = readDb();
  db.exams = db.exams.filter((e) => e.id !== req.params.id);
  db.questions = db.questions.filter((q) => q.examId !== req.params.id);
  writeDb(db);
  res.status(204).send();
});

const questionSchema = z.object({
  examId: z.string().optional(), sectionName: z.string().optional(), type: z.enum(['MCQ', 'CQ']),
  question: z.string().min(1), options: z.array(z.string()).optional(), correct: z.number().optional(),
  explanation: z.string().optional(), stimulus: z.string().optional(),
  subQuestions: z.array(z.object({ label: z.string(), answer: z.string() })).optional(),
  tags: z.array(z.string()).optional(), difficulty: z.enum(['easy', 'medium', 'hard']).optional(), imageUrl: z.string().optional()
});

app.get('/api/questions', requireAuth, (_req, res) => res.json(readDb().questions));

app.post('/api/questions', requireAuth, requireRole('admin', 'teacher'), (req, res) => {
  const parsed = questionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const db = readDb();
  const question = { id: createId('q'), createdAt: new Date().toISOString(), ...parsed.data };
  db.questions.push(question);
  writeDb(db);
  res.status(201).json(question);
});

const jsonImportSchema = z.object({ questions: z.array(z.object({
  question: z.string(), options: z.array(z.string()).optional(), correct: z.number().optional(), explanation: z.string().optional(),
  sectionName: z.string().optional(), type: z.enum(['MCQ', 'CQ']).optional()
})) });

app.post('/api/questions/import-json', requireAuth, requireRole('admin', 'teacher'), (req, res) => {
  const parsed = jsonImportSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid JSON format', errors: parsed.error.flatten() });
  const db = readDb();
  const imported = parsed.data.questions.map((item) => ({
    id: createId('q'), type: item.type || 'MCQ', question: item.question, options: item.options || [],
    correct: item.correct, explanation: item.explanation || '', sectionName: item.sectionName || 'General', createdAt: new Date().toISOString()
  }));
  db.questions.push(...imported);
  writeDb(db);
  res.json({ count: imported.length, imported });
});

app.post('/api/students', requireAuth, requireRole('admin', 'teacher'), (req, res) => {
  const db = readDb();
  const student = { id: createId('stu'), status: 'active', ...req.body };
  db.students.push(student);
  writeDb(db);
  res.status(201).json(student);
});
app.get('/api/students', requireAuth, (_req, res) => res.json(readDb().students));

app.post('/api/students/bulk-csv', requireAuth, requireRole('admin', 'teacher'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'CSV file is required' });
  const records = parse(req.file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true });
  const db = readDb();
  const students = records.map((r) => ({ id: createId('stu'), name: r.name, email: r.email, course: r.course, status: 'active' }));
  db.students.push(...students);
  writeDb(db);
  res.json({ count: students.length });
});

app.patch('/api/students/:id/toggle', requireAuth, requireRole('admin', 'teacher'), (req, res) => {
  const db = readDb();
  const student = db.students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  student.status = student.status === 'active' ? 'inactive' : 'active';
  writeDb(db);
  res.json(student);
});

app.get('/api/analytics', requireAuth, (_req, res) => {
  const db = readDb();
  res.json({
    attempts: db.exams.map((exam) => ({ exam: exam.title, attempts: Math.floor(Math.random() * 120), averageScore: Number((40 + Math.random() * 60).toFixed(2)) })),
    questionAccuracy: db.questions.slice(0, 8).map((q) => ({ label: q.question.slice(0, 24), value: Number((50 + Math.random() * 50).toFixed(2)) }))
  });
});

app.get('/api/devices', requireAuth, (_req, res) => res.json(readDb().sessions));
app.delete('/api/devices/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = readDb();
  db.sessions = db.sessions.filter((d) => d.id !== req.params.id);
  writeDb(db);
  res.status(204).send();
});

app.post('/api/password/change', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.sub);
  if (!user || user.password !== oldPassword) return res.status(400).json({ message: 'Old password mismatch' });
  user.password = newPassword;
  writeDb(db);
  res.json({ message: 'Password changed' });
});

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

export default app;
