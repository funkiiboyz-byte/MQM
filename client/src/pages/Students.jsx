import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../lib/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const load = () => api('/students').then(setStudents);
  useEffect(load, []);
  const submit = async (data) => { await api('/students', { method: 'POST', body: JSON.stringify(data) }); reset(); load(); };
  const bulk = async (e) => {
    const form = new FormData();
    form.append('file', e.target.files[0]);
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000/api') + '/students/bulk-csv', { method: 'POST', body: form, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    load();
  };
  return <div className="panel"><h2>Students</h2><form onSubmit={handleSubmit(submit)} className="row"><input placeholder="Name" {...register('name')} /><input placeholder="Email" {...register('email')} /><input placeholder="Course" {...register('course')} /><button>Add</button></form><input type="file" accept=".csv" onChange={bulk}/><table><thead><tr><th>Name</th><th>Course</th><th>Status</th><th>Action</th></tr></thead><tbody>{students.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.course}</td><td>{s.status}</td><td><button onClick={async()=>{await api(`/students/${s.id}/toggle`,{method:'PATCH'});load();}}>Toggle</button></td></tr>)}</tbody></table></div>;
}
