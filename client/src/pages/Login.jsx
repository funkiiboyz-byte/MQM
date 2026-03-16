import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function Login({ onLogin }) {

  const submit = async (data) => {
    try {
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify(data) });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onLogin(res.user);
      toast.success('Welcome back');

}
