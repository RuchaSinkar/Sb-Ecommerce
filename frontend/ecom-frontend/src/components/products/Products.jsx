import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../shared/ProductCard';
import Loader from '../shared/Loader';
import { fetchProducts, fetchProductsByCategory, searchProducts, fetchCategories } from '../../store/actions';

const SORT_OPTIONS = [
  { label: 'Relevance', sortBy: 'productId', sortOrder: 'asc' },
  { label: 'Price: Low–High', sortBy: 'specialPrice', sortOrder: 'asc' },
  { label: 'Price: High–Low', sortBy: 'specialPrice', sortOrder: 'desc' },
  { label: 'Name A–Z', sortBy: 'productName', sortOrder: 'asc' },
];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, pagination } = useSelector((state) => state.products);
  const { isLoading } = useSelector((state) => state.errors);

  const keyword = searchParams.get('q') || '';
  const catId   = searchParams.get('cat') || '';
  const page    = parseInt(searchParams.get('page') || '0');
  const sortIdx = parseInt(searchParams.get('sort') || '0');
  const sort    = SORT_OPTIONS[sortIdx] || SORT_OPTIONS[0];

  useEffect(() => { if (!categories?.length) dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    const params = { pageNumber: page, pageSize: 12, sortBy: sort.sortBy, sortOrder: sort.sortOrder };
    if (keyword) dispatch(searchProducts(keyword, params));
    else if (catId) dispatch(fetchProductsByCategory(catId, params));
    else dispatch(fetchProducts(params));
  }, [dispatch, keyword, catId, page, sortIdx]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val !== null && val !== '') p.set(key, val); else p.delete(key);
    p.set('page', '0');
    setSearchParams(p);
  };

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 48px' }}>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, scrollbarWidth: 'none' }}>
          {[{ categoryId: '', categoryName: 'All' }, ...(categories || [])].map(cat => {
            const active = catId === String(cat.categoryId);
            return (
              <button key={cat.categoryId} onClick={() => setParam('cat', cat.categoryId)}
                style={{ padding: '6px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, flexShrink: 0, background: active ? 'var(--primary)' : '#fff', color: active ? '#fff' : 'var(--text-secondary)', border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                {cat.categoryName}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, borderLeft: '4px solid var(--primary)', paddingLeft: 12 }}>
            {keyword ? `Results for "${keyword}"` : catId ? (categories?.find(c => String(c.categoryId) === catId)?.categoryName || 'Products') : 'All Products'}
            {pagination?.totalElements > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 8 }}>({pagination.totalElements})</span>}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiFilter size={16} style={{ color: 'var(--text-secondary)' }} />            <select value={sortIdx} onChange={e => setParam('sort', e.target.value)}
              style={{ padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
              {SORT_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? <Loader /> : products?.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 24px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: 20, fontWeight: 700 }}>No products found</p>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
            {products.map(p => <ProductCard key={p.productId} {...p} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 32 }}>
            <button disabled={page === 0} onClick={() => setParam('page', page - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 6, background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, opacity: page === 0 ? 0.4 : 1 }}>
              <FiChevronLeft size={15} /> Prev
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 7) }).map((_, i) => (
              <button key={i} onClick={() => setParam('page', i)}
                style={{ width: 36, height: 36, borderRadius: 6, border: `1.5px solid ${page === i ? 'var(--primary)' : 'var(--border)'}`, background: page === i ? 'var(--primary)' : '#fff', color: page === i ? '#fff' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>
                {i + 1}
              </button>
            ))}
            <button disabled={page >= pagination.totalPages - 1} onClick={() => setParam('page', page + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 6, background: '#fff', cursor: page >= pagination.totalPages - 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, opacity: page >= pagination.totalPages - 1 ? 0.4 : 1 }}>
              Next <FiChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Products;
