import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { api } from '../lib/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analytics() {
  const [data, setData] = useState({ attempts: [], questionAccuracy: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api('/analytics');
        setData(response);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <h2>Analytics</h2>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Analytics</h2>
      <Bar
        data={{
          labels: data.attempts.map((attempt) => attempt.exam),
          datasets: [
            { label: 'Attempts', data: data.attempts.map((attempt) => attempt.attempts), backgroundColor: '#3b82f6' },
            { label: 'Average Score', data: data.attempts.map((attempt) => attempt.averageScore), backgroundColor: '#10b981' }
          ]
        }}
      />
      <h3>Question Wise Accuracy</h3>
      <ul className="accuracy-list">
        {data.questionAccuracy.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
