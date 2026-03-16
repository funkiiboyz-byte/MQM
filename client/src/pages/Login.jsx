import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function Login({ onLogin }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { email: 'admin@megaprep.com', password: 'admin123' } });
  const submit = async (data) => {
    try {
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify(data) });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onLogin(res.user);
      toast.success('Welcome back');
    } catch (e) { toast.error(e.message); }
  };
  return <div className="login"><form className="panel" onSubmit={handleSubmit(submit)}><h2>MEGAPREP CMS Login</h2><input {...register('email')} /><input type="password" {...register('password')} /><button disabled={isSubmitting}>Sign in</button></form></div>;
}
