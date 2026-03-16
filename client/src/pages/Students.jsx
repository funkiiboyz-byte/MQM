import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = async () => {
    try {
      setLoading(true);
      const list = await api('/students');
      setStudents(list);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (data) => {
    try {
      await api('/students', { method: 'POST', body: JSON.stringify(data) });
      toast.success('Student created');
      reset();
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const bulkUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const form = new FormData();
      form.append('file', file);
      const response = await api('/students/bulk-csv', { method: 'POST', body: form });
      toast.success(`${response.count} students uploaded`);
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      event.target.value = '';
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api(`/students/${id}/toggle`, { method: 'PATCH' });
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="panel">
      <h2>Students</h2>

      <form onSubmit={handleSubmit(submit)} className="row">
        <input placeholder="Name" {...register('name', { required: true })} />
        <input placeholder="Email" {...register('email', { required: true })} />
        <input placeholder="Course" {...register('course', { required: true })} />
        <button disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Student'}</button>
      </form>

      <input type="file" accept=".csv" onChange={bulkUpload} />

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.status}</td>
                <td>
                  <button onClick={() => toggleStatus(student.id)}>
                    {student.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {!students.length && (
              <tr>
                <td colSpan="5">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
