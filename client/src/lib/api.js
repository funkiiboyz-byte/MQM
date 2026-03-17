const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getAuthToken() {
  return localStorage.getItem('token');
}

export async function api(path, options = {}) {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const payload = await res.json();
      message = payload?.message || payload?.error || message;
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
