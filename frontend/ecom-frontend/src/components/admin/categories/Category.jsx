import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchCategories, deleteCategory } from '../../../store/actions';
import { categoryAPI } from '../../../services/api';
import Modal from '../../shared/Modal';
import DeleteModal from '../../shared/DeleteModal';
import AddCategoryForm from './AddCategoryForn';
import Loader from '../../shared/Loader';

const Category = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);
  const { isLoading } = useSelector((state) => state.errors);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const closeModal = () => { setSelected(null); setModal(null); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Categories</h1>
        <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          <FiPlus size={16} /> Add Category
        </button>
      </div>
      {isLoading ? <Loader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {categories?.map((cat, i) => (
            <div key={cat.categoryId} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `hsl(${(i * 47) % 360}, 70%, 92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: `hsl(${(i * 47) % 360}, 60%, 40%)` }}>
                  {cat.categoryName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{cat.categoryName}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setSelected(cat); setModal('edit'); }} style={{ padding: 7, borderRadius: 6, border: '1px solid #2874f030', background: '#2874f010', color: 'var(--primary)', cursor: 'pointer' }}><FiEdit2 size={14} /></button>
                <button onClick={() => { setSelected(cat); setModal('delete'); }} style={{ padding: 7, borderRadius: 6, border: '1px solid var(--danger)30', background: 'var(--danger)10', color: 'var(--danger)', cursor: 'pointer' }}><FiTrash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modal === 'add' || modal === 'edit'} setOpen={closeModal} title={modal === 'edit' ? 'Edit Category' : 'Add Category'}>
        <AddCategoryForm setOpen={closeModal} category={selected} update={modal === 'edit'} />
      </Modal>
      <DeleteModal open={modal === 'delete'} setOpen={closeModal} loader={false} title="Delete Category"
        onDeleteHandler={() => { dispatch(deleteCategory(selected?.categoryId, toast)); closeModal(); }} />
    </div>
  );
};
export default Category;
