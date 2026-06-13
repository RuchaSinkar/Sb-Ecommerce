import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroBanner = () => (
  <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1a3c8f 100%)', borderRadius: 12, padding: '48px 40px', position: 'relative', overflow: 'hidden', color: '#fff' }}>
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
      <p style={{ opacity: 0.75, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Welcome to ShopNest</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
        Find Everything<br/>You Need
      </h1>
      <p style={{ opacity: 0.85, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        Shop from thousands of products with fast delivery across India.
      </p>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: 4, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'transform 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        Shop Now <FiArrowRight size={18} />
      </Link>
    </div>
    {/* Decorative circles */}
    <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
    <div style={{ position: 'absolute', right: 80, bottom: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
    <div style={{ position: 'absolute', right: 200, top: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
  </div>
);

export default HeroBanner;
