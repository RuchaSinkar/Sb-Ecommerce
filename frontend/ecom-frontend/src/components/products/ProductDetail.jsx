import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiZap, FiStar, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productAPI } from '../../services/api';
import { addToCart } from '../../store/actions';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productAPI.getAll({ pageSize: 200 })
      .then(r => setProduct(r.data.content?.find(p => String(p.productId) === String(id)) ?? null))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    await dispatch(addToCart(product.productId, qty, toast));
    setAdding(false);
  };

  if (loading) return (
    <div style={{ paddingTop: 72, maxWidth: 1100, margin: '0 auto', padding: '72px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div className="skeleton" style={{ height: 460, borderRadius: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[200, 60, 100, 260].map((h, i) => <div key={i} className="skeleton" style={{ height: h }} />)}
      </div>
    </div>
  );

  if (!product) return <div style={{ paddingTop: 72, textAlign: 'center', fontSize: 18, color: 'var(--text-secondary)', marginTop: 80 }}>Product not found. <button onClick={() => navigate('/')} style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Go Home</button></div>;

const imgSrc = product.image && product.image !== 'default.png' 
  ? `http://localhost:8080/images/${product.image}` //  Point directly to Spring Boot
  : `https://placehold.co/500x500/f1f3f6/2874f0?text=${encodeURIComponent((product.productName || 'P').slice(0,2))}`;
    const discount = product.discount > 0 ? Math.round(product.discount) : null;

  return (
    <div style={{ paddingTop: 80, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 72 }}>
          <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: 8, overflow: 'hidden' }}>
            <img src={imgSrc} alt={product.productName} style={{ maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
            <button onClick={handleAdd} disabled={adding || product.quantity === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 4, fontSize: 15, fontWeight: 700, background: 'var(--accent)', color: '#fff', border: 'none', cursor: product.quantity === 0 ? 'not-allowed' : 'pointer', opacity: adding ? 0.7 : 1 }}>
              <FiShoppingCart size={18} /> {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button onClick={() => { handleAdd(); navigate('/cart'); }} disabled={product.quantity === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 4, fontSize: 15, fontWeight: 700, background: 'var(--primary)', color: '#fff', border: 'none', cursor: product.quantity === 0 ? 'not-allowed' : 'pointer' }}>
              <FiZap size={18} /> Buy Now
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="animate-fadeUp">
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{product.category?.categoryName ?? 'Product'}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>{product.productName}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--success)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}><FiStar size={13} /> 4.2</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>128 ratings</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>₹{(product.specialPrice ?? product.price)?.toFixed(0)}</span>
              {discount && <><span style={{ fontSize: 16, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{product.price?.toFixed(0)}</span><span style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>{discount}% off</span></>}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Inclusive of all taxes</p>
          </div>
          <div>
            {product.quantity > 0
              ? <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>✓ In Stock ({product.quantity} available)</span>
              : <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14 }}>✗ Out of Stock</span>}
          </div>
          {product.quantity > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Qty:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '8px 14px', background: '#f8f9fa', border: 'none', cursor: 'pointer' }}><FiMinus size={14} /></button>
                <span style={{ padding: '8px 18px', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))} style={{ padding: '8px 14px', background: '#f8f9fa', border: 'none', cursor: 'pointer' }}><FiPlus size={14} /></button>
              </div>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Description</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
            {[{ icon: <FiTruck size={20} />, t: 'Free Delivery', s: 'Orders above ₹500' }, { icon: <FiShield size={20} />, t: '1 Year Warranty', s: 'Manufacturer' }, { icon: <FiRefreshCw size={20} />, t: '10 Day Returns', s: 'Easy returns' }].map(i => (
              <div key={i.t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
                <span style={{ color: 'var(--primary)' }}>{i.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{i.t}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{i.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
