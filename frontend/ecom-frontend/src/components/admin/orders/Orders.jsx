import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { orderAPI } from '../../../services/api';
import { updateOrderStatus } from '../../../store/actions';
import Loader from '../../shared/Loader';

const STATUS_OPTIONS = ['Order Accepted', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColor = { 'Order Accepted': '#2874f0', 'Processing': '#ff9f00', 'Shipped': '#9c27b0', 'Delivered': '#26a541', 'Cancelled': '#ff6161' };

const AdminOrders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const loadOrders = () => {
    orderAPI.getAllOrders().then(r => setOrders(r.data)).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    await dispatch(updateOrderStatus(orderId, status, toast));
    loadOrders();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Orders ({orders.length})</h1>
      {orders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <FiShoppingBag size={48} /><p style={{ fontWeight: 600 }}>No orders yet</p>
        </div>
      ) : orders.map(order => (
        <div key={order.orderId} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, cursor: 'pointer' }} onClick={() => setExpanded(e => e === order.orderId ? null : order.orderId)}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Order</p><p style={{ fontWeight: 700 }}>#{order.orderId}</p></div>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Customer</p><p style={{ fontWeight: 600, fontSize: 13 }}>{order.email}</p></div>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Date</p><p style={{ fontWeight: 600, fontSize: 13 }}>{order.orderDate}</p></div>
              <div><p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Total</p><p style={{ fontWeight: 700 }}>₹{order.totalAmount?.toFixed(0)}</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <select value={order.orderStatus} onChange={e => { e.stopPropagation(); handleStatusChange(order.orderId, e.target.value); }}
                style={{ padding: '6px 10px', borderRadius: 6, border: `1.5px solid ${statusColor[order.orderStatus] || '#2874f0'}`, fontWeight: 700, fontSize: 12, color: statusColor[order.orderStatus] || '#2874f0', background: (statusColor[order.orderStatus] || '#2874f0') + '15', cursor: 'pointer', outline: 'none' }}
                onClick={e => e.stopPropagation()}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {expanded === order.orderId ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          {expanded === order.orderId && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px' }}>
              {order.orderItems?.map(item => (
                <div key={item.orderItemId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.product?.image && item.product.image !== 'default.png' ? `/images/${item.product.image}` : `https://placehold.co/48x48/f8f9fa/2874f0?text=P`} alt="" style={{ width: 48, height: 48, objectFit: 'contain', background: '#f8f9fa', borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.productName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Qty: {item.quantity} × ₹{item.orderedProductPrice}</p>
                  </div>
                  <p style={{ fontWeight: 700 }}>₹{(item.orderedProductPrice * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default AdminOrders;
