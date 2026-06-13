import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiBox, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { analyticsAction } from '../../../store/actions';
import Loader from '../../shared/Loader';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
    <div style={{ width: 56, height: 56, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={26} style={{ color }} />
    </div>
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.admin);
  const { isLoading } = useSelector((state) => state.errors);

  useEffect(() => { dispatch(analyticsAction()); }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard title="Total Products" value={analytics?.productCount ?? 0} icon={FiBox} color="#2874f0" />
        <StatCard title="Total Orders" value={analytics?.totalOrders ?? 0} icon={FiShoppingBag} color="#fb641b" />
        <StatCard title="Total Revenue" value={`₹${(analytics?.totalRevenue ?? 0).toFixed(0)}`} icon={FiDollarSign} color="#26a541" />
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {[{ label: 'Manage Products', to: '/admin/products', color: '#2874f0' }, { label: 'Manage Categories', to: '/admin/categories', color: '#9c27b0' }, { label: 'View Orders', to: '/admin/orders', color: '#fb641b' }].map(l => (
            <a key={l.to} href={l.to} style={{ display: 'block', padding: '14px 18px', background: l.color + '12', borderRadius: 8, fontWeight: 700, fontSize: 14, color: l.color, textDecoration: 'none', border: `1.5px solid ${l.color}30`, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = l.color + '22'}
              onMouseLeave={e => e.currentTarget.style.background = l.color + '12'}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
