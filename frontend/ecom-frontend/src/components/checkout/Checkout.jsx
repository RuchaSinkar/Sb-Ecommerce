import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiPlus, FiCreditCard, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addressAPI, orderAPI, paymentAPI } from '../../services/api';
import { fetchCart } from '../../store/actions';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.carts);
  const products = cart?.products ?? [];
  const total = products.reduce((s, p) => s + (p.specialPrice ?? p.price) * (p.quantity || 1), 0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [addingAddr, setAddingAddr] = useState(false);
  const [placing, setPlacing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    addressAPI.getMyAddresses().then(r => {
      setAddresses(r.data);
      if (r.data.length > 0) setSelectedAddr(r.data[0].addressId);
    }).catch(() => {});
  }, []);

  const saveAddress = async (data) => {
    try {
      const res = await addressAPI.create(data);
      setAddresses(a => [...a, res.data]);
      setSelectedAddr(res.data.addressId);
      setAddingAddr(false);
      reset();
      toast.success('Address saved!');
    } catch { toast.error('Failed to save address'); }
  };

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment service unavailable'); return; }

      const { data: rzpOrder } = await paymentAPI.createOrder({ amount: total, currency: 'INR', receipt: `receipt_${Date.now()}` });

      const options = {
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'ShopNest',
        description: 'Order Payment',
        order_id: rzpOrder.orderId,
        handler: async (response) => {
          try {
            await paymentAPI.verify({ razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature });
            await orderAPI.placeOrder('RAZORPAY', {
              addressId: selectedAddr,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              pgName: 'Razorpay', pgPaymentId: response.razorpay_payment_id,
              pgStatus: 'SUCCESS', pgResponseMessage: 'Payment successful',
            });
            dispatch(fetchCart());
            toast.success('Order placed successfully!');
            navigate('/orders');
          } catch { toast.error('Order placement failed'); }
        },
        prefill: { name: 'ShopNest User', email: 'user@shopnest.in' },
        theme: { color: '#2874f0' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch { toast.error('Failed to initiate payment'); }
    finally { setPlacing(false); }
  };

  return (
    <div style={{ paddingTop: 72, maxWidth: 1100, margin: '0 auto', padding: '80px 16px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 28 }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Address */}
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FiMapPin style={{ color: 'var(--primary)' }} /> Delivery Address</h2>
            {addresses.map(addr => (
              <div key={addr.addressId} onClick={() => setSelectedAddr(addr.addressId)}
                style={{ padding: '12px 16px', border: `2px solid ${selectedAddr === addr.addressId ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, marginBottom: 10, cursor: 'pointer', background: selectedAddr === addr.addressId ? 'var(--primary-light)' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{addr.buildingName}, {addr.street}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
                {selectedAddr === addr.addressId && <FiCheck style={{ color: 'var(--primary)', flexShrink: 0 }} size={18} />}
              </div>
            ))}
            <button onClick={() => setAddingAddr(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1.5px dashed var(--primary)', color: 'var(--primary)', background: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
              <FiPlus size={15} /> Add New Address
            </button>
            {addingAddr && (
              <form onSubmit={handleSubmit(saveAddress)} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['street', 'Street'], ['buildingName', 'Building/Apartment'], ['city', 'City'], ['state', 'State'], ['country', 'Country'], ['pincode', 'Pincode']].map(([name, label]) => (
                  <div key={name}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input {...register(name, { required: true })} style={{ width: '100%', padding: '8px 12px', border: `1.5px solid ${errors[name] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 4, fontSize: 14, outline: 'none' }} />
                  </div>
                ))}
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
                  <button type="submit" style={{ padding: '9px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>Save Address</button>
                  <button type="button" onClick={() => setAddingAddr(false)} style={{ padding: '9px 20px', background: '#f1f3f6', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Order items preview */}
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Order Items ({products.length})</h2>
            {products.map(p => (
              <div key={p.productId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <img src={p.image && p.image !== 'default.png' ? `/images/${p.image}` : `https://placehold.co/60x60/f8f9fa/2874f0?text=P`} alt="" style={{ width: 56, height: 56, objectFit: 'contain', background: '#f8f9fa', borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{p.productName}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Qty: {p.quantity || 1}</p>
                </div>
                <p style={{ fontWeight: 700 }}>₹{((p.specialPrice ?? p.price) * (p.quantity || 1)).toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 20, position: 'sticky', top: 72 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Price Details</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}><span>Subtotal</span><span>₹{total.toFixed(0)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}><span>Delivery</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span></div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}><span>Total</span><span>₹{total.toFixed(0)}</span></div>
          <button onClick={handlePlaceOrder} disabled={placing || !products.length}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 18, padding: '14px', background: placing ? '#ccc' : 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 4, border: 'none', cursor: placing ? 'not-allowed' : 'pointer' }}>
            <FiCreditCard size={18} /> {placing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 10 }}>🔒 Secure payment powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
