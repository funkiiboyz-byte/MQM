import { Link } from 'react-router-dom';

const modules = [
  ['Create Exam', 'Setup new papers', '/create-exam', 'blue', 'Create exams with sections and schedule'],
  ['Handle Exams', 'Manage active tests', '/handle-exams', 'green', 'Publish/unpublish and manage status'],
  ['Question Bank', 'Repository access', '/question-bank', 'orange', 'Add MCQ/CQ, JSON import and LaTeX preview'],
  ['Students', 'User management', '/students', 'purple', 'Create, upload CSV and activate/deactivate'],
  ['Analytics', 'Performance reports', '/analytics', 'pink', 'Attempts, average score and accuracy'],
  ['Devices', 'Session security', '/devices', 'cyan', 'View active devices and force logout'],
  ['Password', 'Update credentials', '/password', 'slate', 'Securely update account password']
];

export default function Dashboard() {
  return (
    <section>
      <div className="panel welcome-panel">
        <h2>Welcome to MEGAPREP CMS</h2>
        <p>Choose any module from below to start managing exams, questions and users.</p>
      </div>

      <div className="grid">
        {modules.map(([title, subtitle, link, color, detail]) => (
          <Link to={link} key={title} className={`dash-card ${color}`}>
            <h3>{title}</h3>
            <p className="dash-subtitle">{subtitle}</p>
            <p className="dash-detail">{detail}</p>
            <span className="dash-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
