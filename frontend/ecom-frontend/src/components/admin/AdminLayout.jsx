import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import Sidebar from '../shared/Sidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div style={{ paddingTop: 56, display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <div style={{ position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 50, display: 'none' }} className="xl-sidebar">
        <Sidebar />
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 160 }}>
            <Sidebar />
            <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: 12, right: -40, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><RxCross1 size={22} /></button>
          </div>
        </>
      )}
      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 0, padding: '24px 16px' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <FaBars size={20} /> Menu
        </button>
        <Outlet />
      </div>
      <style>{`@media (min-width: 1280px) { .xl-sidebar { display: block !important; } div[style*="margin-left: 0"] { margin-left: 260px !important; } button[style*="margin-bottom: 16px"] { display: none !important; } }`}</style>
    </div>
  );
};
export default AdminLayout;
