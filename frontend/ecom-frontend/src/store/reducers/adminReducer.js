const initialState = { analytics: null, adminOrders: [] };
export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ANALYTICS': return { ...state, analytics: action.payload };
    case 'SET_ADMIN_ORDERS': return { ...state, adminOrders: action.payload };
    default: return state;
  }
};
