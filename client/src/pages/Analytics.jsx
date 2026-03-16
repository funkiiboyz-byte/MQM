import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analytics() {
  const [data, setData] = useState({ attempts: [], questionAccuracy: [] });

}
