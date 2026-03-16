import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function CreateExam() {
  const [courses, setCourses] = useState([]);
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: { sections: [{ name: 'Section A', marksPerQuestion: 1 }], examType: 'MCQ' }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'sections' });
  useEffect(() => { api('/courses').then(setCourses); }, []);
  const submit = async (data) => {
    await api('/exams', { method: 'POST', body: JSON.stringify(data) });
    toast.success('Exam created');
    reset({ sections: [{ name: 'Section A', marksPerQuestion: 1 }], examType: 'MCQ' });
  };
  return (
    <form className="panel" onSubmit={handleSubmit(submit)}>
      <h2>Create Exam</h2>
      <select {...register('courseId')}>{courses.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select>
      <input placeholder="Exam Number" {...register('examNumber')} />
      <input placeholder="Exam Title" {...register('title')} />
      <div className="row"><input type="number" placeholder="Duration" {...register('duration')} /><input type="number" placeholder="Full Marks" {...register('fullMarks')} /></div>
      <div className="row"><select {...register('examType')}><option>MCQ</option><option>CQ</option></select><input type="date" {...register('examDate')} /></div>
      <div className="row"><input type="time" {...register('startTime')} /><input type="time" {...register('endTime')} /></div>
      <h3>Exam Sections</h3>
      {fields.map((f, i) => <div key={f.id} className="row"><input placeholder="Section Name" {...register(`sections.${i}.name`)} /><input type="number" placeholder="Marks/Question" {...register(`sections.${i}.marksPerQuestion`)} />{fields.length>1 && <button type="button" onClick={() => remove(i)}>Remove</button>}</div>)}
      <button type="button" onClick={() => append({ name: '', marksPerQuestion: 1 })}>Add Section</button>
      <button type="submit">Save & Create Exam</button>
    </form>
  );
}
