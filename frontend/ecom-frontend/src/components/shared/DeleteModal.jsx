import { FiAlertTriangle } from 'react-icons/fi';
const DeleteModal = ({ open, setOpen, title, onDeleteHandler, loader }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 12, width: '100%', maxWidth: 420, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', margin: 16, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <FiAlertTriangle size={28} style={{ color: 'var(--danger)' }} />
        </div>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{title || 'Confirm Delete'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>This action cannot be undone. Are you sure?</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => setOpen(false)} style={{ padding: '9px 24px', border: '1.5px solid var(--border)', borderRadius: 6, fontWeight: 600, cursor: 'pointer', background: '#fff' }}>Cancel</button>
          <button onClick={onDeleteHandler} disabled={loader} style={{ padding: '9px 24px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', opacity: loader ? 0.7 : 1 }}>
            {loader ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
