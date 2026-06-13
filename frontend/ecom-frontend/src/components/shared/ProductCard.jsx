import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addToCart } from '../../store/actions';

const ProductCard = (product) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [adding, setAdding] = useState(false);

  const { productId, productName, price, specialPrice, discount, image, quantity } = product;
  const discountPct = discount > 0 ? Math.round(discount) : null;
  const imgSrc = image && image !== 'default.png' ? `/images/${image}` : `https://placehold.co/300x300/f1f3f6/2874f0?text=${encodeURIComponent((productName || 'P').slice(0, 2))}`;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    await dispatch(addToCart(productId, 1, toast));
    setAdding(false);
  };

  return (
    <Link to={`/product/${productId}`} style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; }}>
      {/* Image */}
      <div style={{ position: 'relative', background: '#f8f9fa', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src={imgSrc} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }} />
        {discountPct && <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 3 }}>{discountPct}% OFF</span>}
        {quantity === 0 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--danger)', fontSize: 14 }}>Out of Stock</div>}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{productName}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'var(--success)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
            <FiStar size={10} /> 4.2
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>(128)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>₹{(specialPrice ?? price)?.toFixed(0)}</span>
          {discountPct && <span style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{price?.toFixed(0)}</span>}
          {discountPct && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)' }}>{discountPct}% off</span>}
        </div>
        <button onClick={handleAdd} disabled={adding || quantity === 0}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 4, fontSize: 13, fontWeight: 600, marginTop: 8, background: quantity === 0 ? '#e0e0e0' : 'var(--primary)', color: quantity === 0 ? '#999' : '#fff', border: 'none', cursor: quantity === 0 ? 'not-allowed' : 'pointer', opacity: adding ? 0.7 : 1 }}>
          <FiShoppingCart size={14} /> {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
