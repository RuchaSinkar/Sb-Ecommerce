import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiUser, FiSearch, FiLogOut, FiPackage, FiLayout, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { logoutUser, searchProducts } from '../../store/actions';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.carts);
  const [search, setSearch] = useState('');
  const [userMenu, setUserMenu] = useState(false);

  const itemCount = cart?.products?.reduce((s, p) => s + (p.quantity || 1), 0) ?? 0;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(searchProducts(search.trim()));
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser(toast, navigate));
    setUserMenu(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '56px', background: 'var(--primary)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.5px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: 13, fontWeight: 700 }}>SN</span>
          ShopNest
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands and more"
            style={{ flex: 1, padding: '8px 14px', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)' }} />
          <button type="submit" style={{ padding: '8px 14px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <FiSearch size={18} />
          </button>
        </form>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 600, fontSize: 14, padding: '6px 12px', borderRadius: 4, background: userMenu ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}>
                <FiUser size={18} />
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</span>
                <FiChevronDown size={14} />
              </button>
              {userMenu && (
                <>
                  <div onClick={() => setUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: -1 }} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', borderRadius: 8, minWidth: 200, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'fadeUp 0.2s ease' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{user.username}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                    {[
                      { to: '/orders', icon: <FiPackage size={15} />, label: 'My Orders' },
                      ...(isAdmin ? [{ to: '/admin', icon: <FiLayout size={15} />, label: 'Admin Dashboard' }] : [])
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setUserMenu(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: 'var(--text-primary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: 'var(--danger)', width: '100%', background: 'transparent', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, padding: '6px 18px', borderRadius: 4, fontSize: 14 }}>Login</Link>
          )}

          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 600, fontSize: 14, padding: '6px 12px', borderRadius: 4, background: 'rgba(255,255,255,0.1)', position: 'relative', textDecoration: 'none' }}>
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
