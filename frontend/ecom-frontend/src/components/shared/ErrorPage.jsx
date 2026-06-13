import { FiAlertTriangle } from 'react-icons/fi';
const ErrorPage = ({ message }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 24px', color: 'var(--danger)' }}>
    <FiAlertTriangle size={40} />
    <p style={{ fontWeight: 600, fontSize: 16 }}>{message || 'Something went wrong.'}</p>
  </div>
);
export default ErrorPage;
