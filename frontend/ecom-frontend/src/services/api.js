
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('shopnest_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      // Don't redirect for auth endpoints themselves
      if (!url.includes('/auth/')) {
        localStorage.removeItem('shopnest_token');
        localStorage.removeItem('shopnest_user');
      }
    }
    return Promise.reject(err)
  }
)

// ─── Auth ───────────────────────────────────────────────────────────────
export const authAPI = {
  login:   (data) => api.post('/auth/signin', data),
  signup:  (data) => api.post('/auth/signup', data),
  logout:  ()     => api.post('/auth/signout'),
  getUser: ()     => api.get('/auth/user'),
}

// ─── Products ────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:        (params)       => api.get('/public/products', { params }),
  getByCategory: (catId, params)=> api.get(`/public/categories/${catId}/products`, { params }),
  search:        (keyword, params) => api.get(`/public/products/keyword/${encodeURIComponent(keyword)}`, { params }),
  create:        (catId, data)  => api.post(`/admin/categories/${catId}/product`, data),
  update:        (id, data)     => api.put(`/admin/products/${id}`, data),
  delete:        (id)           => api.delete(`/admin/products/${id}`),
  updateImage:   (id, formData) => api.put(`/products/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// ─── Categories ──────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll:  (params)     => api.get('/public/categories', { params }),
  create:  (data)       => api.post('/public/categories', data),
  update:  (id, data)   => api.put(`/public/categories/${id}`, data),
  delete:  (id)         => api.delete(`/admin/categories/${id}`),
}

// ─── Cart ────────────────────────────────────────────────────────────────
export const cartAPI = {
  getMyCart:   ()                   => api.get('/carts/users/cart'),
  addItem:     (productId, qty)     => api.post(`/carts/products/${productId}/quantity/${qty}`),
  updateQty:   (productId, op)      => api.put(`/cart/products/${productId}/quantity/${op}`),
  removeItem:  (cartId, productId)  => api.delete(`/carts/${cartId}/product/${productId}`),
  getAllCarts:  ()                   => api.get('/admin/carts'),
}

// ─── Orders ──────────────────────────────────────────────────────────────
export const orderAPI = {
  placeOrder:   (method, data) => api.post(`/order/users/payments/${method}`, data),
  getMyOrders:  ()             => api.get('/order/users/myOrders'),
  getOrderById: (id)           => api.get(`/order/users/myOrders/${id}`),
  getAllOrders:  ()             => api.get('/admin/orders'),
  updateStatus: (id, status)   => api.put(`/admin/orders/${id}/orderStatus/${status}`),
}

// ─── Addresses ───────────────────────────────────────────────────────────
export const addressAPI = {
  getMyAddresses: ()         => api.get('/addresses'),
  create:         (data)     => api.post('/addresses', data),
  update:         (id, data) => api.put(`/addresses/${id}`, data),
  delete:         (id)       => api.delete(`/addresses/${id}`),
}

// ─── Razorpay ────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-razorpay-order', data),
  verify:      (data) => api.post('/payment/verify', data),
}

export default api
