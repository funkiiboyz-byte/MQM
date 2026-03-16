import { Link, useLocation } from 'react-router-dom';

const cards = [
  ['Create Exam', '/create-exam', 'blue', '📝'],
  ['Handle Exams', '/handle-exams', 'green', '🧩'],
  ['Question Bank', '/question-bank', 'orange', '📚'],
  ['Students', '/students', 'purple', '👥'],
  ['Analytics', '/analytics', 'pink', '📊'],
  ['Devices', '/devices', 'cyan', '🖥️'],
  ['Password', '/password', 'slate', '🔐']
];

export default function Layout({ user, onLogout, children }) {
  const { pathname } = useLocation();

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand-wrap">
          <b className="logo">MEGAPREP</b>
          <span className="muted">CMS Admin Panel</span>
        </div>

        <div className="user-actions">
          <span className="pill">{user.name}</span>
          <button type="button" className="btn btn-dark" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="card-nav">
        {cards.map(([label, to, color, icon]) => (
          <Link key={to} to={to} className={`mini-card ${color} ${pathname === to ? 'active' : ''}`}>
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <main>{children}</main>
    </div>
  );
}
