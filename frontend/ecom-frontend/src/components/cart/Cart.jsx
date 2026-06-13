import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { removeFromCart, updateCartQty } from '../../store/actions';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.carts);
  const products = cart?.products ?? [];

  if (!products.length) return (
    <div style={{ paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '120px 24px', textAlign: 'center' }}>
      <FiShoppingCart size={64} style={{ color: 'var(--text-muted)' }} />
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Browse products and add items to your cart.</p>
      <Link to="/products" style={{ background: 'var(--primary)', color: '#fff', padding: '10px 24px', borderRadius: 4, fontWeight: 700, textDecoration: 'none' }}>Shop Now</Link>
    </div>
  );

  const total = products.reduce((s, p) => s + (p.specialPrice ?? p.price) * (p.quantity || 1), 0);

  return (
    <div style={{ paddingTop: 72, maxWidth: 1100, margin: '0 auto', padding: '80px 16px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <FiShoppingCart /> Cart ({products.length} items)
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Items */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {products.map((p, i) => {
            const img = p.image && p.image !== 'default.png' ? `/images/${p.image}` : `https://placehold.co/100x100/f1f3f6/2874f0?text=${encodeURIComponent((p.productName || '').slice(0,2))}`;
            return (
              <div key={p.productId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <img src={img} alt={p.productName} style={{ width: 80, height: 80, objectFit: 'contain', background: '#f8f9fa', borderRadius: 8, padding: 4 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.productName}</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>₹{(p.specialPrice ?? p.price)?.toFixed(0)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                  <button onClick={() => dispatch(updateCartQty(p.productId, 'delete'))} style={{ padding: '6px 12px', background: '#f8f9fa', border: 'none', cursor: 'pointer' }}><FiMinus size={13} /></button>
                  <span style={{ padding: '6px 14px', fontWeight: 700, minWidth: 36, textAlign: 'center' }}>{p.quantity || 1}</span>
                  <button onClick={() => dispatch(updateCartQty(p.productId, 'add'))} style={{ padding: '6px 12px', background: '#f8f9fa', border: 'none', cursor: 'pointer' }}><FiPlus size={13} /></button>
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, minWidth: 80, textAlign: 'right' }}>₹{((p.specialPrice ?? p.price) * (p.quantity || 1)).toFixed(0)}</p>
                <button onClick={() => dispatch(removeFromCart(cart.cartId, p.productId, toast))}
                  style={{ padding: 8, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <FiTrash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 20, position: 'sticky', top: 72 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Price Details</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
            <span>Price ({products.length} items)</span><span>₹{total.toFixed(0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
            <span>Delivery</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
            <span>Total Amount</span><span>₹{total.toFixed(0)}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 8 }}>You save ₹{products.reduce((s, p) => s + ((p.price - (p.specialPrice ?? p.price)) * (p.quantity || 1)), 0).toFixed(0)} on this order</p>
          <Link to="/checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 18, padding: '13px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 4, textDecoration: 'none' }}>
            Place Order
          </Link>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <FiArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
