import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => (
  <footer style={{ background: '#172337', color: '#ccc', marginTop: 48 }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 12 }}>
          <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: 12, marginRight: 6 }}>SN</span>
          ShopNest
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}>Your one-stop shop for everything. Quality products, fast delivery.</p>
      </div>
      <div>
        <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Quick Links</h4>
        {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
          <div key={to} style={{ marginBottom: 8 }}><Link to={to} style={{ fontSize: 13, color: '#ccc', textDecoration: 'none' }}>{label}</Link></div>
        ))}
      </div>
      <div>
        <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Contact</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}><FiMail size={14} /> support@shopnest.in</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><FiPhone size={14} /> +91 98765 43210</div>
      </div>
    </div>
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px', textAlign: 'center', fontSize: 12, color: '#888' }}>
      © {new Date().getFullYear()} ShopNest. All rights reserved.
    </div>
  </footer>
);

export default Footer;
