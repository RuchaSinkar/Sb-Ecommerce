import { useState, useEffect } from 'react';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const statusColor = { 'Order Accepted': '#2874f0', 'Processing': '#ff9f00', 'Shipped': '#9c27b0', 'Delivered': '#26a541', 'Cancelled': '#ff6161' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ paddingTop: 80, maxWidth: 860, margin: '0 auto', padding: '80px 16px 48px' }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 8, marginBottom: 16 }} />)}
    </div>
  );

  if (!orders.length) return (
    <div style={{ paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '120px 24px', textAlign: 'center' }}>
      <FiPackage size={64} style={{ color: '#b0b0b0' }} />
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>No orders yet</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Start shopping to see your orders here.</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 72, maxWidth: 860, margin: '0 auto', padding: '80px 16px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 24 }}>My Orders</h1>
      {orders.map(order => (
        <div key={order.orderId} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexWrap: 'wrap', gap: 12 }} onClick={() => setExpanded(e => e === order.orderId ? null : order.orderId)}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Order ID</p><p style={{ fontWeight: 700 }}>#{order.orderId}</p></div>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Date</p><p style={{ fontWeight: 600 }}>{order.orderDate}</p></div>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Total</p><p style={{ fontWeight: 700 }}>₹{order.totalAmount?.toFixed(0)}</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ background: statusColor[order.orderStatus] || '#2874f0', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{order.orderStatus}</span>
              {expanded === order.orderId ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          {expanded === order.orderId && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
              {order.orderItems?.map(item => (
                <div key={item.orderItemId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.product?.image && item.product.image !== 'default.png' ? `/images/${item.product.image}` : `https://placehold.co/60x60/f8f9fa/2874f0?text=P`} alt="" style={{ width: 56, height: 56, objectFit: 'contain', background: '#f8f9fa', borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.productName}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 700 }}>₹{item.orderedProductPrice?.toFixed(0)}</p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontWeight: 700, fontSize: 16 }}>
                <span>Order Total</span><span>₹{order.totalAmount?.toFixed(0)}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;
