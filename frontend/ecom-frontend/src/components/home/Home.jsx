import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HeroBanner from './HeroBanner';
import ProductCard from '../shared/ProductCard';
import Loader from '../shared/Loader';
import { fetchProducts, fetchCategories } from '../../store/actions';

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state.products);
  const { isLoading } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Hero */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 0' }}>
        <HeroBanner />
      </div>

      {/* Category chips */}
      {categories?.length > 0 && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 14, borderLeft: '4px solid var(--primary)', paddingLeft: 12 }}>Shop by Category</h2>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
            {categories.slice(0, 10).map((cat, i) => (
              <Link key={cat.categoryId} to={`/products?cat=${cat.categoryId}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `hsl(${(i * 47) % 360}, 65%, 92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: `hsl(${(i * 47) % 360}, 55%, 40%)`, border: `2px solid hsl(${(i * 47) % 360}, 50%, 82%)` }}>
                  {cat.categoryName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.categoryName}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, borderLeft: '4px solid var(--primary)', paddingLeft: 12 }}>Featured Products</h2>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>View All <FiArrowRight size={16} /></Link>
        </div>
        {isLoading ? <Loader /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
            {products?.slice(0, 8).map((p, i) => <ProductCard key={p.productId} {...p} />)}
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
