const initialState = {
  user: null,
  loading: true,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, loading: true };
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    default:
      return state;
  }
};
