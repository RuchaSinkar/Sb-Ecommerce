import { authAPI, cartAPI, categoryAPI, orderAPI, productAPI } from "../../services/api";

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
    const { data } = await authAPI.getUser();
    dispatch({ type: "SET_USER", payload: data });
  } catch {
    dispatch({ type: "LOGOUT" });
  }
};

export const authenticateSignInUser = (credentials, toast, navigate, setLoading) => async (dispatch) => {
  try {
    const { data } = await authAPI.login(credentials);
    dispatch({ type: "SET_USER", payload: data });
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
  try {
    await authAPI.logout();
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "CLEAR_CART" });
    toast.success("Signed out successfully");
    navigate("/");
  } catch {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }
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
