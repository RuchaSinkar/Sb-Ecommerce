import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../../store/actions';
import { categoryAPI } from '../../../services/api';
import { useState } from 'react';

const AddCategoryForm = ({ setOpen, category, update }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: update ? { categoryName: category?.categoryName } : {}
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (update) {
        await categoryAPI.update(category.categoryId, data);
        toast.success('Category updated!');
      } else {
        await categoryAPI.create(data);
        toast.success('Category created!');
      }
      dispatch(fetchCategories());
      setOpen(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category Name</label>
        <input {...register('categoryName', { required: 'Required', minLength: { value: 5, message: 'Min 5 characters' } })}
          placeholder="e.g. Electronics"
          style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.categoryName ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6, fontSize: 14, outline: 'none' }} />
        {errors.categoryName && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 3 }}>{errors.categoryName.message}</p>}
      </div>
      <button type="submit" disabled={loading} style={{ padding: '11px', background: loading ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Saving...' : update ? 'Update Category' : 'Add Category'}
      </button>
    </form>
  );
};
export default AddCategoryForm;
