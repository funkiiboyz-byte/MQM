import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function CreateExam() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      courseId: '',
      examNumber: '',
      title: '',
      duration: 60,
      fullMarks: 100,
      examType: 'MCQ',
      examDate: '',
      startTime: '',
      endTime: '',
      sections: [{ name: 'Section A', marksPerQuestion: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'sections' });

  useEffect(() => {
    (async () => {
      try {
        const list = await api('/courses');
        setCourses(list);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api('/exams', { method: 'POST', body: JSON.stringify(data) });
      toast.success('Exam created successfully');
      reset({
        courseId: courses[0]?.id || '',
        examNumber: '',
        title: '',
        duration: 60,
        fullMarks: 100,
        examType: 'MCQ',
        examDate: '',
        startTime: '',
        endTime: '',
        sections: [{ name: 'Section A', marksPerQuestion: 1 }]
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit(onSubmit)}>
      <h2>Create Exam</h2>

      <select {...register('courseId', { required: true })} disabled={loadingCourses || courses.length === 0}>
        {courses.map((course) => (
          <option value={course.id} key={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      <input placeholder="Exam Number" {...register('examNumber', { required: true })} />
      <input placeholder="Exam Title" {...register('title', { required: true })} />

      <div className="row">
        <input type="number" placeholder="Duration (minutes)" {...register('duration', { valueAsNumber: true, required: true, min: 1 })} />
        <input type="number" placeholder="Full Marks" {...register('fullMarks', { valueAsNumber: true, required: true, min: 1 })} />
      </div>

      <div className="row">
        <select {...register('examType', { required: true })}>
          <option value="MCQ">MCQ</option>
          <option value="CQ">CQ</option>
        </select>
        <input type="date" {...register('examDate', { required: true })} />
      </div>

      <div className="row">
        <input type="time" {...register('startTime', { required: true })} />
        <input type="time" {...register('endTime', { required: true })} />
      </div>

      <h3>Exam Sections</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="row">
          <input placeholder="Section Name" {...register(`sections.${index}.name`, { required: true })} />
          <input
            type="number"
            placeholder="Marks per Question"
            {...register(`sections.${index}.marksPerQuestion`, { valueAsNumber: true, required: true, min: 1 })}
          />
          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', marksPerQuestion: 1 })}>
        Add Section
      </button>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save & Create Exam'}
      </button>
    </form>
  );
}
