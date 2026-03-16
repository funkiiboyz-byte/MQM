import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../data/db.json');

const seed = {
  users: [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@megaprep.com',
      password: 'admin123',
      role: 'admin'
    }
  ],
  sessions: [],
  courses: [
    { id: 'c-1', name: 'Mathematics' },
    { id: 'c-2', name: 'Physics' },
    { id: 'c-3', name: 'Chemistry' }
  ],
  exams: [],
  questions: [],
  students: []
};

function ensureDb() {
  if (!existsSync(dirname(dbPath))) mkdirSync(dirname(dbPath), { recursive: true });
  if (!existsSync(dbPath)) writeFileSync(dbPath, JSON.stringify(seed, null, 2));
}

export function readDb() {
  ensureDb();
  return JSON.parse(readFileSync(dbPath, 'utf8'));
}

export function writeDb(db) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function createId(prefix = 'id') {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}
