import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { registerUser } from '../../store/actions';
import { FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await dispatch(registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: ['user'],
    }, toast, navigate, setLoading));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #1a3c8f 100%)', paddingTop: 56 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: 480, width: '100%', margin: 16, padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>
            <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: 12, marginRight: 6 }}>SN</span>ShopNest
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Create Account</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { name: 'username', label: 'Username', placeholder: 'Choose a username', rules: { required: 'Required', minLength: { value: 3, message: 'Min 3 characters' } } },
            { name: 'email', label: 'Email', placeholder: 'your@email.com', rules: { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } } },
            { name: 'password', label: 'Password', placeholder: 'Min 6 characters', type: 'password', rules: { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } } },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type || 'text'} {...register(f.name, f.rules)} placeholder={f.placeholder}
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors[f.name] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6, fontSize: 14, outline: 'none' }} />
              {errors[f.name] && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors[f.name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: loading ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
            <FiUserPlus size={18} /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 14, marginTop: 20, color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
