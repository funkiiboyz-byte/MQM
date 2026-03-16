import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function HandleExams() {
  const [exams, setExams] = useState([]);
  const load = () => api('/exams').then(setExams);
  useEffect(load, []);
  return <div className="panel"><h2>Handle Exams</h2><table><thead><tr><th>Exam</th><th>Type</th><th>Questions</th><th>Status</th><th>Action</th></tr></thead><tbody>{exams.map(e => <tr key={e.id}><td>{e.title}</td><td>{e.examType}</td><td>{e.questionCount}</td><td>{e.published ? 'Published':'Draft'}</td><td><button onClick={async()=>{await api(`/exams/${e.id}/publish`,{method:'PATCH'});load();}}>{e.published?'Unpublish':'Publish'}</button></td></tr>)}</tbody></table></div>;
}
