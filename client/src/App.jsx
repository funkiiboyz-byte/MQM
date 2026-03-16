import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './lib/api';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CreateExam from './pages/CreateExam';
import QuestionBank from './pages/QuestionBank';
import HandleExams from './pages/HandleExams';
import Students from './pages/Students';
import Analytics from './pages/Analytics';
import Devices from './pages/Devices';
import Password from './pages/Password';
import Layout from './components/Layout';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api('/courses').catch(() => {
      localStorage.clear();
      setUser(null);
    });
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <Layout user={user} onLogout={() => { localStorage.clear(); setUser(null); }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/handle-exams" element={<HandleExams />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/students" element={<Students />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/password" element={<Password />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
