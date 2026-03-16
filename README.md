# MEGAPREP Professional Exam & Question Maker CMS

Full-stack Admin Panel CMS for exam and question management.

## Stack
- Frontend: React (Vite), React Hook Form, Chart.js, KaTeX
- Backend: Node.js + Express REST API
- Auth: JWT + RBAC (admin/teacher)
- Storage: JSON database (swap-ready to PostgreSQL/Mongo)

## Features
- Card-based responsive dashboard modules
- Create Exam with dynamic section builder
- Handle Exams (list/publish/unpublish/delete)
- Question Bank:
  - Manual MCQ/CQ creation
  - LaTeX preview
  - JSON import with validation
- Students management + CSV bulk upload + activate/deactivate
- Analytics charts and question-wise accuracy
- Devices/sessions listing + force logout
- Password management

## Run
```bash
npm install
npm run dev
```
- API: `http://localhost:4000`
- App: `http://localhost:5173`

## Default login
- Email: `admin@megaprep.com`
- Password: `admin123`
