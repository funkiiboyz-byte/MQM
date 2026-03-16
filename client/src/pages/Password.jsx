import { useForm } from 'react-hook-form';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function Password() {
  const { register, handleSubmit, reset } = useForm();
  const submit = async (data) => { await api('/password/change', { method: 'POST', body: JSON.stringify(data) }); toast.success('Password changed'); reset(); };
  return <form className="panel" onSubmit={handleSubmit(submit)}><h2>Password Management</h2><input type="password" placeholder="Old Password" {...register('oldPassword')} /><input type="password" placeholder="New Password" {...register('newPassword')} /><button>Update Password</button></form>;
}
