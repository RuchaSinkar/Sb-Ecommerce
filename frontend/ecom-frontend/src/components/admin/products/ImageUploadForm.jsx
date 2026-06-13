import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import { fetchProducts } from '../../../store/actions';
import { productAPI } from '../../../services/api';

const ImageUploadForm = ({ setOpen, product }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Select an image first'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      await productAPI.updateImage(product.id, fd);
      toast.success('Image uploaded!');
      dispatch(fetchProducts());
      setOpen(false);
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upload image for: <strong>{product?.productName}</strong></p>
      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, border: '2px dashed var(--border)', borderRadius: 8, cursor: 'pointer', transition: 'border-color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
        {preview ? <img src={preview} alt="" style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 8 }} /> : <><FiUpload size={32} style={{ color: 'var(--text-secondary)' }} /><span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Click to select image</span></>}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </label>
      <button onClick={handleUpload} disabled={loading || !file} style={{ padding: '11px', background: loading || !file ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: loading || !file ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};
export default ImageUploadForm;
