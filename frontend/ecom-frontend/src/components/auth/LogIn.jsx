import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authenticateSignInUser, fetchCart } from '../../store/actions';
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await dispatch(authenticateSignInUser(data, toast, navigate, setLoading));
    dispatch(fetchCart());
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #1a3c8f 100%)', paddingTop: 56 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: 860, width: '100%', margin: 16 }}>
        <div style={{ background: 'linear-gradient(160deg, var(--primary) 0%, #1a3c8f 100%)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 16 }}>
            <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 8px', fontSize: 14, marginRight: 6 }}>SN</span>ShopNest
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Welcome Back!</h2>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 14 }}>Sign in to access your cart, orders, and exclusive deals.</p>
        </div>
        <div style={{ padding: '48px 40px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Sign In</h3>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Username</label>
              <input {...register('username', { required: 'Username is required' })}
                placeholder="Enter your username"
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.username ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6, fontSize: 14, outline: 'none' }} />
              {errors.username && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.username.message}</p>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} {...register('password', { required: 'Password is required' })}
                  placeholder="Enter your password"
                  style={{ width: '100%', padding: '10px 40px 10px 14px', border: `1.5px solid ${errors.password ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6, fontSize: 14, outline: 'none' }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: loading ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
              <FiLogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 14, marginTop: 20, color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
