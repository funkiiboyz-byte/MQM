import { useForm, useFieldArray } from 'react-hook-form';
import { InlineMath } from 'react-katex';
import { useState } from 'react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

function renderLatex(text = '') {
  const match = text.match(/\$(.*?)\$/);
  return match ? <InlineMath math={match[1]} /> : null;
}

export default function QuestionBank() {
  const [mode, setMode] = useState('MCQ');
  const [jsonInput, setJsonInput] = useState('{"questions":[]}');
  const { register, control, watch, handleSubmit, reset } = useForm({ defaultValues: { options: ['','','',''], explanation: '' } });
  const { fields, append, remove } = useFieldArray({ control, name: 'options' });
  const preview = watch();

  const submit = async (data) => {
    const payload = {
      type: mode,
      question: data.question,
      explanation: data.explanation,
      imageUrl: data.imageUrl,
      options: mode === 'MCQ' ? data.options.filter(Boolean) : [],
      correct: mode === 'MCQ' ? Number(data.correct) : undefined,
      stimulus: mode === 'CQ' ? data.stimulus : undefined,
      subQuestions: mode === 'CQ' ? (data.subQuestionsRaw ? JSON.parse(data.subQuestionsRaw) : []) : undefined
    };
    await api('/questions', { method: 'POST', body: JSON.stringify(payload) });
    toast.success('Question saved');
    reset({ options: ['','','',''], explanation: '' });
  };

  const importJson = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const res = await api('/questions/import-json', { method: 'POST', body: JSON.stringify(parsed) });
      toast.success(`${res.count} imported`);
    } catch (e) {
      toast.error(`Invalid JSON format: ${e.message}`);
    }
  };

  return (
    <div className="split">
      <form className="panel" onSubmit={handleSubmit(submit)}>
        <h2>Question Bank</h2>
        <div className="row"><button type="button" onClick={() => setMode('MCQ')}>Manual MCQ</button><button type="button" onClick={() => setMode('CQ')}>Manual CQ</button></div>
        <textarea placeholder="Question Text. Example: What is $x^2$?" {...register('question')} />

        {mode === 'MCQ' ? (
          <>
            {fields.map((f, i) => <div key={f.id} className="row"><input placeholder={`Option ${i + 1}`} {...register(`options.${i}`)} />{fields.length>2 && <button type="button" onClick={() => remove(i)}>x</button>}</div>)}
            <button type="button" onClick={() => append('')}>Add Option</button>
            <input type="number" placeholder="Correct Answer Index (0-based)" {...register('correct')} />
          </>
        ) : (
          <>
            <textarea placeholder="Stimulus / Passage Editor" {...register('stimulus')} />
            <textarea placeholder='Sub Questions JSON, e.g. [{"label":"A","answer":"..."}]' {...register('subQuestionsRaw')} />
          </>
        )}

        <textarea placeholder="Explanation (LaTeX supported)" {...register('explanation')} />
        <input placeholder="Image URL" {...register('imageUrl')} />
        <button type="submit">Save Question</button>

        <h3>JSON Import</h3>
        <textarea rows="8" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
        <button type="button" onClick={importJson}>Import JSON</button>
      </form>

      <aside className="panel">
        <h3>Live Preview</h3>
        <p>{preview.question}</p>
        {renderLatex(preview.question)}
        <p>{preview.explanation}</p>
        {renderLatex(preview.explanation)}
      </aside>
    </div>
  );
}
