import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function HandleExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const list = await api('/exams');
      setExams(list);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (id) => {
    try {
      await api(`/exams/${id}/publish`, { method: 'PATCH' });
      toast.success('Exam status updated');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteExam = async (id) => {
    try {
      await api(`/exams/${id}`, { method: 'DELETE' });
      toast.success('Exam deleted');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="panel">
      <h2>Handle Exams</h2>
      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Exam</th>
              <th>Type</th>
              <th>Questions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.examType}</td>
                <td>{exam.questionCount}</td>
                <td>{exam.published ? 'Published' : 'Draft'}</td>
                <td>
                  <div className="row">
                    <button onClick={() => togglePublish(exam.id)}>
                      {exam.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => deleteExam(exam.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!exams.length && (
              <tr>
                <td colSpan="5">No exams found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
