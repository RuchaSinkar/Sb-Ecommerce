import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const links = [
  { to: '/admin', icon: <FiGrid size={18} />, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: <FiBox size={18} />, label: 'Products' },
  { to: '/admin/categories', icon: <FiTag size={18} />, label: 'Categories' },
  { to: '/admin/orders', icon: <FiShoppingBag size={18} />, label: 'Orders' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <div style={{ width: 260, background: '#172337', height: '100vh', display: 'flex', flexDirection: 'column', padding: '0 0 24px' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff' }}>
          <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: 12, marginRight: 6 }}>SN</span>Admin
        </div>
      </div>
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ to, icon, label, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.6)', background: active ? 'rgba(40,116,240,0.3)' : 'transparent', textDecoration: 'none', transition: 'all 0.15s', borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              {icon} {label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '0 12px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          <FiArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;
