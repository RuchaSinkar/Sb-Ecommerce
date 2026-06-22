import { authAPI, cartAPI, categoryAPI, orderAPI, productAPI } from "../../services/api";

// Helper: extract JWT value from cookie string returned by backend
// e.g. "springBootEcom=eyJ...; Path=/api; ..." → "eyJ..."
const extractToken = (jwtToken) => {
  if (!jwtToken) return null;
  if (!jwtToken.includes(';') && !jwtToken.includes('=')) return jwtToken; // already clean
  const cookieValue = jwtToken.split(';')[0]; // "springBootEcom=eyJ..."
  const eqIdx = cookieValue.indexOf('=');
  return eqIdx >= 0 ? cookieValue.substring(eqIdx + 1) : cookieValue;
};

// ─── Products ────────────────────────────────────────────────────────────
export const fetchProducts = (params) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await productAPI.getAll(params);
    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message || "Failed to fetch" });
  }
};

export const fetchProductsByCategory = (catId, params) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await productAPI.getByCategory(catId, params);
    dispatch({ type: "FETCH_PRODUCTS", payload: data.content, totalPages: data.totalPages, totalElements: data.totalElements });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message || "Failed to fetch" });
  }
};

export const searchProducts = (keyword, params) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await productAPI.search(keyword, params);
    dispatch({ type: "FETCH_PRODUCTS", payload: data.content, totalPages: data.totalPages, totalElements: data.totalElements });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message || "Failed to search" });
  }
};

// ─── Categories ──────────────────────────────────────────────────────────
export const fetchCategories = () => async (dispatch) => {
  try {
    const { data } = await categoryAPI.getAll({ pageSize: 100 });
    dispatch({ type: "FETCH_CATEGORIES", payload: data.content });
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};

// ─── Auth ────────────────────────────────────────────────────────────────
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "AUTH_LOADING" });
    // Restore from localStorage instantly (no flicker on refresh)
    const cached = localStorage.getItem("shopnest_user");
    if (cached) {
      dispatch({ type: "SET_USER", payload: JSON.parse(cached) });
    }
    // Verify token still valid with backend
    const token = localStorage.getItem("shopnest_token");
    if (!token && !cached) {
      dispatch({ type: "LOGOUT" });
      return;
    }
    try {
      const { data } = await authAPI.getUser();
      dispatch({ type: "SET_USER", payload: data });
      localStorage.setItem("shopnest_user", JSON.stringify(data));
    } catch {
      // Token expired — logout cleanly
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("shopnest_token");
      localStorage.removeItem("shopnest_user");
    }
  } catch {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("shopnest_token");
    localStorage.removeItem("shopnest_user");
  }
};

export const authenticateSignInUser = (credentials, toast, navigate, setLoading) => async (dispatch) => {
  try {
    const { data } = await authAPI.login(credentials);
    // Extract clean JWT from the cookie string the backend returns
    const cleanToken = extractToken(data.jwtToken);
    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
    localStorage.setItem("shopnest_token", cleanToken);
    localStorage.setItem("shopnest_user", JSON.stringify(userInfo));
    dispatch({ type: "SET_USER", payload: userInfo });
    toast.success("Login successful!");
    navigate("/");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

export const registerUser = (userData, toast, navigate, setLoading) => async (dispatch) => {
  try {
    await authAPI.signup(userData);
    toast.success("Account created! Please login.");
    navigate("/login");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

export const logoutUser = (toast, navigate) => async (dispatch) => {
  try { await authAPI.logout(); } catch {}
  dispatch({ type: "LOGOUT" });
  dispatch({ type: "CLEAR_CART" });
  localStorage.removeItem("shopnest_token");
  localStorage.removeItem("shopnest_user");
  toast.success("Signed out successfully");
  navigate("/");
};

// ─── Cart ────────────────────────────────────────────────────────────────
export const fetchCart = () => async (dispatch) => {
  try {
    dispatch({ type: "CART_LOADING" });
    const { data } = await cartAPI.getMyCart();
    dispatch({ type: "SET_CART", payload: data });
  } catch {
    dispatch({ type: "CLEAR_CART" });
  }
};

export const addToCart = (productId, qty, toast) => async (dispatch) => {
  try {
    const { data } = await cartAPI.addItem(productId, qty);
    dispatch({ type: "SET_CART", payload: data });
    toast.success("Added to cart!");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Could not add to cart");
  }
};

export const removeFromCart = (cartId, productId, toast) => async (dispatch) => {
  try {
    await cartAPI.removeItem(cartId, productId);
    const { data } = await cartAPI.getMyCart();
    dispatch({ type: "SET_CART", payload: data });
    toast.success("Removed from cart");
  } catch {
    toast.error("Failed to remove item");
  }
};

export const updateCartQty = (productId, operation) => async (dispatch) => {
  try {
    const { data } = await cartAPI.updateQty(productId, operation);
    dispatch({ type: "SET_CART", payload: data });
  } catch (error) {
    console.error("Failed to update qty", error);
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────
export const analyticsAction = () => async (dispatch) => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      productAPI.getAll({ pageSize: 1 }),
      orderAPI.getAllOrders(),
    ]);
    const totalRevenue = ordersRes.data.reduce((s, o) => s + (o.totalAmount || 0), 0);
    dispatch({
      type: 'SET_ANALYTICS',
      payload: {
        productCount: productsRes.data.totalElements || 0,
        totalOrders: ordersRes.data.length || 0,
        totalRevenue,
      },
    });
    dispatch({ type: 'SET_ADMIN_ORDERS', payload: ordersRes.data });
  } catch (e) {
    console.error('Analytics fetch failed', e);
  }
};

export const deleteProduct = (setLoader, productId, toast, setOpen, isAdmin) => async (dispatch) => {
  if (!isAdmin) { toast.error('Admin access required'); return; }
  setLoader(true);
  try {
    await productAPI.delete(productId);
    toast.success('Product deleted');
    setOpen(false);
    dispatch(fetchProducts());
  } catch { toast.error('Failed to delete product'); }
  finally { setLoader(false); }
};

export const deleteCategory = (categoryId, toast) => async (dispatch) => {
  try {
    await categoryAPI.delete(categoryId);
    toast.success('Category deleted');
    dispatch(fetchCategories());
  } catch { toast.error('Failed to delete category'); }
};

export const updateOrderStatus = (orderId, status, toast) => async (dispatch) => {
  try {
    await orderAPI.updateStatus(orderId, status);
    toast.success('Order status updated');
    dispatch(analyticsAction());
  } catch { toast.error('Failed to update status'); }
};
