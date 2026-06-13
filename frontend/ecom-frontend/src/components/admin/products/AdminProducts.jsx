import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchProducts, deleteProduct } from '../../../store/actions';
import Loader from '../../shared/Loader';
import Modal from '../../shared/Modal';
import DeleteModal from '../../shared/DeleteModal';
import ProductViewModal from '../../shared/ProductViewModal';
import AddProductForm from './AddProductForm';
import ImageUploadForm from './ImageUploadForm';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, pagination } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.errors);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete' | 'image' | 'view'
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => { dispatch(fetchProducts({ pageNumber: page, pageSize: 10 })); }, [dispatch, page]);

  const openModal = (type, product = null) => { setSelected(product); setModal(type); };
  const closeModal = () => { setSelected(null); setModal(null); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Products</h1>
        <button onClick={() => openModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {isLoading ? <Loader /> : (
        <>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  {['Image', 'Name', 'Price', 'Special Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products?.map((p, i) => {
                  const img = p.image && p.image !== 'default.png' ? `/images/${p.image}` : `https://placehold.co/48x48/f1f3f6/2874f0?text=P`;
                  return (
                    <tr key={p.productId} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px' }}><img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, background: '#f8f9fa' }} /></td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: 14, maxWidth: 200 }}><p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.productName}</p></td>
                      <td style={{ padding: '12px 16px', fontSize: 14 }}>₹{p.price}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>₹{p.specialPrice}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: p.quantity > 0 ? '#e8f5e9' : '#ffebee', color: p.quantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {[{ icon: <FiEye size={14} />, type: 'view', color: '#666' }, { icon: <FiEdit2 size={14} />, type: 'edit', color: 'var(--primary)' }, { icon: <FiImage size={14} />, type: 'image', color: '#9c27b0' }, { icon: <FiTrash2 size={14} />, type: 'delete', color: 'var(--danger)' }].map(btn => (
                            <button key={btn.type} onClick={() => openModal(btn.type, { ...p, id: p.productId })}
                              style={{ padding: '6px', borderRadius: 6, border: `1px solid ${btn.color}30`, background: btn.color + '10', color: btn.color, cursor: 'pointer' }}>
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{ width: 34, height: 34, borderRadius: 6, border: `1.5px solid ${page === i ? 'var(--primary)' : 'var(--border)'}`, background: page === i ? 'var(--primary)' : '#fff', color: page === i ? '#fff' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={modal === 'add' || modal === 'edit'} setOpen={closeModal} title={modal === 'edit' ? 'Edit Product' : 'Add Product'}>
        <AddProductForm setOpen={closeModal} product={selected} update={modal === 'edit'} />
      </Modal>
      <Modal open={modal === 'image'} setOpen={closeModal} title="Upload Image">
        <ImageUploadForm setOpen={closeModal} product={selected} />
      </Modal>
      <ProductViewModal open={modal === 'view'} setOpen={closeModal} product={selected} />
      <DeleteModal open={modal === 'delete'} setOpen={closeModal} loader={loader} title="Delete Product"
        onDeleteHandler={() => dispatch(deleteProduct(setLoader, selected?.id, toast, closeModal, isAdmin))} />
    </div>
  );
};
export default AdminProducts;
