const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function headers() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Request failed');
  return res.status === 204 ? null : res.json();
}
