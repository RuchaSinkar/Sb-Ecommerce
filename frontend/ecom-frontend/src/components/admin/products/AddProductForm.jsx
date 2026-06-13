import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchProducts, fetchCategories } from '../../../store/actions';
import { productAPI } from '../../../services/api';

const AddProductForm = ({ setOpen, product, update }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: update ? {
      productName: product?.productName,
      description: product?.description,
      price: product?.price,
      discount: product?.discount,
      quantity: product?.quantity,
    } : {}
  });

  useEffect(() => { if (!categories?.length) dispatch(fetchCategories()); }, [dispatch, categories]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (update) {
        await productAPI.update(product.id, data);
        toast.success('Product updated!');
      } else {
        await productAPI.create(data.categoryId, { productName: data.productName, description: data.description, price: data.price, discount: data.discount, quantity: data.quantity });
        toast.success('Product created!');
      }
      dispatch(fetchProducts());
      setOpen(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const fields = [
    { name: 'productName', label: 'Product Name', rules: { required: 'Required' } },
    { name: 'description', label: 'Description', rules: { required: 'Required' } },
    { name: 'price', label: 'Price (₹)', type: 'number', rules: { required: 'Required', min: 0 } },
    { name: 'discount', label: 'Discount (%)', type: 'number', rules: { required: 'Required', min: 0, max: 100 } },
    { name: 'quantity', label: 'Stock Quantity', type: 'number', rules: { required: 'Required', min: 0 } },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {!update && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
          <select {...register('categoryId', { required: 'Required' })} style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${errors.categoryId ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6, fontSize: 14, outline: 'none' }}>
            <option value="">Select category</option>
            {categories?.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </select>
          {errors.categoryId && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 3 }}>{errors.categoryId.message}</p>}
        </div>
      )}
      {fields.map(f => (
        <div key={f.name}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
          <input type={f.type || 'text'} {...register(f.name, f.rules)} style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${errors[f.name] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6, fontSize: 14, outline: 'none' }} />
          {errors[f.name] && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 3 }}>{errors[f.name].message}</p>}
        </div>
      ))}
      <button type="submit" disabled={loading} style={{ padding: '11px', background: loading ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
        {loading ? 'Saving...' : update ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};
export default AddProductForm;
