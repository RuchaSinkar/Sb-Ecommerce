import Modal from './Modal';
const ProductViewModal = ({ open, setOpen, product }) => {
  if (!product) return null;
  const img = product.image && product.image !== 'default.png' ? `/images/${product.image}` : `https://placehold.co/200x200/f1f3f6/2874f0?text=P`;
  return (
    <Modal open={open} setOpen={setOpen} title="Product Details">
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <img src={img} alt="" style={{ width: 140, height: 140, objectFit: 'contain', background: '#f8f9fa', borderRadius: 8, padding: 8 }} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{product.productName}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{product.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['Price', `₹${product.price}`], ['Special Price', `₹${product.specialPrice}`], ['Discount', `${product.discount}%`], ['Stock', product.quantity]].map(([k, v]) => (
              <div key={k}><span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{k}</span><p style={{ fontWeight: 700 }}>{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ProductViewModal;
