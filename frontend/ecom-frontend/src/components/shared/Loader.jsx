const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
    <div style={{ width: 40, height: 40, border: '3px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
export default Loader;
