import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { api } from '../lib/api';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analytics() {
  const [data, setData] = useState({ attempts: [], questionAccuracy: [] });
  useEffect(() => { api('/analytics').then(setData); }, []);
  return <div className="panel"><h2>Analytics</h2><Bar data={{ labels: data.attempts.map(a=>a.exam), datasets:[{ label:'Attempts', data:data.attempts.map(a=>a.attempts), backgroundColor:'#3b82f6'},{ label:'Avg Score', data:data.attempts.map(a=>a.averageScore), backgroundColor:'#10b981'}]}} /><h3>Question Wise Accuracy</h3><ul>{data.questionAccuracy.map((x,i)=><li key={i}>{x.label}: {x.value}%</li>)}</ul></div>;
}
