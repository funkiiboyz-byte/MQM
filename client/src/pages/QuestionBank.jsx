import { useForm, useFieldArray } from 'react-hook-form';
import { InlineMath, BlockMath } from 'react-katex';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

function renderLatex(text = '') {
  if (!text) return null;
  const block = text.match(/\$\$(.*?)\$\$/s);
  if (block) return <BlockMath math={block[1]} />;
  const inline = text.match(/\$(.*?)\$/);
  return inline ? <InlineMath math={inline[1]} /> : null;
}

export default function QuestionBank() {
  const [mode, setMode] = useState('MCQ');
  const [jsonInput, setJsonInput] = useState('{"questions":[]}');

  const { register, control, watch, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { question: '', options: ['', '', '', ''], explanation: '', correct: 0, stimulus: '', subQuestionsRaw: '' }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'options' });
  const preview = watch();

  const submit = async (data) => {
    try {
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
      reset({ question: '', options: ['', '', '', ''], explanation: '', correct: 0, stimulus: '', subQuestionsRaw: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const importJson = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const response = await api('/questions/import-json', { method: 'POST', body: JSON.stringify(parsed) });
      toast.success(`${response.count} questions imported`);
    } catch (error) {
      toast.error(`Invalid JSON: ${error.message}`);
    }
  };

  return (
    <div className="split">
      <form className="panel" onSubmit={handleSubmit(submit)}>
        <h2>Question Bank</h2>
        <div className="row">
          <button type="button" onClick={() => setMode('MCQ')}>Manual MCQ</button>
          <button type="button" onClick={() => setMode('CQ')}>Manual CQ</button>
        </div>

        <textarea placeholder="Question Text (LaTeX supported)" {...register('question', { required: true })} />

        {mode === 'MCQ' ? (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="row">
                <input placeholder={`Option ${index + 1}`} {...register(`options.${index}`)} />
                {fields.length > 2 && (
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append('')}>Add Option</button>
            <input type="number" placeholder="Correct Answer Index" {...register('correct')} />
          </>
        ) : (
          <>
            <textarea placeholder="Stimulus / Passage" {...register('stimulus', { required: true })} />
            <textarea
              placeholder='Sub Questions JSON: [{"label":"A","answer":"..."}]'
              {...register('subQuestionsRaw')}
            />
          </>
        )}

        <textarea placeholder="Explanation" {...register('explanation')} />
        <input placeholder="Image URL" {...register('imageUrl')} />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Question'}</button>

        <h3>Import Questions via JSON</h3>
        <textarea rows="8" value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} />
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
