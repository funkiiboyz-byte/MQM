import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function Password() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const submit = async (data) => {
    try {
      if (!data.oldPassword || !data.newPassword) {
        toast.error('Both password fields are required');
        return;
      }
      await api('/password/change', { method: 'POST', body: JSON.stringify(data) });
      toast.success('Password changed');
      reset();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit(submit)}>
      <h2>Password Management</h2>
      <input type="password" placeholder="Old Password" {...register('oldPassword', { required: true })} />
      <input type="password" placeholder="New Password" {...register('newPassword', { required: true, minLength: 6 })} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}
