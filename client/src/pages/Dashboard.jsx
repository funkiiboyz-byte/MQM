import { Link } from 'react-router-dom';
const modules = [
  ['Create Exam', 'Setup new papers', '/create-exam', 'blue'], ['Handle Exams', 'Manage active tests', '/handle-exams', 'green'],
  ['Question Bank', 'Repository access', '/question-bank', 'orange'], ['Students', 'User management', '/students', 'purple'],
  ['Analytics', 'Performance reports', '/analytics', 'pink'], ['Devices', 'Session security', '/devices', 'cyan'], ['Password', 'Update credentials', '/password', 'slate']
];
export default function Dashboard() {
  return <section className="grid">{modules.map(([t,s,link,c]) => <Link to={link} key={t} className={`dash-card ${c}`}><h3>{t}</h3><p>{s}</p></Link>)}</section>;
}
