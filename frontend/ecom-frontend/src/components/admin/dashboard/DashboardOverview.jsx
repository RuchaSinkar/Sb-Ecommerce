const DashboardOverview = ({ title, amount, Icon, revenue }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 28px', flex: 1 }}>
    <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(40,116,240,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={24} style={{ color: '#2874f0' }} />
    </div>
    <div>
      <p style={{ fontSize: 13, color: '#878787', fontWeight: 600 }}>{title}</p>
      <p style={{ fontSize: 24, fontWeight: 800 }}>{revenue ? `₹${amount}` : amount}</p>
    </div>
  </div>
);
export default DashboardOverview;
